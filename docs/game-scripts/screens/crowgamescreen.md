---
id: crowgamescreen
title: Crowgamescreen
description: Implements the full gameplay logic, UI, and state management for the Crow Game minigame featured in the Trade Inn screen, including tile matching, power-up usage, animations, and score/reporting flow.
tags: [ui, minigame, npc, network, rewards]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 21cb8f7e
system_scope: ui
---

# Crowgamescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CrowGameScreen` is a `Screen` subclass that implements the complete logic and UI for the Crow Game minigame in the Trade Inn. It manages the 7x5 tile grid, tile matching mechanics, power-up system, animations (e.g., tile drops, tile clearing FX, crow takeoff), score tracking, and integration with the client-server reporting system to award rewards upon game completion. It relies heavily on the `UIAnim` component for visual transitions and works alongside `SkinCollector` for NPC speech and feedback.

## Usage example
```lua
-- Typically instantiated internally via TheFrontEnd when the player accesses the minigame
local screen = CrowGameScreen(profile)
TheFrontEnd:PushScreen(screen)

-- Key internal flow after start:
screen:InitGameBoard()  -- Resets and fills the board
screen:OnTileClick(x, y) -- Handles player tile selection
screen:UpdateInterface() -- Refreshes UI, power-up buttons, and checks game-over state
```

## Dependencies & tags
**Components used:** `uianim`, `SkinCollector`, `stats` (via `Stats.PushMetricsEvent`)
**Tags:** Uses tags internally on widgets via focus management and keyboard navigation (`MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`), but no explicit entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | `UserProfile` | (from constructor) | Profile object used to read/write high scores and track completion state. |
| `score` | number | `0` | Current cumulative score for the session. |
| `move_score` | number | `0` | Score calculation for the most recent move. |
| `moves` | number | `0` | Total number of moves taken. |
| `crows_cleared` | number | `0` | Count of Crow tiles (`oddment_crow`) cleared in the current move. |
| `tiles_cleared` | number | `0` | Count of regular tiles cleared in the current move. |
| `game_state` | number | `GS_GAME_OVER` | Current state of the game (e.g., `GS_TILES_DROPPING`, `GS_TILE_SELECT_REG`). |
| `game_grid` | table of `MiniGameTile` | (constructed via `GameGridConstructor`) | 2D array-like table storing tile state and widgets for the grid. |
| `num_powerup` | table of numbers | (populated via `GetPowerupData`) | Tracks remaining uses of each power-up. |
| `pwup_button`, `pwup_txt` | tables | `{}` | UI button and label references for power-up widgets. |
| `score_root`, `claw_machine`, `sign_bg`, `title`, `startbutton`, `resetbutton` | `Widget` or subclass | (created in `SetupUI`) | Root UI containers and interactive elements. |
| `innkeeper` | `SkinCollector` | (created in `SetupUI`) | NPC component that handles speech and feedback. |
| `queued_click` | table or `nil` | `nil` | Stores a delayed click during state transitions. |

## Main functions
### `InitGameBoard()`
* **Description:** Resets the game state, clears the grid, resets counters and power-up counts, then fills the grid with tiles. After a drop wait, transitions the game to `GS_TILE_SELECT_REG`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early-exits if the board is already dropping (`game_state == ` `GS_TILES_DROPPING`).

### `OnTileClick(x, y)`
* **Description:** Handles player tile selection. Behavior depends on `game_state` (e.g., regular matching, power-up active). Triggers tile clearing, animations, and transitions after a move.
* **Parameters:**  
  - `x` (number): Grid column index (0-based).  
  - `y` (number): Grid row index (0-based).  
* **Returns:** Nothing.
* **Error states:** If no matching move is possible for the selected tile in `GS_TILE_SELECT_REG`, or if a power-up isn’t available, the click is ignored.

### `ClearTilesNoRec(start_x, start_y)`
* **Description:** Performs flood-fill clearing logic for a selected tile and any matching neighbors, using iterative passes to support complex connected regions.
* **Parameters:**  
  - `start_x`, `start_y` (number): Starting tile coordinates.  
* **Returns:** number — total delay (in seconds) needed before the move completes.

### `WaitForClearingToFinish(t)`
* **Description:** Waits `t` seconds, then calculates score, updates high score, grants bonus power-ups, drops and refills tiles, and returns to `GS_TILE_SELECT_REG` after a final drop wait. Fires queued clicks if present.
* **Parameters:**  
  - `t` (number): Delay in seconds before post-move actions begin.  
* **Returns:** Nothing.

### `CalcMoveScore()`
* **Description:** Computes and sets `move_score` using the formula:  
  `tiles_cleared^2 * 5 * (crows_cleared + 1) + crows_cleared * 25`
* **Parameters:** None.
* **Returns:** Nothing.

### `GetMoveScore()`
* **Description:** Returns the last-calculated `move_score`.
* **Parameters:** None.
* **Returns:** number — Move score for the most recent cleared selection.

### `PowerupBtn(pwup)`
* **Description:** Handles selection or deselection of a power-up button when in `GS_TILE_SELECT_REG` or the power-up’s active state.
* **Parameters:**  
  - `pwup` (string): Key from `POWERUPS`, e.g., `"cane"`, `"shovel"`.  
* **Returns:** Nothing.

### `UpdateInterface()`
* **Description:** Refreshes UI components (score text, power-up counts, button states) and checks for game-over conditions. On game over, sends the score/report to the server via `TheItems:ReportCrowGame` and displays the appropriate pop-up (gift or error).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early-exits if `self.inst:IsValid()` is `false`.

### `DropTiles()` / `FillEmptyTiles()`
* **Description:**  
  - `DropTiles()`: Shifts tiles down into empty spaces using mover widgets and `UIAnim:MoveTo`.  
  - `FillEmptyTiles()`: Spawns random tiles from above and drops them into newly created empty spaces.
* **Parameters:** None.
* **Returns:** Nothing.

### `ExplodeTile(explode_delay, x, y)`
* **Description:** Triggers a tile-clearing animation: plays sound FX, spawns a `CrowFX` (if crow) or `ExplodeFX`, and updates counters.
* **Parameters:**  
  - `explode_delay` (number): Delay before the explosion animation starts.  
  - `x`, `y` (number): Grid coordinates of the tile to clear.  
* **Returns:** Nothing.

### `Quit()`
* **Description:** Cleans up resources, stops joystick tracking, and fades the screen out via `TheFrontEnd:FadeBack`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetupUI()`
* **Description:** Initializes the full UI hierarchy: background, claw machine, title, joystick, power-up buttons, score displays, scissor region, movers, and skin collector.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles keyboard/controller inputs: `CONTROL_CANCEL` to quit, `CONTROL_MENU_MISC_1`/`CONTROL_MENU_START` to reset board, and `CONTROL_MENU_MISC_2` to show help.
* **Parameters:**  
  - `control` (string): Input control constant.  
  - `down` (boolean): Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** boolean — `true` if the input was handled, otherwise delegates to base.

### `GetHelpText()`
* **Description:** Returns a formatted help string describing control mappings for available actions.
* **Parameters:** None.
* **Returns:** string — Localized help text.

## Events & listeners
- **Listens to:** None (screen handles user interaction via direct callbacks and `OnControl`, not event-driven callbacks via `inst:ListenForEvent`).
- **Pushes:** Fires no custom `inst:PushEvent` events; uses `Stats.PushMetricsEvent` for Crow Game over telemetry.

