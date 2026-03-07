---
id: armor_grass
title: Armor Grass
description: A wearable grass armor item that provides basic damage absorption and integrates with skin-swapping, fuel, and flammability systems.
tags: [combat, equipment, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e324f1d
system_scope: inventory
---

# Armor Grass

> Based on game build **7140014** | Last updated: 2026-03-04

## Overview
The `armor_grass` prefab represents the Grass Armor item, a light protective gear item crafted by players. It is implemented as a `Prefab` with core components attached in its constructor (`fn`): `inventoryitem`, `fuel`, `armor`, and `equippable`. It supports skin-swapping via `GetSkinBuild()` logic and integrates with the game’s sound and animation systems when equipped or unequipped. When equipped, it applies a body symbol override to the wearer and registers a listener for the `blocked` event to play armor impact sounds.

## Usage example
```lua
local inst = Prefab("armorgrass", fn, assets)
-- This prefab is used internally by the game to spawn Grass Armor; modders typically reference it via prefabs.armorgrass
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `fuel`, `armor`, `equippable`, `transform`, `animstate`, `network`  
**Tags:** Adds `grass` tag to the entity instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/grassarmour"` | Sound played during movement while wearing this armor. |
| `components.fuel.fuelvalue` | number | `TUNING.LARGE_FUEL` | Fuel value used by the `fuel` component. |
| `components.armor.condition` | number | `TUNING.ARMORGRASS` | Initial durability of the armor. |
| `components.armor.absorb_percent` | number | `TUNING.ARMORGRASS_ABSORPTION` | Percentage of damage absorbed when blocked. |
| `components.equippable.equipslot` | `EQUIPSLOTS` enum | `EQUIPSLOTS.BODY` | The equipment slot this item occupies. |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Executed when the armor is equipped by an entity. Sets up animation symbol override for the body part, registers the `blocked` event listener, and handles skin-swapping events.
*   **Parameters:**  
    `inst` (Entity) — the armor prefab instance being equipped.  
    `owner` (Entity) — the entity equipping the armor.  
*   **Returns:** Nothing.
*   **Error states:** If `GetSkinBuild()` returns `nil`, only the base animation override is applied; otherwise a skin-specific override and `equipskinneditem` event are used.

### `onunequip(inst, owner)`
*   **Description:** Executed when the armor is unequipped. Clears animation overrides, removes the `blocked` event listener, and fires unequip skin events if applicable.
*   **Parameters:**  
    `inst` (Entity) — the armor prefab instance being unequipped.  
    `owner` (Entity) — the entity unequipping the armor.  
*   **Returns:** Nothing.

### `OnBlocked(owner)`
*   **Description:** Callback fired when the armor blocks damage. Plays a standard armor impact sound via the owner’s `SoundEmitter`.
*   **Parameters:**  
    `owner` (Entity) — the entity wearing the armor that was struck.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `blocked` — fires `OnBlocked(owner)` when the armor blocks an attack.
- **Pushes (via owner):** `equipskinneditem`, `unequipskinneditem` — only triggered if a skin build is present (`GetSkinBuild() ~= nil`).