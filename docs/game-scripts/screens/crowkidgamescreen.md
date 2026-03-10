---
id: crowkidgamescreen
title: CrowKidGameScreen
description: A screen interface for the Crow Kid's Maze minigame that manages gameplay state, grid rendering, movement logic, and reward reporting.
tags: [ui, minigame, player, network, inventory]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7a984512
system_scope: ui
---

# CrowKidGameScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CrowKidGameScreen` is a UI screen that implements the Crow Kid's Maze minigame. It handles player movement through a procedurally generated hay maze, tracks score and steps, renders dynamic tile grids (background and game board), and manages client-server communication to report scores and claim rewards. The screen integrates with the `SkinCollector` NPC for dialogue and uses `Stats` for metrics reporting.

## Usage example
This component is not intended for direct instantiation by mods. It is displayed via `TheFrontEnd:PushScreen(CrowKidGameScreen(profile))`.

## Dependencies & tags
**Components used:** `skincollector`, `stats`  
**Tags:** None added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | Player profile passed into constructor. |
| `pressed` | table | `{}` | List of currently held directional inputs. |
| `fixed_root`, `scissor_root`, `view_bg_root`, `view_grid_root` | Widget | `nil` | UI hierarchy roots for layout and viewport management. |
| `claw_machine`, `claw_machine_bg` | UIAnim | `nil` | Animated machine visuals. |
| `title` | Image | `nil` | Title image (Trade Inn sign). |
| `startbutton`, `resetbutton` | TextButton | `nil` | Action buttons to start or reset the game. |
| `puppet` | Puppet | `nil` | Character model representing the player. |
| `innkeeper` | SkinCollector | `nil` | NPC dialogue system. |
| `game_board` | table | `{}` | 2D array (`GAME_NUM_ROWS x GAME_NUM_COLUMNS`) storing tile states: `TILE_NONE` (clear), `TILE_HAY` (wall), or item strings. |
| `game_state` | number | `GS_WAITING` | Current state: `0`=waiting, `1`=moving, `2`=pickup. |
| `score` | number | `0` | Number of items collected (prizes). |
| `steps_taken` | number | `0` | Total steps taken by the player. |
| `pos_x`, `pos_y` | number | `1` | Current tile coordinates. |
| `reported_25`, `reported_50`, `reported_75`, `reported_100` | boolean | `false` | Flags tracking when particular score milestones were reported. |
| `move_offset_x`, `move_offset_y` | number | `0` | Pixel offsets for smooth movement interpolation. |
| `bg_offset_x`, `bg_offset_y` | number | `0` | Background scrolling offsets relative to player position. |
| `score_text`, `steps_text` | Text | `nil` | HUD widgets displaying score and step counts. |

## Main functions
### `Constructor(profile)`
*   **Description:** Initializes the screen with the given `profile`. Sets up UI, game board, and interface.
*   **Parameters:** `profile` (table) — Player profile data.
*   **Returns:** Nothing.

### `SetupUI()`
*   **Description:** Creates the full UI layout: background, menu, machine animations, puppet, score HUD, exit button, and skin collector NPC.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `InitGameBoard()`
*   **Description:** Resets and regenerates the maze: builds a 51x51 grid of hay walls, carves paths via recursive maze algorithm, adds holes and single-island removal, places 100 random items, and sets the starting position. Resets score, steps, flags, and game state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Handles frame-by-frame updates: mouse/keyboard input for direction, movement interpolation, step sound playback, and state transitions. Renders tiles by updating grid positions and tile types.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `OnMovement(direction)`
*   **Description:** Initiates movement in the specified direction if state is `GS_WAITING`. Updates puppet facing, computes next tile, sets state to `GS_MOVING` if valid, and queues further input while moving.
*   **Parameters:** `direction` (number) — One of `CONTROL_FOCUS_UP/DOWN/LEFT/RIGHT`.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Processes gamepad and keyboard controls: maps movement inputs, updates `pressed` list for key tracking, triggers movement, and handles restart/help/quit actions.
*   **Parameters:** `control` (number) — Input control identifier. `down` (boolean) — Whether key was pressed (`true`) or released (`false`).
*   **Returns:** boolean — `true` if event handled; otherwise delegates to base class.

### `GetGameTile(x, y)`
*   **Description:** Safely returns the tile type at (`x`, `y`) in `game_board`. Returns `TILE_NONE` for out-of-bounds coordinates.
*   **Parameters:** `x` (number), `y` (number) — Grid coordinates.
*   **Returns:** string — `TILE_NONE`, `TILE_HAY`, or item name.

### `UpdateInterface()`
*   **Description:** Updates UI: positions background and game grids, redraws visible tiles based on current view and player position, checks for game-over milestones (25/50/75/100), triggers report submission via `TheItems:ReportCrowKidGame()`, shows popups upon completion, updates HUD text, and toggles buttons.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Quit()`
*   **Description:** Cleans up and exits screen: clears NPC speech, stops joystick tracker, and fades back to previous screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoQueuedMovement()`
*   **Description:** Executes the next queued or held movement direction once the current movement completes.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `CONTROL_FOCUS_UP/DOWN/LEFT/RIGHT` (via `OnControl`), `CONTROL_CANCEL` (quit), `CONTROL_MENU_MISC_1` (reset), `CONTROL_MENU_MISC_2` (help).
- **Pushes:** None — it does not emit custom events. Game state changes are communicated via screen navigation and `TheItems:ReportCrowKidGame()` callback.