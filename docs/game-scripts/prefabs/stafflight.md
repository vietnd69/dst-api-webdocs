---
id: stafflight
title: Stafflight
description: Creates staff-powered light-emitting entities with dynamic lighting, heating/cooling, sanity aura, and timed extinguishing behavior.
tags: [light, heating, entity, timed, aura]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 18b55575
system_scope: entity
---

# Stafflight

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `stafflight` subsystem defines prefabs for staff-powered light emitters used in DST, such as the Yellow Staff's star, Opal Staff's star, and Emberlight. These entities provide heat, light, and small sanity aura while active. They are constructed via the `makestafflight` factory function and support hot/cold variants, visual pulse modulation, timed extinction, and haunt interaction. The component does not define a standalone component class, but rather instantiates entities with a specific combination of components and behaviors.

## Usage example
```lua
-- Example: Create a hot staff light
local light = require "prefabs/stafflight"
local lightentity = light[1]() -- stafflight prefab
lightentity.Transform:SetPosition(x, y, z)
TheWorld:PushEvent("ms_positionupdate", lightentity)
```

## Dependencies & tags
**Components used:** `cooker`, `propagator`, `heater`, `sanityaura`, `hauntable`, `timer`, `inspectable`  
**Tags added:** `HASHEATER`, `cooker`, `daylight`, `heatstar`, `ignorewalkableplatforms`  
**Tags used conditionally:** `FX`, `NOCLICK` (commented out)  
**No tags removed or checked via `HasTag`**.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_ismastersim` | boolean | `nil` (set to `TheWorld.ismastersim`) | Indicates whether the entity is running on the master simulation. |
| `_pulseoffs` | number | `0` | Offset for light pulsation sine wave, used to sync client light modulation. |
| `_pulsetime` | net_float | `net_float(inst.GUID, ...)` | Networked float tracking time alive, synced via `"pulsetimedirty"` event. |
| `_lastpulsesync` | number | `0` | Last time the master simulation synced the pulse time. |
| `scrapbook_persishable` | number | Depends on variant (`EMBER_STAR_DURATION`, `YELLOWSTAFF_STAR_DURATION`, or `OPALSTAFF_STAR_DURATION`) | Duration until extinguish, used in scrapbook UI. |
| `scrapbook_anim` | string | `"idle_loop"` | Animation name shown in scrapbook. |
| `pst` | string | `nil` or `"post"` | Animation to play upon extinction (e.g., `"post"` for emberlight). |
| `_killed` | boolean | `false` | Flag set when the light is extinguished. |

## Main functions
### `makestafflight(name, is_hot, anim, colour, idles, is_fx, pre, pst)`
* **Description:** Factory function returning a `Prefab` definition for a stafflight entity. Configures visual, audio, lighting, heating, and timer behavior based on parameters.
* **Parameters:**
  * `name` (string) — Prefab name (e.g., `"stafflight"`, `"emberlight"`).
  * `is_hot` (boolean) — If `true`, entity provides heat and heat-related tags/tags; otherwise, it cools surroundings.
  * `anim` (string) — Animation bank/build name (e.g., `"star_hot"`).
  * `colour` (table of 3 numbers) — RGB light color (e.g., `{1, 0.5, 0}`).
  * `idles` (table of strings) — List of idle animations to cycle or loop.
  * `is_fx` (boolean) — If `true`, removes physics, removes persistence, and disables haunt/timer logic.
  * `pre` (string, optional) — Animation to play on spawn (`"appear"` by default if not specified).
  * `pst` (string, optional) — Animation to play on extinction.
* **Returns:** `Prefab` — A ready-to-instantiate prefab definition.
* **Error states:** None; the function always returns a valid `Prefab`.

### `kill_light(inst)`
* **Description:** Initiates the extinguishing sequence: plays `"disappear"` animation, schedules removal after 1 second, enables `persists = false`, and sets `_killed = true`.
* **Parameters:** `inst` (Entity) — The light entity.
* **Returns:** Nothing.
* **Error states:** None.

### `pulse_light(inst)`
* **Description:** On the master simulation, periodically syncs `_pulsetime` and enables the light; on all simulations, modulates light radius, intensity, and falloff with a sine wave for a pulsing visual effect.
* **Parameters:** `inst` (Entity) — The light entity.
* **Returns:** Nothing.
* **Error states:** None.

### `onhaunt(inst)`
* **Description:** Handles haunting of the light. If the extinguish timer is running, stops it and immediately extinguishes the light. Returns `true` to trigger haunter effects.
* **Parameters:** `inst` (Entity) — The light entity.
* **Returns:** `true` — Always indicates successful haunt.
* **Error states:** None.

### `ontimer(inst, data)`
* **Description:** Callback for `timerdone` events. If the finished timer is `"extinguish"`, calls `kill_light`.
* **Parameters:**
  * `inst` (Entity) — The light entity.
  * `data` (table) — Timer data; expects `{ name = "extinguish" }`.
* **Returns:** Nothing.
* **Error states:** None.

### `onpulsetimedirty(inst)`
* **Description:** Client-side event handler updating `_pulseoffs` when `_pulsetime` is updated by the master.
* **Parameters:** `inst` (Entity) — The light entity.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `"animover"` — Triggers `kill_sound` after `kill_light`, and optional `PlayRandomStarIdle` for multi-idle variants.  
  - `"timerdone"` — Calls `ontimer` when the `"extinguish"` timer completes.  
  - `"pulsetimedirty"` (client only) — Updates `_pulseoffs` when `_pulsetime` changes.
- **Pushes:** None directly; relies on component events (e.g., `"timerdone"` from `Timer` component) and internal function triggers.