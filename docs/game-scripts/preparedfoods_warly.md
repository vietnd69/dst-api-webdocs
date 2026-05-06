---
id: preparedfoods_warly
title: Preparedfoods Warly
description: A data configuration file defining Warly's exclusive prepared food recipes with cooking requirements, nutritional values, and consumption effects.
tags: [cooking, food, warly, recipes, config]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: eb9eb19d
system_scope: inventory
---

# Preparedfoods Warly

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`preparedfoods_warly.lua` defines a static table of food recipes exclusive to Warly's Portable Cookpot. Each entry specifies ingredient requirements via a test function, nutritional values (health, hunger, sanity), perish time, cooking duration, and optional consumption effects through `oneatenfn` callbacks. This is a configuration source file — it is not a component and does not attach to entities; it is required by the cooking system to validate and construct prepared food items.

## Usage example
```lua
local PreparedFoodsWarly = require "preparedfoods_warly"
-- Access a food recipe by its key name
local nightmarepie = PreparedFoodsWarly.nightmarepie
print(nightmarepie.name)           -- "nightmarepie"
print(nightmarepie.health)         -- TUNING.HEALING_TINY
print(nightmarepie.priority)       -- 30
print(nightmarepie.cookbook_category) -- "portablecookpot"
-- Check if ingredients match the recipe
local matches = nightmarepie.test(cooker, names, tags)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- global balance constants for healing, calories, sanity, perish times, temperatures
- `STRINGS` -- localization strings for food effect descriptions
- `FOODTYPE` -- food type enumeration (VEGGIE, MEAT, GOODIES, MONSTER)

**Components used:**
- `health` -- accessed in oneatenfn for DoDelta, GetPercent, currenthealth, maxhealth
- `sanity` -- accessed in oneatenfn for DoDelta, GetPercent, current, max
- `oldager` -- checked for nil in nightmarepie oneatenfn
- `spell` -- accessed in glowberrymousse oneatenfn for OnFinish, ResumeSpell, SetTarget, StartSpell, lifetime, target

**Tags:**
- `masterfood` -- added to most food entries
- `unsafefood` -- added to nightmarepie
- `monstermeat` -- added to monstertartare
- `fooddrink` -- added to gazpacho

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foods` | table | — | Top-level table containing all food recipe definitions keyed by recipe name. |
| `test` | function | — | Function that validates if given ingredients match this recipe; receives cooker, names, and tags parameters. |
| `priority` | number | 30 | Recipe priority for matching; higher values take precedence when multiple recipes could match. |
| `foodtype` | enum | — | Primary food type from FOODTYPE enumeration (VEGGIE, MEAT, GOODIES, MONSTER). |
| `secondaryfoodtype` | enum | nil | Optional secondary food type for foods with multiple classifications. |
| `health` | number | — | Health value granted or deducted on consumption; can be negative. |
| `hunger` | number | — | Hunger calories granted on consumption. |
| `sanity` | number | — | Sanity value granted or deducted on consumption; can be negative. |
| `perishtime` | number | — | Time in seconds before the food spoils. |
| `cooktime` | number | — | Time in seconds required to cook this recipe. |
| `potlevel` | string | "low" | Required cookpot tier; "low" or "high". |
| `tags` | table | — | Array of tag strings applied to the resulting food item. |
| `prefabs` | table | nil | Array of prefab names to spawn as buffs on consumption. |
| `oneat_desc` | string | — | Localization key for the food effect description shown in cookbook. |
| `oneatenfn` | function | nil | Callback function executed when food is consumed; receives inst and eater parameters. |
| `floater` | table | — | Animation float parameters for the food item display. |
| `temperature` | number | nil | Temperature bonus applied on consumption (hot or cold). |
| `temperatureduration` | number | nil | Duration of temperature bonus in seconds. |
| `nochill` | boolean | nil | If true, prevents the food from being chilled. |
| `chargevalue` | number | nil | Electric charge value for WX-78 related foods. |
| `name` | string | — | Recipe name key; auto-assigned during initialization loop. |
| `weight` | number | 1 | Recipe weight for selection; auto-assigned if not specified. |
| `cookbook_category` | string | "portablecookpot" | Category identifier for cookbook UI organization; auto-assigned during initialization. |

## Main functions
### `test(cooker, names, tags)`
* **Description:** Validates whether the provided ingredients match this recipe's requirements. Called by the cooking system to determine if a recipe can be produced.
* **Parameters:**
  - `cooker` -- cooking entity instance (e.g., cookpot)
  - `names` -- table of ingredient prefab names with counts
  - `tags` -- table of ingredient tags with counts
* **Returns:** `boolean` -- true if ingredients match recipe requirements, false otherwise.
* **Error states:** None

### `oneatenfn(inst, eater)`
* **Description:** Callback function executed when a player consumes this food. Applies special effects beyond standard stat changes (e.g., buffs, health/sanity swaps, light effects).
* **Parameters:**
  - `inst` -- the food item entity being consumed
  - `eater` -- the player entity consuming the food
* **Returns:** None
* **Error states:** Errors if eater lacks required components (health, sanity, spell) that the callback attempts to access without nil checks.

## Events & listeners
None.