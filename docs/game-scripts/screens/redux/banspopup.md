---
id: banspopup
title: Banspopup
description: Renders a UI popup screen displaying the list of banned players in the current server session.
tags: [ui, server, multiplayer]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: b8de28c1
system_scope: ui
---

# Banspopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BansPopup` is a UI screen component that presents the list of players banned from the current server. It extends `Screen` and integrates with the Redux UI framework, using `BanTab` to render ban entries and `TEMPLATES` to structure the layout. It is typically accessed from the server listing or admin UI flows and handles user input for closing the screen.

## Usage example
```lua
-- Example usage within a larger UI flow (e.g., from a server management screen):
TheFrontEnd:PushScreen(BansPopup())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `DoInit()`
*   **Description:** Initializes the UI layout and widgets for the popup, including background tint, back button (if no controller is attached), and the ban tab.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input events for the screen. Specifically, triggers screen closure on `CONTROL_CANCEL` (e.g., Escape or B button) when the key/button is released (`down == false`).
*   **Parameters:**  
  - `control` (number) — the control constant (e.g., `CONTROL_CANCEL`).  
  - `down` (boolean) — whether the control is currently pressed (`true`) or released (`false`).  
*   **Returns:** `true` if the control was handled; otherwise delegates to the base class and returns its result.

### `GetHelpText()`
*   **Description:** Returns localized help text indicating how to close the popup (e.g., pressing "Back" or "Escape").
*   **Parameters:** None.
*   **Returns:** `string` — formatted help text combining localized control label and string token.

### `_Close()`
*   **Description:** Closes the screen by popping it from the frontend stack.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified