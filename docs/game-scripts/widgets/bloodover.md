---
id: bloodover
title: Bloodover
description: Renders a dynamic visual overlay on the screen when the owner entity is in critical health states such as freezing, overheating, starving, or suffering from lunar burn.
tags: [ui, visual, health, status]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c8c6be2b
system_scope: ui
---

# Bloodover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BloodOver` is a UI widget component that displays a semi-transparent red overlay on the screen when the owner entity enters critical status conditions: freezing, overheating, starvation, or lunar burn. It smoothly animates the overlay opacity using a linear interpolation approach and supports a transient "flash" effect (e.g., on damage or attack events). This widget is typically added to player entities and responds to events from health, hunger, and environmental state components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bloodover")
-- The component automatically updates based on owner's state via event listeners.
-- It requires the owner to have replica components: hunger, health.
```

## Dependencies & tags
**Components used:** `hunger`, `health` (accessed via `owner.replica`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity whose state determines when the overlay is visible. |
| `base_level` | number | `0` | Target opacity level for smooth transitions. |
| `level` | number | `0` | Current opacity level, updated in `OnUpdate`. |
| `k` | number | `1` | Interpolation speed factor (higher = faster transition). |
| `time_since_pulse` | number | `0` | Accumulated time since last pulse cycle. |
| `pulse_period` | number | `1` | Interval in seconds between pulse resets (not actively pulsed, but tracked). |
| `bg` | `Image` | `nil` | The background image used to render the red overlay. |

## Main functions
### `UpdateState()`
* **Description:** Evaluates the owner’s current state (freezing, overheating, starving, lunar burn) and decides whether to show or hide the overlay by calling `TurnOn()` or `TurnOff()`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not fail; assumes `owner.replica.hunger` and `owner.replica.health` are valid if the component is present.

### `TurnOn()`
* **Description:** Activates the overlay by setting it to fade toward `0.5` opacity and prepares the update loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `TurnOff()`
* **Description:** Turns off the overlay by resetting target opacity to `0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Smoothly interpolates the overlay’s opacity (`level`) toward `base_level`. Handles time-step clamping to prevent instability. Controls visibility, tint alpha, and pulse timing. Runs on every frame update via `StartUpdating`/`StopUpdating`.
* **Parameters:**  
  `dt` (number) – Delta time in seconds since last frame (clamped to valid range `0 < dt <= 0.1`).
* **Returns:** Nothing.
* **Error states:** Returns early (no effect) if `dt <= 0` or `dt > 0.1` to avoid numeric instability.

### `Flash()`
* **Description:** Instantly triggers a full-opacity flash of the overlay (e.g., on damage or aura events), overriding the current interpolation toward `base_level`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `badaura` – triggers `Flash()` when owner is affected by a harmful aura.  
  `attacked` – triggers `Flash()` unless the damage is redirected (`data.redirected == true`).  
  `damaged` – triggers `Flash()` (e.g., for non-combat damage like Telltale Heart).  
  `startstarving` / `stopstarving` – toggles overlay based on hunger state.  
  `startfreezing` / `stopfreezing` – toggles overlay based on cold state.  
  `startoverheating` / `stopoverheating` – toggles overlay based on heat state.  
  `startlunarburn` / `stoplunarburn` – toggles overlay based on lunar burn condition.  
- **Pushes:** None.