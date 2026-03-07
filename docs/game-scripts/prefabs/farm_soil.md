---
id: farm_soil
title: Farm Soil
description: Represents tilled soil in the farm, handling visual states, plowing state tracking, and persistence across saves.
tags: [farming, environment, persistence]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 355b8e67
system_scope: environment
---

# Farm Soil

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`farm_soil` is a prefab component that models tilled soil used for planting crops. It manages its visual state (`till_idle`, `collapse`, etc.), tracks whether it has been broken or is currently being plowed, and integrates with the `farm_plow` prefab during the plowing workflow. It supports save/load synchronization and custom mouse-interaction behavior via `CanMouseThrough` and `displaynamefn`.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
inst:AddTag("soil")
inst.SetPlowing = fn().SetPlowing
inst:SetPlowing(plow_entity)
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network` (via `inst.entity:AddX()`), and indirectly `PlayerActionPicker` for mouse interaction logic.
**Tags:** `soil` (initially added), `NOCLICK`, `NOBLOCK`, `broken` (state implied by `NOBLOCK`).

## Properties
No public properties are initialized in the constructor. Internal state is stored in instance fields (e.g., `inst._plow`), which are not part of the public API.

## Main functions
### `SetPlowing(plow)`
* **Description:** Associates the soil with a plowing entity, sets `NOCLICK` tag, and registers callbacks for plow removal or completion to transition out of the plowing state.
* **Parameters:** `plow` (Entity) — the `farm_plow` entity performing the plowing.
* **Returns:** Nothing.
* **Error states:** Returns early without side effects if `plow` is `nil` (no explicit guard, but `inst._plow` will be assigned regardless).

### `OnBreak(inst)`
* **Description:** Handles soil breaking via the `"breaksoil"` event. Transitions soil to a broken state by adding `NOCLICK`/`NOBLOCK` tags and playing the `collapse` animation sequence.
* **Parameters:** `inst` (Entity) — the soil entity.
* **Returns:** Nothing.
* **Error states:** Only operates if `inst` has the `"soil"` tag and not `"NOBLOCK"`.

### `OnCollapse(inst)`
* **Description:** Handles full soil collapse via the `"collapsesoil"` event. Cancels any active plowing state, removes `"soil"` tag, sets `persists = false`, and plays removal animation before auto-removing the entity on `"animover"`.

### `CancelPlowing(inst)`
* **Description:** Cleans up active plowing state by removing event listeners and clearing internal fields (`_plow`, `_onremoveplow`, `_onfinishplowing`).

### `OnSave(inst, data)`
* **Description:** Serializes soil state. Sets `data.broken` based on `"NOBLOCK"` tag, and stores GUID of associated plow if active.
* **Parameters:** `inst` (Entity), `data` (table) — save data table.
* **Returns:** `{ plow_GUID }` if a plow is active (used for entity reference resolution), otherwise `nil`.

### `OnLoad(inst, data)`
* **Description:** Restores soil state after loading. Applies `"NOBLOCK"` tag and collapse animation if `data.broken` is true, otherwise plays `"till_idle"`.

### `OnLoadPostPass(inst, ents, data)`
* **Description:** Post-load hook for restoring plowing association using resolved entities. Re-applies `SetPlowing` if plow GUID resolves, otherwise calls `OnCollapse`.

## Events & listeners
- **Listens to:**  
  - `"breaksoil"` — triggers `OnBreak`.
  - `"collapsesoil"` — triggers `OnCollapse`.
  - `"onremove"` — registered dynamically via `SetPlowing` to trigger collapse if the plow is removed.
  - `"finishplowing"` — registered dynamically via `SetPlowing` to clear `NOCLICK` and reset plowing state.
  - `"animover"` — used in `OnCollapse` to trigger entity removal after animation completes.
- **Pushes:** None.