---
id: toadstoolbrain
title: Toadstoolbrain
description: Implements the behavior tree for the Toadstool entity, managing its channeling, homing, combat engagement, and fleeing states using custom logic and behavior nodes.
tags: [ai, brain, boss, combat, homing]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 6ee52244
---

# Toadstoolbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `ToadstoolBrain` component implements the artificial intelligence behavior tree for the Toadstool entity, a boss-type creature in Don't Starve Together. It orchestrates high-level decision-making during gameplay by sequencing actions such as channeling to spawn mushrooms, returning to its spawn point (hole), leash distance enforcement, engaging targets, fleeing after a timeout, and wandering while returning home. It depends on the `KnownLocations` component to store and retrieve the entity's spawn point, and integrates with the behavior tree framework (`chaseandattack`, `leash`, `wander`, and utility functions like `GetTime` and `TimerExists`).

## Usage example
This component is typically added to an entity during its prefab definition (e.g., in a `.lua` file under `prefabs/`). Below is a minimal example of how the component might be included:

```lua
inst:AddComponent("toadstoolbrain")
```

The component is self-initializing: when attached, the constructor registers the behavior tree on `OnStart`, and the spawn point location is remembered on `OnInitializationComplete`.

## Dependencies & tags
**Components used:**
- `knownlocations`: used to `GetLocation("spawnpoint")` and `RememberLocation("spawnpoint", pos, true)`
- `timer`: used to check if a `"channel"` timer exists and whether a `"mushroomsprout_cd"` timer is present

**Tags:** None identified (the component itself does not add or remove tags directly).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `timetochanneling` | `number?` | `nil` | Timestamp used to track the maximum time allowed for returning to the hole before channeling. Initialized to `nil` in the constructor; set to `GetTime() + MAX_CHANNEL_LEASH_TIME` on first return check; cleared to `0` when channeling begins. |

## Main functions
### `ToadstoolBrain:OnStart()`
* **Description:** Constructs and assigns the root behavior tree node to `self.bt`. This is the main entry point for the AI decision-making process. The behavior tree prioritizes channeling (with return-to-hole logic), leash enforcement, combat engagement, and a parallel flee/wander sequence.
* **Parameters:** None (instance method).
* **Returns:** `nil`.
* **Error states:** None documented. Relies on behavior tree node constructors (`PriorityNode`, `SequenceNode`, `WhileNode`, `ActionNode`, `Leash`, `ChaseAndAttack`, `Wander`, `ParallelNode`) which must be properly defined elsewhere.

### `ToadstoolBrain:OnInitializationComplete()`
* **Description:** Records the entity’s current position as the `"spawnpoint"` location using `KnownLocations:RememberLocation`. The `y` component of the position is explicitly clamped to `0` before storage, ensuring consistent horizontal referencing. The `dont_overwrite` flag is set to `true`, preventing replacement if a spawn point already exists.
* **Parameters:** None (instance method).
* **Returns:** `nil`.
* **Error states:** None documented. Assumes `GetPosition()` and `knownlocations` component exist and are valid.

### `GetHomePos(inst)` (local helper)
* **Description:** Retrieves the stored spawn point location from the `KnownLocations` component.
* **Parameters:** `inst` — The entity instance (not used directly but passed to `KnownLocations:GetLocation`).
* **Returns:** `table?` — The `{x, y, z}` position vector as stored for `"spawnpoint"`, or `nil` if not yet set.
* **Error states:** Returns `nil` if `"spawnpoint"` has not been remembered.

### `ShouldChannel(self)` (local helper)
* **Description:** Determines whether the Toadstool should begin channeling to spawn mushrooms. Conditions include: the `"channel"` timer is active, or the Toadstool is engaged in combat, is below level `3`, and the `"mushroomsprout_cd"` cooldown timer is not running.
* **Parameters:** `self` — The ToadstoolBrain instance.
* **Returns:** `boolean` — `true` if channeling conditions are met, otherwise `false`. On `false`, also resets `self.timetochanneling` to `nil`.
* **Error states:** None documented. Uses `TimerExists` and `engaged` properties; assumes those exist and are valid.

### `ShouldTryReturningToHole(self)` (local helper)
* **Description:** Controls whether the Toadstool is still within the allowed return-to-hole window (`MAX_CHANNEL_LEASH_TIME` seconds = `15`). Sets `timetochanneling` to `GetTime() + MAX_CHANNEL_LESH_TIME` on first call if `nil`.
* **Parameters:** `self` — The ToadstoolBrain instance.
* **Returns:** `boolean` — `true` if within the time window, `false` otherwise.
* **Error states:** None documented. Uses `GetTime()` and assumes `MAX_CHANNEL_LEASH_TIME` is defined.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** 
  - `"startchanneling"` — fired by the `ActionNode` inside the channeling branch after returning to the hole (if applicable), triggering the channeling animation/sequence.
  - `"fleewarning"` — fired after a `FLEE_WARNING_DELAY` (`3.5` seconds) during the flee sequence.
  - `"flee"` — fired after an additional `FLEE_DELAY` (`10` seconds), initiating the flee state.

> Note: Event names are passed as string literals in `self.inst:PushEvent(...)`. Receivers of these events (e.g., state graphs or other components) must register handlers separately.