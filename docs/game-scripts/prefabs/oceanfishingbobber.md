---
id: oceanfishingbobber
title: Oceanfishingbobber
description: Defines prefabs for ocean fishing bobbers used in the Turn of the Tides fishing system, including projectile, floater, and inventory item variants.
tags: [fishing, projectile, environment, inventory]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 12a3f8ee
system_scope: environment
---

# Oceanfishingbobber

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanfishingbobber.lua` defines the prefabs and factory functions for ocean fishing bobbers in the DST Turn of the Tides mod. It instantiates three distinct entity types per bobber: a **projectile** (thrown when casting), a **floater** (remains on the water surface during fishing), and optionally an **inventory item** (used as tackle). It integrates with the `complexprojectile`, `oceanfishable`, and `oceanfishinghook` components to manage bobber deployment, hook interaction, and reel mechanics. The bobber definitions are centralized in the `BOBBERS` table, which maps bobber names to visual, audio, and tackle metadata.

## Usage example
```lua
-- Spawn a bobber projectile when casting a fishing rod
local bobber = SpawnPrefab("oceanfishingbobber_twig_projectile")
-- Internally, this prefab uses projectile_fn(), which:
--   - Sets up a complexprojectile component with OnProjectileLand as the on-hit handler
--   - Adds oceanfishable and registers OnSetRod as the on-set-rod callback
-- When the projectile lands in water, OnProjectileLand spawns the floater and links it to the rod

-- Spawn a bobber floater (e.g., manually or via custom logic)
local floater = SpawnPrefab("oceanfishingbobber_plug_floater")
-- Internally, this uses floater_fn(), which:
--   - Adds oceanfishable (with catch_distance and overrideunreelratefn callbacks)
--   - Adds oceanfishinghook (with onwallupdate for reel physics)
```

## Dependencies & tags
**Components used:** `complexprojectile`, `oceanfishable`, `oceanfishinghook`, `inspectable`, `inventoryitem`, `oceanfishingtackle`, `stackable`, `physics`, `animstate`, `soundemitter`, `transform`, `network`.

**Tags:** `projectile`, `complexprojectile`, `NOCLICK`, `fishinghook`, `oceanfishing_bobber`, `cattoy`, `CLASSIFIED`, `FX`. Also conditionally adds/removes `oceanfishing_catchable` on the floater via `oceanfishable:SetRod`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bobber_def` | table | `nil` (assigned in floater_fn) | Stores bobber configuration from `BOBBERS` (e.g., `land_splash_fx`, `oneat_sfx`, `casting_data`). Only present on floater entities. |
| `_floater_prefab` | string | `nil` (assigned in projectile_fn) | Prefab name of the corresponding floater, e.g., `"oceanfishingbobber_twig_floater"`. Only present on projectile entities. |

## Main functions
Not applicable. This file is a **prefab definition factory**, not a component. It returns a list of `Prefab` entries. The core functions (`projectile_fn`, `floater_fn`, `item_fn`, `ripple_fn`) are used internally by `Prefab(...)` constructors and are not meant to be called directly.

## Events & listeners
- **Listens to (projectile):** None directly. The `OnProjectileLand` callback is invoked internally by `complexprojectile` when the projectile hits a surface.
- **Pushes (floater):**
  - `startfishinginvirtualocean` — Pushed on the `virtualoceanent` entity when a bobber spawns in a virtual ocean area (during casting).
- **Pushes (projectile via callback):**
  - `oceanfishing_stoppedfishing` — Triggered on the `fisher` and `target` when `StopFishing("badcast")` is called (e.g., on invalid cast).
  - Internally, `OnSetRod` removes the floater if `rod == nil`.
- **Pushes (floater via callback):**
  - `oceanfishing_stoppedfishing` — Triggered via `rod.components.oceanfishingrod:StopFishing(...)`.

(None of the event handlers in this file directly push events themselves — they delegate to component callbacks or prefab spawn logic.)

