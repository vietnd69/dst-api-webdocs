---
id: preparedfoods
title: Preparedfoods
description: Defines prepared food recipes and their nutritional, status-effect, and inventory behavior in DST.
tags: [crafting, inventory, food, status-effects, multiplayer]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 4ce0bbe3
system_scope: crafting
---

# Preparedfoods

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `preparedfoods` file defines a collection of prepared food prefabs and their associated properties—such as nutrition values, effect duration, and special status triggers—within DST's crafting system. It specifies how each recipe behaves upon consumption or storage, including integration with core components like health, grogginess, and sleeper, and manages in-inventory behaviors like learnable cookbook stats.

## Usage example
```lua
-- Example of adding a custom prepared food that applies grogginess
inst:AddComponent("food")
inst.components.food:SetHealthMultiplier(1)
inst.components.food:SetHungerMultiplier(1)
inst.components.food:SetSanityMultiplier(0)
inst.components.food:AddTag("honeyed")
inst.components.food:AddTag("monstermeat")
inst.components.food:SetEffectFunction(function(eater)
    if eater.components.grogginess then
        eater.components.grogginess:AddGrogginess(5, 10)
    end
end)
```

## Dependencies & tags
**Components used:**
- `components/grogginess` — used in `shroomcake` and `beefalotreat`; calls `ResetGrogginess()` and `AddGrogginess()` respectively
- `components/health` — used in `shroomcake`; calls `IsDead()` to check eater state
- `components/sleeper` — used in `beefalotreat`; calls `AddSleepiness()`

**Tags:**
- `honeyed`: applied to `taffy`, `pumpkincookie`, `honynuggets`, `honeyham`, `powcake`, `jellybean`
- `catfood`: applied to `fishsticks`
- `monstermeat`: applied to `monsterlasagna`
- `donotautopick`: applied to `powcake`
- `fooddrink`: applied to `vegstinger`, `frozenbananadaiquiri`, `bananajuice`, `sweettea`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipe` | table | `nil` | Per-recipe configuration, including `ingredients`, `components` (health, hunger, sanity), `tags`, and `recipefilterfn` (optional) |
| `prefab` | string | `nil` | The prefab name associated with the food (e.g., `beefalotreat`) |
| `effectfn` | function | `nil` | Optional custom logic executed on consumption (e.g., status application, conditional checks) |

## Main functions
No top-level or exported functions are defined in this file. All logic resides in recipe-level `effectfn` fields and inventory hooks.

## Events & listeners
**Pushes:**
- `learncookbookstats`: Fired when `beefalofeed` or `beefalotreat` recipes are placed in a player’s inventory. Triggers UI updates and stat tracking for the associated cookbook entry.
**Listens to:** None (no explicit listeners are defined in this file).