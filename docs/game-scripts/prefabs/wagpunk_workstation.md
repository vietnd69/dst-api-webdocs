---
id: wagpunk_workstation
title: Wagpunk Workstation
description: A crafting station prefab that integrates with the prototyper system to provide workstation-specific recipe blueprints and behavior, including sound and animation management.
tags: [crafting, world, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e2d0f4b6
system_scope: crafting
---

# Wagpunk Workstation

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagpunk_workstation` is a server-side prefab that implements a specialized crafting station with a fixed set of blueprints and dynamic activation logic. It relies on the `craftingstation` and `prototyper` components to expose recipes and handle user interaction (e.g., toggle on/off, activation). When toggled, it notifies the `wagpunk_arena_manager` component of its state changes. It also registers `OnLoad` logic to retroactively learn certain blueprints during map load, which is a one-time migration.

## Usage example
This prefab is instantiated automatically by the world system and not typically added manually. However, a modder may reference it to interact with its components:
```lua
local workstation = SpawnPrefab("wagpunk_workstation")
if workstation ~= nil and workstation:IsValid() then
    workstation.components.prototyper:SetTechTree(TUNING.PROTOTYPER_TREES.WAGPUNK_WORKSTATION)
    workstation.components.prototyper:Toggle()
end
```

## Dependencies & tags
**Components used:** `inspectable`, `craftingstation`, `prototyper`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** Adds `prototyper`

## Properties
No public properties are declared or initialized in the constructor. It depends entirely on properties of the attached components (e.g., `inst.components.prototyper.on`).

## Main functions
### `OnTurnOn(inst)`
*   **Description:** Enables the workstation’s active state: starts proximity loop animation, plays idle sound, and notifies the arena manager. Does nothing if `prototyper_activatedtask` is already set (prevents re-trigger during activation).
*   **Parameters:** `inst` (Entity) — The workstation instance.
*   **Returns:** Nothing.

### `OnTurnOff(inst)`
*   **Description:** Disables the workstation’s active state: resets to idle animation, stops idle sound, and notifies the arena manager. Does nothing if `prototyper_activatedtask` is set.
*   **Parameters:** `inst` (Entity) — The workstation instance.
*   **Returns:** Nothing.

### `FinishUseAnim(inst)`
*   **Description:** Cleanup handler after the activation animation completes. Restores correct idle/loop animation and sound based on the current `prototyper.on` state.
*   **Parameters:** `inst` (Entity) — The workstation instance.
*   **Returns:** Nothing.

### `OnActivate(inst)`
*   **Description:** Handles user interaction with the workstation (e.g., crafting or toggle click). Plays use sound and animation, cancels any pending activation task, and schedules `FinishUseAnim`.
*   **Parameters:** `inst` (Entity) — The workstation instance.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Legacy migration hook used to ensure specific blueprints are learned if the prefab loads from older save data. Not required for normal operation.
*   **Parameters:**  
    `inst` (Entity) — The workstation instance.  
    `data` (table) — Optional saved state (unused here).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no explicit `inst:ListenForEvent` calls).
- **Pushes:** None (no explicit `inst:PushEvent` calls).
