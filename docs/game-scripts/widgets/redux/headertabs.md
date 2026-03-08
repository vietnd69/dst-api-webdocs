---
id: headertabs
title: Headertabs
description: Renders a horizontal tab menu at the top of a window or dialog, managing button selection and focus in console and keyboard modes.
tags: [ui, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: be1bf8eb
system_scope: ui
---

# Headertabs

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Headertabs` is a UI widget that displays a set of labeled tab buttons, typically placed above a window or dialog (e.g., in character loadout menus or options screens). It extends `Widget` and internally uses the `Menu` system to render and manage tab selection. The component supports both console and keyboard input modes, adjusting button spacing and text size accordingly. It handles focus wrapping and callback coordination for tab changes.

## Usage example
```lua
local HeaderTabs = require "widgets/redux/headertabs"

local tabs = {
    { label = "Tab 1", cb = function() print("Tab 1 selected") end },
    { label = "Tab 2", cb = function() print("Tab 2 selected") end },
    { label = "Tab 3", cb = function() print("Tab 3 selected") end },
}

local header = inst:AddChild(HeaderTabs(tabs, true))  -- wrap_focus = true
header:SelectButton(2)  -- programmatically select second tab
```

## Dependencies & tags
**Components used:** None (`inst` is an entity instance, but no components are accessed via `inst.components.X`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `menu` | `Menu` | `nil` | The underlying `Menu` widget containing the tab buttons. |
| `selected_index` | number | `1` | 1-based index of the currently selected tab (updated on selection). |
| `focus_forward` | `Menu` | `self.menu` | Used to forward focus requests to the `Menu` widget. |

## Main functions
### `SelectButton(index)`
* **Description:** Programmatically selects the tab at the given index, updates `selected_index`, activates the corresponding button, and clears all menu selections first.
* **Parameters:** `index` (number) — 1-based index of the tab to select. Supports wrapping via `circular_index_number`.
* **Returns:** Nothing.
* **Error states:** No explicit error handling — silently clamps index via `circular_index_number`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.