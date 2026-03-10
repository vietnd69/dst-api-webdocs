---
id: plantregistrypanel
title: Plantregistrypanel
description: Creates and manages the plant registry UI panel in the Redux UI system.
tags: [ui, registry, plant]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: b2b0e389
system_scope: ui
---

# Plantregistrypanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PlantRegistryPanel` is a UI widget responsible for constructing the plant registry panel interface in the Redux UI system. It instantiates and organizes a `PlantRegistryWidget` child widget, positions it within the panel hierarchy, and clears any existing filters on the global `ThePlantRegistry` registry before initialization. This panel is typically embedded as part of a larger UI screen (e.g., a menu or inventory panel) and serves as the main container for displaying and interacting with registered plant entries.

## Usage example
```lua
local PlantRegistryPanel = require "screens/redux/panels/plantregistrypanel"
local parent_screen = some_screen_instance

local panel = PlantRegistryPanel(parent_screen)
-- The panel is automatically added as a child of the parent_screen via Widget hierarchy
-- It initializes the PlantRegistryWidget and resets registry filters
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `nil` (set in constructor) | Root container widget for the panel layout. |
| `plantregistry` | PlantRegistryWidget | `nil` (set in constructor) | The child widget displaying the plant registry content. |
| `focus_forward` | Widget | `plantregistry` | Specifies the widget that receives focus forwarding (for UI navigation). |

## Main functions
### `PlantRegistryPanel(parent_screen)`
*   **Description:** Constructor. Initializes the panel as a child of `parent_screen`, creates the root and registry widget, positions the root, and clears global filters on `ThePlantRegistry`.
*   **Parameters:** `parent_screen` (Widget) — the parent screen widget to which this panel is attached.
*   **Returns:** Nothing (the class instance is returned via `Class()`).
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified