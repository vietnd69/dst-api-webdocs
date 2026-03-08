---
id: fertilizerspage
title: Fertilizerspage
description: Renders a scrollable grid of fertilizer entries in the plant registry UI, displaying fertilizer names, icons, and nutrient data conditionally based on unlock status.
tags: [ui, plantregistry, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d846e18a
system_scope: ui
---

# Fertilizerspage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FertilizersPage` is a UI widget responsible for displaying a scrollable list of fertilizers in the plant registry screen. It filters fertilizers based on whether they are modded (`ismodded` parameter) and whether the player has discovered them (via `ThePlantRegistry:KnowsFertilizer`). Each grid cell shows the fertilizer’s name, icon, and up to three nutrient indicators (arrows and icons), with visual states adapting for locked/unlocked items.

It extends `Widget` and uses `TEMPLATES.ScrollingGrid` for layout and scrolling behavior. It does not own the entity (it is a UI-only construct), and interacts with game systems via singleton `ThePlantRegistry` and localization (`STRINGS`).

## Usage example
```lua
local FertilizersPage = require("widgets/redux/fertilizerspage")
local page = FertilizersPage(parent_widget, ismodded)
```

## Dependencies & tags
**Components used:** `ThePlantRegistry` (singleton), `STRINGS` (singleton), `TheFrontEnd:GetSound()` (audio singleton)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `BuildFertlizerScrollGrid()`
*   **Description:** Constructs and configures a scrolling grid widget used to display fertilizer entries. Returns a configured `ScrollingGrid` instance.
*   **Parameters:** None.
*   **Returns:** `ScrollingGrid` instance — a reusable grid widget with custom cell creation and data binding logic.

### Constructor `FertilizersPage(parent_widget, ismodded)`
*   **Description:** Initializes the fertilizers page UI. Sets up the root container, builds and positions the fertilizer grid, filters and populates grid data based on modded status and discovery status, and assigns default focus to the grid.
*   **Parameters:**
    * `parent_widget` (Widget) — the parent widget to which this page will be attached.
    * `ismodded` (boolean) — if `true`, only modded fertilizers are shown; if `false`, only vanilla fertilizers are shown.
*   **Returns:** `FertilizersPage` instance.
*   **Error states:** None documented.

## Events & listeners
None. This widget does not register any event listeners or push events.