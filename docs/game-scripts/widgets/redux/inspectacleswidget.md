---
id: inspectacleswidget
title: Inspectacleswidget
description: Renders and manages a family of interactive puzzle minigames (Wires, Gears, Tape) in the Inspectacles interface, handling grid layout, button interactions, rotation/toggling mechanics, and state synchronization with the game logic.
tags: [ui, minigame, puzzle, interaction, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 4f4f5881
system_scope: ui
---

# Inspectacleswidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`InspectaclesWidget` is a UI component responsible for rendering and managing interactive puzzle minigames (specifically WIRES, GEARS, and TAPE variants) within the Inspectacles interface. It inherits from `Widget` and constructs a grid of animated buttons that represent puzzle elements. The widget handles user input (mouse/touch/keyboard/controller), updates visual states (e.g., wire extension, gear toggle, tape click), synchronizes puzzle state with `parentscreen.solution`, and provides animations for solving the puzzle. It communicates with game logic via `inspectaclesparticipant` to retrieve puzzle data and update the solution state.

## Usage example
```lua
-- Typically instantiated by the parent UI screen when Inspectacles is opened
local inspectacleswidget = InspectaclesWidget(owner, parentscreen, inspectaclesparticipant)
-- The widget is added to the screen hierarchy automatically during construction
-- Solution updates are written back to `parentscreen.solution`
-- The widget automatically checks for puzzle completion and animates the win state
```

## Dependencies & tags
**Components used:** None directly; relies on `inspectaclesparticipant:GetCLIENTDetails()` to fetch puzzle data and `parentscreen.solution` for solution tracking.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `nil` | Root container widget for the entire UI tree. |
| `owner` | Entity | `nil` | Entity that owns the widget (unused in this implementation but stored). |
| `parentscreen` | Screen | `nil` | Reference to the parent UI screen; solution updates are written here. |
| `WIDTH`, `HEIGHT` | number | `300` | Width and height of the widget's main grid area in pixels. |
| `PADDING` | number | `5` | Spacing between adjacent grid elements. |
| `GRIDSIZE` | number | `nil` | Dimensions of the puzzle grid (inherited from `inspectaclesparticipant`). |
| `VALIDVALUEMAX` | number | `nil` | Max value for perimeter indexing (inherited from `inspectaclesparticipant`). |
| `BUTTONSCALE` | number | `nil` | Calculated scale factor for grid buttons to fit the UI. |
| `FRAMESCALE` | number | `nil` | Scale factor for the frame widgets. |
| `ORIGINX` | number | `0` | Horizontal offset for split-screen positioning. |
| `gameroot` | Widget | `nil` | Root widget for the puzzle grid and associated elements. |
| `solved` | boolean | `false` | Flag indicating whether the puzzle has been solved. |
| `solvedt` | number | `-0.4` | Timer tracking elapsed time since solving started. |
| `solvedrev` | boolean | `nil` | Flag indicating whether the "power up reverse" sound has played. |
| `wireexits` | table | `{}` | Stores map of exit node indices for the Wires minigame. |

## Main functions
### `GetIndex(x, y)`
* **Description:** Generates a unique string key for a grid position `(x, y)` to use as a dictionary key (e.g., `"2_3"`). Used for consistent indexing of buttons, exits, and solution state.
* **Parameters:** `x` (number), `y` (number) – grid coordinates.
* **Returns:** string – formatted index key.

### `CheckSolvedState()`
* **Description:** Checks if the puzzle is solved by verifying `parentscreen.solution` is empty. If so, triggers win sound and starts the solve animation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only triggers if `solved` is false and `parentscreen.solution` has no keys (`next(...) == nil`).

### `CloseWithAnimations()`
* **Description:** Initiates the closing sequence after solving. Hides all UI elements, plays the "close" animation, and pops the screen once animation completes.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles the post-solve animation: gradually increases background brightness, plays reverse power-up sound, and pops the screen when the animation completes.
* **Parameters:** `dt` (number) – time elapsed since last frame.
* **Returns:** Nothing.

### `ConstructGame(game, puzzledata)`
* **Description:** Main factory method that builds the UI for a given game type. Creates the grid of buttons, initializes rotation/toggle/click hooks, sets up focus navigation, and calls the appropriate `AddGameUI_*` helper.
* **Parameters:** `game` (string) – one of `"WIRES"`, `"GEARS"`, or `"TAPE"`; `puzzledata` (data provider) – source of puzzle randomness and configuration.
* **Returns:** `gameroot` (Widget), `addedui` (boolean) – whether the game type was recognized and UI was added.

### `MakeProjectionEffects(widget)`
* **Description:** Attaches holo-projection erosion parameters and start a periodic task that updates them over time, giving the widget a shimmering animated effect.
* **Parameters:** `widget` (Widget or UIAnim) – the widget to apply projection effects to.
* **Returns:** Nothing.

### `AddWireVisual(button, direction)`
* **Description:** Creates and positions a wire animation child on a button, aligned to the specified direction (`DIR_UP`, `DIR_LEFT`, etc.).
* **Parameters:** `button` (UIAnimButton) – parent button; `direction` (string) – direction constant (`DIR_*`).
* **Returns:** Nothing.

### `SetWireType(button, wiretype)`
* **Description:** Configures a button's visual type (`plug`, `pipe`, `bend`, `tee`, `cross`) and creates the appropriate number and arrangement of wire visuals.
* **Parameters:** `button` (UIAnimButton); `wiretype` (string) – one of `TYPE_*` constants.
* **Returns:** Nothing.

### `GetWireDirection(button, direction)`
* **Description:** Determines the effective direction (in world space) that a wire emanates from a button, accounting for its current rotation and wire type. Returns `nil` if no connection exists in that direction.
* **Parameters:** `button` (UIAnimButton); `direction` (string) – world-space direction to check (e.g., `DIR_UP`).
* **Returns:** string or `nil` – effective world-space direction or `nil`.

### `TurnWireOn(button, direction, loading)`
* **Description:** Activates a wire segment visually (animation and sound), records state in `button.offwires`, and updates the solution state. Triggers solved check if all wires are powered.
* **Parameters:** `button` (UIAnimButton); `direction` (string); `loading` (boolean) – if true, uses idle anim and no sound.
* **Returns:** Nothing.

### `TurnWireOff(button, direction, loading)`
* **Description:** Deactivates a wire segment visually and updates solution state.
* **Parameters:** `button` (UIAnimButton); `direction` (string); `loading` (boolean).
* **Returns:** Nothing.

### `UpdateButton_WIRES(button, secondary, immediately)`
* **Description:** Recalculates wire activation states for a single button and its neighbors based on adjacency and rotation (Wires minigame only). Implements a flood-fill to propagate state changes.
* **Parameters:** `button` (UIAnimButton); `secondary` (boolean) – prevents re-entry recursion; `immediately` (boolean) – disables sounds/animations.
* **Returns:** Nothing.

### `CreateExitNode_WIRES(x, y, maze)`
* **Description:** Spawns a static exit node UI element at the specified grid perimeter location and configures the adjacent wire direction.
* **Parameters:** `x`, `y` (numbers) – grid coordinates; `maze` (table) – internal maze state.
* **Returns:** Nothing.

### `OnRotatedWire(button)`
* **Description:** Callback invoked when a wire tile is rotated. Deactivates all wires on the button and adjacent connected tiles; then triggers state recalculation.
* **Parameters:** `button` (UIAnimButton).
* **Returns:** Nothing.

### `UpdateWireDirections(spot, direction)`
* **Description:** Updates the `wiretype` (plug/pipe/bend/tee/cross) of a maze spot based on its accumulated connection directions.
* **Parameters:** `spot` (table) – maze node; `direction` (string) – direction of a new connection.
* **Returns:** Nothing.

### `CalculatePerimeterSpot(numindex)`
* **Description:** Maps a linear index into `(x, y)` world-grid coordinates on the puzzle perimeter for exit node placement (Wires minigame).
* **Parameters:** `numindex` (number) – linear index into perimeter positions.
* **Returns:** `x`, `y` (numbers).

### `AddGameUI_WIRES(puzzledata)`
* **Description:** Sets up the Wires minigame: generates a maze using "hunt and kill", places exit nodes on the perimeter, configures buttons with wire types and behaviors, and initializes wire states.
* **Parameters:** `puzzledata` – random/data source.
* **Returns:** Nothing.

### `AddGameUI_GEARS(puzzledata)`
* **Description:** Sets up the Gears minigame: configures each button as a toggle tile with spinning animation, sets initial toggled state based on `puzzledata`.
* **Parameters:** `puzzledata`.
* **Returns:** Nothing.

### `AddGameUI_TAPE(puzzledata)`
* **Description:** Sets up the Tape minigame: configures each button as a click/tap tile, sets initial clicked/unclicked states.
* **Parameters:** `puzzledata`.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles player input (keyboard/controller) to trigger primary/secondary actions on the focused tile. Supports scroll wheel for rotation in Wires mode.
* **Parameters:** `control` (number) – control identifier (`CONTROL_*`); `down` (boolean) – true if key/button pressed.
* **Returns:** boolean – true if input was handled.

### `GetHelpText()`
* **Description:** Returns localized help text describing controls for the active minigame (currently only rotation instructions for Wires).
* **Parameters:** None.
* **Returns:** string – formatted help text.

## Events & listeners
- **Listens to:** `animover` – on the frame background/foreground widgets to detect when animations complete and pop the screen.
- **Pushes:** None. The widget does not fire custom events.