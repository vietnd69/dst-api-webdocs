---
id: upgrademoduleowner
title: Upgrademoduleowner
description: Manages upgrade modules attached to an entity (e.g., WX-78), tracks charge levels, and handles module activation/deactivation based on available power.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ea07475f
---

# Upgrademoduleowner

## Overview
This component manages a collection of upgrade modules attached to an entity (most notably the WX-78 robot), tracks its electric charge level, and controls which modules are active based on available power. It provides functionality for adding, removing, and enumerating modules, enforcing upgrade cooldowns, persisting state during save/load cycles, and broadcasting charge-level updates.

## Dependencies & Tags
- Adds the `"upgrademoduleowner"` tag to the entity.
- Requires modules to have an `upgrademodule` subcomponent (accessed via `module.components.upgrademodule`).
- Does not directly add other components like `health` or `inventory`; it assumes the host entity is appropriately configured.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modules` | `table` | `{}` | List of upgrade module entities attached to the owner. |
| `charge_level` | `number` | `0` | Current electric charge level of the owner. |
| `max_charge` | `number` | `TUNING.WX78_MAXELECTRICCHARGE` | Maximum allowable charge level. |
| `upgrade_cooldown` | `number` | `15*FRAMES` | Minimum time (in frames) between module installations. |
| `_last_upgrade_time` | `number?` | `nil` | Timestamp of the last successful module insertion; used for cooldown enforcement. |

## Main Functions

### `NumModules()`
* **Description:** Returns the total number of installed upgrade modules.
* **Parameters:** None.

### `GetModuleInSlot(slotnum)`
* **Description:** Returns the module installed in the specified slot index (1-based).
* **Parameters:**  
  - `slotnum`: The 1-based index of the module slot to query.

### `GetModuleTypeCount(moduletype)`
* **Description:** Counts how many modules of a given type (e.g., `"motor"`, `"brain"`) are installed. The prefab name is constructed as `"wx78module_"..moduletype`.
* **Parameters:**  
  - `moduletype`: String identifier for the module type (e.g., `"motor"`).

### `UsedSlotCount()`
* **Description:** Returns the total number of charge slots consumed by all installed modules (sum of `module.components.upgrademodule.slots`).
* **Parameters:** None.

### `CanUpgrade(module_instance)`
* **Description:** Determines if a new module can be installed. Checks if the upgrade cooldown has elapsed and, optionally, consults a custom `canupgradefn` callback if defined.
* **Parameters:**  
  - `module_instance`: The module entity being considered for installation.  
  *Returns:* Two values: `success (boolean)`, `reason (string?)` (e.g., `"COOLDOWN"` if on cooldown).

### `UpdateActivatedModules(isloading)`
* **Description:** Ensures modules are activated or deactivated based on available charge. Modules are activated in order until charge runs out. Charge slots consumed per module are determined by `module.components.upgrademodule.slots`.
* **Parameters:**  
  - `isloading`: Boolean indicating if this update occurs during loading (affects activation behavior, e.g., avoiding side effects).

### `PushModule(module, isloading)`
* **Description:** Installs a new module onto the entity. Handles parenting, position reset, charge-level recalculation, cooldown tracking, and callbacks.
* **Parameters:**  
  - `module`: The module entity to install.  
  - `isloading`: Boolean indicating if this is part of loading saved state.

### `PopModule(index)`
* **Description:** Removes and returns the module at the specified index. Deactivates the module, restores it to the scene, and re-evaluates activation status of remaining modules.
* **Parameters:**  
  - `index`: 1-based index of the module to remove (defaults to last module if omitted? *Implementation assumes index must be provided*).  
  *Returns:* The removed module entity.

### `PopAllModules()`
* **Description:** Removes and destroys all installed modules, triggering the `onallmodulespopped` callback if defined.

### `PopOneModule()`
* **Description:** Removes the last installed module and returns the amount of charge that was freed (equal to the module’s slot cost). Triggers the `ononemodulepopped` callback if defined.
* **Parameters:** None.  
  *Returns:* `energy_cost` (number) — amount of charge restored.

### `SetChargeLevel(new_level)`
* **Description:** Updates the current charge level to `new_level`, clamped between `0` and `max_charge`. Also triggers `UpdateActivatedModules()` to reflect the new power availability.
* **Parameters:**  
  - `new_level`: Target charge level.

### `AddCharge(n)`
* **Description:** Increases the current charge level by `n`, clamped to `max_charge`.
* **Parameters:**  
  - `n`: Amount of charge to add.

### `ChargeIsMaxed()`
* **Description:** Returns `true` if the current charge equals the maximum.
* **Parameters:** None.

### `IsChargeEmpty()`
* **Description:** Returns `true` if the current charge is zero.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing charge and installed modules (prefab names).
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component state for saving: charge level and module save records.
* **Parameters:** None.  
  *Returns:* `data (table)`, `our_references (table)` — used by the save system.

### `OnLoad(data, newents)`
* **Description:** Restores component state from saved data: charge level and re-spawns/re-attaches modules.
* **Parameters:**  
  - `data`: Saved data table from `OnSave()`.  
  - `newents`: Entity map for resolving save references.

## Events & Listeners
- **Listens to:** `energylevelupdate` — handled via `charge_level` property setter (the `on_charge_level_changed` function is registered as a property observer in the class definition).
  - On change, pushes an `"energylevelupdate"` event with `{ new_level = new_charge, old_level = old_charge }`.
  - If the entity has a `player_classified` component, updates its `currentenergylevel` property.
- **Triggers events:**
  - `"energylevelupdate"` — emitted when charge level changes (see above).
  - `onmoduleadded(inst, module)` — if callback defined.
  - `onmoduleremoved(inst, module)` — if callback defined.
  - `onallmodulespopped(inst)` — if callback defined.
  - `ononemodulepopped(inst, module)` — if callback defined.