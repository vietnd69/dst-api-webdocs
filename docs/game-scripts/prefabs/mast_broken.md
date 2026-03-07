---
id: mast_broken
title: Mast Broken
description: Represents a broken boat mast that can be repaired or burned, dropping loot and triggering visual/sound effects when interacted with.
tags: [structure, repair, fire, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4c97eb6b
system_scope: entity
---

# Mast Broken

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`mast_broken` is a structural prefab used for a damaged boat mast in DST. It is designed to be interacted with via hammering (repair) or fire (burning), and integrates with several core components: `lootdropper`, `hauntable`, `workable`, and `burnable`. When repaired, it dissolves into effects and removes itself; when burned, it triggers a burnt state that destroys an associated rudder entity.

## Usage example
```lua
local inst = SpawnPrefab("mast_broken")
inst.Transform:SetPosition(entity:GetPosition())
inst.Transform:SetScale(1, 1, 1)
```
This creates an instance of a broken mast at a given position. It is typically spawned by gameplay events (e.g., after a mast is damaged) rather than added dynamically by mods.

## Dependencies & tags
**Components used:** `lootdropper`, `hauntable`, `workable`, `burnable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`

**Tags added:** `NOBLOCK`, `structure`, `mast`, `broken`

**Tags checked:** `burnt`, `boat`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_facing` | number | `FACING_DOWN` | Orientation for scrapbook rendering. |
| `_rudder` | entity reference or `nil` | `rudder` prefab instance | Associated rudder entity, parented to the mast; removed when the mast is burnt. |

## Main functions
### `OnHammered(inst, worker)`
*   **Description:** Callback triggered when the mast is successfully hammered (repaired). Drops loot, spawns a sinking or collapse effect (depending on the worker), and removes the mast.
*   **Parameters:** `inst` (entity) — the mast instance; `worker` (entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

### `OnHit(inst, worker)`
*   **Description:** Callback triggered on each hammer hit during repair. Plays the `broken_hit` animation followed by the `broken` idle loop.
*   **Parameters:** `inst` (entity) — the mast instance; `worker` (entity) — the entity hitting the mast.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Called when the mast finishes burning. Calls `DefaultBurntStructureFn`, then removes the associated `_rudder` entity if present.
*   **Parameters:** `inst` (entity) — the mast instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves the mast’s burnt state to disk.
*   **Parameters:** `inst` (entity) — the mast instance; `data` (table) — the save data table.
*   **Returns:** Nothing. Sets `data.burnt = true` if burning or burnt.

### `OnLoad(inst, data)`
*   **Description:** Restores the burnt state on load. Calls `onburnt` immediately if previously burnt.
*   **Parameters:** `inst` (entity) — the mast instance; `data` (table) — the loaded save data.
*   **Returns:** Nothing. Fires `onburnt` only if `data.burnt` is truthy.

## Events & listeners
- **Listens to:** None (events are handled via component callbacks).
- **Pushes:** None directly; relies on component-level events (e.g., `burnable.onburnt`, `workable.onfinish`, `workable.onwork`).