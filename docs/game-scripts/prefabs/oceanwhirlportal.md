---
id: oceanwhirlportal
title: Oceanwhirlportal
description: Spawnable ocean teleportation structure that detects boats within range and teleports them to a paired exit portal, applying wake effects and watery protection.
tags: [prefab, ocean, teleport, vehicle]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 0c2d7ea1
system_scope: entity
---

# Oceanwhirlportal

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`oceanwhirlportal.lua` registers a spawnable ocean teleportation entity. The prefab's `fn()` constructor builds the visual and audio components on both client and master, then attaches gameplay components (entitytracker, wateryprotection, timer) on the master only. Boats entering the portal's interaction distance are teleported to a paired exit portal, with wake effects spawned and players on the boat receiving travel events. The prefab is referenced by its name `"oceanwhirlportal"` and instantiated with `SpawnPrefab("oceanwhirlportal")`.

## Usage example
```lua
-- Spawn at ocean position:
local inst = SpawnPrefab("oceanwhirlportal")
inst.Transform:SetPosition(100, 0, 100)

-- Link to exit portal (master only):
if TheWorld.ismastersim then
    local exit = SpawnPrefab("oceanwhirlportal")
    exit.Transform:SetPosition(200, 0, 200)
    inst:SetExit(exit)
end

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/whirlportal.zip"),
}
```

## Dependencies & tags
**External dependencies:**
- `SpawnAttackWave` -- spawns wake wave effects behind teleporting boats
- `FindSwimmableOffset` -- finds valid ocean positions for blocked exits
- `SpawnPrefab` -- spawns splash effects and dependent prefabs

**Components used:**
- `inspectable` -- allows players to inspect the portal
- `entitytracker` -- tracks paired exit portal and blocker boats
- `wateryprotection` -- applies temperature/wetness protection at exit
- `timer` -- manages portal lifetime before closure
- `boatphysics` -- accessed on boats for velocity and force application
- `inventoryitem` -- accessed on items for landing state during teleport
- `walkableplatform` -- accessed on boats for player detection

**Tags:**
- `birdblocker` -- prevents birds from landing on this entity
- `ignorewalkableplatforms` -- prevents this from being treated as a walkable platform
- `oceanwhirlportal` -- identifies entity type for filtering

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries listing animation files loaded with this prefab. |
| `prefabs` | table | `{"wave_med", "oceanwhirlportal_splash"}` | Array of dependent prefab names spawned by this entity. |
| `CHECK_FOR_BOATS_PERIOD` | constant (local) | `0.5` | Interval in seconds between boat detection ticks. |
| `BOAT_INTERACT_DISTANCE` | constant (local) | `6.0` | Maximum distance for boat teleport detection. |
| `BOAT_WAKE_COUNT` | constant (local) | `3` | Number of wake wave effects spawned after teleport. |
| `BOAT_WAKE_TIME_PER` | constant (local) | `1.5` | Time in seconds between each wake wave spawn. |
| `BOAT_WAKE_SPEED_MIN_THRESHOLD` | constant (local) | `3.5` | Minimum boat speed required to spawn wake effects. |
| `scrapbook_anim` | string | `"open_loop"` | Animation name for scrapbook display (master only). |
| `scrapbook_scale` | number | `1.5` | Scale factor for scrapbook display (master only). |
| `_check_for_boats_task` | task | `nil` | Reference to periodic boat detection task (master only). |
| `highlightoverride` | table | `{0.1, 0.1, 0.3}` | Highlight color override for the portal entity (master only). |
| `scrapbook_animoffsetx` | number | `30` | X offset for scrapbook animation display (master only). |
| `scrapbook_animoffsety` | number | `-10` | Y offset for scrapbook animation display (master only). |
| `scrapbook_animoffsetbgx` | number | `80` | Background X offset for scrapbook animation display (master only). |
| `scrapbook_animoffsetbgy` | number | `40` | Background Y offset for scrapbook animation display (master only). |
| `OnRemoveEntity` | function | `OnRemoveEntity` | Cleanup handler assigned to entity for sound cleanup on removal (master only). |

## Main functions
### `fn()`
* **Description:** Prefab constructor. Creates the entity, attaches Transform, AnimState, SoundEmitter, MiniMapEntity, and Network components. Plays opening animation loop, sets ocean shader blend, and adds tags. On master, attaches gameplay components, starts timer for portal lifetime, and begins periodic boat detection. Returns `inst` for engine processing.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server).

### `DoBoatWake(boat, isfirst)` (local)
* **Description:** Spawns wake wave effects behind a moving boat. Calculates wave positions based on boat velocity direction and spawns 2-3 waves depending on `isfirst` flag. Only spawns if boat speed exceeds threshold.
* **Parameters:**
  - `boat` -- boat entity instance
  - `isfirst` -- boolean, true if this is the initial wake after teleport
* **Returns:** None
* **Error states:** None — guards against missing `boatphysics` component and low speed.

### `SetExit(inst, exit)` (local)
* **Description:** Links this portal to its paired exit portal. Stores the exit entity in the entitytracker component for later retrieval during teleport logic.
* **Parameters:**
  - `inst` -- this portal entity
  - `exit` -- paired exit portal entity
* **Returns:** None
* **Error states:** None — entitytracker component is always present on master.

### `ClearAvoid(boat)` (local)
* **Description:** Removes the avoidance hack flag from a boat after teleport wake effects complete. Allows the boat to interact with other whirlportals again.
* **Parameters:** `boat` -- boat entity instance
* **Returns:** None
* **Error states:** None — safely sets field to nil regardless of prior state.

### `CheckForBoatsTick(inst)` (local)
* **Description:** **Periodic task callback.** Detects boats within interaction distance and teleports them to the paired exit. Validates exit is not blocked, finds valid ocean position if needed, spawns splash effects, applies force to boat, spawns wake waves, and triggers player travel events. Sets avoidance hack to prevent teleport loops.
* **Parameters:** `inst` -- portal entity instance
* **Returns:** None
* **Error states:** Errors if `entitytracker` component is missing (no guard present). Early returns if exit is nil or blocked.

### `ontimerdone(inst, data)` (local)
* **Description:** Handles timer completion for portal closure. Cancels boat detection task, sets entity to non-persistent, plays closing animation, and listens for animation completion to remove entity.
* **Parameters:**
  - `inst` -- portal entity instance
  - `data` -- timer event data table with `name` field
* **Returns:** None
* **Error states:** None — guards against nil data parameter.

### `OnRemoveEntity(inst)` (local)
* **Description:** Cleanup function called when entity is removed. Kills the looping wave sound to prevent orphaned audio.
* **Parameters:** `inst` -- portal entity instance
* **Returns:** None
* **Error states:** None — SoundEmitter component is always present.

## Events & listeners
- **Listens to:** `timerdone` -- triggers `ontimerdone`; closes portal after `TUNING.OCEANWHIRLPORTAL_KEEPALIVE_DURATION`
- **Listens to:** `animqueueover` -- triggers `inst.Remove`; removes entity after closing animation completes
- **Pushes:** `wormholetravel` -- fired to players on teleported boat; data: direct enum param (`WORMHOLETYPE.OCEANWHIRLPORTAL`) for travel sound playback