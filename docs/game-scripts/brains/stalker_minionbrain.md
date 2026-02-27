---
id: stalker_minionbrain
title: Stalker Minionbrain
description: Controls the behavior and death timing of stalker minions, ensuring they remain leashed to the stalker, idle while near it, and die after a delay following the stalker's death.
tags: [ai, brain, minion, stalker, combat]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: cf0d5fd5
---

# Stalker Minionbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `stalker_minionbrain` component implements a finite state machine using a Behavior Tree (`BT`) to govern stalker minions (small entities summoned by the Stalker boss). Its primary responsibilities include maintaining leash distance relative to the Stalker, idling while near the Stalker, and initiating self-destruction after a randomized delay following the Stalker's death. It depends on the `EntityTracker` component to locate the associated Stalker and the `Health` component to terminate the minion.

## Usage example
This component is typically added to minion entities during their initialization, usually via a prefab definition or spawner logic. Example (conceptual; actual instantiation occurs in prefabs like `stalker_minion`):

```lua
local function fn()
    local inst = CreateEntity()
    inst:AddComponent("stalker_minionbrain")
    -- The brain automatically initializes on `OnStart`, no manual call needed.
    return inst
end
```

## Dependencies & tags
**Components used:**  
- `entitytracker` — accessed via `inst.components.entitytracker:GetEntity("stalker")` to retrieve the Stalker target.  
- `health` — accessed via `inst.components.health:IsDead()` and `inst.components.health:Kill()` for lifecycle management.

**Tags:** None identified.

## Properties
No public properties are explicitly initialized in the constructor.

## Main functions

### `StalkerMinionBrain:OnStart()`
* **Description:** Initializes the Behavior Tree (`BT`) root node. Defines the logic flow: (1) panic if triggered, (2) enforce leash to Stalker, (3) stand still while Stalker is present, (4) wander during a post-Stalker-death grace period, and (5) kill the minion once the grace period ends. This function is automatically invoked when the entity enters the world.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None. Assumes `EntityTracker` and `Health` components are present.

### `GetTarget(inst)`
* **Description:** Helper function that retrieves the Stalker entity via the `EntityTracker` using the `"stalker"` key.
* **Parameters:**  
  - `inst`: The entity instance whose `EntityTracker` component is queried.
* **Returns:** `entity inst` or `nil` — the Stalker entity, or `nil` if not tracked.
* **Error states:** Returns `nil` if the Stalker is not registered in `EntityTracker`.

### `GetTargetPos(inst)`
* **Description:** Helper function that returns the current world position of the Stalker target, if available.
* **Parameters:**  
  - `inst`: The entity instance whose `EntityTracker` component is queried.
* **Returns:** `Vector` or `nil` — the Stalker's position, or `nil` if the target is absent.
* **Error states:** Returns `nil` if `GetTarget(inst)` returns `nil`.

### `ShouldDie(self)`
* **Description:** Determines whether the minion should proceed to die. If no delay has been set (i.e., `self.delay == nil`), it calculates a random delay based on whether the Stalker is already dead (`stalkerdead` flag), adding randomness for unpredictability. Returns `true` only when the current game time exceeds the computed delay.
* **Parameters:**  
  - `self`: The brain component instance.
* **Returns:** `boolean` — `true` if the delay has elapsed and the minion should die; otherwise `false`.
* **Error states:**  
  - Sets `self.delay` lazily on first invocation if not present.  
  - Delay = `stalkerdead ? [1, 3]` or `[3, 5]` (i.e., `dt + math.random() * dt` where `dt` is `1` or `3`).

## Events & listeners
None. The component uses behavior tree nodes and direct state queries instead of event-driven logic.

---