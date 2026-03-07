---
id: thurible
title: Thurible
description: Manages the behavior and state of the Thurible item, a lantern that lights up in the Dark and attracts Shadow Creatures.
tags: [light, shadow, fuel, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 72f22838
system_scope: inventory
---

# Thurible

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `thurible` prefab represents the Thurible item, a hand-held lantern used in *Don't Starve Together* to emit light in dark areas and attract Shadow Creatures during the Nightmare cycle. It functions as an equipped item with fuel-based operation, leveraging the `equippable`, `fueled`, `inventoryitem`, and `shadowlevel` components. When active, it spawns a smoke follower entity (`thurible_smoke`) and emits light intensity and shadow-luring effects.

## Usage example
```lua
local inst = SpawnPrefab("thurible")
inst.components.fueled:InitializeFuelLevel(100) -- Set fuel
inst.components.equippable:Equip(player) -- Equip to player
inst.components.equippable:Unequip() -- Unequip
inst.components.fueled:TakeFuel(10) -- Add fuel
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `fueled`, `shadowlevel`, `inspectable`  
**Tags added:** `shadow_item`, `shadowlure`, `nopunch`, `shadowlevel`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_smoke` | entity or nil | `nil` | Reference to the `thurible_smoke` follower entity when lit. |
| `_body` | entity or nil | `nil` | Reference to the `thuriblebody` follower entity when equipped. |
| `_soundtask` | task or nil | `nil` | Task reference for delayed extinguish sound. |
| `playfuelsound` | net_event | `net_event(...)` | Network event for fuel-add sound playback on clients. |

## Main functions
### `turnon(inst)`
* **Description:** Activates the Thurible’s fuel consumption and spawns the smoke follower if not held and has fuel. Adds the `shadowlure` tag.
* **Parameters:** `inst` (Entity) — the Thurible instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if fuel is empty.

### `turnoff(inst)`
* **Description:** Stops fuel consumption, removes the `shadowlure` tag, and removes the smoke entity.
* **Parameters:** `inst` (Entity) — the Thurible instance.
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Handles equip logic: spawns the `thuriblebody` follower, sets animation layers, toggles symbol overrides, and turns the Thurible on if fueled.
* **Parameters:** `inst` (Entity), `owner` (Entity) — the player equipping it.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Handles unequip logic: removes the body, restores normal arm animations, and turns the Thurible off.
* **Parameters:** `inst` (Entity), `owner` (Entity) — the player unequipping it.
* **Returns:** Nothing.

### `onequiptomodel(inst, owner, from_ground)`
* **Description:** Handles model-only equipping (e.g., in UI): turns the Thurible off.
* **Parameters:** `inst` (Entity), `owner` (Entity), `from_ground` (boolean).
* **Returns:** Nothing.

### `ontakefuel(inst)`
* **Description:** Called when fuel is added; turns the Thurible on if equipped or not held, adds `shadow_item` tag, and plays fuel sound.
* **Parameters:** `inst` (Entity) — the Thurible instance.
* **Returns:** Nothing.

### `nofuel(inst)`
* **Description:** Called when fuel is depleted; removes `shadow_item` tag, turns off, and notifies owner via `itemranout` event if equipped.
* **Parameters:** `inst` (Entity) — the Thurible instance.
* **Returns:** Nothing.

### `ToggleOverrideSymbols(inst, owner)`
* **Description:** Toggles between `swap_thurible` and `swap_thurible_stick` animations based on owner's state (e.g., riding, nodangle). Also manages body visibility.
* **Parameters:** `inst` (Entity), `owner` (Entity) — the equipped player.
* **Returns:** Nothing.

### `GetShadowLevel(inst)`
* **Description:** Returns the current shadow level (`TUNING.THURIBLE_SHADOW_LEVEL` if fueled, otherwise `0`).
* **Parameters:** `inst` (Entity) — the Thurible instance.
* **Returns:** number — `TUNING.THURIBLE_SHADOW_LEVEL` if fueled, else `0`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on smoke/body) — cleans up internal references (`_smoke`, `_body`) when smoke or body entity is removed.  
  - `thurible.playfuelsound` (client-only) — triggers `CLIENT_PlayFuelSound` to play fuel sound in open containers.  
  - `newstate` (on owner stategraph) — triggers `ToggleOverrideSymbols` to update animation symbols.  

- **Pushes:**  
  - `itemranout` — fired via owner when fuel is fully depleted and the item is equipped; includes item prefab, equipslot, and announcement key.