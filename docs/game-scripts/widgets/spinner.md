---
id: spinner
title: Spinner
description: A UI widget that displays and allows selection from a list of options using arrow buttons, supporting both keyboard/controller input and programmatic control.
tags: [ui, widget, selection, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e3a355fe
system_scope: ui
---

# Spinner

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Spinner` is a UI widget derived from `Widget` that provides a selectable list interface with left/right navigation. It supports two visual styles ("standard" and "lean"), dynamic text rendering with truncation, optional foreground images, and controller/keyboard control hints. It is typically used in menus and configuration screens where users must choose from a fixed set of options. The component handles state transitions, sound feedback, focus management, and text/image updates in response to navigation.

## Usage example
```lua
local Spinner = require "widgets/spinner"

local options = {
    { text = "Option A", data = "A" },
    { text = "Option B", data = "B" },
    { text = "Option C", data = "C" },
}

local spinner = Spinner(
    options,
    200,            -- width
    40,             -- height
    { font = BUTTONFONT, size = 30 }, -- text info
    false,          -- editable
    nil,            -- atlas
    nil,            -- textures (nil = default)
    false           -- lean style
)

-- Optional: Set an action when selection changes
spinner:SetOnChangedFn(function(selected, old)
    print("Changed from", old, "to", selected)
end)

-- Initialize to second option
spinner:SetSelected("B")
```

## Dependencies & tags
**Components used:** None (this is a UI widget, not a server-side component; it depends on UI framework classes like `Widget`, `Text`, `Image`, `ImageButton`, and `TextEdit`).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `options` | table | `nil` | Array of option objects, each with optional `text`, `data`, `colour`, and `image`. |
| `selectedIndex` | number | `1` | Current selected index (1-based). |
| `width` | number | `150` | Width of the spinner widget. |
| `height` | number | `40` | Height of the spinner widget (set only in constructor). |
| `lean` | boolean | `false` | Enables lean visual mode (reduced borders, full-width arrows). |
| `editable` | boolean | `false` | Enables `TextEdit` instead of static `Text` if `true`. |
| `textcolour` | table | `{1,1,1,1}` | RGBA colour for the displayed text. |
| `textsize` | table | `{width = width, height = height}` | Size constraints for text layout. |
| `atlas` | string | `"images/ui.xml"` | Texture atlas path. |
| `textures` | table | `spinner_images` or `spinner_lean_images` | Texture filenames for various states. |
| `control_prev` | number | `CONTROL_PREVVALUE` | Virtual control for previous selection. |
| `control_next` | number | `CONTROL_NEXTVALUE` | Virtual control for next selection. |
| `updating` | boolean | `false` | Internal flag during programmatic selection changes. |
| `changing` | boolean | `false` | True when user is actively modifying selection via long-press/hold. |
| `enableWrap` | boolean | `nil` | Whether navigation wraps around from last to first and vice versa. |

## Main functions
### `SetSelectedIndex(idx)`
*   **Description:** Sets the spinner’s selection to the specified index (clamped to valid range). Updates text, colour, and image accordingly.
*   **Parameters:** `idx` (number) - The 1-based index to select.
*   **Returns:** Nothing.
*   **Error states:** Index is clamped between `MinIndex()` and `MaxIndex()`; invalid indices do not raise errors.

### `SetSelected(data)`
*   **Description:** Selects the option whose `data` field matches the given value, by iterating through `options`.
*   **Parameters:** `data` (any) - The data value to match against option entries.
*   **Returns:** Nothing.
*   **Error states:** If no matching `data` is found, selection remains unchanged.

### `GetSelected()`
*   **Description:** Returns the full option object at the current `selectedIndex`.
*   **Parameters:** None.
*   **Returns:** Table or `nil` — the selected option entry.

### `GetSelectedText()`
*   **Description:** Returns the display text and optional colour of the selected option.
*   **Parameters:** None.
*   **Returns:** `text` (string), `colour` (table or `nil`) — the `text` field and optional `colour` of the selected option, or `""` and `nil` if missing.

### `GetSelectedData()`
*   **Description:** Returns the `data` field of the currently selected option.
*   **Parameters:** None.
*   **Returns:** any — the `data` value of the selected option, or `nil` if the option has no `data` field.

### `Next(noclicksound)`
*   **Description:** Advances selection to the next option, wrapping if enabled; plays navigation sounds.
*   **Parameters:** `noclicksound` (boolean, optional) — If `true`, suppresses click sound.
*   **Returns:** Nothing.
*   **Error states:** No effect if disabled; negative/overflow calls are handled via `MinIndex()`/`MaxIndex()`.

### `Prev(noclicksound)`
*   **Description:** Moves selection to the previous option, wrapping if enabled; plays navigation sounds.
*   **Parameters:** `noclicksound` (boolean, optional) — If `true`, suppresses click sound.
*   **Returns:** Nothing.
*   **Error states:** Same as `Next()`.

### `EnablePendingModificationBackground()`
*   **Description:** Adds and configures a semi-transparent highlight background used to indicate unsaved changes (e.g., modifiable settings). A `SetHasModification(is_modified)` function is assigned to toggle its visibility.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOnChangedFn(fn)`
*   **Description:** Registers a callback function invoked after selection changes, with access to both new and previous selected data.
*   **Parameters:** `fn` (function) — Callback accepting `(selected_data, old_data)`.
*   **Returns:** Nothing.

### `SetOptions(options)`
*   **Description:** Replaces the internal `options` list and updates selection to stay valid (e.g., clamps `selectedIndex`, refreshes UI).
*   **Parameters:** `options` (table) — New list of option objects.
*   **Returns:** Nothing.

### `SetWrapEnabled(enable)`
*   **Description:** Enables or disables wrapping navigation (e.g., from last to first item).
*   **Parameters:** `enable` (boolean) — Enable wrapping if `true`.
*   **Returns:** Nothing.

### `SetOnClick(fn)`
*   **Description:** Sets a function to be called when the user clicks the spinner (note: actual click handling is commented out in `OnControl`).
*   **Parameters:** `fn` (function) — Click handler.
*   **Returns:** Nothing.

### `SetTextColour(r,g,b,a)`
*   **Description:** Sets the text colour. Accepts either RGBA numbers or a pre-formed table.
*   **Parameters:** `r` (number or table), `g` (number, optional), `b` (number, optional), `a` (number, optional).
*   **Returns:** Nothing.

### `Layout()`
*   **Description:** Recalculates and positions arrow images left/right relative to the spinner width and arrow size.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateState()`
*   **Description:** Updates visibility and interactivity of arrows, hints, and background based on enabled state, focus, wrap mode, and selection bounds.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddControllerHints(control_prev, control_next, mute_negative_sound)`
*   **Description:** Adds on-screen hints (e.g., controller button icons) next to arrows and enables hint refresh on update.
*   **Parameters:**  
  - `control_prev` (number or `nil`) — Override previous control.  
  - `control_next` (number or `nil`) — Override next control.  
  - `mute_negative_sound` (boolean or `nil`) — Suppress negative sound on invalid navigation.
*   **Returns:** Nothing.

### `RefreshVirtualControllerHints()`
*   **Description:** Updates hint text (e.g., "A", "B" on Xbox) based on current controller and `control_prev`/`control_next`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `OnGainFocus`, `OnLoseFocus`, `OnControl`, `OnFocusMove`, `OnUpdate` — handled internally to manage focus, input, and hint updates.
- **Pushes:** None identified (events are handled internally and no custom events are fired via `inst:PushEvent`).