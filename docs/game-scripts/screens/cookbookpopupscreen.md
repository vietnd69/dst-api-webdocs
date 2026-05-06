---
id: cookbookpopupscreen
title: Cookbookpopupscreen
description: Modal popup screen displaying the cookbook interface with a dimmed background overlay and controller navigation support.
tags: [screen, ui, cookbook, modal]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: screens
source_hash: c6891485
system_scope: ui
---

# Cookbookpopupscreen

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`CookbookPopupScreen` is a modal popup screen extending `Screen`. It displays the cookbook interface via `CookbookWidget`, dims the underlying gameplay with a semi-transparent black overlay, and auto-pauses the game while open. The screen handles `CONTROL_CANCEL` and `CONTROL_MENU_BACK` input to close itself, and saves cookbook filter settings on destruction.

## Usage example
```lua
local CookbookPopupScreen = require("screens/cookbookpopupscreen")

-- Push the screen with the player entity as owner
TheFrontEnd:PushScreen(CookbookPopupScreen(player))

-- Screen auto-pauses game; closes on CANCEL/MENU_BACK or clicking background
```

## Dependencies & tags
**External dependencies:**
- `widgets/screen` -- Screen base class
- `widgets/widget` -- Widget base class for root container
- `widgets/imagebutton` -- ImageButton for the dimmed background overlay
- `widgets/redux/cookbookwidget` -- CookbookWidget displays the actual cookbook content
- `widgets/redux/templates` -- TEMPLATES module (imported but not directly used in this file)

**Components used:** None.

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | --- | The player entity that owns this popup. Passed to `CookbookWidget`. |
| `book` | CookbookWidget | --- | The child widget displaying cookbook content. Added to root container. |
| `default_focus` | Widget | `self.book` | The widget that receives initial focus when screen becomes active. |

## Main functions
### `_ctor(owner)`
* **Description:** Initialises the screen, calls `Screen._ctor(self, "CookbookPopupScreen")`, builds the widget tree (black overlay, root container, cookbook widget), sets default focus to the book, and enables auto-pause via `SetAutopaused(true)`.
* **Parameters:**
  - `owner` -- player entity that owns this popup
* **Returns:** nil
* **Error states:** Errors if `TheFrontEnd` global is nil when background overlay is clicked (no nil guard present in OnClick closure).

### `OnDestroy()`
* **Description:** Cleanup handler called when screen is destroyed. Disables auto-pause, closes the cookbook popup system via `POPUPS.COOKBOOK:Close()`, clears new item flags, saves filter settings via `TheCookbook:Save()`, and calls base class `OnDestroy`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `POPUPS.COOKBOOK` or `TheCookbook` globals are nil (no guard present).

### `OnBecomeInactive()`
* **Description:** Called when screen becomes inactive. Calls base class `OnBecomeInactive`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnBecomeActive()`
* **Description:** Called when screen becomes active. Calls base class `OnBecomeActive`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnControl(control, down)`
* **Description:** Handles input. First calls base class `OnControl`. If input is `CONTROL_MENU_BACK` or `CONTROL_CANCEL` on key release (not down), plays click sound and pops this screen from the FrontEnd stack. Returns true if handled.
* **Parameters:**
  - `control` -- one of CONTROL_* constants
  - `down` -- boolean (true on press, false on release)
* **Returns:** boolean — true if handled, false otherwise
* **Error states:** None — guards against `down == true` before processing cancel.

### `GetHelpText()`
* **Description:** Returns localized help text for controller hints. Queries the current controller ID and builds a string showing the CANCEL button label with the localized "BACK" string from `STRINGS.UI.HELP.BACK`.
* **Parameters:** None
* **Returns:** string — help text for display
* **Error states:** Errors if `TheInput` or `STRINGS.UI.HELP` globals are nil (no guard present).

## Events & listeners
None — screens consume input via OnControl, not engine event subscriptions. The black background overlay has an OnClick handler that calls `TheFrontEnd:PopScreen()`, but this is widget-level callback, not an entity event listener.