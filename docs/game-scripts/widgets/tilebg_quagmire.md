---
id: tilebg_quagmire
title: Tilebg Quagmire
description: Creates and manages horizontal separator images for rendering tile backgrounds in the Quagmire biome UI.
tags: [ui, rendering, layout]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e760a8ac
system_scope: ui
---

# Tilebg Quagmire

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`QuagmireTileBG` is a specialized UI widget used to render tile separators—typically visual dividers—between individual tiles in the Quagmire biome's background display. It extends the base `Widget` class and dynamically manages child `Image` elements to represent separators between adjacent tiles. The component is designed for layout customization where a variable number of tiles require visual spacing.

## Usage example
```lua
local quagmire_tile_bg = QuagmireTileBG("quagmire_atlas", "tilesep.tex", "tilesep.tex")
quagmire_tile_bg:SetNumTiles(4)
quagmire_tile_bg:AddToParent(some_parent_widget)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `atlas` | string | `nil` | Texture atlas name used for all separator images. |
| `sepim` | string | `nil` | Image filename (relative to atlas) for separator texture. |
| `seps` | table or `nil` | `nil` | Array of child `Image` widgets representing separators; populated on `SetNumTiles`. |

## Main functions
### `SetNumTiles(numtiles)`
* **Description:** Recreates the separator images to match the specified number of tiles. It removes all existing child widgets and adds new separator images if `numtiles > 1`.
* **Parameters:** `numtiles` (number) — The total number of tiles to render separators *between*. Must be ≥ 1.
* **Returns:** Nothing.
* **Error states:** If `sepim` is `nil` or `numtiles ≤ 1`, no child separators are created (`self.seps` remains `nil`).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified