---
id: cookbookpopupscreen
title: Cookbookpopupscreen
description: Displays an overlay UI screen for the cookbook interface, handling input navigation and lifecycle events.
tags: [ui, crafting, popup]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 70dbcb03
system_scope: ui
---

# Cookbookpopupscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CookbookPopupScreen` is a UI screen component that presents the cookbook interface as a popup overlay. It manages the rendering and interaction flow of the cookbook widget, handles user navigation (such as canceling back to the parent screen), and coordinates lifecycle events like initialization and destruction. It integrates with the global `TheCookbook` singleton for data persistence and state cleanup.

## Usage example
This screen is not manually instantiated by modders. It is opened programmatically by the game when the cookbook is accessed, typically via `POPUPS.COOKBOOK:Open(owner)`.

## Dependencies & tags
**Components used:** None (uses widgets: `ImageButton`, `Widget`, `CookbookWidget`, `Screen`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns or triggered the cookbook popup. |
| `book` | CookbookWidget | `nil` | Reference to the embedded cookbook widget child. |
| `default_focus` | Widget | `self.book` | Specifies the widget that receives default input focus. |

## Main functions
### `OnDestroy()`
* **Description:** Cleans up the screen upon dismissal — disables autopause, notifies the global cookbook system to close and save state, and calls parent cleanup.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles user input (e.g., back/cancel button). Displays a sound effect and pops the screen when the BACK or CANCEL control is released.
* **Parameters:**  
  `control` (number) — Input control constant (e.g., `CONTROL_MENU_BACK`).  
  `down` (boolean) — `true` if the control was pressed; function responds only when `false` (on release).  
* **Returns:** `true` if input was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text for the screen (e.g., "[Button] Back").
* **Parameters:** None.
* **Returns:** `string` — The help text string.

### `OnBecomeActive()` & `OnBecomeInactive()`
* **Description:** No-op overrides of the base screen lifecycle; delegates to parent but adds no custom logic.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** None (does not fire custom events).
- **Listens to:** None (relies on `Screen` base class for event registration; no explicit `ListenForEvent` calls observed).