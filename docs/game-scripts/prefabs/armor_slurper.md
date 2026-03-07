---
id: armor_slurper
title: Armor Slurper
description: A wearable inventory item that reduces the owner's hunger burn rate while consuming its own fuel over time.
tags: [inventory, equipment, hunger, fuel]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5c44ef2b
system_scope: inventory
---

# Armor Slurper

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `armor_slurper` prefab is a wearable armor item that modifies the equipper's hunger consumption behavior. It attaches to the `EQUIPSLOTS.BODY` slot and reduces the rate at which the player's hunger depletes while the item is actively fueling — i.e., when the character is wearing it. It relies on the `equippable`, `fueled`, `hunger`, and `shadowlevel` components to manage its behavior. The item is tagged with `"fur"` and `"ruins"`, indicating its material origin and potential worldgen placement.

## Usage example
```lua
-- Typical instantiation and configuration (handled internally by the prefab system)
local slurper = SpawnPrefab("armorslurper")
-- Once equipped by a character, the onEquip callback automatically activates
-- its hunger modification and fuel consumption logic.
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `fueled`, `shadowlevel`, `transform`, `animstate`, `network`, `foley`, `physics`, `hauntable`, `shadowlevel`  
**Tags added:** `"fur"`, `"ruins"`, `"shadowlevel"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/fur"` | Sound played during foot movement. |
| `components.equippable.equipslot` | `EQUIPSLOTS` | `EQUIPSLOTS.BODY` | Equipment slot the item occupies. |
| `components.equippable.dapperness` | number | `TUNING.DAPPERNESS_SMALL` | Modifies how easily the character is spotted by predators. |
| `components.equippable.is_magic_dapperness` | boolean | `true` | Indicates dapperness is magic-based (cannot be suppressed by normal means). |
| `components.fueled.fueltype` | `FUELTYPE` | `FUELTYPE.USAGE` | Fuel type used for consumption logic. |
| `components.shadowlevel.level` | number | `TUNING.ARMORSLURPER_SHADOW_LEVEL` | Default shadow level applied to the character while equipped. |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the item is equipped onto an entity. Sets the visual override for the body slot, reduces the owner's hunger burn rate, and starts fuel consumption.
*   **Parameters:**  
    - `inst` (`Entity`) — The armor slurper instance.  
    - `owner` (`Entity`) — The entity equipping the item.  
*   **Returns:** Nothing.
*   **Error states:** If the `owner` lacks a `hunger` component, the hunger modifier is skipped but does not cause an error.

### `onunequip(inst, owner)`
*   **Description:** Called when the item is unequipped. Clears the body visual override, removes the hunger modifier, and stops fuel consumption.
*   **Parameters:**  
    - `inst` (`Entity`) — The armor slurper instance.  
    - `owner` (`Entity`) — The entity unequipping the item.  
*   **Returns:** Nothing.
*   **Error states:** If the `owner` lacks a `hunger` component, the modifier removal is skipped silently.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Called when the item is picked up from the ground (as opposed to being unequipped from a worn state). Immediately cancels any hunger modification and stops fuel consumption — because the item is not yet equipped, only being interacted with in world space.
*   **Parameters:**  
    - `inst` (`Entity`) — The armor slurper instance.  
    - `owner` (`Entity`) — The entity that picked it up.  
    - `from_ground` (`boolean`) — Always `true` in this context, indicating origin from world.  
*   **Returns:** Nothing.
*   **Error states:** If the `owner` lacks a `hunger` component, the modifier removal is skipped silently.

## Events & listeners
- **Pushes:** None — event handlers are implemented as component callbacks (`SetOnEquip`, `SetOnUnequip`, `SetOnEquipToModel`), not event listeners.
- **Listens to:** None — no explicit `inst:ListenForEvent` calls are present.

## Notes
- The item uses `TUNING.ARMORSLURPER_SLOW_HUNGER` to reduce the owner's hunger burn rate via `owner.components.hunger.burnratemodifiers`.
- When fuel is depleted, the `SetDepletedFn(inst.Remove)` callback removes the item from the world entirely.
- The `shadowlevel` component ensures the item contributes to the shadow level bar on the player, affecting sanity drain and creature attraction.
- Built for network sync: the entity calls `inst.entity:SetPristine()` and conditionally returns early on non-master sim to avoid client-side setup duplication.