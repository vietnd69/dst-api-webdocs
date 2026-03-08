---
id: quagmire_notificationwidget
title: Quagmire Notificationwidget
description: Manages the display and animation of Quagmire cooking-related notifications (e.g., recipe discovered, cooked, failed, or appraisal results) in the HUD.
tags: [ui, quagmire, hud, notification]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b8d72fdd
system_scope: ui
---

# Quagmire Notificationwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`NotificationWidget` is a UI widget responsible for rendering dynamic, animated notification popups in the Quagmire mode HUD. It handles cooking events such as recipe discovery, successful meals, overcooked/failed meals, ingredient crafting, and appraisal submissions. Notifications are displayed in fixed-position slots (or centered in a single slot mode) with a slide-in/slide-out animation sequence and accompanying sound effects. The widget is constructed as a subclass of `Widget` and uses an internal queue to manage overlapping notifications.

## Usage example
```lua
-- Typically instantiated and managed internally by the Quagmire HUD.
-- Example manual usage (non-standard):
local owner = CreateEntity()
local widget = NotificationWidget(owner, false) -- false = multi-slot layout
owner:AddChild(widget)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity that owns this widget (used for event listening). |
| `NUM_SLOTS` | number | `5` (or `1` if `centered_layout` is `true`) | Maximum concurrent notifications shown at once. |
| `centered_layout` | boolean | `false` | Whether notifications should be centered vertically instead of staggered. |
| `slots` | table | `{}` | Array tracking active popup widgets by slot index (`1..NUM_SLOTS`). |
| `queue` | table | `{}` | Queue of pending notification popups awaiting display. |

## Main functions
### `BuildPopupWidget(data)`
*   **Description:** Constructs and returns a new notification popup widget based on the provided `data`, queues it for display, and triggers its animation if a slot is available.
*   **Parameters:**  
    - `data` (table) – Notification configuration including:
        - `string` (string): Notification text (from `STRINGS.UI.HUD.QUAGMIRE_NOTFICATIONS.*`).
        - `tint` (array): RGBA color table for UI tinting.
        - `sfx` (string): Sound path to play on slide-in.
        - `icons` (table, optional): List of icon descriptors (each with `atlas` and `texture`).
        - `coins` (table, optional): 4-element table of coin counts for appraisal results.
*   **Returns:** `Widget` – The constructed popup widget instance.
*   **Error states:** If no slots are free, the popup is added to the `queue` and will be shown later when a slot opens.

### `OnRecipeMade(data)`
*   **Description:** Event callback triggered on `quagmire_notifyrecipeupdated`. Builds and displays a notification for recipe discovery, successful cooking, overcooking, or failed cooking based on the `data` payload.
*   **Parameters:**  
    - `data` (table) – Contains:
        - `new_recipe` (boolean): Whether the recipe is newly discovered.
        - `dish` (string, optional): Name of the dish cooked.
        - `product` (string): Product image identifier.
        - `overcooked` (boolean, optional): Indicates overcooked result.
        - `ingredients` (table): Ingredient list (used to determine image availability).
*   **Returns:** Nothing.

### `OnRecipeAppraised(data)`
*   **Description:** Event callback triggered on `quagmire_recipeappraised`. Schedules a notification to display after a 2-second delay, showing appraisal success and coin rewards.
*   **Parameters:**  
    - `data` (table) – Contains:
        - `dish` (string): Dish name.
        - `silverdish` (boolean): Whether silver dish was used.
        - `product` (string): Product image identifier.
        - `coins` (table): 4-element coin reward values.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Overrides base `Widget` input handling; currently delegates to the parent class and does not handle any specific controls itself.
*   **Parameters:**  
    - `control` (string) – The control being acted on.
        `down` (boolean) – Whether the control is pressed (`true`) or released (`false`).
*   **Returns:** `boolean` – `true` if the parent handled the event, otherwise `false` (not consumed here).

## Events & listeners
- **Listens to:**  
  - `quagmire_notifyrecipeupdated` (on `TheWorld`) – triggers `OnRecipeMade(data)`.  
  - `quagmire_recipeappraised` (on `TheWorld`) – triggers `OnRecipeAppraised(data)`.  
- **Pushes:** None.