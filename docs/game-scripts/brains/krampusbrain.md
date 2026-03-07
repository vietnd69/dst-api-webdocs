---
id: krampusbrain
title: Krampusbrain
description: Implements the decision-making logic for the Krampus character, handling stealing, chest-emptying, aggression, fleeing, and departure behaviors.
tags: [ai, combat, inventory, stealth, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 3f047681
system_scope: brain
---

# Krampusbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KrampusBrain` is a behavior tree-based AI controller for the Krampus entity. It manages Krampus’s core behaviors: identifying and stealing eligible inventory items, emptied treasure chests when possible, chasing and attacking nearby players, fleeing when provoked, and eventually departing after accumulating enough stolen items (`greed`). It extends `Brain` and integrates with DST’s behavior system via `PriorityNode`, `DoAction`, `ChaseAndAttack`, `RunAway`, `Follow`, and `Wander`. It relies on the `inventory` component to track possession and make decisions, and interacts with the `inventoryitem` and `container` components to validate targets.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetClass("krampusbrain")
inst.components.brain:OnStart()
```

## Dependencies & tags
**Components used:** `inventory`, `container`, `inventoryitem`  
**Tags checked:** `INLIMBO`, `catchable`, `fire`, `irreplaceable`, `heavy`, `prey`, `bird`, `outofreach`, `_container`, `structure`, `HAMMER_workable`, `_inventoryitem`  
**Tags added:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mytarget` | entity or `nil` | `nil` | The current target entity (typically a player) to follow. |
| `greed` | number | `2 + math.random(4)` | The number of items Krampus must collect before transitioning to the departure state. |

## Main functions
### `SetTarget(target)`
*   **Description:** Sets the current target (e.g., a player) for Krampus to follow. Registers a listener to clear `mytarget` if the target entity is removed.
*   **Parameters:** `target` (entity or `nil`) — entity to target, or `nil` to clear the current target.
*   **Returns:** Nothing.

### `OnStop()`
*   **Description:** Cleans up when the brain is stopped. Clears the current target (`mytarget`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnStart()`
*   **Description:** Initializes and starts the behavior tree. Sets the initial target to `inst.spawnedforplayer`, constructs a behavior tree with priority-ordered behaviors (panic triggers, stealing, chasing, fleeing, following, wandering), and assigns it to `self.bt`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — registered dynamically on the current `mytarget` entity to clear `mytarget` when it is removed.
- **Pushes:** No events are directly pushed by this component. Behavior changes are reflected via stategraph transitions (e.g., `"exit"` state).
