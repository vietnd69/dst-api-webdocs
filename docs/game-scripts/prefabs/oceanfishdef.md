---
id: oceanfishdef
title: Oceanfishdef
description: Defines static configuration data for ocean fish species, including behavior, loot, diet, and school spawning weights.
tags: [fishing, world, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: edfea82b
system_scope: world
---

# Oceanfishdef

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanfishdef.lua` is a configuration data module—not a component—that defines all ocean fish species in the game. It contains static definitions for fish properties (e.g., speed, stamina behavior, loot tables, diet, and cooking outcomes) and school-level spawning weights across water types and seasons. It is referenced by the fishing and world generation systems to instantiate and populate ocean entities.

This file does not contain a component class or `Class(function(self, inst) ... end)` constructor. It is a pure data definition module that returns a table used by other systems.

## Usage example
```lua
local oceanfishdef = require "prefabs/oceanfishdef"

-- Access fish definition
local def = oceanfishdef.fish.oceanfish_small_1
print(def.prefab) -- "oceanfish_small_1"
print(def.diet.caneat[1]) -- FOODGROUP.OMNI

-- Trigger seasonal/event overrides (e.g., Year of the YOT)
oceanfishdef.SpecialEventSetup()
```

## Dependencies & tags
**Components used:** None directly—this file provides data consumed by *other* components (e.g., `fishing`, `lootdropper`, `cookable`). The only external API usage is `inst.components.lootdropper:SpawnLootPrefab()` in the `oncooked_fn` hook.

**Tags:** None identified.

## Properties
No public properties exist in the component sense. This file exports the following top-level tables:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fish` | table | `FISH_DEFS` | Map of fish prefabs (e.g., `oceanfish_small_1`) to their full definition tables (includes stats, loot, diet, etc.). |
| `school` | table | `SCHOOL_WEIGHTS` | Nested table mapping `season` → `water_tile_type` → `{ [prefab] = weight }` for spawning schools. |
| `SpecialEventSetup` | function | Defined inline | Function that modifies `FISH_DEFS` and `SCHOOL_WEIGHTS` during special events (e.g., Year of the YOT). |

## Main functions
No public methods exist for modders to call directly. The file exports a single callable function:

### `SpecialEventSetup()`
* **Description:** Applies seasonal and event-specific overrides to fish definitions and spawning weights. For example, modifies `oceanfish_medium_6` and `oceanfish_medium_7` to drop extra `lucky_goldnugget`s when cooked during the Year of the YOT.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Modifies global data (`FISH_DEFS`, `SCHOOL_WEIGHTS`) in-place; must be called *after* initial data definition.

## Events & listeners
Not applicable.

## Data schema reference
Each entry in `FISH_DEFS` (e.g., `oceanfish_small_1`) is a table with the following key fields:

| Key | Type | Description |
|-----|------|-------------|
| `prefab`, `bank`, `build` | string | Prefab name, animation bank, and build (appearance) name. |
| `weight_min`, `weight_max` | number | Weight range (used for rarity/selection). |
| `walkspeed`, `runspeed` | number | Movement speeds. |
| `stamina` | table | Contains `drain_rate`, `recover_rate`, `struggle_times`, `tired_times`, `tiredout_angles` (governs fish-fighting behavior during angling). |
| `schoolmin`, `schoolmax` | number | Min/max fish count per school. |
| `schoolrange` | number | Area radius for school spread. |
| `schoollifetimemin`, `schoollifetimemax` | number | School existence time (in game ticks). |
| `herdwandermin`, `herdwandermax` | number | Max wandering distance from school center. |
| `herdarrivedist` | number | Distance threshold to stop wandering and rejoin school. |
| `herdwanderdelaymin`, `herdwanderdelaymax` | number | Delay before wander movement starts. |
| `set_hook_time` | table | `{ base = number, var = number }` → hook window before fish escapes. |
| `breach_fx` | table | Array of prebuilt FX strings (e.g., `"ocean_splash_small1"`). |
| `loot`, `heavy_loot`, `cooking_product`, `perish_product` | table | Loot tables for raw catch, heavy catch, cooked product, and spoiling. |
| `fishtype` | string | `"meat"` or `"veggie"`; affects cooking yields. |
| `lures` | number | Preference mask (e.g., `OCEANFISH_LURE_PREFERENCE.SMALL_OMNI`). |
| `diet` | table | `{ caneat = { FOODGROUP... } }` for AI feeding behavior. |
| `cooker_ingredient_value` | table | Cooking value `{ meat = N, fish = N, veggie = N, frozen = N }`. |
| `edible_values` | table | `{ health = N, hunger = N, sanity = N, foodtype = FOODTYPE... }`. |
| `dynamic_shadow` | table | `{ x_scale, y_scale }` for fish shadow. |
| `heater`, `propagator`, `light`, `firesuppressant`, `luckitem` | optional | Special properties (e.g., heat generation, light emission, fire suppression, luck bonus). |