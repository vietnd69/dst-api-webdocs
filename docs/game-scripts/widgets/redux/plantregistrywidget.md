---
id: plantregistrywidget
title: Plantregistrywidget
description: Manages the plant registry UI, handling tab navigation between plant, fertilizer, and modded variants.
tags: [ui, registry, farming]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e3067b1a
system_scope: ui
---

# Plantregistrywidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlantRegistryWidget` is a UI widget that renders the plant registry interface, presenting tabbed views for different categories of plants, weeds, and fertilizers — including both vanilla and modded variants. It dynamically constructs tabs based on the presence of modded definitions and delegates tab content to dedicated page widgets (`PlantsPage`, `FertilizersPage`). It integrates with the `ThePlantRegistry` system for filtering and persistence, and with input controls for tab switching via keyboard/controller.

## Usage example
```lua
local PlantRegistryWidget = require "widgets/redux/plantregistrywidget"
local parent = SomeWidget()
local registry_widget = PlantRegistryWidget(parent)
```

## Dependencies & tags
**Components used:** `ThePlantRegistry`, `TheInventory`, `TheFrontEnd`, `TheNet`, `TheInput`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `Kill()`
*   **Description:** Releases the widget and saves the current filter state (e.g., selected tab index) to persistent storage.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `:PositionTabs(tabs, w, y)`
*   **Description:** Calculates and sets horizontal positions for the tab buttons in a centered layout.
*   **Parameters:**  
  `tabs` (table) — array of tab widgets.  
  `w` (number) — horizontal spacing between tab centers.  
  `y` (number) — vertical position for all tabs.  
*   **Returns:** Nothing.

### `:OnControlTabs(control, down)`
*   **Description:** Handles tab-switching input controls (`CONTROL_MENU_L2`, `CONTROL_MENU_R2`). Triggers the next/previous tab’s click handler when the button is released (`not down`).
*   **Parameters:**  
  `control` (string) — the control being pressed.  
  `down` (boolean) — whether the control is currently held.  
*   **Returns:** `true` if the control was handled; otherwise `nil`.

### `:OnControl(control, down)`
*   **Description:** Overrides base widget control handling to delegate tab-switching input to `OnControlTabs` if multiple tabs exist. Falls back to base class behavior otherwise.
*   **Parameters:** Same as `:OnControlTabs`.
*   **Returns:** `true` if handled; otherwise the result of the base method.

### `:GetHelpText()`
*   **Description:** Returns localized help text for input controls that switch tabs, formatted for the active controller type.
*   **Parameters:** None.
*   **Returns:** `string` — localized instruction text (e.g., `"Left Stick / Right Stick Change Tab"`).

## Events & listeners
None identified.

