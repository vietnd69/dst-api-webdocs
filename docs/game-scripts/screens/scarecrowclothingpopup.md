---
id: scarecrowclothingpopup
title: Scarecrowclothingpopup
description: A UI screen that allows players to configure custom skin appearances for scarecrow entities in offline or online modes.
tags: [ui, skin, dressup, scarecrow]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 850d68ae
system_scope: ui
---

# Scarecrowclothingpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ScarecrowClothingPopupScreen` is a specialized UI screen that presents a `DressupPanel` for configuring skin appearances for scarecrow entities. It is instantiated with an owner scarecrow, a doer (typically the player performing the action), and a character profile. The screen manages focus navigation between the dress-up panel and action buttons, handles controller input for skin scrolling, and coordinates closing behavior with skin data transmission to the `WARDROBE` popup system.

## Usage example
```lua
local scarecrow = TheWorld:FindEntityWithTag("scarecrow")
if scarecrow and scarecrow.components.dressup ~= nil then
    local doer = ThePlayer
    local profile = scarecrow.prefab
    TheFrontEnd:PushScreen(ScarecrowClothingPopupScreen(scarecrow, doer, profile))
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_scarecrow` | entity | `nil` | The scarecrow entity whose skins are being configured. |
| `doer` | entity | `nil` | The entity performing the dressing action (e.g., the player). |
| `proot` | widget | `nil` | Root widget container for the screen UI layout. |
| `root` | widget | `nil` | Internal container widget with fixed anchor position. |
| `dressup` | dressuppanel | `nil` | The dress-up panel widget used to select skins. |
| `menu` | menu | `nil` | Action button menu (e.g., Cancel/Set). |
| `default_focus` | widget | `self.menu` | Widget that initially receives focus on screen activation. |
| `SCREEN_OFFSET` | number | `-0.285 * RESOLUTION_X` | Horizontal offset applied to the camera when this screen is active. |

## Main functions
### `ScarecrowClothingPopupScreen(owner_scarecrow, doer, profile)`
*   **Description:** Constructor for the screen. Initializes UI layout, creates a dress-up panel with an empty skeleton configuration, and sets up menu buttons based on whether offline skin support is available.
*   **Parameters:**  
    `owner_scarecrow` (entity) – The scarecrow entity to configure.  
    `doer` (entity) – The entity performing the configuration (e.g., player).  
    `profile` (string) – Character profile identifier used for skin selection.  
*   **Returns:** `self` (the constructed screen instance).
*   **Error states:** None documented.

### `OnDestroy()`
*   **Description:** Cleanup method called when the screen is destroyed. Disables autopausing, removes the screen from camera offset, and calls parent destructor.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Called when the screen becomes the active screen. If a controller is attached, sets initial focus on `default_focus`.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `DoFocusHookups()`
*   **Description:** Configures bidirectional focus navigation between the `dressup` panel and `menu`.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles controller and keyboard input, including navigation scrolling and cancel actions.
*   **Parameters:**  
    `control` (string) – The control key pressed (e.g., `CONTROL_CANCEL`, `CONTROL_PREVVALUE`).  
    `down` (boolean) – `true` if the key was pressed down; `false` for release.  
*   **Returns:** `true` if input was handled; `false` otherwise.
*   **Error states:** Uses `DressupPanel:ScrollBack()`/`:ScrollFwd()` only when `down` is `true`.

### `Cancel()`
*   **Description:** Cancels the operation by closing the screen without applying any skin changes.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `Close(apply_skins)`
*   **Description:** Closes the screen and reports the selected skins to the `WARDROBE` popup system. Only includes skin data in the report if offline skin support is available or in online mode.
*   **Parameters:**  
    `apply_skins` (boolean) – Whether to apply and transmit selected skins.  
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text describing how to cancel the screen (e.g., "ESC Cancel").
*   **Parameters:** None.  
*   **Returns:** `string` – The help text string.

## Events & listeners
*   **Listens to:** None  
*   **Pushes:** None