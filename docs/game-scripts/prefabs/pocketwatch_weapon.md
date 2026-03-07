---
id: pocketwatch_weapon
title: Pocketwatch Weapon
description: A weaponized pocketwatch that toggles between shadow and depleted states based on fuel level, altering damage and emitting visual effects.
tags: [combat, fuel, visual, equipment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d568d7f7
system_scope: combat
---

# Pocketwatch Weapon

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketwatch_weapon` is a weapon prefab that dynamically adjusts its damage, visual effects, and tags based on its fuel level. It uses the `fueled`, `weapon`, `equippable`, and `inspectable` components to provide a gameplay mechanic where fuel depletion switches the weapon from high-damage shadow mode to low-damage depleted mode, accompanied by visual and sound feedback.

## Usage example
```lua
local inst = SpawnPrefab("pocketwatch_weapon")
inst.components.fueled:InitializeFuelLevel(4 * TUNING.LARGE_FUEL)
inst.components.fueled:DoDelta(-TUNING.TINY_FUEL)
-- Fuel depletion triggers damage reduction and stops visual effects
```

## Dependencies & tags
**Components used:** `inventoryitem`, `lootdropper`, `inspectable`, `equippable`, `weapon`, `fueled`  
**Tags:** Adds `pocketwatch`, `shadow_item` (when fuel > 0); checks `pocketwatchcaster` for status display.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `playfuelsound` | net_event | `net_event(...)` | Network event to sync fuel sound playback. |
| `scrapbook_fueled_rate` | number | `TUNING.TINY_FUEL` | Fuel amount consumed per scrapbook entry. |
| `scrapbook_fueled_uses` | boolean | `true` | Whether this item consumes fuel when added to scrapbook. |
| `_vfx_fx_inst` | Entity or nil | `nil` | Reference to the spawned FX entity during active fuel state. |

## Main functions
### `TryStartFx(inst, owner)`
* **Description:** Spawns the `pocketwatch_weapon_fx` prefab if fuel is present and the owner is known; manages FX parentage.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.  
  `owner` (Entity or nil) — optional explicit owner; otherwise inferred from equipped state and `inventoryitem.owner`.
* **Returns:** Nothing.
* **Error states:** No-op if `owner == nil` or `fueled:IsEmpty()` is `true`.

### `StopFx(inst)`
* **Description:** Removes the FX instance if present, ensuring visual effects cease when fuel is depleted or unequipped.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Called on equip; updates the owner’s animation state to show the weapon and starts FX.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.  
  `owner` (Entity) — the entity equipping the weapon.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Called on unequip; restores the owner’s animation and stops FX.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.  
  `owner` (Entity) — the entity unequipping the weapon.
* **Returns:** Nothing.

### `onattack(inst, attacker, target)`
* **Description:** Handles attack logic: consumes fuel if available, and plays distinct attack sounds based on fuel and attacker state.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.  
  `attacker` (Entity or nil) — the entity performing the attack.  
  `target` (Entity) — the target of the attack (unused directly).
* **Returns:** Nothing.

### `GetStatus(inst, viewer)`
* **Description:** Provides inspection status text when the viewer is a `pocketwatchcaster` and the weapon is depleted.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.  
  `viewer` (Entity) — the inspecting entity.
* **Returns:** `"DEPLETED"` if viewer has `pocketwatchcaster` tag and fuel is empty; otherwise `nil`.

### `OnFuelChanged(inst, data)`
* **Description:** Callback triggered when fuel percentage changes; toggles `shadow_item` tag and weapon damage accordingly.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.  
  `data` (table) — event data containing `percent` (number).
* **Returns:** Nothing.

### `SERVER_PlayFuelSound(inst)`
* **Description:** Server-side logic for playing the “add fuel” sound; delegates to `CLIENT_PlayFuelSound` over the network if needed.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.
* **Returns:** Nothing.

### `CLIENT_PlayFuelSound(inst)`
* **Description:** Client-side helper to play “add fuel” sound when the container is opened by the local player.
* **Parameters:**  
  `inst` (Entity) — the pocketwatch weapon instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `percentusedchange` — triggers `OnFuelChanged` to update state on fuel change.  
  `pocketwatch_weapon.playfuelsound` (client only) — triggers `CLIENT_PlayFuelSound`.
- **Pushes:** None (no direct events fired by this component).