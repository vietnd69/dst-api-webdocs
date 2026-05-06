---
id: upgrademoduleowner
title: Upgrademoduleowner
description: Manages upgrade module slots and charge levels for WX-78 robot entities.
tags: [wx78, upgrade, modules, robot, circuit]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 59c9a5dc
system_scope: entity
---

# Upgrademoduleowner

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Upgrademoduleowner` manages the upgrade module system for WX-78 robot entities. It tracks installed modules across circuit bars, manages charge levels that limit active modules, and handles module activation/deactivation based on available charge. This component works closely with `upgrademodule` components on individual module entities and integrates with the `wx78_classified` component for network replication.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgrademoduleowner")

-- Set charge level and add a module
inst.components.upgrademoduleowner:SetChargeLevel(5)
inst.components.upgrademoduleowner:PushModule("combat", module_inst)

-- Check module status
local count = inst.components.upgrademoduleowner:GetNumModules("combat")
local is_maxed = inst.components.upgrademoduleowner:IsChargeMaxed()

-- Start inspection UI
inst.components.upgrademoduleowner:StartInspecting(player)
```

## Dependencies & tags
**External dependencies:**
- `wx78_moduledefs` -- provides module_definitions and CIRCUIT_BARS constants

**Components used:**
- `inventoryitem` -- calls RemoveFromOwner() when pushing modules
- `upgrademodule` -- calls GetType(), SetTarget(), TryActivate(), TryDeactivate(), RemoveFromOwner(); accesses slots and activated properties
- `SoundEmitter` -- plays sounds for inspect start/stop
- `wx78_classified` -- replicates charge level and inspecting state to clients

**Tags:**
- `upgrademoduleowner` -- added on component init, removed on entity removal
- `inspectingupgrademodules` -- added when StartInspecting(), removed on StopInspecting() or entity removal

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The owning entity instance. |
| `module_bars` | table | `{}` | Table of modules organized by circuit bar type. |
| `charge_level` | number | `0` | Current charge level available for activating modules. |
| `max_charge` | number | `TUNING.WX78_INITIAL_MAXCHARGELEVEL` | Maximum charge level (also determines total circuit slots). |
| `inspecting` | boolean | `false` | Whether the module inspection UI is currently open. |
| `inspecter` | entity | `nil` | The player entity currently inspecting the modules. |
| `onmoduleadded` | function | `nil` | Callback fired when a module is added. |
| `onmoduleremoved` | function | `nil` | Callback fired when a module is removed. |
| `onallmodulespopped` | function | `nil` | Callback fired when all modules are removed. |
| `ononemodulepopped` | function | `nil` | Callback fired when a single module is removed. |
| `canupgradefn` | function | `nil` | Custom validation function for CanUpgrade(). |
| `prevent_automatic_module_activations` | boolean | `nil` | If true, prevents automatic module activation on charge changes. |
| `isloading` | boolean | `nil` | Internal flag set during OnLoad() to suppress events. |
| `is_swapping` | boolean | `nil` | Internal flag set during SwapUpgradeModules(). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from an entity. Cleans up tags.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `StartInspecting(inspecter)`
* **Description:** Opens the module inspection UI for the given player. Plays open sound and sets inspecting state.
* **Parameters:** `inspecter` -- player entity that is inspecting the modules.
* **Returns:** `true` if inspection started successfully, `nil` if already inspecting.
* **Error states:** None.

### `StopInspecting()`
* **Description:** Closes the module inspection UI. Plays close sound and clears inspecting state.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `GetModuleTypeCount(moduletype)`
* **Description:** Counts modules of a specific type across all circuit bars, considering charge limitations.
* **Parameters:** `moduletype` -- string module type to count.
* **Returns:** Number of modules of the specified type that fit within current charge.
* **Error states:** Errors if any module in `module_bars` lacks `upgrademodule` component (nil dereference on `module.components.upgrademodule.slots`).

