---
id: cookbookpanel
title: Cookbookpanel
description: Renders the cooking recipes panel in the Redux UI, providing a structured interface for browsing and filtering recipes.
tags: [ui, crafting, panel]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 9fba55b5
system_scope: ui
---

# Cookbookpanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CookbookPanel` is a UI panel widget responsible for displaying the cooking recipe book interface. It inherits from `Widget` and acts as a container for the `CookbookWidget`, which handles the actual rendering and filtering of recipes. It initializes the panel layout, positions its root widget, clears any existing filters on the global `TheCookbook` instance, and forwards focus to its child cookbook widget.

## Usage example
```lua
local CookbookPanel = require "screens/redux/panels/cookbookpanel"
local parent_screen = some_ui_screen_instance

local cookbook_panel = CookbookPanel(parent_screen)
parent_screen:AddChild(cookbook_panel)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `nil` (set during construction) | Root widget container for the panel; positioned at `(0, -15)`. |
| `book` | CookbookWidget | `nil` (set during construction) | Child widget that manages recipe display and filtering. |
| `focus_forward` | Widget | `self.book` | Defines where keyboard/controller focus should be forwarded within the panel. |

## Main functions
### `CookbookPanel(parent_screen)`
*   **Description:** Constructor that initializes the cookbook panel widget. It sets up the internal hierarchy, clears filters on `TheCookbook`, and attaches the `CookbookWidget`.
*   **Parameters:** `parent_screen` (Widget) — the parent UI screen that owns this panel.
*   **Returns:** Nothing (instance is returned via `return CookbookPanel`).
*   **Error states:** None identified; assumes `parent_screen` is a valid widget.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified