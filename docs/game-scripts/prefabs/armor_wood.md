---
id: armor_wood
title: Armor Wood
description: Provides wooden armor with damage absorption, fuel properties, and visual skin-swapping logic for equipping.
tags: [combat, equipment, visuals]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a307808
system_scope: inventory
---

# Armor Wood

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `armor_wood` prefab defines a wearable piece of wooden armor equipped in the body slot. It integrates with the `armor`, `equippable`, and `fuel` components to provide protection (with absorption and a beaver weakness), equip/unequip visual and event handling, and combustible properties. When equipped, it overrides the equipper's `swap_body` symbol to render the armor visually and plays a sound on blocking attacks.

## Usage example
```lua
-- This is a prefab definition, not a component used standalone.
-- To use this armor, add it to an inventory or equip it via the inventory system:
local inst = SpawnPrefab("armorwood")
-- The prefab automatically adds components and sets up behavior in its constructor.
```

## Dependencies & tags
**Components used:** `armor`, `equippable`, `fuel`, `inspectable`, `inventoryitem`  
**Tags:** Adds `"wood"` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/logarmour"` | Sound played when walking while wearing this armor (handled by equipment logic). |

## Main functions
### `OnBlocked(owner)`
* **Description:** Plays a sound effect when the owner successfully blocks an attack while wearing this armor. Registered as an event listener for the `"blocked"` event on the owner.
* **Parameters:** `owner` (Entity) — the entity wearing the armor that blocked the attack.
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Executed when the armor is equipped. Sets up visual skin override, registers block-sound listener, and fires a skin-related event if applicable.
* **Parameters:**  
  - `inst` (Entity) — the armor instance.  
  - `owner` (Entity) — the entity equipping the armor.  
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Executed when the armor is unequipped. Clears the visual override, removes the block listener, and fires an event if skin is present.
* **Parameters:**  
  - `inst` (Entity) — the armor instance.  
  - `owner` (Entity) — the entity unequipping the armor.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"blocked"` — triggers `OnBlocked` on the owner to play armor impact sound.
- **Pushes:** `"equipskinneditem"` / `"unequipskinneditem"` — fired when the item has a skin and is equipped/unequipped (handled by `onequip`/`onunequip`).

## Initialization behavior (prefab constructor)
- Adds `transform`, `animstate`, and `network` components.
- Sets up inventory physics and floatable behavior for small floating animation.
- Marks entity as pristine.
- Initializes `fuel` with `TUNING.LARGE_FUEL` and makes it small-burnable/propagator.
- Configures `armor` with `TUNING.ARMORWOOD` condition and `TUNING.ARMORWOOD_ABSORPTION` percentage; adds weakness against `beaver` tag.
- Sets body slot equip slot and attaches equip/unequip callbacks.