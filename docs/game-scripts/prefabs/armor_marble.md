---
id: armor_marble
title: Armor Marble
description: A piece of heavy armor that provides high damage absorption at the cost of movement speed, with special marble-sound effects when blocking attacks.
tags: [combat, armor, equipment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: adc59271
system_scope: inventory
---

# Armor Marble

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_marble` is a wearable armor prefab that grants significant damage reduction (`TUNING.ARMORMARBLE_ABSORPTION` percent) and substantial health buffering (`TUNING.ARMORMARBLE` condition) but reduces the wearer’s walk speed by `TUNING.ARMORMARBLE_SLOW`. It attaches to the `BODY` equip slot and modifies the owner’s visual appearance using the `swap_body` symbol override. When equipped, it registers a `blocked` event listener to play marble-specific sound effects upon blocking an attack.

## Usage example
```lua
local inst = SpawnPrefab("armormarble")
-- The prefab is ready to use once returned from the Prefab function.
-- To equip it on a character:
player.components.inventory:Equip(inst)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryitem`, `armor`, `equippable`, `inspectable`  
**Tags:** Adds `marble`, `heavyarmor`, `hardarmor`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/marblearmour"` | Sound name played during movement while equipped. |

## Main functions
### `OnBlocked(owner)`
*   **Description:** Callback executed when the owner blocks an attack while wearing this armor. Plays the marble hit sound (`dontstarve/wilson/hit_marble`) via the owner’s `SoundEmitter`.
*   **Parameters:** `owner` (Entity) — the character wearing the armor and receiving the block event.
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Handler called when the armor is equipped. Sets the visual override symbol (`swap_body`) to `armor_marble`, optionally applying skin data, and registers the `OnBlocked` listener on the owner.
*   **Parameters:**  
    `inst` (Entity) — the armor instance;  
    `owner` (Entity) — the character equipping it.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Handler called when the armor is unequipped. Clears the `swap_body` override, removes the `blocked` event listener, and emits a skin-unequip event if applicable.
*   **Parameters:**  
    `inst` (Entity) — the armor instance;  
    `owner` (Entity) — the character unequipping it.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `blocked` — registered on the owner during equip; triggers `OnBlocked`.
- **Pushes (via owner):** `equipskinneditem`, `unequipskinneditem` — fired when a skin is active and equipped/unequipped.