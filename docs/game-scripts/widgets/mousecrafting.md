---
id: mousecrafting
title: Mousecrafting
description: A crafting UI widget that displays crafting tabs and slots for mouse-based interaction, inheriting from the base Crafting widget.
tags: [ui, crafting]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2248fe32
system_scope: ui
---

# Mousecrafting

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MouseCrafting` is a UI widget class used to render and manage the crafting interface for mouse-driven input. It extends the base `Crafting` widget and configures itself for mouse-specific layout (horizontal orientation, custom positions for UI elements). It is intended to be instantiated as part of the UI layer and does not attach to game entities.

## Usage example
```lua
local MouseCrafting = require "widgets/mousecrafting"
local crafting_ui = MouseCrafting(owner, NUM_CRAFTING_RECIPES)
-- Add to screen or parent widget as needed
parent:AddChild(crafting_ui)
```

## Dependencies & tags
**Components used:** None identified (uses internal widget classes only).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `in_pos` | `Vector3` | `Vector3(145, 0, 0)` | Position offset for input elements within the UI. |
| `out_pos` | `Vector3` | `Vector3(0, 0, 0)` | Position offset for output elements within the UI. |

## Main functions
### `MouseCrafting(owner, num_tabs)`
*   **Description:** Constructor for the `MouseCrafting` widget. Initializes the parent `Crafting` class, sets orientation to false (horizontal), and configures input/output positions. Enables popups on crafting slots.
*   **Parameters:**  
    `owner` (Widget or Entity) — The owner of this widget (typically a screen or parent UI container).  
    `num_tabs` (number, optional) — Number of crafting tabs to initialize; defaults to `NUM_CRAFTING_RECIPES` if not provided.
*   **Returns:** A new `MouseCrafting` instance.
*   **Error states:** None identified.

## Events & listeners
None identified.