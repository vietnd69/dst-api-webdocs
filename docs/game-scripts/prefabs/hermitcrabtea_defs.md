---
id: hermitcrabtea_defs
title: Hermitcrabtea Defs
description: Defines tea ingredients and their associated buffs for the Hermit Crab Teapot prefab.
tags: [hermitcrab, tea, buff, sanity, health]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 50f2494d
system_scope: entity
---

# Hermitcrabtea_defs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`hermitcrabtea_defs.lua` is a data-defines file that declares two central tables: `TEA_DEFS` and `BUFF_DEFS`.  
- `TEA_DEFS` specifies the properties of each tea ingredient (e.g., `petals`, `tillweed`), including the resulting buff name, sanity/health/temperature effects.  
- `BUFF_DEFS` defines how each buff behaves over time (e.g., periodic delta application, aura modifiers, event listeners) via `onattachedfn`, `onextendedfn`, and `ondetachedfn` hooks.  

This file does *not* implement an ECS component itself. Instead, it serves as a configuration table factory consumed elsewhere (e.g., `hermitcrabtea.lua`) to instantiate and manage Hermit Crab Teapot tea variants and their associated debuffs/buffs.

The file references and interacts with the `debuff`, `health`, and `sanity` components via direct calls to `DoDelta()` and aura modifier APIs.

## Usage example
This file is not used directly. It returns a table `{ teas = ..., buffs = ... }` for use by the teapot prefab:

```lua
local TEA_DEFS = require "prefabs/hermitcrabtea_defs"
-- Typically consumed by the teapot prefab as:
-- local teas = TEA_DEFS.teas
-- local buffs = TEA_DEFS.buffs
```

## Dependencies & tags
**Components used:**  
- `debuff` (`inst.components.debuff:Stop()`)  
- `health` (`target.components.health:DoDelta(...)`)  
- `sanity` (`target.components.sanity:DoDelta(...)`, `neg_aura_modifiers`)  

**Tags:**  
- Checks: `playerghost`, `shadowsubmissive`  
- No tags are added/removed directly by this file.

## Properties
No public properties. The file returns a single table with two keys: `teas` (an array of tea definitions) and `buffs` (an array of buff definitions). Each entry is a plain Lua table with static data.

## Main functions
No public functions are exported. All logic is embedded in locally scoped functions (`Petals_OnTick`, `Tillweed_OnTick`, etc.) used by the `onattachedfn` hooks of the `buffs` table.

## Events & listeners
This file defines the following event callbacks used inside buff `onattachedfn`/`ondetachedfn` hooks:
- `attacked` — listened on `target` by the `moon_tree_blossom` buff; triggers `MoonBlossom_OnAttacked`.  
- Buff durations and tick rates are controlled via `inst:DoPeriodicTask()` and `inst.task:Cancel()` — not standard DST events.
