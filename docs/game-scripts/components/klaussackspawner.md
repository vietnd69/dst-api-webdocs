---
id: klaussackspawner
title: Klaussackspawner
description: Manages the spawning, respawning, and state tracking of Klaus Sacks during winter or the Winters Feast event.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 9da92d3d
---

# Klaussackspawner

## Overview
This component oversees the lifecycle of Klaus Sacks in the game world—including registering valid spawner locations, spawning sacks during winter (or during Winters Feast), tracking respawn timers, and handling save/load data and debug output. It operates exclusively on the server (master) and ensures sacks spawn only under appropriate conditions.

## Dependencies & Tags
- **Component dependencies:** None explicitly added via `AddComponent`.
- **Tags used:** `"structure"` (for entity searches when clearing spawn area).
- **Events listened for:** `"ms_registerdeerspawningground"`, `"ms_registerklaussack"`, `"ms_restoreklaussackkey"`.
- **World state watched:** `"iswinter"` (via `WatchWorldState`).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity instance (passed to constructor). |
| `_worldsettingstimer` | `WorldSettingsTimer` | `TheWorld.components.worldsettingstimer` | Internal reference to the world settings timer service. |
| `_spawners` | `table` | `{}` | List of registered Klaus spawner entities (e.g., deer spawning grounds). |
| `_sack` | `Entity?` | `nil` | Reference to the currently active Klaus Sack prefab instance. |
| `_spawnsthiswinter` | `number` | `0` | Count of Klaus Sacks spawned in the current winter season. |
| `_spawnedthiswinter` | `boolean` | `false` | Flag indicating whether a sack has been spawned this winter (used for reload恢复 logic). |

## Main Functions

### `self:GetKlausSack()`
* **Description:** Returns the current valid Klaus Sack entity, if one exists.
* **Parameters:** None.
* **Returns:** `Entity?` — The sack entity, or `nil` if none is valid.

### `self:OnPostInit()`
* **Description:** Initializes timers, event listeners, and respawn logic after the component is attached. Behavior differs based on whether Winters Feast is active.
* **Parameters:** None.

### `self:OnSave()`
* **Description:** Returns data to persist across sessions (currently only `_spawnsthiswinter`).
* **Parameters:** None.
* **Returns:** `table` — `{ spawnsthiswinter = _spawnsthiswinter }`.

### `self:OnLoad(data)`
* **Description:** Restores state from saved data, re-initializing timers and counters as needed.
* **Parameters:**
  - `data` (`table`) — Save data containing optional keys: `timetorespawn`, `spawnsthiswinter`.

### `self:GetDebugString()`
* **Description:** Returns a human-readable string describing the current state (e.g., “Klaus Sack is in the world.”, or “Spawning in 123.45 (0.51 days)”). Used for in-game debugging.
* **Parameters:** None.
* **Returns:** `string` — Debug status line.

## Events & Listeners

- **Listens for `"ms_registerdeerspawningground"`** → `OnRegisterSackSpawningPt`  
  Registers a new spawner location (e.g., a deer spawning ground) and sets up its removal listener.

- **Listens for `"ms_registerklaussack"`** → `RegisterKlausSack`  
  Registers a newly spawned Klaus Sack and attaches an `"onremove"` listener to trigger respawn.

- **Listens for `"ms_restoreklaussackkey"`** → `RestoreKlausSackKey`  
  Restores a dropped key to the sack upon request (e.g., from inventory drop handling).

- **Listens for `"onremove"` on spawner** → `OnRemoveSpawner`  
  Removes a spawner from `_spawners` when deleted.

- **Listens for `"onremove"` on sack** → `OnRemoveSack`  
  Triggers respawn scheduling when the sack is destroyed.

- **Listens for world state change `"iswinter"`** → `OnIsWinter` (or `OnIsWinterEvent` during Winters Feast)  
  Handles winter onset/offset: starts/stop respawning and resets counters.