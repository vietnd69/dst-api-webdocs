---
id: malbatrossspawner
title: Malbatrossspawner
description: Manages spawning and tracking of Malbatross entities near fish shoals in response to player proximity, time, and fishing events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: cc00bb11
---

# Malbatrossspawner

## Overview
The `Malbatrossspawner` component orchestrates the spawning logic for the Malbatross entity by monitoring registered fish shoals, player presence, and game timer events. It only runs on the master simulation and ensures that a Malbatross spawns near a fish shoal when criteria (e.g., player proximity, timer expiration, or fishing hook events) are met.

## Dependencies & Tags
- **Component:** `self.inst` must be a server-side entity (asserted via `TheWorld.ismastersim`).
- **Listening Events:**
  - `"ms_registerfishshoal"` – triggered when a new fish shoal is registered.
  - `"ms_unregisterfishshoal"` – triggered when a fish shoal is removed.
  - `"ms_shoalfishhooked"` / `"ms_shoalfishhooked_redux"` – triggered when a fish is hooked from a shoal.
  - `"malbatrosskilled"` / `"malbatrossremoved"` – triggered when a Malbatross is removed from the world.
- **World Subsystem Used:** `TheWorld.components.worldsettingstimer` for managing spawn timers.

## Properties
No public instance properties are declared outside `self.inst`. All state is held in closure-scoped private variables initialized during construction.

## Main Functions

### `OnUpdate(dt)`
* **Description:** Periodically scans registered fish shoals for proximity to a player. When a suitable shoal is found, it spawns the Malbatross and stops updating.
* **Parameters:** `dt` (number) – time since last update (unused directly).

### `Relocate(target_malbatross)`
* **Description:** Resets the spawn queue to re-evaluate all shoals, optionally removing a specific Malbatross to prompt a new spawn. Used for debugging or dynamic repositioning.
* **Parameters:** `target_malbatross` (optional Entity) – if provided, removes the given Malbatross and adjusts the spawn order.

### `Summon(_slow_debug_target_entity)`
* **Description:** Forces a spawn attempt by initiating the timer and update loop. Optionally prioritizes shoals nearest a given entity (debug aid).
* **Parameters:** `_slow_debug_target_entity` (optional Entity) – used to sort shoals by proximity for debug spawning.

### `OnSave()`
* **Description:** Serializes internal state (e.g., first spawn flag, timer status, active Malbatross GUID) for world save.
* **Returns:**  
  - `data` (table): Contains `_firstspawn`, `_timerfinished`, and optionally `activeguid`.  
  - `ents` (optional table): List of entity GUIDs referenced (e.g., active Malbatross) for save indexing.

### `OnLoad(data)`
* **Description:** Restores state after loading, resuming or re-triggering the spawn timer as needed.
* **Parameters:** `data` (table): Saved state.

### `LoadPostPass(newents, data)`
* **Description:** Resolves the saved Malbatross entity reference after all entities have been loaded.
* **Parameters:**  
  - `newents` (table): Loaded entity mappings by GUID.  
  - `data` (table): Saved data.

### `GetDebugString()`
* **Description:** Returns a formatted debug string describing the current spawn state (timer status, shoal count, etc.).
* **Returns:** `string` – human-readable status.

## Events & Listeners
- Listens for `"ms_registerfishshoal"` → `OnFishShoalAdded`
- Listens for `"ms_unregisterfishshoal"` → `OnFishShoalRemoved`
- Listens for `"ms_shoalfishhooked"` → `OnShoalFishHooked`
- Listens for `"ms_shoalfishhooked_redux"` → `OnShoalFishHookedRedux`
- Listens for `"malbatrosskilled"` and `"malbatrossremoved"` → `OnMalbatrossKilledOrRemoved`
- Internal timer event `"malbatross_timetospawn"` → `OnMalbatrossTimerDone` (via `worldsettingstimer`)