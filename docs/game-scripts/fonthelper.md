---
id: fonthelper
title: Fonthelper
description: Helper module for registering font assets in the game's asset loading system.
tags: [asset, font, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: b86ecc09
system_scope: ui
---

# Fonthelper

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`fonthelper` is a utility module that provides a single function `AddFontAssets` to register font assets with the game's asset system. It is used during mod initialization to ensure custom font files (e.g., `.ttf`, `.otf`) are properly loaded and referenced in `asset_table` and `font_table` structures. This component does not implement an Entity Component System component; it is a standalone helper for asset management.

## Usage example
```lua
local ASSETS = {}
local FONTS = {
    { filename = "fonts/myfont.ttf" },
    { filename = "fonts/altfont.ttf" },
}

AddFontAssets(ASSETS, FONTS)
-- ASSETS now contains Asset("FONT", ...) entries for each font
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `AddFontAssets(asset_table, font_table)`
* **Description:** Iterates through a table of font definitions and appends corresponding `Asset("FONT", ...)` objects to an asset collection table. This prepares custom fonts to be loaded by the game’s asset system (e.g., via `TheInput:GetFontAsset` or `TheSim:GetAsset`).
* **Parameters:**
  * `asset_table` (table) — A mutable array-like table (typically `ASSETS`) to which `Asset` objects will be appended.
  * `font_table` (table) — An array of tables, each containing a `filename` key specifying the path to a font file.
* **Returns:** Nothing (modifies `asset_table` in place).
* **Error states:** No explicit error handling is provided; if `font_table` is malformed (e.g., missing `filename`), the inner `Asset` call may fail at runtime.

## Events & listeners
Not applicable