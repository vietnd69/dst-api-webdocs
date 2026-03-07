---
id: pillow_defs
title: Pillow Defs
description: Defines configuration data for pillow types, specifying combat and resource yield properties used by pillow prefabs.
tags: [combat, resource, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 931f9404
system_scope: entity
---

# Pillow Defs

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pillow_defs` is a static data definition file that specifies gameplay-relevant properties for different pillow types in the game. Each pillow variant (e.g., `petals`, `kelp`, `beefalowool`, `steelwool`) defines numerical parameters that influence combat effectiveness (via `strengthmult` and `defense_amount`) and resource extraction yields (`hand_prize_value`, `body_prize_value`) during interactions like harvesting or crafting. This file does not implement logic itself but serves as a lookup table consumed by other prefabs or systems (e.g., pillow prefabs, harvesting components, or UI) to configure behavior.

## Usage example
```lua
local pillow_defs = require "pillow_defs"
local pillow = pillow_defs.kelp

print(pillow.strengthmult)  -- 1.4
print(pillow.defense_amount)  -- 0.3
print(pillow.hand_prize_value)  -- 0.5
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `petals.strengthmult` | number | `1.0` | Multiplier applied to damage dealt when using the petal pillow as a weapon. |
| `petals.laglength` | number | `0.75` | Duration (in seconds) of the attack lag after using the petal pillow. |
| `petals.defense_amount` | number | `0.1` | Fraction of damage reduction when equipped (likely as a wearable). |
| `petals.hand_prize_value` | number | `0.25` | Resource yield multiplier when harvesting the pillow by hand. |
| `petals.body_prize_value` | number | `0.25` | Resource yield multiplier when harvesting the pillow via its body (e.g., post-destruction). |
| `kelp.strengthmult`, `kelp.laglength`, `kelp.defense_amount`, `kelp.hand_prize_value`, `kelp.body_prize_value` | number | See `petals` equivalents scaled up | Same as `petals` but for the kelp pillow, with higher values. |
| `beefalowool.strengthmult`, `beefalowool.laglength`, `beefalowool.defense_amount`, `beefalowool.hand_prize_value`, `beefalowool.body_prize_value` | number | See `petals` equivalents scaled up further | Same structure, higher values, for beefalo wool pillow. |
| `steelwool.strengthmult`, `steelwool.laglength`, `steelwool.defense_amount`, `steelwool.hand_prize_value`, `steelwool.body_prize_value` | number | See `petals` equivalents scaled up further | Same structure, highest values, for steel wool pillow. |

## Main functions
None.

## Events & listeners
None.