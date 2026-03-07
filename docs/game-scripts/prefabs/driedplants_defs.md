---
id: driedplants_defs
title: Driedplants Defs
description: Defines data for dried plant items, including healing/sanity values and spawn configurations for eating effects.
tags: [food, sanity, healing]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 264c1db0
system_scope: inventory
---

# Driedplants Defs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`driedplants_defs.lua` defines the data structures for dried plant items used in the game’s food system. Each entry specifies properties such as health restoration, sanity impact, and animation/sound assets (`bank` and `build`) to use when the item is consumed. The definitions are collected into a single `plants` table and returned for use by food-related prefabs and crafting recipes.

This file is not an ECS component but a configuration data file — it provides reusable definitions for dried/desiccated plant consumables.

## Usage example
```lua
-- Access dried plant definitions via the returned table
local dried_plants = require "prefabs/driedplants_defs"

-- Example: retrieve the definition for firenettles
local firenettle_def = dried_plants.plants.firenettles_dried
-- Note: Actual key lookup uses the *dried* name variant (see comments in code)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
The module returns a single table with the following top-level structure:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plants` | table of tables | `DRIED_DEFS` | Array of dried plant definition tables. Each table contains optional fields for `name`, `healthvalue`, `sanityvalue`, `bank`, `build`, and `oneaten` callback. |

Each entry in `plants` may include:

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Base name for the dried item (e.g., `"petals"`). Actual prefab names use the suffix `_dried`. |
| `healthvalue` | number | Health restored when eaten (positive or negative). |
| `sanityvalue` | number | Sanity impact when eaten (positive or negative). |
| `bank` | string | Optional SoundBank name override for eating audio. |
| `build` | string | Optional asset build name override for eating visual FX. |
| `oneaten` | function(inst, eater) | Optional callback executed after eating. Receives the eaten item (`inst`) and eater entity (`eater`). |

## Main functions
No functions defined in this file. This is a pure data definition module.

## Events & listeners
Not applicable.