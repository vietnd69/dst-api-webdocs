---
id: tabgroup
title: Tabgroup
description: Manages a collection of tab widgets, handling layout, selection, visibility, and transitions between tabs in UI contexts.
tags: [ui, layout, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7b58986b
system_scope: ui
---

# Tabgroup

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TabGroup` is a UI widget component that organizes and manages a group of `Tab` widgets. It handles tab layout (including spacing and positioning), selection state, visibility toggling, and navigation logic (e.g., moving between tabs). It extends `Widget` and is intended for use in screen interfaces where tabbed UI panes are required (e.g., menus, crafting screens, or inventory overlays).

## Usage example
```lua
local tabgroup = AddChild(TabGroup())
tabgroup:AddTab("Tab1", "tab_atlas", "icon_atlas", "icon", imnorm, imselected, imhighlight, imalthighlight, imoverlay, onselect_fn, ondeselect_fn, false)
tabgroup:AddTab("Tab2", "tab_atlas", "icon_atlas", "icon", imnorm, imselected, imhighlight, imalthighlight, imoverlay, onselect_fn, ondeselect_fn, false)
tabgroup:OpenTab(1)
```

## Dependencies & tags
**Components used:** `Widget` (parent class)  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tabs` | table | `{}` | List of `Tab` widgets managed by this group. |
| `spacing` | number | `70` | Horizontal distance (in pixels) between adjacent tabs. |
| `offset` | Vector3 | `Vector3(0, -1, 0)` | Directional offset vector used for vertical alignment during layout. |
| `hideoffset` | Vector3 | `Vector3(-64, 0, 0)` | Offset applied when a tab is hidden. |
| `selected` | Tab or `nil` | `nil` | Reference to the currently selected `Tab` instance. |
| `base_pos` | table | `{}` | Maps each tab to its base (shown) `Vector3` position. |
| `shown` | table | `{}` | Maps each tab to a boolean indicating visibility state. |

## Main functions
### `GetNumTabs()`
* **Description:** Returns the total number of tabs added to the group, regardless of visibility.
* **Parameters:** None.
* **Returns:** number — count of tabs in `self.tabs`.

### `HideTab(tab)`
* **Description:** Animates and hides the given tab by moving it left by `hideoffset`. Calls `onhidetab()` callback if defined.
* **Parameters:** `tab` (Tab) — the tab instance to hide.
* **Returns:** Nothing.
* **Error states:** Silently returns if the tab is not in `self.shown`.

### `ShowTab(tab)`
* **Description:** Animates and shows the given tab by moving it from `hideoffset` to its base position. Calls `onshowtab()` callback if defined.
* **Parameters:** `tab` (Tab) — the tab instance to show.
* **Returns:** Nothing.
* **Error states:** Silently returns if the tab is already shown or lacks a stored base position.

### `GetFirstIdx()`
* **Description:** Returns the 1-based index of the first *shown* tab.
* **Parameters:** None.
* **Returns:** number or `nil` — index of first visible tab, or `nil` if no tabs are shown.

### `GetLastIdx()`
* **Description:** Returns the 1-based index of the last *shown* tab.
* **Parameters:** None.
* **Returns:** number or `nil` — index of last visible tab, or `nil` if no tabs are shown.

### `GetNextIdx()`
* **Description:** Returns the 1-based index of the next *shown* tab after the currently selected one (or index 1 if none selected).
* **Parameters:** None.
* **Returns:** number — index of next visible tab; loops back to current if no further tabs exist.

### `GetPrevIdx()`
* **Description:** Returns the 1-based index of the previous *shown* tab before the currently selected one (or index 1 if none selected).
* **Parameters:** None.
* **Returns:** number — index of previous visible tab; loops back to current if no earlier tabs exist.

### `GetCurrentIdx()`
* **Description:** Returns the 1-based index of the currently selected tab.
* **Parameters:** None.
* **Returns:** number or `nil` — index of selected tab, or `nil` if no tab is selected.

### `OpenTab(idx)`
* **Description:** Selects and displays the tab at the given index. Returns the tab if opened; otherwise `nil`.
* **Parameters:** `idx` (number) — 1-based index of the tab to open.
* **Returns:** Tab or `nil` — the opened tab, or `nil` if index is out of bounds or the tab is hidden.

### `AddTab(...)`
* **Description:** Creates a new `Tab` widget, adds it to the group, and updates layout for all tabs based on spacing and visibility. Automatically calls `SetPosition` on each tab.
* **Parameters:**  
  `name` (string), `atlas` (string), `icon_atlas` (string), `icon` (string), `imnorm`, `imselected`, `imhighlight`, `imalthighlight`, `imoverlay` (texture/resource IDs), `onselect` (function), `ondeselect` (function), `collapsed` (boolean).  
* **Returns:** Tab — the newly created tab instance.

### `OnTabsChanged()`
* **Description:** Checks for changes in the selected tab. Fires `onopen`, `onclose`, or `onchange` callbacks as appropriate.
* **Parameters:** None.
* **Returns:** Nothing.

### `DeselectAll()`
* **Description:** Deselects all tabs and clears `self.selected`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified — this component does not register event listeners nor push events. Callbacks (`onopen`, `onchange`, `onclose`, `onshowtab`, `onhidetab`) are used instead for state notifications.