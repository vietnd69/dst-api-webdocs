---
id: worldprogressionfilterpicker
title: Worldprogressionfilterpicker
description: Renders a scrollable list of world progression filter options for UI selection, allowing players to configure must, cant, or any filtering rules per tag.
tags: [ui, world, progression, filter]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: be884918
system_scope: ui
---

# Worldprogressionfilterpicker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WorldProgressionFilterPicker` is a reusable UI widget that displays and manages world progression tag filters. It presents a scrollable grid of rows—each corresponding to a world state tag—allowing the user to select a filter setting (`MUST`, `CANT`, or `ANY`) using radio buttons. It integrates with the `ScrollingGrid` template and updates its content based on the provided `worldprogressionfilters` data table. The widget does not own state itself; it reflects and mutates the external `worldprogressionfilters` table passed into its constructor.

## Usage example
```lua
local filters = {}
local picker = WorldProgressionFilterPicker(filters)
picker:SetCallback(function()
    print("Filters updated:", strdump(filters))
end)
-- Later, to repopulate:
picker:SetDataAndRefresh(newfilters)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds internal children widgets (`filter_row`, `icon`, `radiobuttons`, etc.) but no entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `worldprogressionfilters` | table | `nil` | Reference to the external table storing per-namespace/tag filter settings. |
| `cb` | function | `nil` | Optional callback fired when a filter setting is changed. |
| `scroll_list` | ScrollingGrid | `nil` | Internal scrolling list container. |
| `last_focused_radiobuttons` | RadioButtons | `nil` | Tracks the last-focused radio button row (for focus navigation). |

## Main functions
### `SetCallback(cb)`
* **Description:** Sets the callback function invoked whenever a radio button in any row changes its selected value.
* **Parameters:** `cb` (function) – A zero-argument function to execute on change.
* **Returns:** Nothing.
* **Error states:** No callback is invoked if `cb` is `nil` or `row.tagdata` is missing.

## Events & listeners
None identified. The widget does not register or push events directly. Changes are propagated via the user-provided callback.