---
id: itemmimic_data
title: Itemmimic Data
description: Defines tag constraints and requirements for items that can be mimicked by the Itemmimic entity.
tags: [item, mimic, tags]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e411ed5e
system_scope: entity
---

# Itemmimic Data

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines a configuration table that specifies which tags an item must have (`MUST_TAGS`) and which tags it must *not* have (`CANT_TAGS`) in order to be a valid target for the `itemmimic` prefab. It serves as a data contract used during mimic selection logic to filter valid candidates in the game world.

## Usage example
```lua
-- Typical usage in the itemmimic prefab or related logic:
local ItemmimicData = require("prefabs/itemmimic_data")

local function IsValidMimicTarget(inst)
    for _, tag in ipairs(ItemmimicData.MUST_TAGS) do
        if not inst:HasTag(tag) then
            return false
        end
    end
    for _, tag in ipairs(ItemmimicData.CANT_TAGS) do
        if inst:HasTag(tag) then
            return false
        end
    end
    return true
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:**
- `MUST_TAGS`: `"_equippable"`, `"_inventoryitem"`
- `CANT_TAGS`: `"_container"`, `"_health"`, `"_stackable"`, `"heavy"`, `"smallcreature"`, `"INLIMBO"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MUST_TAGS` | table of strings | `{"_equippable", "_inventoryitem"}` | Tags that a candidate item *must* possess to be considered mimickable. |
| `CANT_TAGS` | table of strings | `{"_container", "_health", "_stackable", "heavy", "smallcreature", "INLIMBO"}` | Tags that a candidate item *must not* possess — presence of any disqualifies the item. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.