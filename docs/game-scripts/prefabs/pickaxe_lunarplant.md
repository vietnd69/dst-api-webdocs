---
id: pickaxe_lunarplant
title: Pickaxe Lunarplant
description: A specialized mining tool that gains increased damage when equipped alongside the Lunar Plant Hat, with separate states for intact and broken conditions.
tags: [mining, combat, tool, weapon, setbonus]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3bdaba9a
system_scope: inventory
---

# Pickaxe Lunarplant

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pickaxe_lunarplant` prefab functions as a durable mining and hammering tool with set-bonus mechanics. It dynamically modifies its damage output based on whether the player is wearing the `lunarplanthat`. When equipped, it listens for equip/unequip events on the owner to enable or disable a planar damage bonus and weapon damage multiplier. It also supports physical breakage via forge mechanics, toggling between intact and broken states that affect its animation, collision size, and tool functionality.

## Usage example
This prefab is instantiated internally by the game and not meant for direct component usage. As a modder, you can reference its behavior when extending similar set-bonus items:
```lua
-- Example: check if a lunarplant pickaxe gains bonus damage on a player
local player = TheEntManager:GetEntityFromID(player_guid)
local hat = player.components.inventory:GetEquippedItem(EQUIPSLOTS.HEAD)
if hat and hat.prefab == "lunarplanthat" then
    -- Bonus is active
end
```

## Dependencies & tags
**Components used:** `equippable`, `tool`, `weapon`, `floater`, `planardamage`, `inspectable`, `inventoryitem`, `finiteuses`, `damagetypebonus`, `lunarplant_tentacle_weapon`, `forge`, `hauntable`

**Tags added:** `hammer`, `tool`, `weapon`, `broken`, `show_broken_ui`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._bonusenabled` | boolean | `false` | Tracks whether the set-bonus damage and planar damage are active. |
| `inst._owner` | entity (optional) | `nil` | Reference to the entity currently holding/equipping this item. |
| `inst.base_damage` | number | `TUNING.PICKAXE_LUNARPLANT_DAMAGE` | Base weapon damage value before set-bonus multiplier. |
| `inst.isbroken` | net_bool | `false` | Networked boolean flag indicating whether the pickaxe is broken. |
| `SWAP_DATA` | table | `{ sym_build = "pickaxe_lunarplant", sym_name = "swap_pickaxe_lunarplant" }` | Animation swap data used by the floater for intact state. |
| `SWAP_DATA_BROKEN` | table | `{ sym_build = "pickaxe_lunarplant", sym_name = "swap_pickaxe_BROKEN_FORGEDITEM_float", bank = "pickaxe_lunarplant", anim = "broken" }` | Animation swap data used by the floater for broken state. |

## Main functions
### `SetBuffEnabled(inst, enabled)`
*   **Description:** Activates or deactivates the set-bonus damage and planar damage modifiers based on the `enabled` flag. Modifies `weapon.damage` and calls `planardamage:AddBonus` or `RemoveBonus`.
*   **Parameters:** `inst` (entity) — the pickaxe instance; `enabled` (boolean) — whether the bonus should be applied.
*   **Returns:** Nothing.
*   **Error states:** No-op if `enabled` is `true` but `_bonusenabled` is already `true`, or vice versa.

### `SetBuffOwner(inst, owner)`
*   **Description:** Assigns a new owner to the pickaxe and registers event listeners for that owner's `equip` and `unequip` events (specifically when items are equipped to the HEAD slot). Automatically checks if the owner currently wears a `lunarplanthat` and sets the bonus accordingly.
*   **Parameters:** `inst` (entity) — the pickaxe instance; `owner` (entity or `nil`) — the new owner entity.
*   **Returns:** Nothing.
*   **Error states:** If the owner is `nil`, all bonus logic is disabled and listeners are removed.

### `SetupComponents(inst)`
*   **Description:** Attaches `equippable`, `tool`, and `weapon` components to the instance, and configures them with appropriate callbacks, actions, and damage values.
*   **Parameters:** `inst` (entity) — the pickaxe instance.
*   **Returns:** Nothing.

### `DisableComponents(inst)`
*   **Description:** Removes the `equippable`, `tool`, and `weapon` components. Called when the pickaxe enters the broken state.
*   **Parameters:** `inst` (entity) — the pickaxe instance.
*   **Returns:** Nothing.

### `OnIsBrokenDirty(inst)`
*   **Description:** Updates floater properties (size, vertical offset, and scale) based on whether the pickaxe is broken or intact.
*   **Parameters:** `inst` (entity) — the pickaxe instance.
*   **Returns:** Nothing.

### `SetIsBroken(inst, isbroken)`
*   **Description:** Configures the floater's bank swap data for broken vs intact state and updates the `isbroken` net_bool.
*   **Parameters:** `inst` (entity) — the pickaxe instance; `isbroken` (boolean) — whether the item is broken.
*   **Returns:** Nothing.

### `OnBroken(inst)`
*   **Description:** Transitions the pickaxe into the broken state: disables tool/weapon components, sets the broken animation, updates floater state, adds the `broken` tag, and overrides inspect name.
*   **Parameters:** `inst` (entity) — the pickaxe instance.
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Restores tool/weapon components and resets the pickaxe to its intact state: re-enables components, sets idle animation, removes `broken` tag, and clears inspect name override.
*   **Parameters:** `inst` (entity) — the pickaxe instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `equip` — fired by owner's inventory when an item is equipped (to detect `lunarplanthat` in HEAD slot).
- **Listens to:** `unequip` — fired by owner's inventory when an item is unequipped (to disable bonus if HEAD slot is cleared).
- **Listens to (client only):** `isbrokendirty` — triggers `OnIsBrokenDirty` when `isbroken` net_bool changes on the client.

- **Pushes (client only):** `equipskinneditem`, `unequipskinneditem` — emitted during equip/unequip when a skin build is present.
