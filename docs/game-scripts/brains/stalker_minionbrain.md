---
id: stalker_minionbrain
title: Stalker Minionbrain
description: Manages the AI behavior of stalker minions, which remain stationary while their stalker is present but die shortly after the stalker is destroyed.
tags: [ai, boss, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: cf0d5fd5
system_scope: brain
---

# Stalker Minionbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`StalkerMinionBrain` defines the behavior tree logic for stalker minions (typically summoned by a Stalker boss). These minions cease active movement and remain stationary (`StandStill`) while their parent stalker entity is alive and within tracking range. Once the stalker dies, a short delay is triggered, after which the minion begins to wander (`Wander`) before self-terminating by killing itself via the `health` component. The behavior tree prioritizes panic response first, followed by leash enforcement, then idle/stalking conditions, and finally delayed self-destruction.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("entitytracker")
inst.brain = inst:AddBrain("stalker_minionbrain")
-- The brain is initialized automatically on add via BrainManager
```

## Dependencies & tags
**Components used:** `entitytracker`, `health`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and sets the behavior tree root node, which orchestrates the minion’s AI logic: panic response, leash tracking, waiting near the stalker, wandering after stalker death, and self-killing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes `entitytracker` and `health` components are attached; no explicit validation is performed.

### `GetTarget(inst)` *(local)*
* **Description:** Retrieves the stalker entity tracked by the `entitytracker` component.
* **Parameters:** `inst` (Entity) — the minion entity instance.
* **Returns:** The stalker entity if present, otherwise `nil`.
* **Error states:** Returns `nil` if no entity named `"stalker"` exists in the tracker.

### `GetTargetPos(inst)` *(local)*
* **Description:** Returns the current world position of the stalker target, or `nil` if no target exists.
* **Parameters:** `inst` (Entity) — the minion entity instance.
* **Returns:** `Vector` position or `nil`.
* **Error states:** Returns `nil` if `GetTarget(inst)` returns `nil`.

### `ShouldDie(self)` *(local)*
* **Description:** Determines whether the minion should proceed to self-termination based on a randomized delay timer after the stalker’s death.
* **Parameters:** `self` — the brain instance.
* **Returns:** `true` if the delay period has elapsed and the minion should kill itself; otherwise `false`.
* **Error states:** Initializes a random delay (`1` or `3` seconds plus random jitter) only on first call; subsequent calls compare current time against computed `self.delay`.

## Events & listeners
None identified.
