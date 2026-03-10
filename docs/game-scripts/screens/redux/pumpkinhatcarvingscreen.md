---
id: pumpkinhatcarvingscreen
title: Pumpkinhatcarvingscreen
description: UI screen component that allows players to customize pumpkin hat face features by selecting variations via keyboard, gamepad, or mouse inputs.
tags: [ui, player, customization]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 267655d9
system_scope: ui
---

# Pumpkinhatcarvingscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PumpkinHatCarvingScreen` is a UI screen that provides an interactive interface for modifying pumpkin hat face configurations. It displays tools, face parts (eyes, etc.), and variation selectors, synchronized with the `pumpkinhatcarvable` component on a target entity. The screen supports input via keyboard, controller, or mouse, and ensures local modifications are only submitted upon confirmation. It does not manage game state directly but acts as a client-facing mediator between player input and the `pumpkinhatcarvable` component.

## Usage example
```lua
local screen = PumpkinHatCarvingScreen(player, target_pumpkin_hat_entity)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `pumpkinhatcarvable` (via `target.components.pumpkinhatcarvable:GetFaceData()`), `inventory` (via `owner.replica.inventory:Has()` to check tool availability)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns the screen session. |
| `dirty` | boolean | `false` | Tracks whether face data has been modified since loading. |
| `facedata` | table | `{}` | Map of `part → variation` storing current face configuration. |
| `buttons` | table of tables | `{}` | Grid of UI buttons indexed `[row][col]`. |
| `highlights` | table | `{}` | Map of `part → highlight UIAnim` for visual feedback. |
| `menu` | Widget (Menu) | `nil` | Modal menu with Cancel, Randomize, Set buttons. |
| `shapemenu` | Widget | `nil` | Container widget for tool selectors and part labels. |
| `face` | UIAnim | `nil` | The face animation overlay on the pumpkin model. |
| `default_focus` | Widget | `nil` | Button used as initial input focus. |

## Main functions
### `SetPart(part, variation)`
*   **Description:** Updates the pumpkin face's visual representation for a given part (e.g., `"reye"`) to a specific variation and marks the screen as dirty if the value changed.
*   **Parameters:**  
    `part` (string) — Part name key (e.g., `"reye"`, `"leye"`, `"mouth"`—currently only eyes used).  
    `variation` (number) — Integer identifier for the desired visual variant.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; silently skips if the variation matches the current value.

### `GetButtonForPart(part, variation)`
*   **Description:** Maps a `part` and `variation` to its corresponding UI button in the grid.
*   **Parameters:**  
    `part` (string) — Part name key.  
    `variation` (number) — Variation ID to locate.
*   **Returns:** `Widget` — The UI button instance for the specified variation, or `nil` if out of bounds.

### `RandomizePart(part)`
*   **Description:** Selects a random valid variation for a given face part, excluding the current one, and applies it via `SetPart`.
*   **Parameters:**  
    `part` (string) — Part name key to randomize.
*   **Returns:** Nothing.

### `RandomizeFace()`
*   **Description:** Invokes `RandomizePart` for all face parts defined in `PumpkinHatCarvable.PARTS`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Cancel()`
*   **Description:** Closes the carving screen without saving changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SaveAndClose()`
*   **Description:** Commits the current face configuration (if dirty) to the server via the `PUMPKINHATCARVING` popup and closes the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** If `dirty` is false, it calls `Cancel()` instead of saving.

### `OnControl(control, down)`
*   **Description:** Handles input for global actions like cancel, randomize, and save using controller or keyboard bindings.
*   **Parameters:**  
    `control` (string) — Control identifier (e.g., `CONTROL_CANCEL`, `CONTROL_MENU_MISC_1`, `CONTROL_MENU_START`).  
    `down` (boolean) — `true` if the control was pressed (not released).
*   **Returns:** `boolean` — `true` if the control was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns localized string describing available controls (e.g., key mappings for cancel/randomize/set).
*   **Parameters:** None.
*   **Returns:** `string` — Human-readable help text.

### `OnDestroy()`
*   **Description:** Cleans up screen state: resets autopaused status, closes the carving popup, and removes screen offset.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are present).
- **Pushes:** `pumpkinhatcarvable` component is queried for face data, but the screen does not fire custom events itself.