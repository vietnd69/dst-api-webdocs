---
id: catcoonden
title: Catcoonden
description: Manages the lifecycle, inventory, and catcoon spawning behavior of the Catcoon Den structure in Don't Starve Together.
tags: [structure, spawning, inventory, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 229f62f1
system_scope: entity
---

# Catcoonden

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`catcoonden` is the constructor for the Catcoon Den prefab—a unique structure that acts as a boss encounter with multiple lives, inventory storage for catcoons, and dynamic spawning behavior. It integrates with multiple components: `workable` (for hammering), `childspawner` (for spawning and regenerating catcoons), `inventory` (to hold items stored by catcoons), `lootdropper` (for loot generation), `activatable` (for the Ransack action), and `inspectable`. It reacts to environmental states (rain, season), handles player interaction via the Ransack verb, and persists state across saves.

## Usage example
```lua
local den = SpawnPrefab("catcoonden")
den.Transform:SetPosition(entity.Transform:GetWorldPosition())
-- Catcoon Den is fully self-initializing via its constructor; no further setup needed.
```

## Dependencies & tags
**Components used:** `workable`, `childspawner`, `inventory`, `lootdropper`, `activatable`, `inspectable`, `rainimmunity` (conditional), `worldstate`  
**Tags added:** `structure`, `beaverchewable`, `catcoonden`, `no_hideandseek`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lives_left` | number | `9` | Remaining lives (catcoons alive or resummonable) before the den becomes unresponsive. |
| `playing_dead_anim` | boolean or nil | `nil` | If truthy, the den is in its "dead" state animation and not spawning. |
| `delay_end` | number | `0` | Game time (from `GetTime()`) when the den regains a life after all are spent. |
| `_inv_age` | table | `{}` | Array tracking the world age of items stored in each inventory slot for LRU eviction. |
| `entity` | Entity | — | Base entity container; includes `Transform`, `AnimState`, `MiniMapEntity`, and `SoundEmitter`. |

## Main functions
### `onhammered(inst)`
* **Description:** Called when the den is hammered to completion (workable finish). Destroys the den, releases all stored catcoons, drops inventory and loot, spawns collapse FX, and removes the entity.
* **Parameters:** `inst` (Entity) — the Catcoon Den instance.
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Handles resuscitation of the den after all lives are spent (resets lives and enables spawning) or exits the "dead" animation state if lives remain.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Cleans up inventory items during world sleep if the den is depleted.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnChildKilled(inst, child)`
* **Description:** Decrements `lives_left` when a spawned catcoon is killed. When `lives_left` reaches `0`, stops spawning/regeneration and sets `delay_end` for the repair timer (adjusted for season).
* **Parameters:**  
  * `inst` (Entity) — the den.  
  * `child` (Entity) — the killed catcoon.  
* **Returns:** Nothing.

### `OnRansacked(inst, doer)`
* **Description:** Triggered by the Ransack verb (activatable activation). Sets the den inactive, forces nearby allied catcoons to attack the doer, releases all catcoons, and drops inventory contents (one slot at a time, oldest-first). Returns `true` if an item was dropped.
* **Parameters:**  
  * `inst` (Entity) — the den.  
  * `doer` (Entity) — the actor performing Ransack (may be `nil`).  
* **Returns:**  
  * `true` — an item was dropped.  
  * `false, "EMPTY_CATCOONDEN"` — no items were dropped (inventory empty).  

### `OnInventoryFull(inst, leftovers)`
* **Description:** Handles overflow when inventory slots are full. Removes the oldest item (based on `_inv_age`) from an existing slot and replaces it with `leftovers`.
* **Parameters:**  
  * `inst` (Entity) — the den.  
  * `leftovers` (Entity) — the item that could not fit.  
* **Returns:** Nothing.

### `CacheItemsAtHome(inst, catcoon)`
* **Description:** Transfers all items from a visiting catcoon into the den’s inventory.
* **Parameters:**  
  * `inst` (Entity) — the den.  
  * `catcoon` (Entity) — the catcoon storing items.  
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Saves state (`lives_left`, `delay_remaining`, `_inv_age`) to the save slot.
* **Parameters:**  
  * `inst` (Entity).  
  * `data` (table) — save table to populate.  
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores state from a save. Recovers `lives_left`, `delay_end`, and `_inv_age`. Handles reconfiguration of `childspawner` if the den is depleted.
* **Parameters:**  
  * `inst` (Entity).  
  * `data` (table) — loaded save data.  
* **Returns:** Nothing.

### `getstatus(inst, viewer)`
* **Description:** Returns `"EMPTY"` if `lives_left` is `0`, otherwise `nil`. Used by the inspectable UI.
* **Parameters:**  
  * `inst` (Entity).  
  * `viewer` (Entity) — the inspecting entity.  
* **Returns:** `"EMPTY"` or `nil`.

## Events & listeners
- **Listens to:**  
  * `gotnewitem` — calls `OnCachedItemAtHome` to record when an item is stored in the den’s inventory.  
- **Pushes:**  
  * (None directly; relies on component events like those from `activatable`, `workable`, `childspawner`.)
