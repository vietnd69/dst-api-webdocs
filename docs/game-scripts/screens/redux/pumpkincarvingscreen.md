---
id: pumpkincarvingscreen
title: Pumpkincarvingscreen
description: A UI screen for interactively carving pumpkins by placing carved shapes and fills on a target entity.
tags: [ui, crafting, halloween, interaction]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 10d02826
system_scope: ui
---

# Pumpkincarvingscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Pumpkincarvingscreen` is a UI screen that enables players to visually configure carvings on a pumpkin entity via an interactive GUI. It provides buttons for selecting carving shapes and tools (Pumpkin Carver I–III), a drag-and-drop interface for positioning shapes, and logic to validate boundaries and tool availability. It interacts with the `pumpkincarvable` component on a target entity to read existing carvings and submit new ones. The screen supports both mouse and controller input, with dynamic focus navigation and controller-specific help text.

## Usage example
```lua
local target = TheWorld:FindEntityWithTag("pumpkin")
if target and target.components.pumpkincarvable then
    local screen = PumpkinCarvingScreen(player, target)
    TheFrontEnd:PushScreen(screen)
end
```

## Dependencies & tags
**Components used:** `pumpkincarvable` (via `target.components.pumpkincarvable:GetCutData()`), `inventory` (via `owner.replica.inventory:Has(tool, 1, true)`).
**Tags:** None added, removed, or checked by this screen.

## Properties
No public properties.

## Main functions
### `StartDraggingShape(shape)`
*   **Description:** Begins dragging a selected carving shape (line and fill layers) to be placed on the pumpkin. Enables mouse/follow handler and updates the UI focus.
*   **Parameters:** `shape` (string) – the shape identifier (e.g., `"triangle"`, `"star"`), used to look up available rotations and textures.
*   **Returns:** Nothing.

### `StopDraggingShape()`
*   **Description:** Cancels dragging mode, restores menu/shapemenu clickability, kills drag widgets, and resets focus.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StampShapeAt(x, y, shape, rot)`
*   **Description:** Permanently adds a carved shape at a given pumpkin-space position, triggers a sound effect, plays a cut animation, and marks the screen as dirty.
*   **Parameters:** `x`, `y` (number) – local pumpkin-space coordinates; `shape` (string) – shape name; `rot` (number) – rotation index (1-based).
*   **Returns:** Nothing.

### `DoAddCutAt(x, y, shape, rot)`
*   **Description:** Internal helper that adds a shape to the `self.cutdata` table and instantiates its visual representation (line/fill) on the pumpkin UI. Does *not* trigger FX or mark dirty.
*   **Parameters:** `x`, `y`, `shape`, `rot` – same as `StampShapeAt`.
*   **Returns:** Nothing.

### `MoveDraggingShapeTo(x, y)`
*   **Description:** Updates the drag widget position, clamps to pumpkin boundaries, and updates tint based on whether the position is valid.
*   **Parameters:** `x`, `y` (number) – local pumpkin-space coordinates.
*   **Returns:** `true` if the position is valid and within bounds; `false` otherwise.

### `RotateDraggingShape(delta)`
*   **Description:** Rotates the currently dragged shape by `delta` increments (±1), wrapping around the shape’s allowed rotations.
*   **Parameters:** `delta` (number) – rotation step (+1 or -1).
*   **Returns:** Nothing.

### `ClearCuts()`
*   **Description:** Clears all carved shapes from the pumpkin, resetting `self.cutdata` and all visual cut layers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HasMaxCuts()`
*   **Description:** Checks if the number of carvings has reached the configured maximum.
*   **Parameters:** None.
*   **Returns:** `true` if `#self.cutdata >= TUNING.HALLOWEEN_PUMPKINCARVER_MAX_CUTS`, otherwise `false`.

### `SaveAndClose()`
*   **Description:** Commits current carvings to the `pumpkincarvable` component on the target entity (by encoding `self.cutdata`), closes the popup, and pops the screen. Does nothing if no changes have been made (`self.dirty == false`).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early (calls `Cancel`) if no cuts have been made (`self.dirty == false`).

### `Cancel()`
*   **Description:** Cancels the carving session without saving changes, closes the popup, and pops the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowWarning()`
*   **Description:** Displays a warning popup (top of screen) for exceeding the max cut limit. Animated via `OnUpdate`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (on FX animation widget) – triggers `OnFxAnimOver` to kill the FX widget.
- **Pushes:** No events are explicitly pushed by this screen. It relies on `POPUPS.PUMPKINCARVING:Close(...)` for communication with other UI systems.