---
id: yotb-costumes
title: YOTB Costumes
description: Year of the Beefalo costume definitions and pattern matching system
sidebar_position: 3
slug: game-scripts/core-systems/yotb-costumes
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# YOTB Costumes

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `yotb_costumes` module defines the costume system for Year of the Beefalo (YOTB) events. It contains costume definitions, pattern fragment requirements, category scoring systems, and beefalo skin associations for the sewing system.

## Usage Example

```lua
local costume_data = require("yotb_costumes")

-- Access costume definitions
local war_costume = costume_data.costumes.WAR
print(war_costume.skin_name) -- "WAR"
print(war_costume.prefab_name) -- "war_blueprint"

-- Check costume requirements
local ingredients = {
    ["yotb_pattern_fragment_1"] = 3,
    ["yotb_pattern_fragment_2"] = 1
}
local can_make_war = war_costume.test(ingredients) -- true

-- Access part categories
local head_category = costume_data.parts.beefalo_head_war
print(head_category.FEARSOME) -- 2
```

## Costume Definitions

### Costume Structure

Each costume contains the following properties:

- `test` (function): Function that validates ingredient requirements
- `priority` (number): Crafting priority when multiple recipes are valid
- `time` (number): Base sewing time requirement
- `skins` (table): Array of associated beefalo skin names
- `skin_name` (string): Costume identifier (auto-generated)
- `prefab_name` (string): Blueprint prefab name (auto-generated)

### Available Costumes

#### WAR Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_1` > 1
- `yotb_pattern_fragment_2` ≥ 1

**Properties:**
- Priority: 1
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_war`, `beefalo_body_war`, `beefalo_horn_war`, `beefalo_tail_war`, `beefalo_feet_war`

```lua
local war_test = function(ingredients)
    return ingredients["yotb_pattern_fragment_1"] and ingredients["yotb_pattern_fragment_1"] > 1 and
           ingredients["yotb_pattern_fragment_2"]
end
```

#### DOLL Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_2` > 1
- `yotb_pattern_fragment_3` ≥ 1

**Properties:**
- Priority: 2
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_doll`, `beefalo_body_doll`, `beefalo_horn_doll`, `beefalo_tail_doll`, `beefalo_feet_doll`

#### ROBOT Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_1` > 2

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_robot`, `beefalo_body_robot`, `beefalo_horn_robot`, `beefalo_tail_robot`, `beefalo_feet_robot`

#### NATURE Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_3` > 1
- `yotb_pattern_fragment_2` ≥ 1

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_nature`, `beefalo_body_nature`, `beefalo_horn_nature`, `beefalo_tail_nature`, `beefalo_feet_nature`

#### FORMAL Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_2` > 2

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_formal`, `beefalo_body_formal`, `beefalo_horn_formal`, `beefalo_tail_formal`, `beefalo_feet_formal`

#### VICTORIAN Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_1` ≥ 1
- `yotb_pattern_fragment_2` ≥ 1
- `yotb_pattern_fragment_3` ≥ 1

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_victorian`, `beefalo_body_victorian`, `beefalo_horn_victorian`, `beefalo_tail_victorian`, `beefalo_feet_victorian`

#### ICE Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_1` > 1
- `yotb_pattern_fragment_3` ≥ 1

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_ice`, `beefalo_body_ice`, `beefalo_horn_ice`, `beefalo_tail_ice`, `beefalo_feet_ice`

#### FESTIVE Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_3` > 2

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_festive`, `beefalo_body_festive`, `beefalo_horn_festive`, `beefalo_tail_festive`, `beefalo_feet_festive`

#### BEAST Costume

**Status:** `stable`

**Requirements:**
- `yotb_pattern_fragment_3` > 1
- `yotb_pattern_fragment_1` ≥ 1

**Properties:**
- Priority: 3
- Time: `TUNING.BASE_SEWING_TIME`
- Skins: `beefalo_head_beast`, `beefalo_body_beast`, `beefalo_horn_beast`, `beefalo_tail_beast`, `beefalo_feet_beast`

## Category Scoring System

The module includes a scoring system for different costume categories across three attributes:

### Scoring Categories

- `FEARSOME`: Intimidating/aggressive appearance
- `FESTIVE`: Celebratory/party appearance  
- `FORMAL`: Elegant/sophisticated appearance

### Category Scores

| Costume | FEARSOME | FESTIVE | FORMAL |
|---------|----------|---------|--------|
| WAR | 2 | 0 | 1 |
| DOLL | 0 | 1 | 2 |
| FESTIVE | 0 | 3 | 0 |
| ROBOT | 3 | 0 | 1 |
| NATURE | 0 | 2 | 1 |
| VICTORIAN | 1 | 1 | 1 |
| FORMAL | 0 | 0 | 3 |
| ICE | 2 | 1 | 0 |
| BEAST | 1 | 2 | 0 |
| DEFAULT | 1.5 | 1.5 | 1.5 |

### Example Usage

```lua
local costume_data = require("yotb_costumes")

-- Get category scores for a specific part
local war_head_scores = costume_data.parts.beefalo_head_war
print("War head fearsome score:", war_head_scores.FEARSOME) -- 2
print("War head festive score:", war_head_scores.FESTIVE) -- 0
print("War head formal score:", war_head_scores.FORMAL) -- 1

-- Access category definitions
local war_category = costume_data.categories.WAR
print("War category scores:", war_category.FEARSOME, war_category.FESTIVE, war_category.FORMAL)
```

## Data Structure

### Exported Table

The module returns a table with three main components:

```lua
return {
    costumes = costumes,    -- Costume definitions with test functions
    parts = parts,          -- Part-to-category mapping
    categories = categories -- Category score definitions
}
```

### Parts Mapping

All beefalo parts are mapped to their respective category scores:

```lua
-- Example part mappings
beefalo_head_war = WAR,        -- Maps to WAR category scores
beefalo_body_doll = DOLL,      -- Maps to DOLL category scores
beefalo_horn_robot = ROBOT,    -- Maps to ROBOT category scores
-- ... and so on for all parts
default = DEFAULT,             -- Fallback for unspecified parts
```

## Pattern Fragment Requirements

The costume system uses three types of pattern fragments:

- `yotb_pattern_fragment_1`: Used primarily for WAR, ROBOT, ICE, VICTORIAN, and BEAST costumes
- `yotb_pattern_fragment_2`: Used primarily for DOLL, NATURE, FORMAL, and VICTORIAN costumes  
- `yotb_pattern_fragment_3`: Used primarily for NATURE, VICTORIAN, ICE, FESTIVE, and BEAST costumes

### Fragment Combination Examples

```lua
-- WAR costume (high fragment_1 + some fragment_2)
local war_ingredients = {
    ["yotb_pattern_fragment_1"] = 3,
    ["yotb_pattern_fragment_2"] = 1
}

-- VICTORIAN costume (balanced fragments)
local victorian_ingredients = {
    ["yotb_pattern_fragment_1"] = 1,
    ["yotb_pattern_fragment_2"] = 1,
    ["yotb_pattern_fragment_3"] = 1
}

-- FESTIVE costume (high fragment_3 only)
local festive_ingredients = {
    ["yotb_pattern_fragment_3"] = 3
}
```

## Related Modules

- [YOTB Sewing](./yotb_sewing.md): Uses this costume data for recipe calculation
- [Tuning](./tuning.md): Provides `BASE_SEWING_TIME` constant
- [Beefalo Clothing](./beefalo_clothing.md): Related clothing system for beefalo
