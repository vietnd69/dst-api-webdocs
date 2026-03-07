---
id: atrium_gate
title: Atrium Gate
description: Manages the state, gameplay progression, and visual effects of the Atrium Gate, including stalker tracking, destabilization sequences, cooldown handling, and Charlie-related cutscenes.
tags: [combat, environment, boss, puzzle, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 255708dd
system_scope: environment
---

# Atrium Gate

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The Atrium Gate is a central world object in the Ruins that governs the transition between stable and unstable states, primarily triggered by tracking a Stalker. It coordinates multiple systems including timers (via `worldsettingstimer`), stalker monitoring (via `entitytracker`), visual effects (via `pointofinterest` and local FX), lighting, pathfinding, and the Charlie cutscene system. When the gate destabilizes, it resets the Ruins and resets Nightmare-related world modifiers.

## Usage example
```lua
-- Typical use in Prefab: added automatically to the gate entity during construction.
-- Example calls from external systems:
local gate = GetPrefab("atrium_gate")
if gate ~= nil then
    gate.TrackStalker(stalker_entity)
    gate.Destabilize() -- Manually trigger destabilization
    gate.ForceDestabilizeExplode() -- Immediately force explosion if destabilizing
    local is_charging = gate:IsWaitingForStalker()
end
```

## Dependencies & tags
**Components used:** `charliecutscene`, `entitytracker`, `worldsettingstimer`, `inspectable`, `pickable`, `trader`, `pointofinterest`, `colourtweener`, `health`, `lootdropper`, `areaaware`, `focalpoint`, `talker`, `light`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`.

**Tags:** `gemsocket`, `stargate`, `intense`, `FX`, `DECOR`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._camerafocus` | `net_tinybyte` | `0` | Networked camera focus level (0=off, 1=charging, 2=destabilizing). |
| `inst.highlightchildren` | `table` | `{}` | List of FX children for highlighting. |
| `inst.scrapbook_specialinfo` | `string` | `"atriumgate"` | Scrapbook entry identifier. |
| `inst.scrapbook_speechstatus` | `string` | `"OFF"` | Scrapbook status string mirroring `getstatus`. |

## Main functions
### `TrackStalker(stalker)`
*   **Description:** Begins or switches tracking of a new Stalker entity. Triggers `OnKeyGiven` if not already active, and registers callbacks for the Stalker’s removal or death.
*   **Parameters:** `stalker` (Entity) — the Stalker entity to track.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; expects a valid entity reference.

### `Destabilize(failed)`
*   **Description:** Initiates the destabilization sequence if the gate is not currently destabilizing or in cooldown. If `failed` is `true`, it rejects the player’s attempt and respawns the key.
*   **Parameters:** `failed` (boolean) — whether to abort and return the key.
*   **Returns:** Nothing.

### `StartCooldown(immediate)`
*   **Description:** Ends destabilization or active state and starts the cooldown phase. Cancels destabilization timer and sets up the cooldown timer.
*   **Parameters:** `immediate` (boolean) — if `true`, skip animation delay and play cooldown immediately.
*   **Returns:** Nothing.

### `ForceDestabilizeExplode()`
*   **Description:** Forces an immediate destabilization explosion if the gate is currently destabilizing.
*   **Parameters:** None.
*   **Returns:** `true` if a destabilization was forced; `false` otherwise.

### `IsDestabilizing()`
*   **Description:** Checks whether the destabilizing timer is currently active.
*   **Parameters:** None.
*   **Returns:** `true` if the `"destabilizing"` timer exists and is active; `false` otherwise.

### `IsWaitingForStalker()`
*   **Description:** Checks whether the gate is in the `"ON"` state (waiting for a Stalker to be tracked).
*   **Parameters:** None.
*   **Returns:** `true` if `getstatus(inst) == "ON"`; `false` otherwise.

### `IsObjectInAtriumArena(inst, obj)`
*   **Description:** Determines if an object is within the Atrium arena bounds (±14.55 tiles in X/Z from the gate).
*   **Parameters:**  
  `inst` (Entity) — the gate entity.  
  `obj` (Entity or `nil`) — the object to test.
*   **Returns:** `true` if `obj` is within bounds and not `nil`; `false` otherwise.

### `getstatus(inst)`
*   **Description:** Returns a status string indicating the gate’s current operational state.
*   **Parameters:** `inst` (Entity) — the gate instance.
*   **Returns:** One of: `"DESTABILIZING"`, `"COOLDOWN"`, `"CHARGING"`, `"ON"`, `"OFF"`.

## Events & listeners
- **Listens to:** `timerdone` — triggers `ontimer` to handle timer expiration (destabilizedelay, destabilizing, cooldown).  
- **Pushes:** `atriumpowered`, `ms_locknightmarephase`, `pausequakes`, `pausehounded`, `unpausequakes`, `unpausehounded`, `resetruins` — fired during state transitions to affect global world systems.

- **Entity callbacks:**
  - `onremove` — for tracked Stalker and Charlie Hand.
  - `death` — for tracked Stalker to detect when Stalker dies or leaves the arena.
  - `OnEntitySleep` / `OnEntityWake` — starts or cancels auto-fail timer when Stalker sleeps/wakes.
  - `OnLoadPostPass` / `OnPreLoad` — handles state restoration and timer persistence across saves.