---
id: widgetutil
title: Widgetutil
description: Provides utility functions for crafting menu interactions, recipe construction logic, and UI indicator placement.
tags: [crafting, ui, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 5a82f48a
system_scope: ui
---

# Widgetutil

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`widgetutil` contains helper functions supporting the crafting and building UI flow in DST. It manages recipe feasibility checks (e.g., can prototype, can craft ingredients), handles recipe execution when clicked in the crafting menu, and computes screen positions and orientations for directional build indicators. The component is not an entity component but a shared utility module used by UI widgets and components during player interaction.

## Usage example
```lua
local x, y, angle = GetIndicatorLocationAndAngle(
    player,
    target_x,
    target_z,
    indicator_width,
    indicator_height,
    { TOP_EDGE_BUFFER = 30, RIGHT_EDGE_BUFFER = 90 }
)

local close_menu, err = DoRecipeClick(player, recipe, skin)
if err == "NO_INGREDIENTS" then
    -- Show ingredient shortfall notification
end
```

## Dependencies & tags
**Components used:** `builder`, `playercontroller`, `inventory`, `craftingmenu` (via `TheFrontEnd`, `Profile`, `TheFocalPoint`)
**Tags:** None — this file does not operate on entities directly.

## Properties
No public properties — only local module-level variables and pure utility functions.

## Main functions
### `ShouldHintRecipe(recipetree, buildertree)`
* **Description:** Determines whether a recipe hint should be shown in the UI based on the player's tech progress. Returns `true` if the player's current tech level does not significantly exceed the recipe's requirements.
* **Parameters:**  
  `recipetree` (table) — recipe's tech tree levels.  
  `buildertree` (table) — player's current tech tree progress.
* **Returns:** `boolean` — `true` if hinting is allowed.
* **Error states:** None.

### `CanPrototypeRecipe(recipetree, buildertree)`
* **Description:** Checks whether the player can prototype (i.e., research/learn) the recipe based on tech level. Unlike `ShouldHintRecipe`, this is strict — the player's level must be ≤ recipe level.
* **Parameters:**  
  `recipetree` (table) — recipe's tech tree levels.  
  `buildertree` (table) — player's current tech tree progress.
* **Returns:** `boolean` — `true` if the player can prototype this recipe.
* **Error states:** None.

### `DoRecipeClick(owner, recipe, skin)`
* **Description:** Handles player clicking a recipe in the crafting menu — performs validation, ingredient checking, buffering/placing, unlocking, and playback. Returns instructions to the UI (e.g., whether to keep the menu open) and optional error messages.
* **Parameters:**  
  `owner` (Entity, optional) — player entity performing the action.  
  `recipe` (table, optional) — recipe definition table.  
  `skin` (string|nil) — optional skin name override for the placed item.
* **Returns:**  
  `close_menu` (boolean) — whether the crafting menu should close.  
  `error_msg` (string|nil) — `"NO_INGREDIENTS"`, `"NO_STATION"`, or `"NO_TECH"` if the action cannot proceed.
* **Error states:** Returns early with `true` (keep menu open) if the player is `busy` or controls are disabled (except when HUD is blocking input only). Fails gracefully with error strings for missing ingredients, insufficient tech, or unavailable research station.

### `GetIndicatorLocationAndAngle(owner, targX, targZ, w, h, bufferoverrides)`
* **Description:** Calculates on-screen position and rotation angle for a build-direction indicator (e.g., the arrow shown when building walls or directional objects). Uses camera orientation and screen bounds to keep the indicator visible and near the screen edge opposite the target.
* **Parameters:**  
  `owner` (Entity) — player who will build.  
  `targX` (number) — X world coordinate of the target.  
  `targZ` (number) — Z world coordinate of the target.  
  `w` (number) — width of the indicator element.  
  `h` (number) — height of the indicator element.  
  `bufferoverrides` (table|nil|false) — optional table with `TOP_EDGE_BUFFER`, `BOTTOM_EDGE_BUFFER`, `LEFT_EDGE_BUFFER`, `RIGHT_EDGE_BUFFER`; if `false`, disables all edge buffers.
* **Returns:**  
  `x` (number) — screen X coordinate.  
  `y` (number) — screen Y coordinate.  
  `indicatorAngle` (number) — rotation in degrees (0° = down).
* **Error states:** Clamps coordinates to stay within screen bounds and respects edge buffer constraints.

## Events & listeners
- **Listens to:** None — this module does not register entity listeners.
- **Pushes:** `cantbuild` — fired on `owner` when a build attempt fails due to missing ingredients *and* the server detects possible ingredient availability (see `DoRecipeClick`).
