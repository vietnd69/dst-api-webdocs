---
id: mysteryboxscreen
title: Mysteryboxscreen
description: Renders the UI screen for viewing and opening mystery boxes, handling selection, display, and server-side box opening logic.
tags: [ui, inventory, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 113081fd
system_scope: ui
---

# Mysteryboxscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MysteryBoxScreen` is a UI screen that presents a selection interface for mystery boxes, allowing players to choose a box type, view its count and description, and open it via a server request. It inherits from `Screen` and integrates with DST’s Redux UI framework. The screen dynamically populates box options using `GetMysteryBoxCounts` and `GetSkinName`, and delegates actual opening to `ItemBoxOpenerPopup`, which in turn calls `TheItems:OpenBox`.

## Usage example
```lua
-- Typically invoked internally via TheFrontEnd:PushScreen
local screen = MysteryBoxScreen(prev_screen, user_profile)
TheFrontEnd:PushScreen(screen)

-- Internally, the screen opens a box when selected:
local box_item_type = "mysterybox_classic_4"
local box_item_id = GetMysteryBoxItemID(box_item_type)
TheItems:OpenBox(box_item_id, function(success, item_types)
    -- Handle results
end)
```

## Dependencies & tags
**Components used:** None (`MysteryBoxScreen` is a screen/widget, not an ECS component).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `UpdateMysteryBoxInfo()`
* **Description:** Refreshes the box selection list and display based on current inventory counts. Queries available mystery box types and their counts via `GetMysteryBoxCounts`. Ensures at least one default box type (`mysterybox_classic_4`) is always available. Hides or shows the “all out of boxes” message and enables/disables the open button depending on availability.
* **Parameters:** None.
* **Returns:** Nothing.

### `_BuildBoxesPanel()`
* **Description:** Constructs and returns the UI panel containing the box selection spinner, image, count text, and open button. Initializes event handlers for spinner changes and button clicks. On spinner change, updates the displayed item count, description, and animation skin, and toggles button state.
* **Parameters:** None.
* **Returns:** `Widget` — the container widget (`boxes_ss`) for the box interaction UI.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Shows the screen if not already visible, resets internal state, and enables the kitcoon puppet animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Called when the screen loses focus. Disables the kitcoon puppet animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events, specifically the `CONTROL_CANCEL` action to exit the screen via `TheFrontEnd:FadeBack()`.
* **Parameters:**  
  `control` (string) — the control identifier (e.g., `"escape"`).  
  `down` (boolean) — whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was handled; otherwise `false`.

### `GetHelpText()`
* **Description:** Returns localized help text describing the cancel button’s function (e.g., “Esc Back”).
* **Parameters:** None.
* **Returns:** `string` — the help text.

### `OnUpdate(dt)`
* **Description:** Placeholder; currently does nothing.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

### `Constructor: MysteryBoxScreen(prev_screen, user_profile)`
* **Description:** Initializes the screen. Calls `Screen._ctor` with the identifier `"MysteryBoxScreen"`, stores `user_profile`, calls `DoInit` to build the UI, and sets default focus to the boxes panel.
* **Parameters:**  
  `prev_screen` (Screen or nil) — the screen to return to on cancel.  
  `user_profile` (table) — user profile data (unused in current implementation).  
* **Returns:** `MysteryBoxScreen` instance.

## Events & listeners
None identified.