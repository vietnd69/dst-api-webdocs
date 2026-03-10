---
id: wardrobepopup
title: Wardrobepopup
description: Manages the UI screen for equipping character skins in the wardrobe system, handling user input, skin selection, and applying or discarding changes.
tags: [ui, character, skin]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7f03443b
system_scope: ui
---

# Wardrobepopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`WardrobePopupScreen` is a UI screen component responsible for presenting and managing the character skin customization interface (wardrobe). It integrates a `DressupPanel` for skin selection, displays the current character portrait, and provides controls (buttons) to confirm, cancel, or reset changes. It handles both online and offline skin support modes and integrates with the `TheInventory`, `TheNet`, and `TheFrontEnd` systems for state persistence and navigation.

## Usage example
```lua
-- Assume owner_player is a valid player entity and profile holds the character skin data.
local recent_item_types = nil
local recent_item_ids = nil

local screen = WardrobePopupScreen(owner_player, profile, recent_item_types, recent_item_ids)
TheFrontEnd:AddScreen(screen)
```

## Dependencies & tags
**Components used:** None identified (does not use `inst.components.X` pattern).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `WardrobePopupScreen(owner_player, profile, recent_item_types, recent_item_ids)`
*   **Description:** Constructor. Initializes the wardrobe screen, sets up UI layout (root widget, portrait image, `DressupPanel`, and button menu), configures layout positions based on online/offline mode, and registers screen-specific behavior.
*   **Parameters:**
    *   `owner_player` (entity) — The player entity whose wardrobe is being viewed.
    *   `profile` (table) — Contains the current character skin configuration.
    *   `recent_item_types` (table or nil) — List of item types recently opened in the gift popup (used for skin context).
    *   `recent_item_ids` (table or nil) — Corresponding item IDs matching `recent_item_types`.
*   **Returns:** Instance of `WardrobePopupScreen`.

### `OnControl(control, down)`
*   **Description:** Handles controller input events for navigation and skin scrolling.
*   **Parameters:**
    *   `control` (number) — The control identifier (e.g., `CONTROL_CANCEL`, `CONTROL_SCROLLFWD`).
    *   `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
*   **Returns:** `true` if the input was handled; otherwise, delegates to base class.
*   **Error states:** Returns `true` only when the control matches known wardrobe-specific actions.

### `Cancel()`
*   **Description:** Resets any unsaved skin changes and closes the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Reset()`
*   **Description:** Resets the `DressupPanel` to its last committed state and updates the character portrait.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Close()`
*   **Description:** Commits selected skins to the game state (if online/offline skin support is enabled), notifies the `POPUPS.WARDROBE` system, triggers cleanup in the `DressupPanel`, and pops the screen from the front-end stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetPortrait()`
*   **Description:** Updates the character portrait image based on the selected base skin and the current character prefab.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text for the current controller layout (e.g., "Button A Cancel").
*   **Parameters:** None.
*   **Returns:** `string` — The help text string.

## Events & listeners
None identified.