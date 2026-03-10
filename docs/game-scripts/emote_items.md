---
id: emote_items
title: Emote Items
description: Defines static metadata and configuration for all emote items available in the game.
tags: [emote, item, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 2c28a818
system_scope: ui
---

# Emote Items

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`emote_items.lua` is an auto-generated data module that defines the complete set of emote items recognized by the game. Each emote entry contains metadata such as rarity, command name, animation keys, sound settings, and skin tagging information. This table (`EMOTE_ITEMS`) is used by the UI, inventory, and client-side systems to validate, display, and execute emotes. It is not a component and is not attached to entities.

## Usage example
```lua
-- Access a specific emote's configuration
local emote_data = EMOTE_ITEMS.emote_dance_step

-- Use its command name for UI labels or chat handling
print(emote_data.cmd_name) -- "step"

-- Check if an emote requires a hat to be equipped
if emote_data.data.needshat then
    -- apply logic for hat-restricted emotes
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Emote entries may include `skin_tags` (e.g., `"LAVA"`, `"EMOTE"`, `"WESTERN"`), which are used internally for UI filtering and item grouping.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `EMOTE_ITEMS` | table | *(see source)* | Global table mapping emote keys (e.g., `emote_dance_step`) to full emote configuration objects. Each object contains keys like `rarity`, `data`, `aliases`, and `release_group`. |

## Main functions
Not applicable. This file defines only a static data structure; no executable functions are present.

## Events & listeners
Not applicable. This file contains no event listeners or event dispatching logic.