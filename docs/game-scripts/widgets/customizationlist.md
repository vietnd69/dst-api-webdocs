---
id: customizationlist
title: Customizationlist
description: Renders and manages interactive UI spinners for in-game world customization options in the sandbox menu.
tags: [ui, customization, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e357990e
system_scope: ui
---

# Customizationlist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CustomizationList` is a UI widget that displays a scrollable list of customizable world generation options (e.g., season length, world size, starting season) as labeled spinner controls. It supports two-column layout, focus navigation, preset value highlighting, and real-time callbacks when spinner values change. It is typically used in the sandbox/world customization screen to allow players to configure world parameters before world generation.

## Usage example
```lua
local options = {
    { name = "season_length", default = 20, group = "time", grouplabel = "Time",
      options = { {text="Short", data=10}, {text="Normal", data=20}, {text="Long", data=30} } },
    { name = "summer_length", default = "normal", group = "time", grouplabel = "Time",
      options = { {text="Normal", data="normal"}, {text="Long", data="long"} } },
}
local list = CustomizationList("sandbox", options, function(name, value)
    print("Option", name, "changed to", value)
end)
list:SetTitle("World Settings")
list:SetEditable(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no entity tags; operates purely in UI space.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `location` | string | — | Identifier for the context (e.g., `"sandbox"`, `"premade"`), used for localized section labels. |
| `options` | table | — | Array of option definitions, each with `name`, `default`, `group`, `grouplabel`, `options`, and optionally `image`, `atlas`. |
| `allowEdit` | boolean | `true` | Controls whether spinners are enabled or disabled. |
| `spinnerCB` | function or nil | `nil` | Callback invoked when a spinner value changes: `spinnerCB(optionName, newValue)`. |
| `presetvalues` | table | `{}` | Table of pre-set values for each option name; used to visually distinguish unchanged vs. preset values. |
| `spinners` | table | `{}` | List of all `Spinner` widgets created for the options. |
| `optionwidgets` | table | `{}` | List of all UI widget rows (labels and spinner pairs) added to the scroll list. |
| `title` | string or nil | `nil` | Optional title string displayed above the options. |
| `focused_column` | number | `1` | Indicates which column (1=left, 2=right) currently has focus in two-column layout. |
| `scroll_list` | ScrollableList | — | The root scrollable container housing all option widgets. |

## Main functions
### `SetTitle(title)`
* **Description:** Sets an optional title label above the option list and updates widget positions accordingly. Replaces any existing title.
* **Parameters:** `title` (string or nil) — the localized string to display as the section title, or `nil` to remove.
* **Returns:** Nothing.

### `SetEditable(editable)`
* **Description:** Enables or disables all spinners, typically used to lock customization when previewing a preset.
* **Parameters:** `editable` (boolean) — if `false`, disables all spinners and darkens their text; if `true`, re-enables them.
* **Returns:** Nothing.

### `SetPresetValues(values)`
* **Description:** Stores a table of preset values to determine visual tinting of spinner backgrounds (e.g., light grey for unchanged defaults, darker grey if matching a preset, default white otherwise).
* **Parameters:** `values` (table) — a map from `option.name` → `value`.
* **Returns:** Nothing.

### `SetValueForOption(option, value)`
* **Description:** Programmatically sets the selected value for a given option name and updates the spinner background tint.
* **Parameters:**  
  * `option` (string) — the `name` field of the target option.  
  * `value` — the value to set (must match one of the option’s `data` values).
* **Returns:** Nothing.

### `SetBGForSpinner(spinner)`
* **Description:** Sets the background tint of a spinner’s parent `bg` image based on whether its current value matches the default, the stored preset value, or a custom override.
* **Parameters:** `spinner` (Spinner) — the spinner widget whose background tint should be updated.
* **Returns:** Nothing.

## Events & listeners
None identified — this widget does not listen for or push any game or widget-specific events directly. Event interactions happen indirectly via `spinnerCB` callbacks and internal focus handling.