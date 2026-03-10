---
id: controlsscreen_ps4
title: Controlsscreen Ps4
description: Renders the PlayStation-specific controller layout and input labels onscreen for DST's controls menu.
tags: [ui, controller, platform]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: dfd26caf
system_scope: ui
---

# Controlsscreen Ps4

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Controlsscreen_ps4` is a UI screen component that displays platform-specific PlayStation controller diagrams and button labels for the DualShock 4 and PlayStation Vita devices. It inherits from `Screen`, dynamically loads controller image assets, and populates labeled regions for each button based on device type. The screen automatically detects the active input device and switches layouts accordingly.

## Usage example
This screen is instantiated and managed by the UI system (e.g., via `TheFrontEnd:PushScreen("controlsscreen_ps4", in_game)`). Typical modder interaction is limited to referencing its strings or extending its layout logic.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `in_game` | boolean | `nil` | Indicates whether the screen was opened from within a game session. |
| `device` | number | `nil` | Current input device type (e.g., `DEVICE_DUALSHOCK4` or `DEVICE_VITA`). |
| `layouts` | table | `{}` | Map of device IDs to their respective `Widget` layout instances. |
| `bg` | Image | `nil` | Background image widget. |
| `root` | Widget | `nil` | Root container widget for layout elements. |

## Main functions
### `PopulateLayout(device)`
* **Description:** Constructs and returns a `Widget` layout containing the controller image and all associated localized button labels for the given device.
* **Parameters:**  
  `device` (number) – Device identifier (e.g., `DEVICE_DUALSHOCK4`, `DEVICE_VITA`).  
* **Returns:** `Widget` – The constructed layout container with image and labels.  
* **Error states:** None. Uses hardcoded positions and device-specific label maps.

### `OnUpdate(dt)`
* **Description:** Periodically checks for a change in the active input device and swaps layouts if needed.
* **Parameters:**  
  `dt` (number) – Time elapsed since the last frame.  
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events. Delegates standard screen controls first, then closes the screen if the cancel button is released.
* **Parameters:**  
  `control` (number) – Control ID (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) – Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `boolean` – `true` if handled by parent class, else proceeds to cancel handling.

### `Close()`
* **Description:** Closes the screen and returns to the previous screen in the stack.
* **Parameters:** None.  
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns a localized help string indicating how to close the screen (e.g., "Start Button Back").
* **Parameters:** None.  
* **Returns:** `string` – A concatenated help text string.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified