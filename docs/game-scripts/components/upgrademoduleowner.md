---
id: upgrademoduleowner
title: Upgrademoduleowner
description: Manages a collection of upgrade modules and their charge-based activation state for an entity.
tags: [inventory, upgrading, charge]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ea07475f
system_scope: entity
---
# Upgrademoduleowner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Upgrademoduleowner` serves as the central manager for upgrade modules attached to an entity, such as WX-78's electrical charge system. It maintains a list of installed modules, tracks available charge, and automatically activates or deactivates modules based on available charge relative to slot costs. It interacts closely with the `upgrademodule` component and integrates with save/load, event propagation, and UI synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgrademoduleowner")
inst.components.upgrademoduleowner:SetChargeLevel(200)
-- Attach a module (e.g., after validation)
local module = TheEntMan:CreateEntity("wx78module_charge")
inst.components.upgrademoduleowner:PushModule(module, false)
-- Check module count or activation
local active = inst.components.upgrademoduleowner:GetModuleInSlot(1)
local num_modules = inst.components.upgrademoduleowner:NumModules()
```

## Dependencies & tags
**Components used:** `upgrademodule` (via `module.components.upgrademodule`)
**Tags:** Adds `upgrademoduleowner` when initialized; removes it on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modules` | table | `{}` | List of attached module entities. |
| `charge_level` | number | `0` | Current electrical charge available. |
| `max_charge` | number | `TUNING.WX78_MAXELECTRICCHARGE` | Maximum possible charge. |
| `upgrade_cooldown` | number | `15*FRAMES` | Minimum time (in frames) between module installations. |
| `onmoduleadded` | function | `nil` | Optional callback when a module is added. |
| `onmoduleremoved` | function | `nil` | Optional callback when a module is removed. |
| `onallmodulespopped` | function | `nil` | Optional callback when all modules are removed. |
| `ononemodulepopped` | function | `nil` | Optional callback when one module is popped. |
| `canupgradefn` | function | `nil` | Optional predicate to allow/block new upgrades. |

## Main functions
### `NumModules()`
*   **Description:** Returns the total number of modules currently installed.
*   **Parameters:** None.
*   **Returns:** `number` — the number of modules in `modules`.

### `GetModuleInSlot(slotnum)`
*   **Description:** Retrieves the module installed at a specific slot index.
*   **Parameters:** `slotnum` (number) — 1-based index of the slot.
*   **Returns:** `entity?` — the module entity, or `nil` if slot is empty.

### `GetModuleTypeCount(moduletype)`
*   **Description:** Counts how many modules of a specific type (e.g., `"charge"`, `"speed"`) are installed.
*   **Parameters:** `moduletype` (string) — the type suffix used to build the module prefab name (`"wx78module_"..moduletype`).
*   **Returns:** `number` — count of matching modules.

### `UsedSlotCount()`
*   **Description:** Calculates total slot cost of all installed modules.
*   **Parameters:** None.
*   **Returns:** `number` — sum of `slots` values from each module’s `upgrademodule` component.

### `CanUpgrade(module_instance)`
*   **Description:** Determines whether a new module can be installed.
*   **Parameters:** `module_instance` (entity) — the module to be installed.
*   **Returns:** 
  *   `true` — if allowed.
  *   `false, "COOLDOWN"` — if the upgrade cooldown has not elapsed.
  *   The result of `canupgradefn(inst, module_instance)` if that callback is set.

### `UpdateActivatedModules(isloading)`
*   **Description:** Iterates over installed modules, activates or deactivates them based on remaining charge after deducting slot costs.
*   **Parameters:** `isloading` (boolean) — whether this is during a load operation (passed to module activation).
*   **Returns:** Nothing.

### `PushModule(module, isloading)`
*   **Description:** Adds a module to the owner, connects it to the scene hierarchy, and updates activation states.
*   **Parameters:** 
  *   `module` (entity) — the module to install.
  *   `isloading` (boolean) — whether loading from save.
*   **Returns:** Nothing.

### `PopModule(index)`
*   **Description:** Removes and returns the module at the given index (defaults to last module).
*   **Parameters:** `index` (number) — 1-based slot index to remove. Defaults to `#self.modules`.
*   **Returns:** `entity?` — the removed module, or `nil` if none.

### `PopAllModules()`
*   **Description:** Removes all installed modules one by one.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PopOneModule()`
*   **Description:** Removes the last installed module and returns the energy cost equivalent to the module's slots *if* it was fully charged at removal time.
*   **Parameters:** None.
*   **Returns:** `number` — energy cost recovered (same as `slots` of popped module if fully charged), or `0` if no modules.

### `SetChargeLevel(new_level)`
*   **Description:** Updates the current charge level, clamps it to `[0, max_charge]`, and re-evaluates activation states.
*   **Parameters:** `new_level` (number) — desired charge amount.
*   **Returns:** Nothing.

### `AddCharge(n)`
*   **Description:** Increases charge level by `n`, clamped to `max_charge`.
*   **Parameters:** `n` (number) — amount of charge to add (can be negative).
*   **Returns:** Nothing.

### `ChargeIsMaxed()`
*   **Description:** Checks if charge is at maximum.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `charge_level == max_charge`.

### `IsChargeEmpty()`
*   **Description:** Checks if charge is zero.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `charge_level == 0`.

### `OnSave()`
*   **Description:** Generates serializable save data for modules and charge state.
*   **Parameters:** None.
*   **Returns:** 
  *   `data` (table) — `{ modules = {...}, charge_level = number }`
  *   `our_references` (table) — list of referenced entity save records.

### `OnLoad(data, newents)`
*   **Description:** Restores modules and charge level from saved data.
*   **Parameters:** 
  *   `data` (table) — save data from `OnSave`.
  *   `newents` (table) — mapping of restored entities.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string describing current charge and installed modules.
*   **Parameters:** None.
*   **Returns:** `string` — formatted debug info.

## Events & listeners
- **Listens to:** `charge_level` property change — triggers `on_charge_level_changed` callback.
- **Pushes:** `energylevelupdate` with `{ new_level = number, old_level = number }` whenever charge level changes.
- **Callbacks:** Supports optional user-defined callbacks `onmoduleadded`, `onmoduleremoved`, `onallmodulespopped`, `ononemodulepopped`, and `canupgradefn`.

