---
id: skin_gifts
title: Skin Gifts
description: Provides static lookup tables mapping skin item prefabs to their associated gift event types and configuring visual popup data for gift notifications.
tags: [ui, inventory, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3e4f3215
system_scope: ui
---

# Skin Gifts

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`skin_gifts.lua` is a data module that defines two core lookup structures: `SKIN_GIFT_TYPES` maps skin item prefab names to their associated gift event categories (e.g., `"TWITCH_DROP"`, `"CUPID"`), and `SKIN_GIFT_POPUPDATA` defines the visual configuration for gift-related UI popups (including atlas, image, and title offset values). This module is not a component but a configuration data module intended to be `require`d elsewhere (e.g., by UI or item logic) to standardize how gift items are categorized and displayed.

## Usage example
```lua
local skin_gifts = require "skin_gifts"

-- Look up the gift type for a given skin item
local gift_type = skin_gifts.types["torch_nautical"] -- returns "TWITCH_DROP"

-- Retrieve popup data for a gift type
local popup_config = skin_gifts.popupdata["CUPID"]
-- Returns atlas, image, and titleoffset values for Cupid-themed gifts
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `types` | table | (see source) | Map of skin item prefab names (strings) to gift event type identifiers (strings), e.g., `"TWITCH_DROP"` or `"CUPID"`. |
| `popupdata` | table | (see source) | Map of gift event type identifiers to visual configuration tables (each with `atlas`, `image`, and `titleoffset` keys; some include `title_size`). |

## Main functions
Not applicable

## Events & listeners
Not applicable