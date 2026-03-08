---
id: wordpredictionwidget
title: Wordpredictionwidget
description: Renders a UI widget for word prediction in the console, supporting keyboard and mouse navigation through prediction suggestions.
tags: [ui, console, input, autocomplete]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 76031d2f
system_scope: ui
---

# Wordpredictionwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WordPredictionWidget` is a UI widget that displays word prediction suggestions for the console text input. It dynamically refreshes predictions as the user types, supports tab/enter-based completion, and provides scrolling and keyboard navigation (arrow keys, tab, escape). It is built on top of the `WordPredictor` utility and integrates with the `TextEditWidget` to apply completions.

## Usage example
```lua
-- Typically instantiated internally by the console UI, not manually added
-- Example of interaction (not direct usage, for illustration only):
local widget = WordPredictionWidget(text_edit_instance, 300, "tab enter")
widget:RefreshPredictions(true)
```

## Dependencies & tags
**Components used:** `wordpredictor` (via `WordPredictor` utility), `text_edit` (via `text_edit.inst`), `ConsoleScreenSettings`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `word_predictor` | `WordPredictor` instance | `WordPredictor()` | Manages prediction logic and list. |
| `text_edit` | reference | `nil` | Reference to the owning text input widget. |
| `max_width` | number | `300` | Maximum horizontal width (in pixels) of the widget container. |
| `enter_complete` | boolean | `false` | Whether pressing ENTER triggers completion. |
| `tab_complete` | boolean | `false` | Whether pressing TAB triggers completion. |
| `expanded` | boolean | depends on `ConsoleScreenSettings` | Whether the widget is expanded (multi-row display). |
| `start_index` | number | `1` | Starting index for scrolled prediction list. |
| `prediction_btns` | table | `{}` | List of active prediction buttons (buttons only). |
| `active_prediction_btn` | number or nil | `nil` | Index (relative to `prediction_btns`) of currently selected prediction. |
| `prediction_root` | Widget | - | Container widget for prediction buttons. |
| `backing` | Image | - | Background visual for the widget. |

## Main functions
### `RefreshPredictions(reset)`
*   **Description:** Refreshes the list of word predictions based on current text in the `text_edit`, updates the displayed button list, and handles scrolling and visibility. Called internally on text change or input events.
*   **Parameters:** 
    * `reset` (boolean, optional) — if `true`, resets `start_index` to `1` and disables scroll buttons.
*   **Returns:** Nothing.
*   **Error states:** If prediction list is empty, hides the widget and clears all buttons.

### `Dismiss()`
*   **Description:** Clears the prediction state, hides the widget, and saves expanded state to settings.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ResolvePrediction(prediction_index)`
*   **Description:** Delegates to the `WordPredictor` to apply a specific prediction (by index).
*   **Parameters:** 
    * `prediction_index` (number) — the 1-based index in the full prediction matches list.
*   **Returns:** Result of `word_predictor:Apply(prediction_index)`.

### `OnRawKey(key, down)`
*   **Description:** Handles raw keyboard input when the widget is active (e.g., navigation, completion, dismissal). Overrides base widget behavior.
*   **Parameters:** 
    * `key` (KEY_*) — the key code pressed (e.g., `KEY_TAB`, `KEY_ENTER`, `KEY_LEFT`).
    * `down` (boolean) — whether the key is pressed (`true`) or released (`false`).
*   **Returns:** `true` if the key event is consumed (preventing further processing), `false` otherwise.

### `OnControl(control, down)`
*   **Description:** Handles control bindings (e.g., `CONTROL_ACCEPT`, `CONTROL_CANCEL`) for button-like input.
*   **Parameters:** 
    * `control` (CONTROL_*) — the control identifier.
    * `down` (boolean) — whether the control was activated.
*   **Returns:** `true` if handled, `false` otherwise.

### `OnTextInput(text)`
*   **Description:** Handles text input (e.g., literal `"\t"` character) for tab completion when not handled via key events.
*   **Parameters:** 
    * `text` (string) — the text inserted (e.g., tab character).
*   **Returns:** `true` if tab completion was triggered, `false` otherwise.

### `IsMouseOnly()`
*   **Description:** Returns `true` if the widget should only respond to mouse events (i.e., neither enter nor tab completion is enabled).
*   **Parameters:** None.
*   **Returns:** boolean.

## Events & listeners
- **Listens to:** 
    * `onconsolehistoryupdated` — hides the widget when console history is updated.
- **Pushes:** 
    * `onwordpredictionupdated` — fired after predictions are refreshed, to notify listeners (e.g., log positioning).