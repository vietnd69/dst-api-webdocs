---
id: alterguardian_phase4_lunarriftbrain
title: Alterguardian Phase4 Lunarriftbrain
description: Controls the behavior tree for the Alterguardian boss during Phase 4 of the Lunar Rift encounter, enabling ranged attacks, chasing, and wandering within a designated arena.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: faf55a8b
---

# Alterguardian Phase4 Lunarriftbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component implements the behavior tree for the Alterguardian boss during Phase 4 of the Lunar Rift encounter. It defines how the entity pursues and attacks targets while also roaming within a specific arena area (`WagPunkArena`). The behavior prioritizes combat over wandering, and integrates with the `Combat` component to handle ranged attacks and target engagement. It inherits from `Brain` and constructs its behavior tree inside the `OnStart()` method using custom nodes and shared behavior utilities.

## Dependencies & Tags
- **Components used:**
  - `Combat` (`self.inst.components.combat`): Used to check for targets, cooldown status, and trigger attacks. Sets `ignorehitrange = true` during attack attempts.
  - `Wander` (from `behaviours/wander.lua`): Used to define roaming behavior within a home area.
- **Tags:** None explicitly added or removed by this component.
- **Behaviors used:**
  - `ChaseAndAttack`: Shared behavior for pursuing and attacking targets.
  - `Wander`: Enables the entity to wander near its arena center when no target is present or during combat cooldowns.

## Properties
No public properties are initialized directly in the constructor. The only state set is `self.bt`, which stores the constructed `BT` (BehaviorTree) instance in `OnStart()`.

## Main Functions
### `Alterguardian_Phase4_LunarRiftBrain:OnStart()`
* **Description:** Constructs and assigns the primary behavior tree for the entity. It defines a priority-based root node that runs indefinitely unless the entity enters a jumping or dead state. The behavior tree prioritizes combat (ranged attacks with chase/attack fallback) over wandering in a defined arena area.
* **Parameters:** None.
* **Returns:** None.

### `GetHome(inst)`
* **Description:** A helper function that computes the home position for wandering. It checks if the entity is inside the `WagPunkArena`, and if so, returns the arena's center coordinates as a `Vector3` (with Y=0). If outside the arena, it returns `nil`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `Vector3 | nil` — the arena center or `nil` if the entity is outside the arena.

## Events & Listeners
This component does not define or register any event listeners. It operates entirely through the BehaviorTree framework and immediate component calls (e.g., `Combat` methods).