### `GetUsedSlotCount(bartype)`
* **Description:** Returns total slot cost of all modules in a specific circuit bar.
* **Parameters:** `bartype` -- circuit bar type string.
* **Returns:** Total slot count as number.
* **Error states:** Errors if any module in the bar lacks `upgrademodule` component (nil dereference on `module.components.upgrademodule.slots`).

### `GetAllModules()`
* **Description:** Returns a flat list of all modules across all circuit bars.
* **Parameters:** None.
* **Returns:** Table of module entity instances.
* **Error states:** None.

### `GetModules(bartype)`
* **Description:** Returns the module list for a specific circuit bar.
* **Parameters:** `bartype` -- circuit bar type string.
* **Returns:** Table of module entities, or `nil` if bartype does not exist.
* **Error states:** None.

### `GetNumModules(bartype)`
* **Description:** Returns the count of modules in a specific circuit bar.
* **Parameters:** `bartype` -- circuit bar type string.
* **Returns:** Number of modules in the bar.
* **Error states:** None.

### `GetModule(bartype, moduleindex)`
* **Description:** Returns a specific module by index from a circuit bar.
* **Parameters:**
  - `bartype` -- circuit bar type string
  - `moduleindex` -- integer index in the bar
* **Returns:** Module entity instance, or `nil` if index is out of bounds.
* **Error states:** None.

### `NumModules()`
* **Description:** DEPRECATED. Always returns 0. Use `GetNumModules()` instead.
* **Parameters:** None.
* **Returns:** `0`.
* **Error states:** None.

### `CanUpgrade(module_instance)`
* **Description:** Checks if a module can be added. Uses custom `canupgradefn` if set, otherwise returns true.
* **Parameters:** `module_instance` -- module entity to validate.
* **Returns:** `true` if upgrade is allowed, `false` otherwise.
* **Error states:** Errors if `canupgradefn` is set but throws an error when called (no error handling wrapper).

### `UpdateActivatedModules(isloading)`
* **Description:** Activates or deactivates modules based on available charge. Modules are activated in order until charge is exhausted.
* **Parameters:** `isloading` -- boolean, passed to TryActivate() to suppress events during load.
* **Returns:** None.
* **Error states:** Errors if any module lacks `upgrademodule` component (nil dereference on `module.components.upgrademodule` methods).

### `SetAutomaticModuleActivations(enabled)`
* **Description:** Enables or disables automatic module activation when charge changes.
* **Parameters:** `enabled` -- boolean to enable or disable auto-activation.
* **Returns:** None.
* **Error states:** None.

### `PushModule(bartype, module, isloading)`
* **Description:** Adds a module to a circuit bar. Removes module from previous owner, sets target, and updates activation state.
* **Parameters:**
  - `bartype` -- circuit bar type string, or nil to auto-detect from module
  - `module` -- module entity instance
  - `isloading` -- boolean, passed to SetTarget() and UpdateActivatedModules()
* **Returns:** None.
* **Error states:** Errors if `module` lacks `inventoryitem` or `upgrademodule` components (nil dereference on component method calls). Errors if `bartype` is nil and `module.components.upgrademodule:GetType()` returns nil or invalid key.

### `PopModule(bartype, index)`
* **Description:** Removes a module from a circuit bar by index. Deactivates the module and returns it to the scene.
* **Parameters:**
  - `bartype` -- circuit bar type string
  - `index` -- integer index in the bar (defaults to last if not specified in some contexts)
* **Returns:** `top_module` (entity or nil), `was_activated` (boolean or nil).
* **Error states:** Errors if module lacks `upgrademodule` component (nil dereference on `top_module.components.upgrademodule` access).

### `FindAndPopModule(moduletofind)`
* **Description:** Searches all circuit bars for a specific module and removes it.
* **Parameters:** `moduletofind` -- module entity instance to find and remove.
* **Returns:** None.
* **Error states:** Calls `PopOneModule()` which may have error states (see that function).

### `PopAllModules(bartype)`
* **Description:** Removes all modules from one or all circuit bars. Fires `onallmodulespopped` callback.
* **Parameters:** `bartype` -- circuit bar type string, or nil to pop all bars.
* **Returns:** Table of all popped module entities.
* **Error states:** Errors if any module lacks `upgrademodule` component during PopModule() calls.

