---
id: quaker
title: Quaker
description: Manages environmental quaking events that spawn falling debris and trigger player-specific particle and audio effects in response to time, explosions, or forced triggers.
tags: [environment, event, debris, world]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c07f1a7b
system_scope: environment
---
# Quaker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Quaker` is a world-level component responsible for orchestrating timed quaking events, where debris (including items, animals, and structures) falls from above and may collide with or destroy nearby entities. It handles scheduling, state transitions (`WAITING`, `WARNING`, `QUAKING`), player-specific drop logic, and sound/camera effects. It integrates with physics, world topology, entities, and network replication to coordinate client-server behavior during quakes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("quaker")
inst.components.quaker:SetQuakeData({
    warningtime = 7,
    quaketime = function() return math.random(5, 10) + 5 end,
    debrispersecond = function() return math.random(5, 6) end,
    nextquake = function() return TUNING.TOTAL_DAY_TIME + math.random() * TUNING.TOTAL_DAY_TIME * 2 end,
    mammals = 1,
})
```

## Dependencies & tags
**Components used:** `talker`, `workable`, `combat`, `inventoryitem`, `mine`, `childspawner`, `spawner`, `rabbitkingmanager`, `riftspawner`  
**Tags added or removed:** None directly; checks tags on debris (`heavy`, `quakedebris`, `smashable`, `NPC_workable`, `INLIMBO`, etc.) to determine interactions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity (typically the world or a world generator) that owns the `quaker` component. |
| `_debrispersecond` | number | `1` | Current rate (debris per second) during a quake. |
| `_mammalsremaining` | number | `0` | Remaining count of small mammals (`rabbit`, `mole`, `carrat`) allowed to drop during the current quake. |
| `_quakedata` | table or `nil` | `nil` | Configuration data for quake timing, duration, and behavior. |
| `_state` | `QUAKESTATE` enum | `nil` | Current state: `0 = WAITING`, `1 = WARNING`, `2 = QUAKING`. |
| `_activeplayers` | table | `{}` | List of players currently registered to receive debris drops. |
| `_scheduleddrops` | table | `{}` | Mapping from player → scheduled task for debris drops. |
| `_frequencymultiplier` | number | `TUNING.QUAKE_FREQUENCY_MULTIPLIER` | Multiplier applied to quake frequency (used for tuning or debugging). |
| `_quakesoundintensity` | `net_tinybyte` | `0` | Networked value representing main quake sound intensity (0 = none, 1 = warning, 2 = quaking). |
| `_miniquakesoundintensity` | `net_bool` | `false` | Networked flag indicating whether a mini-quake sound is playing. |
| `_pausesources` | `SourceModifierList` | — | Tracks sources that have paused quaking; stops quake events when any source is active. |

## Main functions
### `SetQuakeData(data)`
* **Description:** Sets the configuration table for quaking behavior (timing, durations, rates) and schedules the next quake if `data` is valid and frequency is enabled.
* **Parameters:** `data` (table) — Must contain keys like `warningtime`, `quaketime`, `debrispersecond`, `nextquake`, `mammals`. Each value may be a literal or a function returning a value.
* **Returns:** Nothing.
* **Error states:** No-op on non-master simulation (`_ismastersim == false`).

### `SetDebris(data)`
* **Description:** Replaces the global debris drop table with the provided list. Each entry is a table with `weight` and `loot` (array of prefab names or identifiers).
* **Parameters:** `data` (table) — Array of debris drop configurations.
* **Returns:** Nothing.
* **Error states:** No-op on non-master simulation.

### `SetTagDebris(tile, data)`
* **Description:** Associates a custom debris table with a specific world topology tile (e.g., `"lunacyarea"`). Used to override debris based on location.
* **Parameters:** `tile` (string) — Tile identifier/name in the world topology. `data` (table) — Debris table to use for that tile, or an empty table `{}` to produce no debris.
* **Returns:** Nothing.
* **Error states:** No-op on non-master simulation.

### `IsQuaking()`
* **Description:** Returns `true` if a main quake or mini-quake is currently active.
* **Parameters:** None.
* **Returns:** boolean — `true` if `_quakesoundintensity > 1` or `_miniquakesoundintensity` is `true`.
* **Error states:** None.

## Events & listeners
- **Listens to:**
  - `quakesoundintensitydirty` (client) — Updates earthquake sound playback and intensity based on `_quakesoundintensity` value.
  - `miniquakesoundintensitydirty` (client) — Handles mini-quake sound playback.
  - `ms_playerjoined` (master) — Registers new player and schedules drops if quaking.
  - `ms_playerleft` (master) — Cancels pending debris drops for the leaving player.
  - `ms_miniquake` (master) — Triggers a localized mini-quake with configurable parameters.
  - `ms_forcequake` (master) — Immediately starts a quake if not already quaking.
  - `explosion` (master) — Shortens remaining wait time or resets warning phase if an explosion occurs during a pending quake.
  - `pausequakes` (master) — Adds a pause source via `_pausesources`.
  - `unpausequakes` (master) — Removes a pause source via `_pausesources`.
- **Pushes:**
  - `startquake` — Fired when the quake phase begins; includes `duration` and `debrisperiod`.
  - `warnquake` — Fired during the warning phase.
  - `endquake` — Fired when a quake ends.
  - `startfalling`, `stopfalling`, `detachchild`, `destroy` — Emitted by debris entities during simulation.

## Events & listeners
