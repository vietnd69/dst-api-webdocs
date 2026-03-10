---
id: preparedfoods_warly
title: Preparedfoods Warly
description: Defines special cooked food recipes for Warly's portable cookpot that grant unique or unusual effects when consumed.
tags: [cooking, food, effects, warly]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 53333f4b
system_scope: crafting
---

# Preparedfoods Warly

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`preparedfoods_warly.lua` defines a table of special prepared food recipes intended for use with Warly's portable cookpot. Each entry specifies validation criteria (`test` function), nutritional stats (`health`, `hunger`, `sanity`, `perishtime`), and optional consumption-side effects (`oneatenfn`). Effects include swapping health and sanity (e.g., `nightmarepie`), granting debuffs (`voltgoatjelly`, `frogfishbowl`), spawning permanent light sources (`glowberrymousse`), and modifying body temperature (`dragonchilisalad`, `gazpacho`). These foods are designated with the `"masterfood"` tag and are made accessible through the `"portablecookpot"` cookbook category.

## Usage example
```lua
-- Sample usage: add to a pot recipe system
local preparedfoods = require("prepreparedfoods_warly")
for name, data in pairs(preparedfoods) do
    -- Typically registered in a larger cooking table or validated via data.test()
    print("Food:", name, "Priority:", data.priority)
end
```

## Dependencies & tags
**Components used:** `health`, `sanity`, `spell`, `oldager`  
**Tags added per food:** `"masterfood"`, `"unsafefood"` (nightmarepie only), `"monstermeat"` (monstertartare only), `"fooddrink"` (gazpacho only). Individual foods may specify `"primaryfood"` or `"secondaryfoodtype"` based on `foodtype` and `secondaryfoodtype`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | Recipe key (`k`) | Internal recipe identifier assigned at runtime. |
| `weight` | number | `1` | Relative weighting for random selection (used by the cooking system). |
| `priority` | number | `0` | Higher-priority recipes take precedence during conflict resolution. |
| `foodtype` | FOODTYPE enum | Required | Classification (e.g., `VEGGIE`, `MEAT`, `GOODIES`). |
| `secondaryfoodtype` | FOODTYPE enum | `nil` | Secondary classification (e.g., `MONSTER`). |
| `health` | number | Required | Change to eater's health on consumption. |
| `hunger` | number | Required | Change to eater's hunger on consumption. |
| `sanity` | number | `0` | Change to eater's sanity on consumption. |
| `temperature` | number | `nil` | Bonus temperature applied on consumption. |
| `temperatureduration` | number | `nil` | Duration (in seconds) of the temperature bonus. |
| `perishtime` | number | Required | Time until the prepared food spoils. |
| `cooktime` | number | Required | Time required to cook the recipe (seconds). |
| `potlevel` | string or nil | `"low"` | Required pot tier (`"low"`, `"high"`, or `"high"`). |
| `nochill` | boolean or nil | `nil` | If `true`, prevents chilling while held. |
| `prefabs` | table | `{}` | Prefab names to spawn or attach to eater on consumption (e.g., debuff or light entities). |
| `tags` | table | `{}` | Tags applied to the food item itself (e.g., `"masterfood"`). |
| `floater` | table or nil | `{nil, 0.1}` | Position offset for the food item's floating animation. |
| `oneat_desc` | string or nil | `nil` | Localization key for in-ui description of consumption effect. |

## Main functions
This file returns a table of recipes; it does not define any stand-alone functions beyond recipe validators (`test`) and consumption callbacks (`oneatenfn`). All per-recipe logic is contained in the `oneatenfn` handlers.

## Events & listeners
None. The component itself does not listen for or emit game events directly. Side effects are implemented via component methods (`DoDelta`, `AddDebuff`, `Spell` APIs) called within `oneatenfn`.