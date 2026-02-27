---
id: lunar_grazer_brain
title: Lunar Grazer Brain
description: Implements the AI decision logic for the Lunar Grazer entity, handling combat engagement, stealth stalking, and patrol behavior based on target state and entity condition.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9afee4b5
---

# Lunar Grazer Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree logic for the Lunar Grazer entity, a hostile mob in Don't Starve Together. It dynamically selects behaviors depending on combat readiness (cooldown), target state (sleeping vs awake), and entity condition (e.g., debris protection). It orchestrates core behaviors like `ChaseAndAttack`, `Leash` (for stalling/stalking), `Wander`, and conditional despawn logic. The brain integrates with several components—`combat`, `health`, `grogginess`, `sleeper`, and `knownlocations`—to determine state transitions and act accordingly.

## Dependencies & Tags

- **Components used:**
  - `combat`: accesses `HasTarget()`, `InCooldown()`, and `target` property.
  - `health`: accesses `IsHurt()`.
  - `grogginess`: accesses `IsKnockedOut()` (via `SleepCheck` helper).
  - `sleeper`: accesses `IsAsleep()` (via `SleepCheck` helper).
  - `knownlocations`: accesses `GetLocation("spawnpoint")`.

- **Tags checked via stategraph (`inst.sg`):**
  - `"debris"`: triggers respawn behavior.
  - `"invisible"`: skips awake behavior.
  - `"knockout"`: indirectly checked via `IsKnockedOut()` (used for sleeping target detection).

## Properties

No public properties are explicitly initialized in the constructor. Behavior configuration is embedded in the behavior tree construction within `OnStart()`.

## Main Functions

### `LunarGrazerBrain:OnStart()`
* **Description:** Constructs and assigns the root behavior tree for the Lunar Grazer. This function is called automatically by the brain framework when the entity spawns or the brain is initialized.
* **Parameters:** None.
* **Returns:** `nil` (sets `self.bt` internally).

### `IsSleeper(target)`
* **Description:** Helper function used internally to determine whether a potential target is capable of sleeping or being knocked out. Used to decide between aggressive vs stalking attack patterns.
* **Parameters:**
  - `target` (`Entity`): The target entity to inspect.
* **Returns:** `boolean` — `true` if the target has either a `grogginess` or `sleeper` component; otherwise `false`.

### `SleepCheck(target)`
* **Description:** Checks whether the target is currently in a sleeping or knocked-out state. Excludes entities in the `"dismounting"` state when using grogginess. Used to prioritize stealth engagement.
* **Parameters:**
  - `target` (`Entity`): The target entity to inspect.
* **Returns:** `boolean` — `true` if the target is knocked out or asleep; otherwise `false`.

### `DoStalking(inst)`
* **Description:** Computes a target position that positions the Lunar Grazer to the side of its target (strafing motion) when in combat. Used by the `Leash` behavior to maintain ranged combat positioning.
* **Parameters:**
  - `inst` (`Entity`): The Lunar Grazer entity instance.
* **Returns:** `Vector3` — A world position (x, 0, z) at which the Lunar Grazer should move to maintain stalker-like positioning. Returns `nil` if there is no current combat target.

### `GetTargetPos(inst)`
* **Description:** Helper function to retrieve the current world position of the combat target.
* **Parameters:**
  - `inst` (`Entity`): The Lunar Grazer entity instance.
* **Returns:** `Vector3` — The position of `self.inst.components.combat.target`.

### `GetHome(inst)`
* **Description:** Retrieves the spawn point location (used for patrol/despawn logic).
* **Parameters:**
  - `inst` (`Entity`): The Lunar Grazer entity instance.
* **Returns:** `Vector3?` — The stored "spawnpoint" location from `knownlocations`, or `nil` if unset.

## Events & Listeners

- **Listens to:** None (no explicit `inst:ListenForEvent` calls).
- **Pushes:**
  - `"lunar_grazer_respawn"` — Pushed when in debris state and not hurt, to trigger respawn logic.
  - `"lunar_grazer_despawn"` — Pushed when loitering at spawn point for too long without target found.

Note: Event dispatch is handled through `inst:PushEvent(...)` inside the behavior tree; no additional event handlers are defined in this file.