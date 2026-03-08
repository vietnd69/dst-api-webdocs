---
id: numericspinner
title: Numericspinner
description: A UI widget for selecting integer values within a specified range, supporting both spinner buttons and direct text input.
tags: [ui, input, widgets]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 59239fbe
system_scope: ui
---

# Numericspinner

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`NumericSpinner` is a UI widget that extends `Spinner` to provide integer selection within a configurable range (`min` to `max`). It supports both button-based navigation (inherited from `Spinner`) and direct text input when enabled (`editable = true`). The component enforces numeric validation and clamping when values are entered via keyboard or text input.

## Usage example
```lua
local NumericSpinner = require "widgets/numericspinner"
local spinner = NumericSpinner(1, 10, 80, 30, {font = "fonts/corruptor.fnt"}, "images/spinner.tex", {"spin_arrow_left.tex", "spin_arrow_right.tex"}, true, false, 100, 24)
spinner:SetSelected(5)
local value = spinner:GetSelected() -- returns 5
```

## Dependencies & tags
**Components used:** `Spinner` (base class, via `require "widgets/spinner"`). No direct component or tag usage is performed.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `min` | number | N/A (constructor parameter) | Minimum allowed integer value. |
| `max` | number | N/A (constructor parameter) | Maximum allowed integer value. |
| `selectedIndex` | number | `0` (inherited) | Current integer index (clamped to `[min, max]`). |

## Main functions
### `GetSelected()`
*   **Description:** Returns the currently selected integer value. If text input is enabled and the widget is not updating, it parses and validates the displayed text before returning.
*   **Parameters:** None.
*   **Returns:** `number` — the selected integer value, clamped to `[min, max]`.

### `GetSelectedIndex()`
*   **Description:** Alias for `GetSelected()`. Parses and validates the text input when editable and not updating.
*   **Parameters:** None.
*   **Returns:** `number` — the selected integer value.

### `GetSelectedText()`
*   **Description:** Returns the string representation of the selected value.
*   **Parameters:** None.
*   **Returns:** `string` — the selected value as text (e.g., `"5"`).

### `GetSelectedData()`
*   **Description:** Alias for `GetSelected()`. Returns the selected integer value.
*   **Parameters:** None.
*   **Returns:** `number` — the selected integer value.

### `MinIndex()`
*   **Description:** Returns the minimum allowed index.
*   **Parameters:** None.
*   **Returns:** `number` — the `min` value.

### `MaxIndex()`
*   **Description:** Returns the maximum allowed index.
*   **Parameters:** None.
*   **Returns:** `number` — the `max` value.

### `OnKeyDown(key)`
*   **Description:** Passes keyboard input to the underlying text field if editable mode is enabled.
*   **Parameters:** `key` — key code from input event.
*   **Returns:** Nothing.

### `OnTextInput(text)`
*   **Description:** Appends typed text to the input field if editable mode is enabled.
*   **Parameters:** `text` (`string`) — the input text to append.
*   **Returns:** Nothing.

## Events & listeners
None identified.