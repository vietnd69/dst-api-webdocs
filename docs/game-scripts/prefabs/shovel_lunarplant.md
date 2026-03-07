---
id: shovel_lunarplant
title: Shovel Lunarplant
description: A lunar plant–themed shovel that grants bonus damage and planar damage when equipped alongside a Lunar Plant Hat, with dynamic behavior based on breakage state.
tags: [combat, inventory, tool, weapon, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f9d43b12
system_scope: inventory
---

# Shovel Lunarplant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shovel_lunarplant` prefab is a specialized digging tool that functions as both a weapon and utility item. Its core responsibility is to dynamically adjust damage output (normal and planar) based on whether the player is wearing a matching Lunar Plant Hat. It supports breakage mechanics via forging: when broken, it loses tool/weapon components, emits a distinct floating animation, and shows a "BROKEN" label. Upon repair, full functionality is restored. It uses the `equippable`, `tool`, `weapon`, `floater`, `planardamage`, `inspectable`, and `finiteuses` components to integrate deeply with DST’s item and combat systems.

## Usage example
This prefab is not instantiated directly via component calls in mod code; instead, it is loaded via `Prefabs:Prefab("shovel_lunarplant")`. A modder might customize behavior by adding components or overriding events during `OnPostInit`, for example:

```lua
AddPrefabPostInit("shovel_lunarplant", function(inst)
    -- Example: add a custom tag on broken state
    local old_onbroken = inst.onbroken
    inst.onbroken = function(...)
        inst:AddTag("lunar_break_modded")
        if old_onbroken then old_onbroken(...) end
    end
end)
```

## Dependencies & tags
**Components used:** `equippable`, `tool`, `weapon`, `floater`, `planardamage`, `inspectable`, `finiteuses`, `inventoryitem`, `farmtiller`, `lunarplant_tentacle_weapon`, `damagetypebonus`, `forgeable`, `hauntable`.

**Tags added:** `show_broken_ui`, `tool`, `weapon`, `broken` (when broken), and action-specific tags (e.g., `dig_tool`, `till_tool`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.base_damage` | number | `TUNING.SHOVEL_LUNARPLANT_DAMAGE` | Base weapon damage used when bonus is inactive. |
| `inst.isbroken` | net_bool | `false` | Networked boolean indicating breakage state. |
| `inst._bonusenabled` | boolean | `false` | Internal flag tracking whether set bonus is currently active. |
| `inst._owner` | Entity or nil | `nil` | Reference to the inventory owner (player) when equipped. |
| `inst._onownerequip` | function or nil | — | Event callback for owner equip events. |
| `inst._onownerunequip` | function or nil | — | Event callback for owner unequip events. |

## Main functions
### `SetBuffEnabled(inst, enabled)`
* **Description:** Enables or disables the set bonus (increased weapon and planar damage) when the owner is wearing the Lunar Plant Hat.
* **Parameters:**  
  `enabled` (boolean) — `true` to apply bonus, `false` to remove it.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silently no-ops if components like `weapon` or `planardamage` are absent.

### `SetBuffOwner(inst, owner)`
* **Description:** Attaches event listeners to the `owner` (player) to monitor equip/unequip events for the Lunar Plant Hat, and checks current head slot to set the bonus appropriately.
* **Parameters:**  
  `owner` (Entity or nil) — The player entity; if `nil`, detaches listeners and disables bonus.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; relies on `GetEquippedItem(EQUIPSLOTS.HEAD)` returning `nil` for empty slots.

### `onequip(inst, owner)`
* **Description:** Called when the shovel is equipped. Handles animation overrides (ARM_carry), skinning, and triggers set-bonus logic via `SetBuffOwner`.
* **Parameters:**  
  `owner` (Entity) — The player equipping the item.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Called when the shovel is unequipped. Reverts carry animations, removes skinning, and disables set bonus.
* **Parameters:**  
  `owner` (Entity) — The player unequipping the item.
* **Returns:** Nothing.

### `SetupComponents(inst)`
* **Description:** Initializes and attaches tool, weapon, and farmtiller components for normal (pristine) operation.
* **Parameters:** None.
* **Returns:** Nothing.

### `DisableComponents(inst)`
* **Description:** Removes tool, weapon, and farmtiller components when the shovel breaks.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnIsBrokenDirty(inst)`
* **Description:** Adjusts floater size, vertical offset, and scale based on `inst.isbroken` value.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetIsBroken(inst, isbroken)`
* **Description:** Updates the floater swap data and syncs the `isbroken` networked property; triggers animation and UI label updates.
* **Parameters:**  
  `isbroken` (boolean) — `true` to mark as broken.
* **Returns:** Nothing.

### `OnBroken(inst)`
* **Description:** Converts the shovel to its broken state: disables tool/weapon, updates animation, sets broken flag, and labels it "BROKEN".
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRepaired(inst)`
* **Description:** Restores the shovel to pristine state: re-adds tool/weapon, resets animation, and clears broken flag.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"equip"` (on owner) — to detect Lunar Plant Hat equip/unequip and toggle set bonus.  
  - `"unequip"` (on owner) — to detect Lunar Plant Hat removal.  
  - `"isbrokendirty"` (client-side only) — to update floater visuals when `isbroken` syncs.
- **Pushes (via `inst:PushEvent`):**  
  - `"equipskinneditem"` / `"unequipskinneditem"` — client events when skinning changes on equip/unequip.  
  - `nil` — no direct events fired by this prefab’s core logic beyond the above skinned-item callbacks.