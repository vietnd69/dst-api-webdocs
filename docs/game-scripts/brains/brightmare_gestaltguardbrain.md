---
id: brightmare_gestaltguardbrain
title: Brightmare Gestaltguardbrain
description: Implements the AI behavior tree for the Brightmare Gestaltguard, handling aggression, player proximity response, and target tracking using a hierarchical state machine.
tags: [ai, brain, combat, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 7af630bc
system_scope: brain
---

# Brightmare Gestaltguardbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GestaltGuardBrain` is the AI behavior controller for the Brightmare Gestaltguard entity. It defines how the gestalt guard responds to player proximity, maintains facing direction toward visible targets, and escalates aggression based on its `behaviour_level` (where level 3 is fully aggressive). The brain integrates behavior trees (`BT`) with custom utility functions to manage navigation, combat readiness, and dynamic repositioning (e.g., when players get too close). It depends on the `combat` and `knownlocations` components and is attached to the entity during initialization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst:AddBrain("brightmare_gestaltguardbrain")
-- The brain is automatically initialized; OnStart() and OnInitializationComplete() are called by the state graph.
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity instance the brain controls. Inherited from `Brain`. |
| `bt` | `BT` | `nil` | The Behavior Tree instance created in `OnStart()`. Initialized only after `OnStart()` is called. |

## Main functions
### `OnStart()`
* **Description:** Initializes and sets up the behavior tree for the gestalt guard. The root node handles state transitions based on `behaviour_level`, proximity checks, and target acquisition.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes `self.inst.sg` is valid and that required behavior modules (`behaviours/...`) are correctly loaded.

### `OnInitializationComplete()`
* **Description:** Records the entity’s current position as its `spawnpoint` using the `knownlocations` component. This prevents overwriting an existing spawnpoint if already set.
* **Parameters:** None.
* **Returns:** Nothing.

### `Relocate(inst)`
* **Description:** Utility function that commands the entity to enter the `"relocate"` state via its state graph. Typically invoked when a player is detected within `RELOCATED_DISTSQ`.
* **Parameters:** `inst` (Entity) — the gestalt guard instance.
* **Returns:** Nothing.

### `GetFacingTarget(inst)`
* **Description:** Returns the current combat target *only if* it exists, is valid, and is within the configured viewing range (`GESTALTGUARD_WATCHING_RANGE`). The check is only performed when `behaviour_level == 2` or higher (note: logic uses level 2 but only aggression at level 3).
* **Parameters:** `inst` (Entity) — the gestalt guard instance.
* **Returns:** `Entity` or `nil` — the valid target within viewing range, or `nil`.
* **Error states:** Returns `nil` if target is invalid, missing, or outside `GETFACINGTARGET_DISTSQ`.

### `KeepFacingTarget(inst, target)`
* **Description:** Returns `true` if the current facing target matches the provided `target` and it remains within range (via `GetFacingTarget`).
* **Parameters:**  
  `inst` (Entity) — the gestalt guard instance.  
  `target` (Entity) — the expected facing target.  
* **Returns:** `boolean` — `true` if `GetFacingTarget(inst) == target`, otherwise `false`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.  
(Event handling and state transitions are managed internally by the behavior tree and state graph, not via `inst:PushEvent`/`inst:ListenForEvent`.)
