---
id: minigametile
title: Minigametile
description: A UI widget representing a tile in a minigame, handling visual state, number display, highlighting, and user interaction via clicks and focus.
tags: [ui, minigame, interaction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7d358654
system_scope: ui
---

# Minigametile

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MiniGameTile` is a UI widget that represents a single interactive tile in a minigame context. It manages visual appearance (via `UIAnim`), numeric display (via `Text`), state transitions (hidden/shown/hidden-hover), and user input (clicking, focus, enable/disable). It extends `Widget` and is typically used as a child of a larger minigame UI container (e.g., a pattern-repeating minigame grid).

## Usage example
```lua
-- Create a tile at index 3 for a given screen, with no mover
local tile = MiniGameTile(screen, 3, nil)

-- Set its visible number and type
tile:SetTileNumber(7)
tile:SetTileTypeUnHidden("symbol_fish")

-- Interact with it
tile:Select()  -- Emphasize tile as selected
tile:HighlightTileNum()  -- Turn text green

-- Handle click logic
tile.clickFn = function(index) print("Tile", index, "clicked") end
```

## Dependencies & tags
**Components used:** None identified. Uses only widget subcomponents (`UIAnim`, `Text`, `Image` via `require`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `screen` | `Widget?` | `nil` | Reference to the parent screen/minigame container. |
| `index` | number | `0` (expected) | Unique index/ID of this tile within the minigame. |
| `exploded` | boolean | `false` | Reserved for future or game-specific use; not used in current implementation. |
| `view_state` | string | `"on"` | Current visibility state: `"on"`, `"off"`, or combined with `"_hover"` via animation push. |
| `number` | number? | `nil` | The numeric label displayed on the tile. |
| `tile_type` | string | `""` | The type ID (e.g., `"symbol_fish"`) used for symbol override. |
| `clicked` | boolean | `false` | Whether the tile is currently in a "selected/pressed" state. |
| `clickFn` | function? | `nil` | Optional callback invoked on click (if enabled and ACCEPT is released). |

## Main functions
### `IsClear()`
*   **Description:** Returns `true` if the tile is empty/uninitialized (no `number` and no `tile_type`).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `number == nil` and `tile_type == ""`, otherwise `false`.

### `ClearTile()`
*   **Description:** Resets the tile to its default empty state: clears type, resets animations, hides the number, and removes highlighting.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetTileNumber(num)`
*   **Description:** Sets the numeric text displayed on the tile.
*   **Parameters:** `num` (number or `nil`) — the number to display; `nil` clears the text.
*   **Returns:** Nothing.

### `HighlightTileNum()`
*   **Description:** Visually highlights the tile number by setting the tile’s overlay colour to green and making the text green.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UnhighlightTileNum()`
*   **Description:** Reverts the tile number to its default appearance (white overlay and white text).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetTileTypeUnHidden(tile_type)`
*   **Description:** Sets the tile’s type and ensures the symbol is visible using `OverrideSkinSymbol`.
*   **Parameters:** `tile_type` (string) — the symbol ID to display (e.g., `"symbol_fish"`).
*   **Returns:** Nothing.

### `SetTileTypeHidden(tile_type)`
*   **Description:** Sets the tile’s type ID but hides the symbol by clearing all override symbols. Typically used when the tile is in a "hidden" initial state.
*   **Parameters:** `tile_type` (string) — the symbol ID to store (for later reveal).
*   **Returns:** Nothing.

### `UnhideTileType()`
*   **Description:** Shows the stored tile type’s symbol on the tile using `OverrideSkinSymbol("SWAP_ICON", ...)`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ForceHideTile()`
*   **Description:** Immediately switches the tile to the `"off"` animation without sound or transition delay.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HideTile()`
*   **Description:** Plays a transition animation (`"anim_off"` → `"off"`) and plays a sound only if currently visible (`view_state == "on"`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowTile()`
*   **Description:** Plays a transition animation (`"anim_on"` → `"on"`) and plays a sound only if currently hidden (`view_state == "off"`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Embiggen()`
*   **Description:** Temporarily scales the tile up by 10% (for hover/selection emphasis).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Shrink()`
*   **Description:** Restores the tile to its default scale (`image_scale = 0.6`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Select()`
*   **Description:** Marks the tile as selected (`clicked = true`) and scales it up.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Unselect()`
*   **Description:** Clears the selected state (`clicked = false`) and restores the tile’s scale.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input for the tile. If `CONTROL_ACCEPT` (e.g., mouse click/Confirm) is released (`down == false`) and the tile is enabled and not already clicked, and if `clickFn` is set, the function is invoked with `self.index`.
*   **Parameters:**  
  - `control` (string) — the control ID (e.g., `"accept"`).  
  - `down` (boolean) — whether the control is being pressed (`true`) or released (`false`).
*   **Returns:** `boolean` — `true` if the control was handled, otherwise `nil`.
*   **Error states:** Does nothing if tile is disabled or already clicked.

### `OnGainFocus()`, `OnLoseFocus()`
*   **Description:** Manages visual feedback when focus is gained or lost. On gain: embiggen + hover animation + sound. On lose: shrink + return to base animation (unless clicked).
*   **Parameters:** None (overrides base Widget methods).
*   **Returns:** Nothing.

### `OnEnable()`, `OnDisable()`
*   **Description:** Ensures proper focus behavior when the tile is enabled or disabled (re-invokes focus handlers as appropriate).
*   **Parameters:** None (overrides base Widget methods).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified. (No events are fired via `inst:PushEvent`.)
