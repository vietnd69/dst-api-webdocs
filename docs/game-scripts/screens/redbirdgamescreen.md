---
id: redbirdgamescreen
title: Redbirdgamescreen
description: Manages the Redbird Trading Post minigame interface, including tile matching logic, scoring, timer progression, and server reporting.
tags: [minigame, ui, trading, scoring, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: fcbe0fa2
system_scope: ui
---

# Redbirdgamescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`RedbirdGameScreen` implements the minigame logic and UI for the Redbird Trading Post, a recurring challenge in Don't Starve Together. It manages a 4x4 grid of tiles, enforces tile-matching rules (summing to 100), tracks the "egg timer" that causes eggs to rot, handles scoring, and reports results to the server for item rewards. It extends `Screen` and integrates with `SkinCollector`, `UIAnim`, and `MiniGameTile` components to render the game board and assets.

## Usage example
```lua
-- Create and push the Redbird Game Screen (typically handled by TheFrontEnd)
local profile = ThePlayer and ThePlayer.profile
local redbird_screen = RedbirdGameScreen(profile)
TheFrontEnd:PushScreen(redbird_screen)
-- Game state transitions (InitGameBoard, OnTileClick) are handled internally via player input
```

## Dependencies & tags
**Components used:** `uianim`, `skincollector`, `stats`  
**Tags:** None added/removed directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | Profile object used to retrieve/set high scores and reported achievements. |
| `score` | number | `0` | Current game score. |
| `game_state` | number | `GS_GAME_BEGINNING` | Current state of the minigame (`0=beginning`, `1=tiles dropping`, `2=transition`, `3=select 1`, `4=select 2`, `5=game over`). |
| `egg_timer` | number | `EGG_TIMER` | Countdown timer for egg freshness; expires at 0, causing eggs to rot. |
| `game_grid` | table of MiniGameTile | `nil` | 4x4 array of interactive tile widgets. |
| `selected_tile` | MiniGameTile or `nil` | `nil` | Currently selected tile in a two-tile match operation. |
| `startbutton` | TextButton or nil | `nil` | Start/Reset button widget. |
| `resetbutton` | TextButton or nil | `nil` | Reset button widget. |
| `innkeeper` | SkinCollector | `nil` | NPC speaker providing game feedback and phrases. |

## Main functions
### `InitGameBoard()`
*   **Description:** Resets the board: clears all tiles, fills empty spaces, drops tiles from above, and transitions to `GS_TILE_SELECT_1`. Used to start or restart the game.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnTileClick(x, y)`
*   **Description:** Handles player input on tiles. Implements selection and matching logic (e.g., adjacent tiles summing to 100). Triggers explosions, score updates, timer resets, and state transitions.
*   **Parameters:**
    *   `x` (number) – Zero-based column index.
    *   `y` (number) – Zero-based row index.
*   **Returns:** Nothing.

### `ExplodeTile(explode_delay, tile, is_bird, is_rotten)`
*   **Description:** Visually replaces a tile with an explosion or robin egg animation (and sound). If `is_bird` is `true`, creates a `RobinFX` entity; otherwise creates `ExplodeFX`.
*   **Parameters:**
    *   `explode_delay` (number) – Delay before explosion occurs (seconds).
    *   `tile` (MiniGameTile) – Tile to explode.
    *   `is_bird` (boolean) – Whether to show bird/egg animation.
    *   `is_rotten` (boolean) – If `true`, shows rotten egg type; otherwise normal egg.
*   **Returns:** Nothing.

### `DropTiles()`
*   **Description:** Moves existing tiles downward to fill empty slots in each column and spawns new tiles above the board. Updates `game_state` to `GS_TILES_DROPPING`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FillEmptyTiles(allow_dupes)`
*   **Description:** Fills remaining empty tiles in each column by spawning new numbered tiles from above the board.
*   **Parameters:**
    *   `allow_dupes` (boolean) – Currently unused (passed but ignored).
*   **Returns:** Nothing.

### `CheckGameOverCondition()`
*   **Description:** Evaluates whether the player can continue playing (any valid moves remain). If no moves exist, reports final score and egg count to the server via `TheItems:ReportRedbirdGame()`, displays a game-over popup, and optionally awards item rewards.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateInterface()`
*   **Description:** Updates UI elements (score, high score, egg timer text/progress bar, button states) each frame based on `game_state` and current values.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Quit()`
*   **Description:** Cleans up and exits the minigame: clears speech, stops joystick feedback, kills all active mover tiles, and fades out the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Reduces `egg_timer` by `dt` during active gameplay; triggers `UpdateInterface()` to refresh UI.
*   **Parameters:**
    *   `dt` (number) – Delta time since last frame.
*   **Returns:** Nothing.

### `PlayMachineAnim(name, loop)`
*   **Description:** Plays an animation on the claw machine UI (`claw_machine` and `claw_machine_bg` anims).
*   **Parameters:**
    *   `name` (string) – Animation name.
    *   `loop` (boolean) – Whether to loop the animation.
*   **Returns:** Nothing.

### `PushMachineAnim(name, loop)`
*   **Description:** Pushes an animation to play after current animation completes on the claw machine UI.
*   **Parameters:**
    *   `name` (string) – Animation name.
    *   `loop` (boolean) – Whether to loop the animation.
*   **Returns:** Nothing.

### `GetMoverTile()`
*   **Description:** Retrieves a reusable mover tile from the unused pool for animating tile drops/fills.
*   **Parameters:** None.
*   **Returns:** `MiniGameTile` – A mover tile ready for movement.

### `AddUnusedMoverTile(tile)`
*   **Description:** Returns a mover tile to the unused pool for reuse.
*   **Parameters:**
    *   `tile` (MiniGameTile) – Mover tile to return.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (uses standard screen lifecycle via `OnUpdate`, `OnControl`, `OnBecomeActive`).
- **Pushes:** None directly (UI and network interactions occur via `TheFrontEnd` and `TheItems`).