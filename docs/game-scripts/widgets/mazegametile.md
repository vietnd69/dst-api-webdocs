---
id: mazegametile
title: Mazegametile
description: A UI widget representing a single tile in a maze mini-game, displaying tile types via image textures.
tags: [ui, maze]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 19b18d77
system_scope: ui
---

# Mazegametile

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MazeGameTile` is a UI widget that visually represents a tile in a maze mini-game. It inherits from `Widget` and uses an `Image` component to display tile type textures (e.g., walls, paths, start/end). The tile supports dynamic texture updates via `SetTileType`, allowing it to switch between states like "none" (hidden) and other named textures loaded from the inventory atlas system.

## Usage example
```lua
local MazeGameTile = require "widgets/mazegametile"
local tile = MazeGameTile(screen_ref)
tile:SetTileType("wall")  -- displays wall texture
tile:SetTileType("none")  -- hides the tile
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tile_type` | string | `nil` | Stores the current tile type string set via `SetTileType`. |
| `tile` | Image | `Image(...)` | The underlying `Image` widget used to render the tile's texture. |

## Main functions
### `SetTileType(tile_type)`
* **Description:** Updates the tile's displayed texture based on the provided `tile_type`. If `tile_type` is `"none"`, the tile is hidden; otherwise, it loads and displays the corresponding texture.
* **Parameters:** `tile_type` (string) — the identifier for the tile's visual state (e.g., `"wall"`, `"path"`, `"none"`).
* **Returns:** Nothing.
* **Error states:** May fail silently if `GetInventoryItemAtlas(tex)` returns `nil` for the texture name.

## Events & listeners
None identified