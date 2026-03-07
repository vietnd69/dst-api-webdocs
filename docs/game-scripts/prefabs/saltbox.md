---
id: saltbox
title: Saltbox
description: A storage container that preserves perishable items at a fixed rate and can be destroyed via hammering to release its contents.
tags: [inventory, preservation, structure, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8e6e5e86
system_scope: inventory
---

# Saltbox

> Based on game build **714004** | Last updated: 2026-03-07

## Overview
The `saltbox` prefab represents a storage structure that keeps items preserved at a fixed perish rate multiplier (`TUNING.PERISH_SALTBOX_MULT`). It integrates the `container`, `preserver`, `lootdropper`, and `workable` components to provide storage functionality, item preservation, and destruction behavior. It is designed as a seasonal/structure-specific container with animation and sound feedback for opening/closing, hammering, and placement.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectable")
inst:AddComponent("container")
inst.components.container:WidgetSetup("saltbox")
inst:AddComponent("preserver")
inst.components.preserver:SetPerishRateMultiplier(TUNING.PERISH_SALTBOX_MULT)
inst:AddComponent("lootdropper")
inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(2)
inst.components.workable:SetOnFinishCallback(function(inst, worker) inst.components.lootdropper:DropLoot() inst:Remove() end)
inst.components.workable:SetOnWorkCallback(function(inst, worker) inst.AnimState:PlayAnimation("hit") inst.components.container:DropEverything() inst.AnimState:PushAnimation("closed", false) inst.components.container:Close() end)
```

## Dependencies & tags
**Components used:** `container`, `preserver`, `lootdropper`, `workable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** Adds `saltbox` and `structure`; checks `burnt` (via `lootdropper`), `monster`, `animal`, `creaturecorpse`, `structure`, `hive` (via `lootdropper`), and seasonal tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onopenfn` | function | `onopen` | Callback fired when the container is opened; triggers animation and sound. |
| `onclosefn` | function | `onclose` | Callback fired when the container is closed; triggers animation and sound. |
| `skipclosesnd` | boolean | `true` | Suppresses default close sound; custom close sound is played manually. |
| `skipopensnd` | boolean | `true` | Suppresses default open sound; custom open sound is played manually. |
| `perish_rate_multiplier` | number | `TUNING.PERISH_SALTBOX_MULT` | Multiplier applied to the base perish rate for stored items. |

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Destroys the saltbox by dropping all its contents via `lootdropper`, empties the container, spawns a small collapse FX, and removes the entity.
*   **Parameters:** `inst` (Entity) – the saltbox instance; `worker` (Entity) – the player performing the hammer action.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Triggered during partial hammering; plays hit animation, drops all container contents, and resets animation to "closed". Closes the container.
*   **Parameters:** `inst` (Entity) – the saltbox instance; `worker` (Entity) – the player performing the hammer action.
*   **Returns:** Nothing.

### `onopen(inst)`
*   **Description:** Plays the "open" animation and emits the custom open sound.
*   **Parameters:** `inst` (Entity) – the saltbox instance.
*   **Returns:** Nothing.

### `onclose(inst)`
*   **Description:** Plays the "close" animation and emits the custom close sound.
*   **Parameters:** `inst` (Entity) – the saltbox instance.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Plays the "place" animation, locks into "closed" state, and emits the placement sound.
*   **Parameters:** `inst` (Entity) – the saltbox instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` – triggers `onbuilt` callback to set initial state upon placement.
- **Pushes:** None (relies on components to fire their own events).