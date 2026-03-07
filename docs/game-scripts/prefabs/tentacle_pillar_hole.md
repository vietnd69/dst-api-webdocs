---
id: tentacle_pillar_hole
title: Tentacle Pillar Hole
description: Serves as a static teleporter anchor that spawns a tentacle pillar when players or items interact with it, and handles associated sound effects, state synchronization, and residue behavior.
tags: [teleport, boss, entity, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 29d7d0ac
system_scope: environment
---

# Tentacle Pillar Hole

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`tentacle_pillar_hole` is a non-player entity functioning as a fixed teleport destination in the Caves. It acts as the "spawn point" for the tentacle pillar boss — when activated by a player or item via teleportation, it triggers the emergence of a physical tentacle pillar prefab. The component coordinates sound playback, state persistence across saves, and special logic for residue creation (e.g., for Charlie-related mechanics). It integrates with `teleporter`, `inventory`, `trader`, `playerprox`, and `roseinspectable` components to handle activation, interaction, and boss-spawning behavior.

## Usage example
```lua
-- The prefab is automatically spawned by the worldgen system.
-- Modders typically do not instantiate this directly.
-- Example of listening for emergence events:
local inst = ...
inst:ListenForEvent("doneteleporting", function(ent, obj)
    if obj:HasTag("player") then
        print("Player has emerged from tentacle pillar hole")
    end
end, inst)
```

## Dependencies & tags
**Components used:**  
`playerprox`, `inspectable`, `roseinspectable`, `teleporter`, `inventory`, `trader`, `pointofinterest` (client-only), `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`  
**Tags added/checked:**  
Adds `tentacle_pillar`, `rocky`, `wet`, `trader`, `alltrader`  
Checks `player`, `wet`, `debuffed` (via `skilltreeupdater` on doer/residueowner)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `emergetime` | number | `GetTime() + TUNING.TENTACLE_PILLAR_ARM_EMERGE_TIME` | Timestamp when the tentacle pillar may emerge. Decremented in `OnLongUpdate`. |
| `emergetask` | Task? | `nil` | Scheduled task to re-arm emergence after teleporting (if condition met). Cancelled on teleport completion. |
| `overtaken` | boolean | `nil` | Not initialized here; used only if the hole was "overtaken" by an active tentacle pillar (rare case). |
| `hiddenglobalicon` | Entity? | `nil` | Hidden global map icon used for tracking wormhole locations (client-side). |

## Main functions
### `DoEmerge(inst)`
*   **Description:** Spawns the actual `tentacle_pillar` boss prefab at this hole’s location, removes the hole entity, and wires the new pillar’s teleporter to point back to the original target. If the target is another hole, triggers recursive emergence.
*   **Parameters:** `inst` (Entity) — the hole entity instance.
*   **Returns:** Nothing.
*   **Error states:** May cause recursion if `targetTeleporter.prefab == "tentacle_pillar_hole"`.

### `TryEmerge(inst)`
*   **Description:** Checks if the emergence timer (`emergetime`) has passed and no teleport is currently in progress; if so, calls `DoEmerge`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** No-op if `IsBusy()` or `IsTargetBusy()` is true, or if `emergetime` has not elapsed.

### `OnActivate(inst, doer)`
*   **Description:** Handler for teleport activation. Awards achievement, mutes player, and plays sound only for non-player doers.
*   **Parameters:**  
  `inst` (Entity) — the hole entity.  
  `doer` (Entity) — the entity teleporting through (player, item, or follower).  
*   **Returns:** Nothing.

### `StartTravelSound(inst, doer)`
*   **Description:** Plays the "enter wormhole" sound on the hole and pushes a local `wormholetravel` event for the doer to sync audio.
*   **Parameters:** `inst` (Entity), `doer` (Entity).  
*   **Returns:** Nothing.

### `OnDoneTeleporting(inst, obj)`
*   **Description:** Called after teleport completes. Resets emergence timer, plays emerge sound, and schedules a follow-up emergence check. Notifies player of spit event for quirks like Wisecracker.
*   **Parameters:** `inst` (Entity), `obj` (Entity? — the teleporting object, may be nil).  
*   **Returns:** Nothing.

### `OnAccept(inst, giver, item)`
*   **Description:** Trader callback — drops the accepted item into the hole’s inventory and triggers teleport activation on it.
*   **Parameters:**  
  `inst` (Entity),  
  `giver` (Entity? — rarely used),  
  `item` (Entity) — the tradable item being accepted.  
*   **Returns:** Nothing.

### `OnLongUpdate(inst, dt)`
*   **Description:** Decrements `emergetime` by `dt` every frame during long updates (used for accurate emergence timing).
*   **Parameters:** `inst` (Entity), `dt` (number — delta time in seconds).  
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Starts looping idle sound (`tentapiller_hiddenidle_LP`) when the entity becomes active in the world.
*   **Parameters:** `inst` (Entity).  
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Stops looping idle sound when the entity goes to sleep (e.g., far from world center).
*   **Parameters:** `inst` (Entity).  
*   **Returns:** Nothing.

### `CanResidueBeSpawnedBy(inst, doer)`
*   **Description:** Determines whether Charlie’s residue can spawn at this hole’s location (requires `winona_charlie_2` skill).
*   **Parameters:** `inst` (Entity), `doer` (Entity? — usually the player).  
*   **Returns:** `boolean` — true only if `skilltreeupdater` exists and `winona_charlie_2` is activated.

### `OnResidueCreated(inst, residueowner, residue)`
*   **Description:** Sets the residue’s map action context to `WORMHOLE` if the skill is active, allowing the residue to appear as a wormhole tracker.
*   **Parameters:** `inst` (Entity), `residueowner` (Entity), `residue` (Entity).  
*   **Returns:** Nothing.

### `CreateHiddenGlobalIcon(inst)`
*   **Description:** Spawns a hidden global map icon to track wormhole locations client-side. Sets priority and restriction tags.
*   **Parameters:** `inst` (Entity).  
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves remaining time until emergence (if positive) as a relative timestamp.
*   **Parameters:** `inst` (Entity), `data` (table).  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `emergetime` by adding saved delta to current game time.
*   **Parameters:** `inst` (Entity), `data` (table? — saved state).  
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Called after world loading completes. If target teleporter is a pillar, triggers its `OnLoadPostPass`.
*   **Parameters:** `inst` (Entity).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `starttravelsound` — fires `StartTravelSound` to play entrance sound and notify doer for audio sync.  
  `doneteleporting` — fires `OnDoneTeleporting` to finalize teleport and schedule re-emergence.  
- **Pushes:**  
  `dropitem` — via `inventory:DropItem`.  
  `wormholetravel` — via `StartTravelSound` on the doer (for local audio).  
  `wormholespit` — delayed event pushed to player after teleport (for quirks like Wisecracker).  
  No custom events are pushed directly from this component’s own methods beyond those delegated via component callbacks.