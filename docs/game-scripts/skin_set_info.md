---
id: skin_set_info
title: Skin Set Info
description: A data-only module that maps emote or costume identifiers to lists of associated skin asset names.
tags: [skin, costume, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: d8d942f0
system_scope: entity
---

# Skin Set Info

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`skin_set_info.lua` is a read-only data module that defines collections of skin assets used for character appearance customization. Each key corresponds to a named set (e.g., an emote-based skin pack or holiday theme), and each value is a list of lists of strings, where each inner list contains the filenames (sans extension) of components like `"body_"`, `"legs_"`, `"hand_"`, `"feet_"`, or `"head_"` assets. This file is auto-generated and serves as a registry for modding or UI systems that need to look up associated parts for a given skin set.

## Usage example
```lua
-- Load the skin set definitions
local skin_sets = require "skin_set_info"

-- Retrieve all skins for the "emote_yawn" set
local yawn_skins = skin_sets.emote_yawn  -- e.g., { {"body_pj_purple_mauve", ...} }

-- Iterate over sets and their components
for set_name, parts_lists in pairs(skin_sets) do
    for _, parts in ipairs(parts_lists) do
        -- parts is a list like { "body_pj_purple_mauve", "legs_pj_purple_mauve", ... }
        for _, part in ipairs(parts) do
            print(set_name, part)
        end
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this module returns a static Lua table literal. All entries are defined at module load time.

## Main functions
None — this module has no functions. It is a pure data container returning a table.

## Events & listeners
None identified