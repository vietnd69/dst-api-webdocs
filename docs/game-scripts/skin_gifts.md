---
id: skin_gifts
title: Skin Gifts
description: A data configuration file mapping skin item names to gift types and defining popup display data for each gift category.
tags: [skins, gifts, configuration, inventory, ui]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 3a82162e
system_scope: inventory
---

# Skin Gifts

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`skin_gifts.lua` is a data configuration file that defines the relationship between skin items and their gift type categories. It contains two main tables: `SKIN_GIFT_TYPES` maps individual skin item names to gift type identifiers, and `SKIN_GIFT_POPUPDATA` defines the visual presentation data (atlas, image, title offset) for each gift type popup. This file is auto-generated and is required by systems that need to display gift acquisition notifications or validate skin gift categories. It is not a component and does not attach to entities.

## Usage example
```lua
local SkinGifts = require "skin_gifts"

-- Look up the gift type for a specific skin item
local giftType = SkinGifts.types["lantern_crystal"]
print(giftType) -- "TWITCH_DROP"

-- Access popup display data for a gift type
local popupData = SkinGifts.popupdata["TWITCH_DROP"]
print(popupData.atlas) -- "images/thankyou_twitch.xml"
print(popupData.image) -- "twitch.tex"
```

## Dependencies & tags
**Components used:** None identified
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `types` | table | — | Table mapping skin item prefab names to gift type string identifiers. |
| `popupdata` | table | — | Table mapping gift type identifiers to popup display configuration tables. |
| `types[item_name]` | string | — | Gift type identifier for a specific skin item (e.g., `"TWITCH_DROP"`, `"CUPID"`, `"WINTER"`). |
| `popupdata[type].atlas` | string | — | Path to the atlas XML file for the gift type popup image. |
| `popupdata[type].image` | string | — | Name of the texture file within the atlas for the gift type popup. |
| `popupdata[type].titleoffset` | table | `{0, -20, 0}` | Three-element table defining X, Y, Z offset for the popup title text. |
| `popupdata[type].title_size` | number | — | Optional font size override for the popup title (not present for all types). |

## Main functions
No functions are defined in this file. It exports static data tables only.

## Events & listeners
None.