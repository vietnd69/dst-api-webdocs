---
id: skin_gifts
title: Skin Gifts
description: A static data configuration file mapping skin prefab names to gift type identifiers and defining popup display metadata for each gift category.
tags: [config, data, skins, ui]
sidebar_position: 10
last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 264fc765
system_scope: ui
---

# Skin Gifts

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`skin_gifts.lua` defines a static data configuration table used by the skin and account item systems to determine gift type classifications and popup display metadata. The file exports two main data structures: `SKIN_GIFT_TYPES` maps individual skin prefab names to their gift category identifier, and `SKIN_GIFT_POPUPDATA` defines the visual configuration (atlas, texture, title offset) for each gift category popup. This is a configuration source file — it is not a component and does not attach to entities; it is required by UI systems that need to resolve gift display information.

## Usage example
```lua
local SkinGifts = require "skin_gifts"

-- Access gift type for a specific skin prefab
local giftType = SkinGifts.types["lantern_crystal"]
print(giftType)  -- "TWITCH_DROP"

-- Access popup display configuration for a gift category
local popupConfig = SkinGifts.popupdata["TWITCH_DROP"]
print(popupConfig.atlas)   -- "images/thankyou_twitch.xml"
print(popupConfig.image)   -- "twitch.tex"
print(popupConfig.titleoffset)  -- {0, -20, 0}
```

## Dependencies & tags
**External dependencies:** None identified

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `types` | table | — | String-keyed table mapping skin prefab names to gift type category identifiers. |
| `types.<prefab_name>` | string | — | Gift type identifier for a specific skin prefab (e.g., `"TWITCH_DROP"`, `"CUPID"`, `"WINTER"`). |
| `popupdata` | table | — | String-keyed table mapping gift type categories to popup display configuration tables. |
| `popupdata.<gift_type>.atlas` | string | — | Path to the atlas XML file for the popup background image (e.g., `"images/thankyou_twitch.xml"`). |
| `popupdata.<gift_type>.image` | string | — | Texture name within the atlas for the popup icon (e.g., `"twitch.tex"`). |
| `popupdata.<gift_type>.titleoffset` | table | — | Three-element array `{x, y, z}` controlling title text positioning offset. |
| `popupdata.<gift_type>.title_size` | number | `---` | Optional font size override for the popup title; only present on some gift types (e.g., `ROGR`, `SWR`). |

## Main functions
None. This file exports static data tables only — no functions are defined.

## Events & listeners
None.