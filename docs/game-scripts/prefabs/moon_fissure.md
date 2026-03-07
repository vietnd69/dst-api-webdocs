---
id: moon_fissure
title: Moon Fissure
description: Manages the visual and gameplay behavior of the Moon Fissure prop, which reacts to lunar phases and accepts moon altar pieces as repairs.
tags: [environment, lighting, repair, moon]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4836de73
system_scope: environment
---

# Moon Fissure

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moon_fissure.lua` defines the logic for the Moon Fissure prop—a world object that dynamically adjusts its lighting, animations, and sanity aura based on the current lunar phase in DST. It integrates with multiple components: `inspectable`, `workable`, `repairable`, `sanityaura`, `timer`, and `ambientlighting`. When a compatible moon altar piece is repaired into the fissure, it spawns the corresponding altar prefab and removes itself. The component also manages periodic lighting updates during wakefulness and cleans up light and sound tasks during entity sleep.

## Usage example
This prefab is not instantiated manually by modders; it is created internally by the game when the Moon Fissure entity is spawned (e.g., during world generation or event triggers). A typical interaction involves players using a moon altar piece (e.g., `moon_altar_idol`) on the fissure:

```lua
-- This code is illustrative of how the repair flow works internally
inst.components.repairable:Repair(MOON_ALTAR) -- triggers onrepaired callback
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `repairable`, `sanityaura`, `timer`, `ambientlighting`  
**Tags added:** `antlion_sinkhole_blocker` (on main and plugged fissures), `DECOR`, `NOCLICK` (on FX entity)  
**Tags checked:** None explicitly via `HasTag`, but `sanityaura` uses observer-based evaluation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_level` | `net_tinybyte` | `MOON_STATES[TheWorld.state.moonphase]` | Networked numeric value (1–5) representing the current lunar phase state. |
| `_lighttask` | `task` or `nil` | `DoPeriodicTask(0, OnUpdateLight)` | Periodic task for updating light properties; cancelled on `OnEntitySleep`. |
| `_transition_task` | `task` or `nil` | `nil` | Delayed task used during moon phase transitions to avoid instant visual jumps. |
| `fx` | `Entity` or `nil` | `SpawnPrefab("moon_fissure_fx")` | Child entity holding visual effects synced with the main fissure. |

## Main functions
### `OnUpdateLight(inst)`
*   **Description:** Smoothly interpolates the fissure's light properties (radius, intensity, falloff, and color) toward the current lunar phase's target values, and adjusts color based on world ambient brightness.
*   **Parameters:** `inst` (entity) — the fissure instance.
*   **Returns:** Nothing.
*   **Error states:** If `inst._level:value()` is invalid, falls back to `lightstate_data[1]` (no light). Uses `FRAMES` for frame-rate-adjusted interpolation.

### `UpdateState(inst)`
*   **Description:** Syncs animation layers, backing visibility, and light state based on the current moon phase stored in `_level`. Also updates `sanityaura.max_distsq`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `delayed_transition(inst)`
*   **Description:** Triggers the visual "crack open" animation sequence and schedules `UpdateState` after 5 frames (via `_transition_task`) to finalize phase transition.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onmoonphasechagned(inst, phase)`
*   **Description:** Listens for world moon phase changes and initiates a delayed transition (with random delay) if a transition is pending.
*   **Parameters:**  
  - `inst` (entity) — the fissure instance.  
  - `phase` (string) — the new moon phase (unused directly).  
*   **Returns:** Nothing.

### `aurafn(inst, observer)`
*   **Description:** Callback for `sanityaura.aurafn`; returns the sanity change rate per second based on the current fissure level.
*   **Parameters:**  
  - `inst` (entity).  
  - `observer` (entity) — the entity receiving sanity change (unused but required).  
*   **Returns:** number — sanity change value derived from `lightstate_data[level].sanityaura`.

### `aurafallofffn(inst, observer, distsq)`
*   **Description:** Callback for `sanityaura.fallofffn`; modifies distance-squared for sanity falloff calculation.  
*   **Parameters:**  
  - `inst` (entity).  
  - `observer` (entity).  
  - `distsq` (number) — squared distance from fissure to observer.  
*   **Returns:** number — adjusted falloff value.

### `getstatus(inst)`
*   **Description:** Callback for `inspectable.getstatus`; returns a string descriptor for the "inspect" UI.  
*   **Parameters:** `inst` (entity).  
*   **Returns:** `"NOLIGHT"` if `_level == 1` (new moon), otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `timerdone` (on `moon_fissure_plugged` only) — triggers "toot" animation loop when timer expires.  
  - `animover` (on `moon_fissure_plugged` only) — handles playback of "toot" animation segments and emits a sound.  
  - `moonphase` (via `WatchWorldState`) — reacts to moon phase changes.  
- **Pushes:**  
  - `on_fissure_socket` (on altar spawned after repair).  
  - `moonfissurevent` (on `moon_fissure_plugged` during "toot" sequence).  
- **Observes:**  
  - `TheWorld.state.moonphase` — drives transitions and state updates.  
