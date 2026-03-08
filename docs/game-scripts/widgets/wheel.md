---
id: wheel
title: Wheel
description: Manages a circular UI menu for selecting actions or items, supporting both keyboard/mouse and gamepad navigation.
tags: [ui, controller, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a396b58d
system_scope: ui
---

# Wheel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Wheel` is a UI widget that displays a radial menu of interactive items around a central selected label. It supports both mouse (hover-based selection) and controller (analog stick) input, with features like nested wheels, cooldown visualization, and dynamic enablement checks. It inherits from `Widget` and manages UI elements (`UIAnimButton` or `ImageButton`) as menu entries arranged in a circle.

## Usage example
```lua
local wheel = Wheel("mywheel", player, {
    ignoreleftstick = false,
    ignorerightstick = true
})
wheel:SetItems({
    { label = "Item 1", bank = "mybank", build = "mybuild", anims = { idle = { anim = "idle", loop = true } } },
    { label = "Item 2", bank = "mybank", build = "mybuild", anims = { focus = { anim = "focus", loop = true } } },
}, 120, 130)
wheel:Open()
```

## Dependencies & tags
**Components used:** None directly; depends on input and frontend systems (`TheInput`, `TheFrontEnd`) and other widgets (`UIAnimButton`, `UIAnim`, `Text`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | *required* | The entity that owns/controls this wheel. |
| `selected_label` | `Text` | *created* | Label displaying the currently focused item’s label. |
| `items` | table of tables | `{}` | Nested dataset of menu items, keyed by dataset name. |
| `isopen` | boolean | `false` | Whether the wheel is currently visible and active. |
| `iscontroller` | boolean | `false` | Whether a gamepad is attached (set at `Open()` time). |
| `activeitems` | table | `nil` | The current dataset being displayed (set by `Open()`). |
| `activeitemscount` | number | `0` | Number of items in `activeitems`. |
| `cur_cell_index` | number | `0` | Index of the currently focused item (0 = none). |
| `numspacers` | number | `0` | Count of spacer items (used for L/R layout balancing). |

## Main functions
### `SetItems(dataset, radius, focus_radius, dataset_name)`
*   **Description:** Populates the wheel with menu items arranged in a circle. Each item may include label, visuals (anims or images), callbacks, nested wheels, cooldowns, and enablement checks. Clears prior items in the same dataset if present.
*   **Parameters:** 
    - `dataset` (table) — array of item definition tables.
    - `radius` (number) — distance from center where items appear when unfocused.
    - `focus_radius` (number) — distance where focused items move to (typically larger).
    - `dataset_name` (string, optional) — name for this dataset (default `"root"`). Used to support nested wheels.
*   **Returns:** Nothing.
*   **Error states:** None.

### `Open(dataset_name)`
*   **Description:** Makes the wheel visible and begins input processing. Initializes item states (enabled/disabled/cooldown), selects the first enabled or explicitly `selected` item, and begins update loop for controller navigation.
*   **Parameters:** 
    - `dataset_name` (string, optional) — name of the dataset to open (default `"root"`).
*   **Returns:** Nothing.
*   **Error states:** No-op if dataset does not exist or is empty.

### `Close()`
*   **Description:** Hides the wheel, cancels ongoing animations, clears focus, and stops update processing. Resets internal state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if wheel is not open.

### `OnUpdate(dt)`
*   **Description:** Controller-specific input handler. Reads analog stick values (left and right sticks, optionally configurable) to compute angular position and update the focused menu item. Handles spacers and deadzone logic.
*   **Parameters:** 
    - `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `iscontroller` is `false` or input magnitude is below deadzone.

### `OnControl(control, down)`
*   **Description:** Handles controller button presses. Responds to `CONTROL_CANCEL` to trigger `OnCancel()`. Delegates to base class first.
*   **Parameters:** 
    - `control` (number) — control ID (e.g., `CONTROL_CANCEL`).
    - `down` (boolean) — whether the button was pressed (`true`) or released (`false`).
*   **Returns:** `true` if the event was handled, `false` otherwise.

### `OnCancel()`
*   **Description:** Overridable hook called when the cancel action (e.g., button B or ESC) is triggered. Default implementation does nothing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnExecute()`
*   **Description:** Overridable hook called after an item’s `execute` callback returns `false`. Used for post-execution behavior (e.g., closing the wheel). Default implementation does nothing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text string for the wheel’s close action (e.g., `"B Cancel"`).
*   **Parameters:** None.
*   **Returns:** `string` — localized help text.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls found).
- **Pushes:** None (no `inst:PushEvent` calls found).