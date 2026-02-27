---
id: nightmareclock
title: Nightmareclock
description: Manages the cyclical nightmare phase progression and timing in the game world, including sound transitions, phase state synchronization, and player-activated ambient effects.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6974687a
---

# Nightmareclock

## Overview
The `nightmareclock` component tracks and controls the progression of nightmare phases in the world (e.g., Calm, Warn, Wild, Dawn), including time remaining in each phase, sound state management, and synchronization across clients and servers. It operates as a world-level clock that activates when a player enters the Nightmare area and updates phase transitions dynamically, with distinct behavior for master simulation and client shards.

## Dependencies & Tags
- **Components:** No explicit component dependencies are declared in this file. However, it interacts with `areaaware` on the active player (`_activatedplayer.components.areaaware`) and relies on `TheWorld`'s `SoundEmitter`.
- **Tags:** None added or removed by this component itself. It reads `"Nightmare"` area tags dynamically via `CurrentlyInTag("Nightmare")`.
- **Tuning usage:** Relies on `TUNING.NIGHTMARE_SEGS`, `TUNING.SEG_TIME`, and `TUNING.NIGHTMARE_SEG_VARIATION`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the component's owning entity (typically `TheWorld`). |
| `_segs` | `table` of `net_smallbyte` | Empty table | Networked segment durations for each phase (`calm`, `warn`, `wild`, `dawn`). |
| `_phase` | `net_tinybyte` | `PHASES.calm (1)` | Current phase index (1–4), synced over network. |
| `_totaltimeinphase` | `net_float` | Calculated per phase | Total duration (in seconds) of the current phase. |
| `_remainingtimeinphase` | `net_float` | Equal to `_totaltimeinphase` on init | Remaining time (in seconds) in the current phase. |
| `_activatedplayer` | `Entity?` | `nil` | The player who triggered/activated the nightmare clock. |
| `_lockedphase` | `number?` | `nil` | If set, locks the current phase and prevents automatic transitions. |
| `_phasedirty` | `boolean` | `true` | Flag indicating the phase has changed and sounds/events should update. |

## Main Functions
### `self:OnUpdate(dt)`
* **Description:** Called every frame (acts as both `Update` and `LongUpdate` due to assignment). Handles phase timer decrement, phase transitions on the master server, client-side clamping during phase transitions, and emits the `nightmareclocktick` event for UI/audio feedback.
* **Parameters:**
  - `dt` (number): Delta time in seconds since last update.

### `self:GetDebugString()`
* **Description:** Returns a formatted debug string containing the current phase name and remaining time (e.g., `"wild: 3.45"`).
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"nightmarephasedirty"` → Sets `_phasedirty = true`.
  - `"playeractivated"` → Sets `_activatedplayer`, registers `"changearea"` listener, and marks phase dirty.
  - `"playerdeactivated"` → Clears `_activatedplayer` if it matches, removes `"changearea"` listener.
  - On **master simulation** only:
    - `"ms_setnightmaresegs"` → Sets custom phase durations.
    - `"ms_setnightmarephase"` → Immediately transitions to specified phase.
    - `"ms_nextnightmarephase"` → Forces transition to next phase.
    - `"ms_nextnightmarecycle"` → Jumps to Dawn phase and resets timer.
    - `"ms_locknightmarephase"` → Locks the current (or specified) phase.
- **Emits:**
  - `"nightmarephasechanged"` (world event) → Fired when phase changes.
  - `"nightmareclocktick"` (world event) → Fired every update; payload: `{ phase = "calm", timeinphase = 0.25, time = elapsed }`.

## Save/Load Behavior
- **On save (master only):** Returns a table with `lengths`, `phase`, `totaltimeinphase`, `remainingtimeinphase`, and `lockedphase`.
- **On load (master only):** Restores phase segments, phase index, timer values, and lock state from saved data.