---
id: beard
title: Beard
description: Manages beard growth, shaving mechanics, and insulation for bearded entities like Wilson.
tags: [character, grooming, insulation]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: afd7b837
system_scope: entity
---

# Beard

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Beard` manages the growth cycle, shaving mechanics, and thermal insulation properties for bearded entities. It tracks daily growth increments, supports callback-based visual stage changes, and integrates with the skill tree system for enhanced beard capabilities. The component automatically handles beard sack inventory management when skill upgrades are active.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("beard")
inst.components.beard:AddCallback(3, function(inst, skinname)
    -- Update beard animation stage
    inst.AnimState:PlayAnimation("beard_stage_3")
end)
inst.components.beard:EnableGrowth(true)
inst.components.beard:SetSkin("wilson_default")
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- access to beard growth constants, insulation values, and skill tuning

**Components used:**
- `skilltreeupdater` -- checks if beard-related skills are activated for growth bonuses and insulation modifiers
- `inventory` -- manages beard sack equipment and item transfers
- `sanity` -- applies sanity delta when entity shaves itself
- `container` -- handles beard sack item storage during sack upgrades

**Tags:**
- `bearded` -- added on component initialization, removed on component removal

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `daysgrowth` | number | `0` | Number of days the beard has grown. |
| `daysgrowthaccumulator` | number | `0` | Accumulated fractional days from skill bonuses. |
| `callbacks` | table | `{}` | Map of day numbers to callback functions for visual updates. |
| `prize` | string | `nil` | Prefab name of beard bits to drop when shaving. |
| `bits` | number | `0` | Current number of beard bits collected. |
| `insulation_factor` | number | `1` | Multiplier for insulation calculation. |
| `pause` | boolean | `nil` | If true, pauses beard growth on day complete. |
| `onreset` | function | `nil` | Callback function invoked when beard is reset. |
| `isgrowing` | boolean | `nil` | Tracks whether growth watching is active. |
| `skinname` | string | `nil` | Name of the current beard skin. |
| `canshavetest` | function | `nil` | Optional validation function before allowing shave. |

## Main functions
### `EnableGrowth(enable)`
* **Description:** Starts or stops watching world day cycles for beard growth. When enabled, the beard grows one stage per day plus any skill-based bonus days.
* **Parameters:** `enable` -- boolean to start or stop growth tracking.
* **Returns:** None.
* **Error states:** None.

### `GetInsulation()`
* **Description:** Calculates total insulation value based on beard bits, tuning constants, insulation factor, and active skill modifiers.
* **Parameters:** None.
* **Returns:** Number representing insulation value.
* **Error states:** None.

### `ShouldTryToShave(doer, item)`
* **Description:** Validates whether shaving is permitted based on available bits and optional custom test function.
* **Parameters:**
  - `doer` -- entity attempting to shave
  - `item` -- shaving tool item
* **Returns:** Boolean `true` if shaving is allowed, or `false, reason` if not.
* **Error states:** None.

### `Shave(doer, item)`
* **Description:** Removes beard bits, triggers callback for previous growth stage, drops beard bit prizes, applies sanity gain if self-shaving, and updates inventory.
* **Parameters:**
  - `doer` -- entity performing the shave
  - `item` -- shaving tool item
* **Returns:** `true` on success, or `false, reason` on failure.
* **Error states:** None.

### `AddCallback(day, cb)`
* **Description:** Registers a callback function to execute when beard reaches a specific growth day. Used for updating visual stages.
* **Parameters:**
  - `day` -- number representing growth day threshold
  - `cb` -- function to call with `(inst, skinname)` when day is reached
* **Returns:** None.
* **Error states:** None.

### `Reset()`
* **Description:** Resets all growth counters and bits to zero, invokes optional onreset callback, and updates beard inventory state.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnSave()`
* **Description:** Returns a table containing current growth state for serialization.
* **Parameters:** None.
* **Returns:** Table with `growth`, `growthaccumulator`, `bits`, and `skinname` fields.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores beard state from saved data and re-triggers all callbacks up to current growth day.
* **Parameters:** `data` -- table containing saved growth state.
* **Returns:** None.
* **Error states:** None.

### `LoadPostPass(newents, data)`
* **Description:** Post-load initialization that updates beard inventory after all entities are loaded.
* **Parameters:**
  - `newents` -- entity mapping from load process
  - `data` -- saved component data
* **Returns:** None.
* **Error states:** None.

### `SetSkin(skinname)`
* **Description:** Sets the beard skin name and re-triggers all callbacks up to current growth day with the new skin.
* **Parameters:** `skinname` -- string name of the beard skin.
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current bits, days growth, and next callback event day.
* **Parameters:** None.
* **Returns:** String for debugging output.
* **Error states:** None.

### `GetBeardSkinAndLength()`
* **Description:** Returns the current skin name and calculated beard length for network replication to clients.
* **Parameters:** None.
* **Returns:** `skinname, length` or `nil` if length is zero.
* **Error states:** None.

### `UpdateBeardInventory()`
* **Description:** Manages beard sack equipment based on current bit count and active skill upgrades. Equips appropriate sack level, transfers items between sacks, or removes sack if no level is met.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Errors if `inventory` component is missing (no nil guard before `GetEquippedItem` or `Equip` calls).

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed. Disables growth, removes bearded tag, and unregisters respawn event listener.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

## Events & listeners
- **Listens to:** `ms_respawnedfromghost` - resets beard on player respawn from ghost form.
- **Pushes:** `shaved` - fired when beard is successfully shaved, includes no additional data.