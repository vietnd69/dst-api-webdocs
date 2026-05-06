---
id: wx78_modules
title: Wx78 Modules
description: Prefab factory file that generates WX-78 upgrade module entities with inventory, finite uses, and upgrademodule components for each module definition.
tags: [prefab, wx78, upgrade, robot]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: db27d248
system_scope: entity
---

# Wx78 Modules

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`wx78_modules.lua` is a prefab factory file that generates multiple WX-78 upgrade module entities from definitions in `wx78_moduledefs.lua`. Each module prefab is created via `MakeModule(data)` and attaches client-side components (transform, animstate, network) in `fn()`, then server-side gameplay components (inspectable, inventoryitem, upgrademodule, finiteuses) in the master-only section. Modules are inventory items that can be slotted into WX-78 and consume uses when removed, with skill tree bonuses affecting consumption rate.

## Usage example
```lua
-- Modules are spawned by prefab name (generated from module definitions):
local inst = SpawnPrefab("wx78module_processor")

-- Access module properties (client-safe):
local netid = inst._netid
local slots = inst._slots
local modtype = inst._type

-- Server-side: check component state
if TheWorld.ismastersim then
    local uses = inst.components.finiteuses:GetPercent()
end
```

## Dependencies & tags
**External dependencies:**
- `wx78_moduledefs` -- provides `module_definitions` table with module data (name, slots, type, callbacks)

**Components used:**
- `inspectable` -- allows players to examine the module
- `inventoryitem` -- enables carrying in inventory slots
- `upgrademodule` -- handles slot requirements, type, and activation/deactivation hooks
- `finiteuses` -- tracks module uses and triggers removal when depleted

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries: ANIM (wx_chips.zip) and SCRIPT (wx78_moduledefs.lua). |
| `_netid` | number | --- | Client-readable module network ID (set in fn()). |
| `_slots` | number | --- | Client-readable number of upgrade slots required (set in fn()). |
| `_type` | string | --- | Client-readable module type identifier (set in fn()). |


## Main functions
### `on_module_removed(inst, owner)` (local)
* **Description:** Callback triggered when a module is removed from WX-78. Consumes uses from `finiteuses` component unless owner is currently swapping modules. Consumption rate is halved if the "wx78_circuitry_betterunplug" skill is activated.
* **Parameters:**
  - `inst` -- module entity being removed
  - `owner` -- WX-78 entity owning the module
* **Returns:** None
* **Error states:** None

### `MakeModule(data)` (local)
* **Description:** Factory function that creates a Prefab object for a single module definition. Builds an inner `fn()` constructor closure that captures `data` from outer scope. The constructor creates the entity, adds Transform/AnimState/Network components, sets animation bank/build from module data, configures inventory floatable scale based on slot count, and sets client-readable properties (`_netid`, `_slots`, `_type`). Server-side attaches gameplay components (`inspectable`, `inventoryitem`, `upgrademodule`, `finiteuses`) and configures upgrademodule hooks. Returns a Prefab table with name `"wx78module_"..data.name`.
* **Parameters:** `data` -- module definition table from `module_definitions` containing name, slots, type, callbacks, and optional overrides.
* **Returns:** Prefab table
* **Error states:** Errors if `data.name`, `data.slots`, `data.type`, or callback fields (`activatefn`, `deactivatefn`, `addedtoownerfn`, `removedfromownerfn`) are nil/invalid when accessed in the inner `fn()` constructor — no validation guards present before data access.


## Events & listeners
- **Listens to:** None directly registered in this file.
- **Pushes:** None directly pushed in this file.
- **Component events:** `finiteuses` component triggers `percentusedchange` event internally; `SetOnFinished(inst.Remove)` causes entity removal when uses reach zero.