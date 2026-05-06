---
id: quagmire_recipebookscreen
title: QuagmireRecipeBookScreen
description: Modal screen displaying the Quagmire event recipe book with minimap-style controls and background dimming.
tags: [screen, ui, quagmire, event]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: screens
source_hash: c6565427
system_scope: ui
---

# QuagmireRecipeBookScreen

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`QuagmireRecipeBookScreen` is a modal UI screen extending `Screen`. It is specifically designed for the Quagmire event to display the recipe book (`QuagmireBookWidget`). The screen hijacks the `MapScreen` constructor logic to leverage existing minimap control flows. It renders a semi-transparent black background that closes the screen when clicked, and optionally displays map controls (zoom/rotate) for mouse users. Controller input is handled via `OnControl`, primarily supporting cancel/back navigation.

## Usage example
```lua
local QuagmireRecipeBookScreen = require("screens/quagmire_recipebookscreen")

-- Push the screen, typically passing the player or HUD owner
TheFrontEnd:PushScreen(QuagmireRecipeBookScreen(ThePlayer))
```

## Dependencies & tags
**External dependencies:**
- `widgets/screen` -- Screen base class
- `widgets/widget` -- Generic widget container
- `widgets/imagebutton` -- Background click-to-close image
- `widgets/redux/quagmire_book` -- QuagmireBookWidget, the main content display
- `widgets/redux/templates` -- UI template utilities
- `widgets/mapcontrols` -- Minimap-style control buttons (zoom/rotate)

**Components used:** None.

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | --- | The entity owning this screen (typically the player). Used for HUD scaling events. |
| `book` | QuagmireBookWidget | --- | The main recipe book widget instance added to the root. |
| `bottomright_root` | Widget | `nil` | Container for bottom-right map controls. Only created if `TheInput:ControllerAttached()` is false. |
| `mapcontrols` | MapControls | `nil` | Map control widget instance (zoom/rotate buttons). Only created for mouse input. |
| `black` | ImageButton | --- | Full-screen semi-transparent background. Clicking triggers `TheFrontEnd:PopScreen()`. |

## Main functions
### `_ctor(owner)`
*   **Description:** Initializes the screen. Calls `Screen._ctor` with `"MapScreen"` to hijack minimap logic. Creates the background dimmer, the recipe book widget, and conditionally adds map controls for mouse users. Registers a listener for HUD scaling updates.
*   **Parameters:**
    - `owner` -- Entity instance (usually the player) owning the HUD
*   **Returns:** nil
*   **Error states:** Errors if `owner` is nil and `owner.HUD` is accessed in the HUD scale listener registration (guarded by `if not TheInput:ControllerAttached()`).

### `OnBecomeInactive()`
*   **Description:** Lifecycle hook called when the screen is pushed behind another screen or popped. Calls the base class implementation. Contains commented-out logic for toggling minimap visibility.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `OnBecomeActive()`
*   **Description:** Lifecycle hook called when the screen comes to the front. Calls the base class implementation. Contains commented-out logic for toggling minimap visibility.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `OnControl(control, down)`
*   **Description:** Handles input. Processes `CONTROL_MENU_BACK` and `CONTROL_CANCEL` to close the screen with a sound effect. Rotation and zoom controls (`CONTROL_ROTATE_LEFT`, `CONTROL_MAP_ZOOM_IN`, etc.) are present in the source but commented out; this function returns `false` for those inputs in the current build.
*   **Parameters:**
    - `control` -- CONTROL_* constant
    - `down` -- boolean indicating key press state
*   **Returns:** boolean -- `true` if input was handled (cancel/back), `false` otherwise
*   **Error states:** None. References `ThePlayer.components.playercontroller` in commented code (see `playercontroller.lua` for `RotLeft`/`RotRight`).

### `GetHelpText()`
*   **Description:** Generates the help text string displayed in the UI hint bar. Concatenates the localized cancel control name with the back action string.
*   **Parameters:** None
*   **Returns:** string -- Help text (e.g., "B Back")
*   **Error states:** None.

## Events & listeners
**Listens to:**
- `refreshhudsize` (on `owner.HUD.inst`) -- Triggers a lambda that updates `bottomright_root` scale to match the current HUD scale.

**Pushes:** None.