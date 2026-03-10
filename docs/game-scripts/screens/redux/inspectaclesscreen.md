---
id: inspectaclesscreen
title: Inspectaclesscreen
description: Manages the UI screen for the Inspectacles minigame, handling input, animation flows, and solution reporting.
tags: [ui, minigame, interaction]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 551cbc6b
system_scope: ui
---

# Inspectaclesscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Inspectaclesscreen` is a UI screen that hosts the Inspectacles minigame interface. It initializes the screen layout, creates an overlay backdrop, instantiates an `InspectaclesWidget` to handle game logic, and manages screen lifecycle events such as close requests, focus transitions, and input handling. It is tied to a specific owner entity that must have the `inspectaclesparticipant` component attached.

## Usage example
```lua
local owner = TheWorld.worldstate.player
if owner and owner:HasTag("player") then
    owner.components.inspectaclesparticipant = owner.components.inspectaclesparticipant or owner:AddComponent("inspectaclesparticipant")
    TheFrontEnd:PushScreen(InspectaclesScreen(owner))
end
```

## Dependencies & tags
**Components used:** `inspectaclesparticipant` (accessed via `owner.components.inspectaclesparticipant`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity instance participating in the Inspectacles minigame. |
| `solution` | table | `{}` | A table used to collect or track solution data during the minigame. |
| `game` | InspectaclesWidget | `nil` | The widget instance hosting the minigame UI. |
| `default_focus` | Widget | `self.game` | The widget that receives default focus when the screen becomes active. |

## Main functions
### `OnDestroy()`
*   **Description:** Handles cleanup when the screen is destroyed. Pauses gameplay unpausing, reports the solution result to the `INSPECTACLES` popup, and calls the parent destroy method.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `self.game` is `nil`.

### `TryToCloseWithAnimations()`
*   **Description:** Attempts to close the screen gracefully, either via the `InspectaclesWidget`’s animation system or by popping the screen immediately if the widget is not initialized.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Processes input events. Specifically handles back/cancel controls (`CONTROL_MENU_BACK`, `CONTROL_CANCEL`) to trigger screen closure with sound feedback and animations.
*   **Parameters:**  
  `control` (number) - The control ID being triggered.  
  `down` (boolean) - Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `true` if the control was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns localized help text for player guidance (e.g., "[Button] Back").
*   **Parameters:** None.
*   **Returns:** `string` - A formatted string combining localized control name and help label.

### `OnBecomeActive()`
*   **Description:** Called when the screen becomes the active screen. Delegates to parent implementation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Called when the screen loses active status. Delegates to parent implementation.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `INSPECTACLES` popup via `POPUPS.INSPECTACLES:Close(owner, solution)` in `OnDestroy()`.  
- **Listens to:** No direct event listeners registered (`inst:ListenForEvent` is not used), though the screen responds to screen lifecycle callbacks (`OnBecomeActive`, `OnBecomeInactive`, `OnDestroy`).