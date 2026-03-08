---
id: unknownplantpage
title: Unknownplantpage
description: Renders a UI page indicating that a plant in the Plant Registry is unknown (unresearched).
tags: [ui, registry, plant]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7fc4dded
system_scope: ui
---

# Unknownplantpage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`UnknownPlantPage` is a UI widget used in the Plant Registry screen to display a placeholder page when a plant has not yet been researched by the player. It inherits from `PlantPageWidget` and displays a locked, unlabeled plant with a "Needs Plant Research" message. It is purely a presentation-layer component with no game state or logic responsibilities.

## Usage example
```lua
local UnknownPlantPage = require "widgets/redux/unknownplantpage"
local page = UnknownPlantPage(plantspage_instance, nil)
-- The page is immediately ready for display in the registry UI
```

## Dependencies & tags
**Components used:** None  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plant_name` | Text widget | `nil` | Displays "Mystery Plant" in locked-brown color. |
| `needs_research` | Text widget | `nil` | Displays "Needs Plant Research" in unlocked-brown color. |

## Main functions
### `UnknownPlantPage(plantspage, data)`
* **Description:** Constructor. Initializes the page with fixed text and styling for unresearched plants. Calls parent `PlantPageWidget` constructor with identifier `"UnknownPlantPage"`.
* **Parameters:**
  * `plantspage` (Widget) – The parent plant registry page container.
  * `data` (any) – Unused in this implementation (passed through).
* **Returns:** Nothing.
* **Error states:** None — always succeeds.

## Events & listeners
None identified.