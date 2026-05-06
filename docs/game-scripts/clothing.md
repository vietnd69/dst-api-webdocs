---
id: clothing
title: Clothing
description: This auto-generated file defines static configuration data for clothing items, including skin attributes, symbol overrides, and sound effects used by the account items system.
tags: [skins, data, inventory, account]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: data_patched
category_type: root
source_hash: 2e68178d
system_scope: inventory
---

# Clothing

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `clothing.lua` script serves as a central repository for static clothing configuration data within Don't Starve Together. Generated automatically by `export_accountitems.lua`, this file does not contain runtime logic but instead defines large dictionaries mapping clothing prefabs to their attributes. These attributes include equipment slot types, skin tags, symbol overrides, tuck behavior, rarity, and release groups. Additionally, it establishes lookup tables for clothing-related sound effects and symbol hide configurations. Other systems query this data to determine how to render skins and apply clothing assets to entities.

## Usage example
```lua
-- Access the global CLOTHING table populated by this file
local clothing_defs = CLOTHING

-- Iterate through definitions to find body slot items
for prefab, config in pairs(clothing_defs) do
    if config.type == "CLOTHING_BODY" then
        -- Retrieve symbol overrides for rendering
        local symbols = config.symbol_overrides
        -- Check rarity for inventory sorting
        if config.rarity == "rare" then
            -- Process rare clothing item
        end
    end
end
```

## Dependencies & tags

**External dependencies:**
- `CLOTHING` -- Referenced to iterate over clothing definitions and collect symbol overrides, symbol_hides, and symbol_in_base_hides into global lookup tables.

**Components used:**
None

**Tags:**
- `CLOTHING_BODY` -- add
- `CLOTHING` -- add
- `CLOTHING_FEET` -- add
- `CLOTHING_HAND` -- add
- `CLOTHING_LEGS` -- add
- `COSTUME` -- add
- `T_UPDATE` -- add
- `ANCIENT` -- add
- `LUNAR` -- add
- `CHEF` -- add
- `FORMAL` -- add
- `SURVIVOR` -- add
- `VICTORIAN` -- add
- `YULE` -- add
- `HALLOWED` -- add
- `STEAMPUNK` -- add
- `WESTERN` -- add
- `MASQUERADE` -- add
- `PIRATE` -- add
- `VARG` -- add
- `SHADOW` -- add
- `ROSE` -- add
- `LAVA` -- add
- `ICE` -- add
- `YOTP` -- add
- `WINTER` -- add
- `YOTH` -- add
- `FOOLS` -- add
- `VALKYRIE` -- add
- `RETRO` -- add
- `CAVE` -- add
- `NEXTKIN` -- add
- `HOCKEY` -- add
- `BOY` -- add
- `HANDMEDOWN` -- add
- `DETECTIVE` -- add
- `FISHERMAN` -- add
- `SPRING` -- add
- `STRONGMAN` -- add
- `ORIGNAL` -- add
- `MINOTAUR` -- add
- `CACTUS` -- add
- `MUSHROOM` -- add
- `PUMPKIN` -- add
- `BARBER` -- add
- `COOK` -- add
- `HAUNTEDDOLL` -- add

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
None

## Events & listeners
None