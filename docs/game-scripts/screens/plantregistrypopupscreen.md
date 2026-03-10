---
id: plantregistrypopupscreen
title: Plantregistrypopupscreen
description: Displays a UI screen for viewing plant registry data in the Redux interface, owned by a specific entity.
tags: [ui, redux, popup]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 2e9c69f0
system_scope: ui
---

# Plantregistrypopupscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PlantRegistryPopupScreen` is a UI screen that presents a plant registry widget in a modal overlay. It is instantiated with an `owner` entity and presents a semi-transparent background that closes the screen when clicked, and a centered, scrollable registry interface populated using `PlantRegistryWidget`. The screen handles input for dismissal via controller or keyboard back/cancel controls and integrates with the global `TheFrontEnd` screen stack.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("plantregistrypopup") -- hypothetical usage
-- To open the screen:
TheFrontEnd:PushScreen(PlantRegistryPopupScreen(some_entity))
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity that owns or is associated with the registry data. |
| `plantregistry` | `PlantRegistryWidget` | `nil` | The embedded widget displaying registry contents. |
| `default_focus` | widget | `self.plantregistry` | The widget that receives focus when the screen becomes active. |

## Main functions
### `PlantRegistryPopupScreen(owner)`
*   **Description:** Constructor for the screen. Sets up the modal overlay with a semi-transparent black background and a centered `PlantRegistryWidget`.
*   **Parameters:** `owner` (entity) – the entity whose plant registry data will be displayed.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnDestroy()`
*   **Description:** Cleans up the screen when it is destroyed. Disables autopause and signals `POPUPS.PLANTREGISTRY` to close the popup for the owner.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input for screen dismissal. Closes the screen when the user presses the back or cancel control (and the key is released).
*   **Parameters:**  
  `control` (number) – the control constant (e.g., `CONTROL_MENU_BACK`).  
  `down` (boolean) – `true` if the key is pressed down, `false` on release.  
*   **Returns:** `true` if the event was handled, `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns localized help text for the back/cancel action.
*   **Parameters:** None.
*   **Returns:** `string` – localized help message (e.g., `"B  BACK"`).

### `OnBecomeActive()`
*   **Description:** Called when the screen becomes the active top screen. Delegates to base implementation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Called when the screen is no longer active. Delegates to base implementation.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified