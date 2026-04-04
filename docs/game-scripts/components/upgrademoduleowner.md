---
id: upgrademoduleowner
title: UpgradeModuleOwner
description: Manages upgrade modules and electric charge levels for WX-78 character entities.
tags: [upgrade, wx78, modules, electric]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: components
source_hash: 1f8488bc
system_scope: entity
---

# UpgradeModuleOwner

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`UpgradeModuleOwner` manages upgrade modules and electric charge levels for WX-78 character entities. It tracks installed modules, their slot costs, and activation states based on available charge. This component is central to WX-78's upgrade system, coordinating module installation, removal, and power management within the Entity Component System.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgrademoduleowner")
inst.components.upgrademoduleowner:SetChargeLevel(10)

local module = SpawnPrefab("wx78module_attack")
if inst.components.upgrademoduleowner:CanUpgrade(module) then
    inst.components.upgrademoduleowner:PushModule(module)
end
```

## Dependencies & tags
**Components used:** `upgrademodule` (on module entities), `player_classified` (optional, for UI replication)
**Tags:** Adds `upgrademoduleowner` on initialization; removes `upgrademoduleowner` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modules` | table | `{}` | Array of installed module entity references. |
| `charge_level` | number | `0` | Current electric charge level. |
| `max_charge` | number | `TUNING.WX78_MAXELECTRICCHARGE` | Maximum charge capacity. |
| `upgrade_cooldown` | number | `15*FRAMES` | Cooldown period between upgrades in frames. |
| `canupgradefn` | function | `nil` | Optional custom validation function for upgrades. |
| `onmoduleadded` | function | `nil` | Callback fired when a module is added. |
| `onmoduleremoved` | function | `nil` | Callback fired when a module is removed. |
| `onallmodulespopped` | function | `nil` | Callback fired when all modules are removed. |
| `ononemodulepopped` | function | `nil` | Callback fired when one module is removed. |
| `_last_upgrade_time` | number | `nil` | Timestamp of the last upgrade action. |

## Main functions
### `NumModules()`
*   **Description:** Returns the total number of installed modules.
*   **Parameters:** None.
*   **Returns:** `number` - Count of modules in the `modules` table.

### `GetModuleInSlot(slotnum)`
*   **Description:** Retrieves a module at a specific slot index.
*   **Parameters:** `slotnum` (number) - The index in the modules array.
*   **Returns:** `entity` or `nil` - The module entity at that slot, or `nil` if empty.

### `GetModuleTypeCount(moduletype)`
*   **Description:** Counts how many modules of a specific type are installed.
*   **Parameters:** `moduletype` (string) - The module type identifier (e.g., `"attack"`, `"speed"`).
*   **Returns:** `number` - Count of matching modules.

### `UsedSlotCount()`
*   **Description:** Calculates total slot cost of all installed modules.
*   **Parameters:** None.
*   **Returns:** `number` - Sum of all module slot costs.

### `CanUpgrade(module_instance)`
*   **Description:** Validates whether a module can be installed.
*   **Parameters:** `module_instance` (entity) - The module entity to validate.
*   **Returns:** `(boolean, string?)` - `true` if upgrade is allowed; `false` with reason string (e.g., `"COOLDOWN"`) if blocked.
*   **Error states:** Returns `false, "COOLDOWN"` if upgrade cooldown is active.

### `PushModule(module, isloading)`
*   **Description:** Installs a module onto the entity.
*   **Parameters:** `module` (entity) - The module entity to install. `isloading` (boolean, optional) - Whether this is during save load.
*   **Returns:** Nothing.
*   **Side Effects:** Sets `_last_upgrade_time` to enforce cooldown after installation.

### `PopModule(index)`
*   **Description:** Removes a module at a specific index, or the last module if no index is provided.
*   **Parameters:** `index` (number, optional) - Module array index; defaults to last module if omitted.
*   **Returns:** `entity` or `nil` - The removed module entity, or `nil` if no modules exist.

### `PopAllModules()`
*   **Description:** Removes all installed modules.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PopOneModule()`
*   **Description:** Removes the last module if available and returns its energy cost if it was charged, otherwise returns 0.
*   **Parameters:** None.
*   **Returns:** `number` - Energy cost of the removed module if it was charged, otherwise `0`.

### `SetChargeLevel(new_level)`
*   **Description:** Sets the current charge level, clamped to valid range.
*   **Parameters:** `new_level` (number) - The new charge level.
*   **Returns:** Nothing.

### `AddCharge(n)`
*   **Description:** Adds or subtracts charge from the current level.
*   **Parameters:** `n` (number) - Amount to add (negative values subtract).
*   **Returns:** Nothing.

### `ChargeIsMaxed()`
*   **Description:** Checks if charge is at maximum capacity.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if `charge_level` equals `max_charge`.

### `IsChargeEmpty()`
*   **Description:** Checks if charge level is zero.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if `charge_level` is `0`.

### `UpdateActivatedModules(isloading)`
*   **Description:** Updates module activation states based on available charge. Deactivates modules that exceed available charge slots.
*   **Parameters:** `isloading` (boolean, optional) - Whether this is during save load.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes component state for persistence.
*   **Parameters:** None.
*   **Returns:** `table`, `table` - Save data and object references.

### `OnLoad(data, newents)`
*   **Description:** Restores component state from saved data.
*   **Parameters:** `data` (table) - Saved component data. `newents` (table) - Entity reference mapping.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns debug information for console output.
*   **Parameters:** None.
*   **Returns:** `string` - Formatted debug string with charge level and module list.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler when component is removed from entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `energylevelupdate` - Fired when charge level changes; data includes `new_level` and `old_level`.