### `PopOneModule(bartype, index)`
* **Description:** Removes a single module and fires `ononemodulepopped` callback.
* **Parameters:**
  - `bartype` -- circuit bar type string
  - `index` -- integer index in the bar
* **Returns:** `0` (deprecated energy cost value, kept for mod compatibility).
* **Error states:** Errors if `PopModule()` fails (see PopModule error states).

### `SetMaxCharge(max_charge)`
* **Description:** Sets the maximum charge level. Pops modules that exceed the new limit.
* **Parameters:** `max_charge` -- new maximum charge level as number.
* **Returns:** None.
* **Error states:** Errors if any module lacks `upgrademodule` component during limit check (nil dereference on `moduleent.components.upgrademodule.slots`).

### `SetChargeLevel(new_level)`
* **Description:** Sets the current charge level, clamped between 0 and max_charge. Triggers module activation updates.
* **Parameters:** `new_level` -- new charge level as number.
* **Returns:** None.
* **Error states:** None.

### `DoDeltaCharge(n)`
* **Description:** Adds or subtracts from the current charge level.
* **Parameters:** `n` -- number to add (negative to subtract).
* **Returns:** None.
* **Error states:** None.

### `AddCharge(n)`
* **Description:** DEPRECATED alias for DoDeltaCharge(). Adds or subtracts from the current charge level.
* **Parameters:** `n` -- number to add (negative to subtract).
* **Returns:** None.
* **Error states:** None.

### `IsChargeMaxed()`
* **Description:** Checks if current charge equals maximum charge.
* **Parameters:** None.
* **Returns:** `true` if maxed, `false` otherwise.
* **Error states:** None.

### `ChargeIsMaxed()`
* **Description:** DEPRECATED alias for IsChargeMaxed(). Checks if current charge equals maximum charge.
* **Parameters:** None.
* **Returns:** `true` if maxed, `false` otherwise.
* **Error states:** None.

### `IsChargeEmpty()`
* **Description:** Checks if current charge level is zero.
* **Parameters:** None.
* **Returns:** `true` if empty, `false` otherwise.
* **Error states:** None.

### `GetChargeLevel()`
* **Description:** Returns the current charge level.
* **Parameters:** None.
* **Returns:** Current charge level as number.
* **Error states:** None.

### `GetMaxChargeLevel()`
* **Description:** Returns the maximum charge level.
* **Parameters:** None.
* **Returns:** Maximum charge level as number.
* **Error states:** None.

### `IsSwapping()`
* **Description:** Checks if a module swap operation is in progress.
* **Parameters:** None.
* **Returns:** `true` if swapping, `nil` otherwise.
* **Error states:** None.

### `SwapUpgradeModules(otherupgrademoduleowner)`
* **Description:** Exchanges all modules between two upgrademoduleowner components. Sets swap flags during operation.
* **Parameters:** `otherupgrademoduleowner` -- another upgrademoduleowner component instance.
* **Returns:** None.
* **Error states:** Errors if `otherupgrademoduleowner` is nil or lacks upgrademoduleowner methods (nil dereference on method calls).

### `OnSave()`
* **Description:** Serializes component state for saving. Returns module data and references.
* **Parameters:** None.
* **Returns:** `data` (table), `our_references` (table of entity references).
* **Error states:** Errors if any module lacks `GetSaveRecord()` method (nil dereference on `module:GetSaveRecord()`).

### `OnLoad(data, newents)`
* **Description:** Restores component state from save data. Spawns and pushes saved modules.
* **Parameters:**
  - `data` -- save data table
  - `newents` -- entity reference mapping table
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a debug string showing charge level and all installed modules.
* **Parameters:** None.
* **Returns:** Debug string.
* **Error states:** None.

## Events & listeners
- **Pushes:** `energylevelupdate` -- fired when `charge_level` or `max_charge` changes; data includes `new_level`, `old_level`, `old_max_level`, `new_max_level`, `isloading`