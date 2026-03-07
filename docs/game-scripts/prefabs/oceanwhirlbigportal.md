---
id: oceanwhirlbigportal
title: Oceanwhirlbigportal
description: Controls the big ocean whirlpool portal that transports entities to the Caves, manages visual layers, sound, wave blocking, and looting behavior.
tags: [ocean, portal, migration, fx, loot]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f19a064c
system_scope: environment
---

# Oceanwhirlbigportal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `oceanwhirlbigportal` prefab implements a large ocean vortex used to enter the Caves world. It functions as a two-part system: the main portal entity (`oceanwhirlbigportal`) and its looting exit (`oceanwhirlbigportalexit`). The main portal handles physics interactions with nearby entities (pulling, damaging, and water protection), animates opening/closing based on migration availability, blocks ocean waves, and emits associated sound effects. It uses client-side visual layers and synchronization, while the exit provides a one-way item retrieval point after migration.

## Usage example
```lua
-- Server-side: Open the portal when a player initiates migration
local inst = SpawnPrefab("oceanwhirlbigportal")
inst.Transform:SetPosition(x, y, z)
inst:PushEvent("migration_available") -- triggers opening animation

-- Later, when ready to close
inst:PushEvent("migration_unavailable") -- triggers closing animation

-- Client-side (dedicated server safe): Listen for animation sync events
inst:ListenForEvent("oceanwhirlbigportal.syncanims", function(inst, anim, loop)
    -- Custom handling for client animation sync
end)
```

## Dependencies & tags
**Components used:** `health`, `inventory`, `itemstore`, `lootdropper`, `oceanwhirlportalphysics`, `pickable`, `pointofinterest`, `updatelooper`, `wateryprotection`, `wavemanager`, `worldmigrator`, `animstate`, `transform`, `soundemitter`, `minimapentity`, `network`, `inspectable`.

**Tags:** Adds `birdblocker`, `ignorewalkableplatforms`, `oceanwhirlportal`, `oceanwhirlbigportal`, `NOCLICK`, `FX`, `pickable_rummage_str`. Checks `player`, `boat`, `debt`. Does not add/remove tags dynamically beyond initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `openingwhirlportal` | boolean | `nil` | Tracks whether the portal is currently in the process of opening. |
| `focalcooldowns` | table | `{}` | Stores per-entity cooldown timers for focal zone entry. |
| `scrapbook_ignore` | boolean | `true` (when closed) | Controls visibility in the scrapbook. |
| `scrapbook_thingtype` | string | `"POI"` | Scrapbook display category. |
| `highlightoverride` | vector3 | `{0.1, 0.1, 0.3}` | Custom highlight color when selected. |
| `syncanims` | net_event | `net_event(GUID, "oceanwhirlbigportal.syncanims")` | Network event used to synchronize animations between server and clients. |

## Main functions
### `OpenWhirlportal(inst)`
* **Description:** Begins opening the portal by playing pre-animation, starting looping sound, and enabling POI/map icon. If called while asleep, opens instantly.
* **Parameters:** `inst` (Entity) — The portal instance.
* **Returns:** Nothing.
* **Error states:** Has no effect if `inst:IsAsleep()` is `false` and `openingwhirlportal` is already `true`.

### `CloseWhirlportal(inst)`
* **Description:** Closes the portal by playing closing animation, stopping sound, disabling POI/map icon, and disabling physics.
* **Parameters:** `inst` (Entity) — The portal instance.
* **Returns:** Nothing.

### `OnEntityTouchingFocalFn(inst, ent)`
* **Description:** Core logic triggered when an entity enters the portal's focal zone. Applies watery protection, attempts world migration, damages boats or sinks entities that fail migration, and enforces cooldowns.
* **Parameters:** 
  * `inst` (Entity) — The portal instance.
  * `ent` (Entity) — The entity touching the focal zone.
* **Returns:** Nothing.
* **Error states:** If migration fails and the entity is not a boat or is dead, the entity is sunk.

### `OnItemStoreChangedCount(inst)`
* **Description:** Updates the exit’s animation and interactability based on the number of stored items.
* **Parameters:** `inst` (Entity) — The exit instance.
* **Returns:** Nothing.

### `onpickedfn(inst, picker, loot)`
* **Description:** Handles item retrieval when a player interacts with the exit. Spawns loot items, flings or gives to inventory, and triggers animation feedback.
* **Parameters:** 
  * `inst` (Entity) — The exit instance.
  * `picker` (Entity) — The player picking items.
  * `loot` (unknown) — Unused parameter.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `migration_available` — triggers `OpenWhirlportal`.
- **Listens to:** `migration_unavailable` — triggers `CloseWhirlportal`.
- **Listens to:** `migration_full` — triggers `CloseWhirlportal`.
- **Listens to:** `migration_activate` — triggers `SplashWhirlportal`.
- **Listens to:** `entitywake` / `entitysleep` (client) — toggles wave blocker registration via `CheckToggleWaveBlocker`.
- **Listens to:** `oceanwhirlbigportal.syncanims` (client) — triggers `OnSyncAnims`.
- **Listens to:** `onremove` (client) — unregisters wave blocker in `OnRemove_Client`.
- **Listens to:** `animover` — used to finalize opening animation sequence.
- **Listens to:** `itemstore_changedcount` (exit) — updates animation via `OnItemStoreChangedCount`.

