---
id: worldcustomizationlist
title: Worldcustomizationlist
description: Renders an interactive list of world customization options (e.g., seasons, world size, presets) with editable spinners and dynamic visual feedback for modified values.
tags: [ui, world, customization]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 33ea05c5
system_scope: ui
---

# Worldcustomizationlist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CustomizationList` is a UI widget responsible for displaying and managing world customization options in the sandbox menu. It arranges options in a scrolling grid with up to two columns, renders labels for option groups, and provides spinner widgets for selecting values. It supports visual feedback for changes relative to defaults and preset values via background tinting. The widget does not own data but consumes `options` and `location` inputs and integrates with a callback (`spinnerCB`) to propagate changes.

## Usage example
```lua
local CustomizationList = require "widgets/redux/worldcustomizationlist"

local list = CustomizationList("forest", {
    { name = "world_size", group = "world", grouplabel = "World", default = "medium", options = { ... } },
    -- ... more options
}, function(option_name, selection)
    print("Option", option_name, "changed to", selection)
end)

list:SetTitle("Custom World Settings")
list:SetEditable(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `label`, `opt_spinner`, `item-*` widgets; does not add/remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `location` | string | `nil` | The world location key (e.g., `"forest"`) used for locale lookups. |
| `options` | table | `nil` | Array of option definitions, each with `name`, `group`, `grouplabel`, `default`, `options`, and optional `image`, `atlas`, `alwaysedit`. |
| `spinnerCB` | function | `nil` | Callback invoked on spinner change: `(option_name, selection)`. |
| `allowEdit` | boolean | `true` | Controls whether spinners are interactive. |
| `presetvalues` | table | `{}` | Tracks preset values used for visual feedback (tint intensity). |
| `title` | string or nil | `nil` | Optional title displayed above options. |
| `optionitems` | table | `{}` | Internal list of flattened items (headings, options, empties) for the scrolling grid. |
| `scroll_list` | widget | `nil` | The scrolling grid widget instance holding the rendered options. |

## Main functions
### `SetTitle(title)`
*   **Description:** Inserts a title heading (across both columns) at the top of the list. Cannot remove a title once set.
*   **Parameters:** `title` (string) — the localized text to display as the section title.
*   **Returns:** Nothing.

### `MakeOptionSpinners()`
*   **Description:** Internal constructor function that builds the internal `optionitems` list by iterating `self.options`, inserting group headers and empty placeholders, and initializes `self.scroll_list`.
*   **Parameters:** None (called during construction).
*   **Returns:** Nothing.

### `SetEditable(editable)`
*   **Description:** Updates whether the spinners are editable and refreshes the view to reflect the change.
*   **Parameters:** `editable` (boolean) — enables or disables spinner interactivity.
*   **Returns:** Nothing.

### `SetPresetValues(values)`
*   **Description:** Stores a table of preset values used for visual comparison (to highlight deviations from defaults or presets).
*   **Parameters:** `values` (table) — key-value pairs mapping option names to their preset value.
*   **Returns:** Nothing.

### `SetValueForOption(option, value)`
*   **Description:** Sets a specific option’s selected value and refreshes the view.
*   **Parameters:**  
  * `option` (string) — the `name` of the option to update.  
  * `value` (any) — the new selection value.
*   **Returns:** Nothing.

### `SetBGForSpinner(spinner, option)`
*   **Description:** Applies background tint to the spinner’s `changed_image` based on whether the value matches the default, a preset, or is modified.
*   **Parameters:**  
  * `spinner` (widget) — the spinner instance to update.  
  * `option` (table) — the option definition containing `name` and `default`.
*   **Returns:** Nothing.  
*   **Error states:** Assumes `spinner:GetSelectedData()` returns a value comparable to `option.default` and `self.presetvalues[option.name]`.

## Events & listeners
*   **Listens to:** None (no `inst:ListenForEvent` calls detected).
*   **Pushes:** None (no `inst:PushEvent` calls detected).