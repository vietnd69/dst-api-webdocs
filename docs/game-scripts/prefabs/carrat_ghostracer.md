---
id: carrat_ghostracer
title: Carrat Ghostracer
description: A non-player character prefab representing a Ghost Racer carrat that participates in the Year of the Crow (YOTC) race, with stat-based performance modifiers and dynamic behavior during races.
tags: [npc, race, yotc, ai, shadow]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aff34542
system_scope: entity
---

# Carrat Ghostracer

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carrat_ghostracer` is a prefab definition for a non-player character that acts as a race participant in the Year of the Crow (YOTC) event. It uses the `yotc_racestats` and `yotc_racecompetitor` components to configure race performance based on player-derived stat modifiers, and dynamically adjusts movement speed, stamina, reaction time, and forgetfulness during the race. It also integrates with the `locomotor`, `health`, `sleeper`, and `brain` systems, and supports special YOTC visuals (e.g., red pouch) when the event is active.

The prefab uses a shared stategraph (`SGcarrat`) and an external brain (`carratbrain`) for AI behavior.

## Usage example
This prefab is instantiated internally by the game during YOTC events and should not typically be created manually. However, for testing or mod extensions, a basic instantiation would look like:

```lua
local carrat = SpawnPrefab("carrat_ghostracer")
carrat.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `yotc_racestats`, `yotc_racecompetitor`, `locomotor`, `health`, `sleeper`, `inspectable`  
**Tags:** `shadow`, `ghost` (implied viaprefab name), and conditionally `has_no_prize` (removed when race begins)  
**Stategraph:** `SGcarrat`  
**Brain:** `carratbrain`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._musicstate` | `net_tinybyte` | `CARRAT_MUSIC_STATES.NONE` | Networked integer representing the carrat’s current music/mode state (used for race music triggers). |
| `inst._color` | string | `"black"` | Internal color identifier (not exposed for modification). |
| `inst.sounds` | table | `shadowcarratsounds` | Sound event mapping for audio playback. |
| `inst.persists` | boolean | `false` | Indicates the carrat will not be saved to world save. |
| `inst.sg.mem.noelectrocute` | boolean | `true` | Flag indicating the carrat cannot be electrocuted (shared across all carrats). |

## Main functions
### `race_begun(inst)`
* **Description:** Callback invoked when the race officially begins. It applies stat-based modifiers to the carrat, configures stamina, speed, and reaction behavior, handles sleep wake-up, and triggers start delays or stun states depending on the `reaction` stat.
* **Parameters:** `inst` (Entity instance) — the carrat entity.
* **Returns:** Nothing.
* **Error states:** Gracefully skips modifications if `yotc_racecompetitor` or `yotc_racestats` components are missing. Does nothing if the carrat is dead.

### `race_over_fn(inst)`
* **Description:** Cleanup callback when the race ends. Removes the `yotc_racecompetitor` component and spawns a `shadow_puff` effect before removing the carrat.
* **Parameters:** `inst` (Entity instance) — the carrat entity.
* **Returns:** Nothing.

### `pieceout(inst)`
* **Description:** Helper function called after the race to spawn a visual effect (`shadow_puff`) at the carrat’s position and remove the carrat entity.
* **Parameters:** `inst` (Entity instance) — the carrat entity.
* **Returns:** Nothing.

### `OnMusicStateDirty(inst)`
* **Description:** Event listener that detects when the carrat’s music state changes to `CARRAT_MUSIC_STATES.RACE`. If the local player is within range (20 units), it triggers a client-side `"playracemusic"` event.
* **Parameters:** `inst` (Entity instance) — the carrat entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `musicstatedirty` — triggers `OnMusicStateDirty` on the client to control race music playback.
- **Pushes:** None directly (events like `"onwakeup"` are handled by `Sleeper` component’s internal logic).