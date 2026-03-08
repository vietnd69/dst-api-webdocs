---
id: settingslist
title: Settingslist
description: Renders a scrollable grid of world customization controls (spinners and text entries) for the world settings menu.
tags: [ui, world, customization, settings]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 87ecf88d
system_scope: ui
---

# Settingslist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SettingsList` is a UI widget that presents a scrollable grid of world customization options (e.g., sliders, dropdowns, text fields) in the world generation settings screen. It dynamically constructs rows and columns of interactive controls (spinners and text entries) based on option definitions retrieved from its parent widget, handles user input via gamepad or keyboard, and updates values in the parent via callbacks. It uses the `ScrollingGrid` template for layout and manages focus navigation, background highlighting for changed/preset values, and grouping via heading labels.

## Usage example
```lua
local parent_widget = ... -- an instance that implements GetOptions(), GetValueForOption(), SetTweak(), IsEditable()
local settings_list = SettingsList(parent_widget, "forest")
settings_list:MakeScrollList()
settings_list:RefreshOptionItems()
settings_list:SetPresetValues({ rain = "medium", start_location = "beefalo village" })
```

## Dependencies & tags
**Components used:** None (it is a pure UI widget, not an entity component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_widget` | Widget | `nil` | The owning widget responsible for providing option definitions and receiving updates. |
| `levelcategory` | string | `nil` | The world category being customized (e.g., `"forest"`, `"caves"`). |
| `presetvalues` | table | `{}` | Map of option names to their preset/default values, used to determine background highlights. |
| `optionitems` | array | `{}` | Array of item data objects describing each row (headings, option definitions, or empty placeholders). |
| `options` | array | `nil` | Cached list of option definitions retrieved from `parent_widget:GetOptions()`. |
| `forceupdate` | boolean | `nil` | Flag used during refresh to reapply current values without reconstructing widgets. |

## Main functions
### `MakeScrollList()`
* **Description:** Constructs the scrolling grid UI, defines helper widgets (spinners, text entries), and wires callbacks. Initializes `self.scroll_list` and `self.optionitems`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `RefreshOptionItems()`
* **Description:** Fetches current option definitions from the parent, groups them by `group`, inserts heading labels and empty placeholders to maintain grid layout integrity (3-column alignment), and updates the scrolling grid.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetPresetValues(values)`
* **Description:** Stores a map of option names to preset values used for visual feedback (e.g., highlighting fields that match the preset).
* **Parameters:** `values` (table) — key-value map of option name → value.
* **Returns:** Nothing.

### `SetBGForSpinner(spinner, option)`
* **Description:** Sets the background tint on a spinner to indicate its state: unchanged (transparent), matching the preset (light tint `0.1`), or modified (standard tint `0.3`).
* **Parameters:** 
  * `spinner` (Widget) — the spinner widget instance.
  * `option` (table) — the option definition containing `name`, `default`, etc.
* **Returns:** Nothing.

### `SetBGForTextEntry(textentry, option)`
* **Description:** Sets the background tint on a text entry to indicate its state (unchanged, preset, or modified). Mirrors `SetBGForSpinner`.
* **Parameters:** 
  * `textentry` (Widget) — the text entry widget instance.
  * `option` (table) — the option definition.
* **Returns:** Nothing.

### `OnTextEntryChanged(option, textentry, value)`
* **Description:** Called when a text entry’s value changes; notifies the parent via `SetTweak()` and refreshes the background tint.
* **Parameters:** 
  * `option` (table) — the option definition.
  * `textentry` (Widget) — the text entry widget.
  * `value` (string) — the new string value.
* **Returns:** Nothing.
* **Error states:** Returns early if `option` is `nil`.

### `OnSpinnerChanged(option, spinner, value)`
* **Description:** Called when a spinner’s value changes; notifies the parent via `SetTweak()` and refreshes the background tint.
* **Parameters:** 
  * `option` (table) — the option definition.
  * `spinner` (Widget) — the spinner widget.
  * `value` — the selected data value.
* **Returns:** Nothing.
* **Error states:** Returns early if `option` is `nil` (e.g., triggered on headers or invalid indices).

### `Refresh(force)`
* **Description:** Forces the scrolling grid to refresh its view. Used to reapply values when options change or state updates.
* **Parameters:** `force` (boolean) — if `true`, triggers value-only updates without rebuilding widgets.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (this widget does not register events via `inst:ListenForEvent`). Interaction is handled via callback functions passed to spinner/textentry widgets.
- **Pushes:** None (this widget does not fire events via `inst:PushEvent`).
