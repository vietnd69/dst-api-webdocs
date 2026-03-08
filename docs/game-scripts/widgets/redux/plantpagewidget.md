---
id: plantpagewidget
title: Plantpagewidget
description: Serves as the base widget class for all plant registry pages, providing shared UI functionality like back navigation and input handling.
tags: [ui, plant, navigation, base]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 16d174e5
system_scope: ui
---

# Plantpagewidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlantPageWidget` is a base widget class used for implementing individual pages in the plant registry UI. It extends `Widget` and provides common behavior such as a back button (mouse/keyboard only), cancellation input handling to close the current page, and help text support. Modders may either extend this class or implement equivalent functionality from scratch if building fully custom plant pages.

## Usage example
```lua
local PlantPageWidget = require "widgets/redux/plantpagewidget"

local MyCustomPage = Class(PlantPageWidget, function(self, name, plantspage, data)
    PlantPageWidget._ctor(self, name, plantspage, data)
    -- Add custom page content here
end)

-- Example instantiation within a larger UI system:
-- local page = MyCustomPage("mymod_plant_page", myPlantsPageInstance, plantData)
-- myPlantsPageInstance:AddChild(page)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plantspage` | widget | `nil` | Reference to the parent plant registry page widget that owns this page. Used to trigger page closure. |
| `data` | table | `nil` | Page-specific data passed in on construction (e.g., plant registry entry data). |
| `root` | widget | Created internally | Root child widget for layout of page contents. |
| `back_button` | widget or `nil` | `nil` (console) | Back button widget, only created on non-console platforms. Triggers `plantspage:ClosePageWidget()` on press. |

## Main functions
### `OnControl(control, down)`
* **Description:** Handles input events. Overrides base `OnControl` to intercept the `CONTROL_CANCEL` input (e.g., Escape or B button) to close the current page instead of exiting the entire screen.
* **Parameters:**  
  `control` (enum) — The input control pressed.  
  `down` (boolean) — `true` if the control was pressed down; `false` on release.
* **Returns:** `true` if the event was handled (preventing propagation); `false` otherwise.
* **Error states:** Delegates to base class first via `PlantPageWidget._base.OnControl`; returns early with `true` if base handles it.

### `HasExclusiveHelpText()`
* **Description:** Indicates that this widget provides its own help text (e.g., for in-game help overlay).
* **Parameters:** None.  
* **Returns:** `true`.

### `GetHelpText()`
* **Description:** Returns localized help text describing the back action for the current input device (keyboard/mouse or controller).
* **Parameters:** None.  
* **Returns:** `string` — e.g., `"ESC Back"` or `"B Back"`, depending on active controller.

### `HideBackdrop()`
* **Description:** Template method for subclasses to indicate whether the default page backdrop should be hidden. By default, returns `false` to keep the backdrop visible.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if backdrop should be hidden; `false` otherwise.

## Events & listeners
None identified