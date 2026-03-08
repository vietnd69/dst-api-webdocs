---
id: plantspage
title: Plantspage
description: Renders the plant registry UI page, displaying scrollable plant entries with stage selection and navigation for both vanilla and modded plants.
tags: [ui, registry, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1f674f16
system_scope: ui
---

# Plantspage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlantsPage` is a UI widget that presents the plant registry interface, listing both vanilla and modded plants in a scrollable grid. It dynamically populates plant cells based on registry knowledge, handles stage selection via spinner controls, and supports opening detailed plant pages. It integrates with `ThePlantRegistry` to determine known plant stages and manages navigation between the grid and detail views.

## Usage example
```lua
local PlantsPage = require "widgets/redux/plantspage"
local page = PlANTSPage(parent_widget, ismodded)
```

## Dependencies & tags
**Components used:** `ThePlantRegistry` (global singleton), `TEMPLATES.ScrollingGrid`, `Spinner`, `UIAnim`, `Text`, `ImageButton`, `Image`, `Widget`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_widget` | widget | `nil` | The parent UI container or tab that hosts this page. |
| `ismodded` | boolean | `false` | Whether this page displays modded (true) or vanilla (false) plants. |
| `root` | widget | `nil` | The root container widget for the page. |
| `plant_grid` | ScrollingGrid | `nil` | The scrollable grid holding plant entry widgets. |
| `plantregistrywidget` | widget | `nil` | The currently opened detail page widget (if any). |
| `currentwidget` | widget | `nil` | The grid cell widget that had focus before switching to the detail page. |
| `parent_default_focus` | widget | `self.plant_grid` | Tracks the widget to restore focus to when closing the detail view. |

## Main functions
### `BuildPlantScrollGrid()`
* **Description:** Constructs and configures the scrolling grid widget used to display plant entries. Each cell shows plant name, animation, and stage spinner, with conditional visibility and styling based on registry knowledge.
* **Parameters:** None.
* **Returns:** `ScrollingGrid` — a configured scrolling grid instance populated with plant cells.
* **Error states:** No explicit error handling; relies on `orderedPairs` and `ThePlantRegistry` correctness.

### `OpenPageWidget(plantregistrywidgetpath, data, currentwidget)`
* **Description:** Opens a detail page widget for a selected plant, replacing the grid view. Hides backdrop/tab UI and stores focus state for restoration.
* **Parameters:** 
  * `plantregistrywidgetpath` (string) — path to the widget module to load for the detail view.
  * `data` (table) — plant definition and registry info (includes `plant`, `plant_def`, `info`, `currentstage`).
  * `currentwidget` (widget) — the grid cell widget that triggered the navigation.
* **Returns:** Nothing.

### `ClosePageWidget()`
* **Description:** Closes the currently open detail page, restores the plant grid view, re-shows hidden UI elements, and reassigns focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Routes input controls to the active detail page widget (if open) or falls back to default behavior.
* **Parameters:** 
  * `control` (string) — control identifier (e.g., `"CONTROL_BACK"`, `"CONTROL_SELECT"`).
  * `down` (boolean) — whether the control is pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if control was handled by a child widget, otherwise delegates to base class behavior.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls in source).
- **Pushes:** None identified (no `inst:PushEvent` calls in source).