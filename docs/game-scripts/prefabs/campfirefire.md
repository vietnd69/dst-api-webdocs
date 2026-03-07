---
id: campfirefire
title: Campfirefire
description: Creates and configures campfire and portable campfire entities with fire effects, heating, and dynamic animation levels.
tags: [environment, fx, lighting, heater]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4f098a3d
system_scope: environment
---

# Campfirefire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`campfirefire` is a prefab factory function that generates two distinct fire prefabs — `campfirefire` and `portable_campfirefire` — used for campfire and portable campfire items in DST. It configures visual fire levels (animations, sound, radius, light), integrates with the `heater` component for heat delivery, and the `firefx` component for dynamic fire level management. The prefabs are entity-centric and include `animstate`, `soundemitter`, `transform`, and `network` components, plus server-side `heater` and `firefx` components when created on the master sim.

## Usage example
```lua
-- Internally invoked by the game via Prefab() system
local campfire_prefab = require("prefabs/campfirefire")
-- Returns two prefabs: campfirefire and portable_campfirefire
local campfire, portable_campfire = campfire_prefab()
```

## Dependencies & tags
**Components used:** `heater`, `firefx`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `FX` and `HASHEATER` to each generated entity instance.

## Properties
No public properties — this file exports a factory function, not a component class.

## Main functions
### `MakeFire(name, fxlevels, heatlevels)`
*   **Description:** Factory function that constructs a prefab definition for a fire entity with custom fire levels and heat values. It initializes core visual/audio systems, sets up the heater component, and configures the firefx component with the provided level data.
*   **Parameters:**
    *   `name` (string) — The name of the prefab (e.g., `"campfirefire"`).
    *   `fxlevels` (table) — Array of fire level configurations passed to `firefx.levels`.
    *   `heatlevels` (table) — Array of heat values used by `heater` component via `GetHeatFn`.
*   **Returns:** A `Prefab` definition (created via `Prefab(...)`), not an entity instance.
*   **Error states:** None identified. Ensures `master_postinit` callback is called for Quagmire mode if applicable.

## Events & listeners
None identified — this file does not define event listeners or event pushes.

## Notes
- Fire intensity scales with level: radius and sound intensity increase from level 1 to 4 (`firelevels`) or 3 (`portable_firelevels`).
- Lighting uses fixed RGB color: `(255, 255, 192)`.
- Server-only setup includes assigning `heatfn` on the `heater` component to return `heatlevels[level]`.
- The `firefx.usedayparamforsound` flag is set to `true`, indicating time-of-day sounds are handled specially.