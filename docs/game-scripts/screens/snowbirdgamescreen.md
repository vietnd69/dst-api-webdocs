---
id: snowbirdgamescreen
title: Snowbirdgamescreen
description: Manages the full snowbird memory matching mini-game flow, including tile interactions, score tracking, life management, and post-game rewards.
tags: [ui, minigame, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 00e17270
system_scope: ui
---

# Snowbirdgamescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SnowbirdGameScreen` is a specialized `Screen` subclass that implements a tile-matching mini-game where players flip and match tiles to gain score and preserve lives. It handles UI construction, game state transitions, tile animation/movement, scoring, and server-side reporting for reward distribution. It uses `MiniGameTile`, `UIAnim`, and `SkinCollector` components, and depends on `stats.lua` for metrics reporting. The screen supports both keyboard/mouse and controller input.

## Usage example
```lua
local SnowbirdGameScreen = require "screens/snowbirdgamescreen"
local profile = ThePlayer and ThePlayer.components.playerprofile or nil
local screen = SnowbirdGameScreen(profile)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `uianim`, `stats`
**Tags:** Checks `debuffed`, `buffed`, `depleted` via `MiniGameTile`; manages internal `exploded` flags per tile.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | Player profile object used to read/write high scores. |
| `score` | number | `0` | Current game score. |
| `lives` | number | `3` | Remaining player lives. |
| `game_state` | number | `GS_GAME_OVER` | One of the `GS_*` constants (`0`–`6`) indicating the current game phase. |
| `game_grid` | table | `nil` | Array of 6 `MiniGameTile` widgets, arranged 2 rows × 3 columns. |
| `startbutton` | `TextButton` | `nil` | Button widget to restart/reset the board. |
| `resetbutton` | `TextButton` | `nil` | Button widget to start a new round. |
| `innkeeper` | `SkinCollector` | `nil` | NPC speech/sfx provider during gameplay. |

## Main functions
### `InitGameBoard()`
* **Description:** Resets score/lives, clears and reshuffles the game grid, and initiates tile-filling animations. Only runs if the game is not already in the dropping state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnTileClick(x, y)`
* **Description:** Handles player tile selection/tile-flipping logic. Validates game-state transitions (reviewing → tile selection 1 → transition → tile selection 2 → clearing). Handles match detection, scoring, life changes, tile explosion FX, and queued input.
* **Parameters:**
  * `x` (number) – Column index (`0`–`2`).
  * `y` (number) – Row index (`0`–`1`).
* **Returns:** Nothing.

### `UpdateInterface()`
* **Description:** Updates UI text (score, lives, high score) and manages button states. Triggers game-over logic (including `Stats.PushMetricsEvent`, `ReportSnowbirdGame`, and reward popups) when `lives == 0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ExplodeTile(explode_delay, tile)`
* **Description:** Triggers visual and audio FX for a matched tile: plays takeoff sound for snowbird tiles, or flip sound with explosion FX for others. Clears the tile after delay.
* **Parameters:**
  * `explode_delay` (number) – Delay before clearing the tile.
  * `tile` (`MiniGameTile`) – Tile to explode.
* **Returns:** Nothing.

### `DropTiles()`
* **Description:** Moves tiles downward to fill empty grid positions, using hidden mover tiles for animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `FillEmptyTiles(allow_dupes)`
* **Description:** Generates and drops new tiles into empty grid slots from a shuffled list of `TILE_TYPES`. Supports optional duplicate prevention.
* **Parameters:**
  * `allow_dupes` (boolean) – Whether to allow the same tile type to be dropped multiple times in a column.
* **Returns:** Nothing.

### `Quit()`
* **Description:** Shuts down the screen cleanly: clears NPC speech, stops joystick listeners, kills all mover widgets, and triggers screen fade-out.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `control` events via `OnControl`, including `CONTROL_ACCEPT`, `CONTROL_CANCEL`, `CONTROL_MENU_MISC_1`, `CONTROL_MENU_START`, and `CONTROL_MENU_MISC_2`.
- **Pushes:** `buffed`, `debuffed`, `depleted` events via the underlying `MiniGameTile` widgets.