---
id: nightmareclock
title: Nightmareclock
description: Manages the cyclical nightmare phase transitions and audio cues in the Caves, synchronizing timing and sound states across networked clients.
tags: [nightmare, world, audio, sync]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6974687a
system_scope: world
---

# Nightmareclock

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Nightmareclock` component tracks and controls the progression of nightmare phases (calm, warn, wild, dawn) in the Caves. It operates in a master-server/client architecture, maintaining synchronized phase transitions and ambient sound effects using networked variables. It relies on the `AreaAware` component to determine the current active player’s location and conditionally adjust ambient audio when inside a `"Nightmare"` tag zone.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("nightmareclock")
inst:AddComponent("nightmareclock")

-- Lock into the 'wild' phase on the server
inst.Transform:SetPosition(0, 0, 0)
TheWorld:PushEvent("ms_locknightmarephase", "wild")
```

## Dependencies & tags
**Components used:** `areaaware` (via `TheWorld` player activation events)
**Tags:** None added/removed by this component; it checks `"Nightmare"` tag via `AreaAware:CurrentlyInTag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Entity instance the component is attached to. |
| `_segs` | `table` of `net_smallbyte` | dynamically allocated | Networked segments for duration weights of each phase. |
| `_phase` | `net_tinybyte` | `PHASES.calm` | Current phase index (1–4). |
| `_totaltimeinphase` | `net_float` | computed | Total duration of the current phase in seconds. |
| `_remainingtimeinphase` | `net_float` | computed | Remaining time in the current phase. |
| `_lockedphase` | `number` or `nil` | `nil` | If set, prevents automatic phase transitions (used in boss fights). |
| `_activatedplayer` | `Entity` or `nil` | `nil` | Currently active player used for ambient sound context. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Advances time in the current phase, handles phase transitions on the server, updates networked variables, and triggers events when phases change. Called every frame via `inst:StartUpdatingComponent`.
*   **Parameters:** `dt` (number) — delta time in seconds since the last update.
*   **Returns:** Nothing.
*   **Error states:** On clients/shards, time pauses near the end of a phase while awaiting server synchronization; `math.min(.001, remaining)` avoids negative values.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string for the current phase name and remaining time.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"wild: 2.34 "`.

## Events & listeners
- **Listens to:**
  - `"changearea"` (on `_activatedplayer`) — triggers `UpdateAmbientSounds`.
  - `"playeractivated"` (on `TheWorld`) — sets `_activatedplayer`, registers `"changearea"` listener, sets `_phasedirty = true`.
  - `"playerdeactivated"` (on `TheWorld`) — clears `_activatedplayer` if matched, removes `"changearea"` listener.
  - `"nightmarephasedirty"` — sets `_phasedirty = true`.
  - `"ms_setnightmaresegs"` (master only) — sets phase segment durations.
  - `"ms_setnightmarephase"` (master only) — forces a specific phase.
  - `"ms_nextnightmarephase"` (master only) — advances to the next phase immediately.
  - `"ms_nextnightmarecycle"` (master only) — jumps to `"dawn"` and resets.
  - `"ms_locknightmarephase"` (master only) — locks progression to a specific phase.
- **Pushes:**
  - `"nightmarephasechanged"` (on `TheWorld`) — when phase changes, with the new phase name as payload.
  - `"nightmareclocktick"` (on `TheWorld`) — every frame, with `{ phase, timeinphase, time }` payload (normalized phase progress and cumulative elapsed time).

## Save/Load
- **`OnSave()`** (master only): Returns a table with `lengths`, `phase`, `totaltimeinphase`, `remainingtimeinphase`, and `lockedphase`.
- **`OnLoad(data)`** (master only): Restores segment lengths, phase, timing, and lock state from saved data.

## Notes
- Phase durations are calculated as `segment_value * TUNING.SEG_TIME + random(TUNING.NIGHTMARE_SEG_VARIATION * TUNING.SEG_TIME)`.
- Ambient sound state (`"dontstarve/cave/nightmare"`) is controlled via `"nightmare"` parameter (0–2), tied to phase severity.
- The `"calm"` phase (`param = 0`) suppresses ambient loop sound; `"warn"` and `"dawn"` (`param = 1`) and `"wild"` (`param = 2`) activate and modulate it.
- All networked variables (`_segs`, `_phase`, `_totaltimeinphase`, `_remainingtimeinphase`) are built using GUID-scoped names to ensure correct client-server synchronization.
