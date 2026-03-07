---
id: avengingghost
title: Avengingghost
description: Manages the avenging ghost state for Wendy, increasing damage over time while in ghost form if a nearby player has the 'wendy_avenging_ghost' skill activated.
tags: [combat, player, ghost, skill, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9a349101
system_scope: entity
---

# Avengingghost

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AvengingGhost` controls the behavior of Wendy's avenging ghost transformation. When active, it grants increasing damage over time while Wendy is a ghost, provided at least one nearby player has the `wendy_avenging_ghost` skill activated via the `skilltreeupdater` component. The component handles state transitions (`StartAvenging`, `StopAvenging`), time tracking, network sync, world-state-based damage adjustments (day/dusk/night), and attachment of a visual attack effect. It is intended for use only on the master simulation and interacts closely with the `combat`, `aura`, `timer`, and `skilltreeupdater` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("avengingghost")
-- Avenging state is triggered automatically on 'ms_becameghost' if ShouldAvenge() returns true.
-- The component internally manages tick timers and damage scaling via OnUpdate.
```

## Dependencies & tags
**Components used:** `combat`, `aura`, `timer`, `skilltreeupdater`, `net_float`, `net_hash`
**Tags:** Listens for `ms_becameghost`, `ms_respawnedfromghost`, `onareaattackother`, and `avengetimedirty` events. Does not directly add/remove tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity instance owning this component. |
| `ismastersim` | boolean | — | Whether the current instance is the server (true) or client (false). |
| `_avengetime` | `net_float` | `0` | Networked remaining time in seconds (decrements during avenging). |
| `_maxtime` | `net_float` | `15` | Networked maximum duration (fixed at 15 seconds). |
| `_symbol` | `net_hash` | `nil` | Networked hash for avenging ghost symbol (not populated in this code). |
| `olddamage` | number | `nil` | Stores original combat damage before avenging begins. |

## Main functions
### `GetSymbol()`
* **Description:** Returns the current avenging ghost symbol hash.
* **Parameters:** None.
* **Returns:** `hash` (string) — The symbol value; currently always `nil` as it is not set.
* **Error states:** None.

### `GetTime()`
* **Description:** Returns the remaining avenging time.
* **Parameters:** None.
* **Returns:** `number` — Time remaining in seconds.
* **Error states:** None.

### `GetMaxTime()`
* **Description:** Returns the maximum avenging duration.
* **Parameters:** None.
* **Returns:** `number` — Fixed at `15`.
* **Error states:** None.

### `ShouldAvenge()`
* **Description:** (Server-only) Checks whether any nearby player has the `wendy_avenging_ghost` skill activated. Used to decide if avenging should activate upon becoming a ghost.
* **Parameters:** None.
* **Returns:** `boolean?` — `true` if a qualifying player is nearby, `nil` otherwise.
* **Error states:** Returns `nil` immediately if called on client.

### `StartAvenging(time)`
* **Description:** (Server-only) Activates the avenging ghost effect: starts the aura, begins attack timer, sets world-state listeners for dynamic damage, spawns attack effect, updates color, and initializes avenging time.
* **Parameters:** `time` (number, optional) — Custom starting time in seconds; defaults to `15`.
* **Returns:** Nothing.
* **Error states:** Returns early if called on client. Must be called on server.

### `StopAvenging()`
* **Description:** (Server-only) Deactivates avenging: restores original combat damage, removes aura, kills attack effect, stops world-state listeners, and resets timer/color.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if called on client or if not currently avenging (`olddamage` is `nil`).

### `OnUpdate(dt)`
* **Description:** (Server-only) Called periodically while avenging. Decrements avenging time, scaled by `SLOWRATE` if the attack timer is active.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Returns early if called on client or if avenging is inactive.

### `OnSave()`
* **Description:** Serializes current avenging time for save game persistence.
* **Parameters:** None.
* **Returns:** `{ avengetime = number }` — Table containing the remaining time (or loaded time if available).
* **Error states:** None.

### `OnLoad(data, newents)`
* **Description:** Loads persisted avenging time after save restoration.
* **Parameters:** 
  * `data` (table) — Save data containing `avengetime`.
  * `newents` (table) — Entity map (unused).
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** 
  - `ms_becameghost` — Triggers `StartAvenging()` if `ShouldAvenge()` returns true.
  - `ms_respawnedfromghost` — Triggers `StopAvenging()`.
  - `onareaattackother` — Resets or starts the `"avenging_ghost_attack"` timer on `timer` component.
  - `avengetimedirty` — Fires `"clientavengetimedirty"` event for UI updates.
- **Pushes:** 
  - `"clientavengetimedirty"` —携 `{ val = time }` — Notified when avenging time changes (client-side).

## Notes
- This component is server-only (`ismastersim` check). All logic for state transitions and time management occurs on the server; client handles visuals and UI sync.
- Avenging time is decremented by `dt` normally, but slowed by `dt * 0.5` when the `"avenging_ghost_attack"` timer exists.
- Damage is dynamically set based on time of day via `TUNING.ABIGAIL_DAMAGE.*` values (`day`, `dusk`, `night`), and visual feedback uses the `abigail_attack_fx` prefab.
- The `skilltreeupdater:IsActivated("wendy_avenging_ghost")` check ensures the skill must be active for any nearby player for avenging to begin.
