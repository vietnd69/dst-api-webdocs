---
id: blockersets
title: Blockersets
description: Defines named collections of entity prefabs used as environmental blockers across different biomes and difficulty tiers in map generation.
tags: [map, environment, generation]
sidebar_position: 100

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 0f732ba3
---

# Blockersets

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`blockersets.lua` is a static data module that defines groupings of entity prefabs used as natural and structured environmental obstacles during world generation. It organizes blockers into categories based on threat level (`easy`/`hard`), creature type (e.g., `spiders`, `bees`, `hounds`), terrain biomes (e.g., `forest`, `marsh`, `rocky`), and special seasonal variants. These sets are consumed by map generation systems to determine which prefabs can appear as placed obstacles in specific contexts.

The component is not an ECS component—it is a plain Lua table (`sets`) exported at module load time and referenced directly via `require("map/blockersets")`. It has no runtime entity association, no component instantiation, and no event system.

## Usage example

```lua
local blockersets = require("map/blockersets")

-- Select an appropriate set for forest difficulty
local forest_blockers = math.random() > 0.5 and blockersets.forest_easy or blockersets.forest_hard

-- Pick a random blocker from the chosen set
local random_blocker = forest_blockers[ math.random(#forest_blockers) ]
-- random_blocker now holds a string like "SpiderfieldEasyA" or "PigGuardpost"
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sets.walls_easy` | `table<string>` | `{"DenseRocks", "InsanityWall"}` | Wall prefabs suitable for low-difficulty placement. |
| `sets.walls_hard` | `table<string>` | `{"SanityWall"}` | Wall prefabs suitable for high-difficulty placement. |
| `sets.all_walls` | `table<string>` | Union of `walls_easy` and `walls_hard` | Combined wall blockers. |
| `sets.chess_easy` | `table<string>` | `{}` | No chess-field blockers in easy mode. |
| `sets.chess_hard` | `table<string>` | `{"Chessfield","ChessfieldA","ChessfieldB","ChessfieldC"}` | Hard-mode chess-field blocker prefabs. |
| `sets.all_chess` | `table<string>` | Union of `chess_easy` and `chess_hard` | All chess-field blockers. |
| `sets.tallbirds_easy` | `table<string>` | `{"TallbirdfieldSmallA","Tallbirdfield"}` | Easy-mode tallbird field blockers. |
| `sets.tallbirds_hard` | `table<string>` | `{"TallbirdfieldA","TallbirdfieldB"}` | Hard-mode tallbird field blockers. |
| `sets.all_tallbirds` | `table<string>` | Union of `tallbirds_easy` and `tallbirds_hard` | All tallbird blockers. |
| `sets.spiders_easy` | `table<string>` | `{"SpiderfieldEasy","SpiderfieldEasyA","SpiderfieldEasyB"}` | Easy-mode spider field blockers. |
| `sets.spiders_hard` | `table<string>` | `{"Spiderfield","SpiderfieldA","SpiderfieldB","SpiderfieldC"}` | Hard-mode spider field blockers. |
| `sets.all_spiders` | `table<string>` | Union of `spiders_easy` and `spiders_hard` | All spider blockers. |
| `sets.bees_easy` | `table<string>` | `{"Waspnests"}` | Easy-mode wasp nest blockers. |
| `sets.bees_hard` | `table<string>` | `{}` | No hard-mode bee/wasp blockers defined. |
| `sets.all_bees` | `table<string>` | Union of `bees_easy` and `bees_hard` | All bee/wasp blockers. |
| `sets.pigs_easy` | `table<string>` | `{"PigGuardpostEasy"}` | Easy-mode pig guardpost blockers. |
| `sets.pigs_hard` | `table<string>` | `{"PigGuardpost","PigGuardpostB"}` | Hard-mode pig guardpost blockers. |
| `sets.all_pigs` | `table<string>` | Union of `pigs_easy` and `pigs_hard` | All pig-related blockers. |
| `sets.tentacles_easy` | `table<string>` | `{"TentaclelandSmallA"}` | Easy-mode tentacle field blockers. |
| `sets.tentacles_hard` | `table<string>` | `{"TentaclelandA","Tentacleland"}` | Hard-mode tentacle field blockers. |
| `sets.all_tentacles` | `table<string>` | Union of `tentacles_easy` and `tentacles_hard` | All tentacle blockers. |
| `sets.merms_easy` | `table<string>` | `{}` | No easy-mode merm blockers defined. |
| `sets.merms_hard` | `table<string>` | `{"Mermfield"}` | Hard-mode merm blockers. |
| `sets.all_merms` | `table<string>` | Union of `merms_easy` and `merms_hard` | All merm blockers. |
| `sets.hounds_easy` | `table<string>` | `{}` | No easy-mode hound blockers defined. |
| `sets.hounds_hard` | `table<string>` | `{"Moundfield"}` | Hard-mode hound mound blockers. |
| `sets.all_hounds` | `table<string>` | Union of `hounds_easy` and `hounds_hard` | All hound blockers. |
| `sets.forest_easy` | `table<string>` | Union of `spiders_easy` and `pigs_easy` | Forest-specific easy blockers. |
| `sets.forest_hard` | `table<string>` | Union of `spiders_hard` and `pigs_hard` | Forest-specific hard blockers. |
| `sets.all_forest` | `table<string>` | Union of `forest_easy` and `forest_hard` | All forest blockers. |
| `sets.rocky_easy` | `table<string>` | Union of `tallbirds_easy`, `pigs_easy`, and `hounds_easy` | Rocky terrain easy blockers. |
| `sets.rocky_hard` | `table<string>` | Union of `tallbirds_hard`, `pigs_hard`, and `hounds_hard` | Rocky terrain hard blockers. |
| `sets.all_rocky` | `table<string>` | Union of `rocky_easy` and `rocky_hard` | All rocky terrain blockers. |
| `sets.grass_easy` | `table<string>` | Union of `bees_easy` and `pigs_easy` | Grass terrain easy blockers. |
| `sets.grass_hard` | `table<string>` | Union of `bees_hard` and `pigs_hard` | Grass terrain hard blockers. |
| `sets.all_grass` | `table<string>` | Union of `grass_easy` and `grass_hard` | All grass terrain blockers. |
| `sets.marsh_easy` | `table<string>` | Union of `tentacles_easy` and `merms_easy` | Marsh terrain easy blockers. |
| `sets.marsh_hard` | `table<string>` | Union of `tentacles_hard` and `merms_hard` | Marsh terrain hard blockers. |
| `sets.all_marsh` | `table<string>` | Union of `marsh_easy` and `marsh_hard` | All marsh terrain blockers. |
| `sets.winter_hard` | `table<string>` | `{"Deerclopsfield","Walrusfield"}` | Special winter hard-mode blockers. |
| `sets.all_easy` | `table<string>` | Union of `pigs_easy`, `spiders_easy`, `tallbirds_easy`, `chess_easy`, `tentacles_easy`, `walls_hard` | Combined easy-mode blockers across all categories. |
| `sets.all_hard` | `table<string>` | Union of `pigs_hard`, `spiders_hard`, `tallbirds_hard`, `chess_hard`, `tentacles_hard`, `walls_hard` | Combined hard-mode blockers across all categories. |
| `sets.all` | `table<string>` | Union of `all_easy` and `all_hard` | Generic catch-all set excluding seasonal/special cases. |
| `sets.all_hard_winter` | `table<string>` | Union of `all_hard` and `winter_hard` | Hard-mode blockers including special winter content. |

## Main functions
There are no callable functions in this module. It exports only static data tables.

## Events & listeners
None. This module is data-only and does not participate in the event system.