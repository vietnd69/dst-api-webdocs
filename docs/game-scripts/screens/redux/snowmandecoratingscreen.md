---
id: snowmandecoratingscreen
title: Snowmandecoratingscreen
description: A UI screen that allows players to interactively decorate snowmen by placing decorative items onto snowball stacks using keyboard/controller input.
tags: [ui, snowman, decoration, input]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: c610982e
system_scope: ui
---

# Snowmandecoratingscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SnowmanDecoratingScreen` is a dedicated UI screen component that renders a visual editor for decorating snowmen. It displays the snowman structure (snowballs) and allows the player to place decoration items onto valid positions while enforcing limits on total decorations. The screen handles mouse/controller input, item dragging, rotation, flipping, placement validation, sound feedback, and visual warnings. It integrates with the `snowmandecoratable` component on the snowman entity to load existing decoration data and persists new decorations on save.

## Usage example
```lua
-- Typically instantiated internally by the game when initiating snowman decoration
-- Example of how the screen is pushed:
local screen = SnowmanDecoratingScreen(owner, target_snowman, decoration_item)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `snowmandecoratable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns the screen session. |
| `obj` | entity | `nil` | The item currently being used for decoration (the drag target). |
| `maxdecor` | number | `0` | Maximum number of decorations allowed for this snowman based on its size and layers. |
| `dirtyindex` | number | `1` | Starting index in `decordata` for new decorations (excludes pre-existing ones). |
| `decordata` | table | `{}` | Array of decoration records: `{ itemhash, rot, flip, x, y }`. |
| `stacks` | table | `{}` | Array of snowball UI elements representing the snowman structure. |
| `dragitem` | widget | `nil` | The UIAnim widget currently being dragged. |

## Main functions
### `ScreenToLocal(x, y)`
*   **Description:** Converts screen-space coordinates to local snowman space (scaled and translated).
*   **Parameters:** `x` (number), `y` (number) - screen coordinates.
*   **Returns:** `x_local` (number), `y_local` (number) - coordinates relative to the snowman root.

### `IsOnSnowman(x, y, padding)`
*   **Description:** Checks if a point (x,y) lies within any snowball in the snowman.
*   **Parameters:** `x` (number), `y` (number) - local snowman space coordinates. `padding` (number, optional) - radial expansion tolerance.
*   **Returns:** `boolean` - `true` if inside any snowball, `false` otherwise.

### `ClampToSnowman(x, y)`
*   **Description:** Projects a point onto the nearest valid position on the snowman surface if it falls outside.
*   **Parameters:** `x` (number), `y` (number) - local snowman space coordinates.
*   **Returns:** `x_clamped` (number), `y_clamped` (number) - coordinates constrained to the snowman boundary.

### `StartDraggingItem(obj)`
*   **Description:** Begins dragging a decoration item, creating a visual drag target and attaching input handlers.
*   **Parameters:** `obj` (entity) - the item to drag.
*   **Returns:** Nothing.

### `RotateDraggingItem(delta)`
*   **Description:** Cycles the animation frame of the dragged item to rotate its visual orientation.
*   **Parameters:** `delta` (number, typically ±1) - rotation direction/step.
*   **Returns:** Nothing.

### `FlipDraggingItem()`
*   **Description:** Flips the dragged item horizontally (if supported) and adjusts rotation to match.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TryPlacingDecor()`
*   **Description:** Attempts to place the current drag item if valid (not exceeding max, on snowman). Shows warning on failure.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoAddItemAt(x, y, itemhash, itemdata, rot, flip)`
*   **Description:** Creates and returns a static UI element for a decoration at a given location.
*   **Parameters:** 
    * `x`, `y` (number) - local placement coordinates.
    * `itemhash` (hash) - item prefab hash.
    * `itemdata` (table) - decoration metadata from `SnowmanDecoratable`.
    * `rot` (number) - animation frame index.
    * `flip` (boolean) - whether the item is flipped.
*   **Returns:** `decor` (UIAnim) - the created decoration widget.

### `PlaceItemAt(x, y, itemhash, itemdata, rot, flip)`
*   **Description:** Places a decoration, triggers placement FX, plays UI sound, and updates inventory.
*   **Parameters:** Same as `DoAddItemAt` plus additional side-effect logic.
*   **Returns:** Nothing.

### `Cancel()`
*   **Description:** Aborts decoration session, closes popup, and pops the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SaveAndClose()`
*   **Description:** Serializes all new decorations, closes the popup with updated data, and pops the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HasMaxDecor()`
*   **Description:** Checks if the decoration limit for this snowman has been reached.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if no more decorations can be added.

### `OnControl(control, down)`
*   **Description:** Handles all user input for this screen (movement, rotate, flip, place, cancel, save).
*   **Parameters:** 
    * `control` (string) - control identifier (e.g., `CONTROL_ACCEPT`, `CONTROL_SECONDARY`).
    * `down` (boolean) - whether the control was pressed (true) or released (false).
*   **Returns:** `boolean` - `true` if the input was consumed.

### `OnUpdate(dt)`
*   **Description:** Updates screen state each frame (autoclose delay, warning fade, controller drag movement).
*   **Parameters:** `dt` (number) - delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (on FX animations) - triggers `OnFxAnimOver` to clean up FX widgets.
- **Pushes:** No custom events; relies on screen lifecycle and `POPUPS.SNOWMANDECORATING` callbacks.