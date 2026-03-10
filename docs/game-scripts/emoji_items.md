---
id: emoji_items
title: Emoji Items
description: Defines a global lookup table of emoji item definitions with metadata for in-game use.
tags: [inventory, network, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f01694c8
system_scope: inventory
---

# Emoji Items

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`EMOJI_ITEMS` is a globally defined Lua table that contains static configuration data for all emoji unlockable items in the game. Each entry maps a unique key (e.g., `emoji_abigail`) to a set of metadata fields, including rarity, skin tags, input name, UTF-8 character, and release group. This data is used for inventory management, client-side rendering, and server-side validation but does not implement any functional logic or component behavior itself.

## Usage example
```lua
-- Retrieve an emoji item definition by key
local abigail_emoji = EMOJI_ITEMS.emoji_abigail
print(abigail_emoji.data.utf8_str) -- Outputs: 󰀜
print(abigail_emoji.rarity)        -- Outputs: Common

-- Iterate over all emoji items
for key, item in pairs(EMOJI_ITEMS) do
    print(key, item.data.item_type, item.data.utf8_str)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Each item entry defines custom skin tags in `skin_tags`, including `"VICTORIAN"`, `"EMOJI"`, `"LAVA"`, and `"VARG"` — used for categorization and filtering.

## Properties
No public properties are defined for this module; it is a read-only table.

## Main functions
No functions are defined; this file exports only data.

## Events & listeners
Not applicable.