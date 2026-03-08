---
id: kitcoonpouch
title: Kitcoonpouch
description: A UI widget that displays the Kitcoon's hibernation status and toggles hibernation on user input.
tags: [ui, character, profile]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: dfd20a45
system_scope: ui
---

# Kitcoonpouch

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`KitcoonPouch` is a UI widget that renders the visual representation of the Kitcoon (a companion creature) pouch, animating between "sleep" and "empty" states based on whether the Kitcoon is currently hibernating. It acts as an interactive UI element that responds to player input (typically a button press) to toggle the hibernation state of the Kitcoon, delegating state changes to the `Profile` and `kit` objects.

## Usage example
```lua
local pouch = KitcoonPouch()
pouch:SetKit(some_kit_instance)
-- The widget automatically plays the correct animation based on Profile state
-- When the user presses ACCEPT, it toggles hibernation
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | `UIAnim` | `nil` | Child animation widget displaying the Kitcoon pouch. |
| `animstate` | `AnimState` | `nil` | Animation state object used to control playback and visual properties. |
| `kit` | `table` (optional) | `nil` | Reference to the Kitcoon prefab/component; must be set via `SetKit()` before use. |
| `onclick` | `function` | `nil` | Click handler that toggles hibernation and updates animation. |

## Main functions
### `SetKit(kit)`
*   **Description:** Assigns the Kitcoon instance to this pouch widget, enabling interaction with hibernation logic.
*   **Parameters:** `kit` (table) — the Kitcoon entity/component.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles control input; triggers the hibernation toggle when the ACCEPT control is released.
*   **Parameters:**  
  * `control` (string) — the control identifier (e.g., `"accept"`).  
  * `down` (boolean) — `true` if the control is pressed, `false` if released.  
*   **Returns:** `true` if the base class handled the event; otherwise delegates to internal `onclick` on release of `CONTROL_ACCEPT`.

### `onclick()`
*   **Description:** Internal callback invoked on ACCEPT release. Toggles hibernation state if the Kitcoon has a build, updates `Profile`, and notifies the Kitcoon via `WakeFromHibernation()` or `GoToHibernation()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.