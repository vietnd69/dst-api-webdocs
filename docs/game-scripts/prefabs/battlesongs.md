---
id: battlesongs
title: Battlesongs
description: Generates combat buff prefabs and their associated song definitions for the Battlesinger class, integrating with the singing inspiration system and debuff lifecycle.
tags: [combat, buff, audio, player]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f62f3dd0
system_scope: player
---

# Battlesongs

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `battlesongs.lua` file defines prefabricated entities for in-game battle songs used by the Battlesinger character class. It generates two types of prefabs per song: a *song item* (placed in inventory or containers) and an optional *instant song* that applies a debuff directly to a target. This file orchestrates song lifecycle management, including attachment/detachment events, visual FX, inspiration delta tracking, and inventory interaction. It depends heavily on the `singinginspiration`, `debuff`, and `inventoryitem` components, and dynamically adjusts item visuals based on available inspiration and skill unlocks.

## Usage example
```lua
-- Load song prefabs via require (typically done once at startup)
local song_prefabs = require("prefabs/battlesongs")

-- The module returns multiple prefabs as separate values
-- Each song produces:
-- 1. A song item prefab (e.g., "battlesong_heart_of_the_storm")
-- 2. A debuff prefab for instant songs (e.g., "heart_of_the_storm")

-- To apply a song manually (example for an instant song):
local inst = CreateEntity()
inst:AddComponent("singinginspiration")
local buff = Prefab("heart_of_the_storm", function() return buff_fn(songdata) end)
inst:AddDebuff(buff)
```

## Dependencies & tags
**Components used:** `debuff`, `inventoryitem`, `finiteuses` (commented out), `rechargeable`, `erasablepaper`, `inspectable`, `singable`, `fuel`, `rider`, `skilltreeupdater`, `container`, `health`, `inventory`, `equippable`, `singinginspiration`  
**Tags:** Adds `battlesong` to song item prefabs; adds `CLASSIFIED` to debuff prefabs  
**Events listened for:** `unequipped`, `equipped`, `inspirationdelta`, `ondropped`, `death`  
**Events pushed:** `imagechange` (via `ChangeImageName`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `songdata` | table | `nil` | Stores song configuration loaded from `battlesongdefs.lua`, e.g., `INSTANT`, `TICK_FN`, `ATTACH_FX`. |
| `_owner` | Entity or nil | `nil` | The grand owner entity (e.g., player) of the song item. |
| `_container` | Entity or nil | `nil` | The container entity (e.g., backpack) into which the song is placed. |
| `expire_time` | number | `nil` | Game time at which the debuff buff expires (set when attached). |
| `battlesong_count` | number (on target) | `0` | Per-target counter tracking how many battlesongs are active. |
| `battlesong_fx_task` | Task or nil | `nil` | Looping FX task attached to targets for persistent visual effects. |

## Main functions
### `buff_OnAttached(inst, target)`
* **Description:** Called when the debuff is applied to a target entity. Sets up entity hierarchy, applies immediate effects, spawns attach FX, starts periodic tick task, and increments the target's `battlesong_count`.
* **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity being buffed.
* **Returns:** Nothing.

### `buff_OnDetached(inst, target)`
* **Description:** Called when the debuff is removed. Cancels the tick task, decrements `battlesong_count`, cleans up loop FX, spawns detach FX if defined, and removes the debuff entity.
* **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity that was buffed.
* **Returns:** Nothing.

### `buff_OnExtended(inst, target)`
* **Description:** Extends the debuff duration to `TUNING.SONG_REFRESH_PERIOD` seconds from now and calls `ONEXTENDED` if defined in `songdata`.
* **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity being buffed.
* **Returns:** Nothing.

### `buff_OnTick(inst, target)`
* **Description:** Periodically executed during the debuff lifetime. Checks expiration, applies per-tick `TICK_FN` if alive, and triggers loop FX.
* **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity being buffed.
* **Returns:** Nothing.
* **Error states:** Stops the debuff early if `target.components.health:IsDead()` returns `true`.

### `updateinvimage(inst, owner)`
* **Description:** Updates the inventory image based on ownership and equipment state. Adjusts event listeners for `equipped`/`unequipped` and `inspirationdelta` events depending on whether the item is in an equipped backpack or other container.
* **Parameters:** `inst` (Entity) — the song item; `owner` (Entity or nil) — the new owner container or inventory.
* **Returns:** Nothing.

### `OnPutInInventory(inst, owner)`
* **Description:** Handles logic when the song item is placed in an inventory. Updates the inventory image, and if the owner is a Battlesinger and meets skill requirements, may unlock an accomplishment via RPC.
* **Parameters:** `inst` (Entity) — the song item; `owner` (Entity) — the inventory owner.
* **Returns:** Nothing.

### `SpawnFx(fx_name, target, scale, xOffset, yOffset, zOffset)`
* **Description:** Spawns and positions a visual FX prefab relative to a target. Adjusts offsets if the target is riding a creature.
* **Parameters:** `fx_name` (string) — prefab name of FX; `target` (Entity) — parent entity; `scale` (number, optional) — uniform scale factor; `xOffset`, `yOffset`, `zOffset` (numbers, optional) — local position offsets.
* **Returns:** Entity — the spawned FX instance (or `nil` if creation failed).

## Events & listeners
- **Listens to:**  
  - `unequipped` (on container) — to stop listening for `unequipped` when moved.  
  - `equipped` (on container) — to stop listening for `equipped` once handled.  
  - `inspirationdelta` (on owner) — to update item image based on inspiration availability.  
  - `ondropped` — triggers `UpdateInvImage` when item is dropped.  
  - `death` (on target) — stops the debuff when the target dies.  
- **Pushes:**  
  - `imagechange` — via `inventoryitem:ChangeImageName()`.
