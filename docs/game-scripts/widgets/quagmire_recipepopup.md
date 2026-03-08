---
id: quagmire_recipepopup
title: Quagmire Recipepopup
description: Renders and manages the interactive recipe details popup UI for the Quagmire game mode, displaying recipe name, description, ingredients, and build status.
tags: [ui, crafting, quagmire]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e8a4baeb
system_scope: ui
---

# Quagmire Recipepopup

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RecipePopup` is a UI widget responsible for displaying detailed information about a single recipe in the Quagmire crafting interface. It shows the recipe name, description, first ingredient (with availability indicator), and context-sensitive build instructions or control hints depending on whether a gamepad is attached. It does not manage recipe selection or tab navigation — it operates as a slave component bound to a specific recipe and owner entity via `SetRecipe`.

## Usage example
```lua
local recipe_popup = RecipePopup()
recipe_popup:SetRecipe(some_recipe, some_player_entity)
-- The popup automatically refreshes its display on SetRecipe
-- To update later, call recipe_popup:Refresh()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipe` | table or `nil` | `nil` | The recipe data to display; must contain fields like `product`, `tab.str`, and `ingredients[1]`. |
| `owner` | `ent` or `nil` | `nil` | The player entity that owns the builder and inventory replicas used for build checks. |
| `smallfonts` | boolean | `false` | Whether to use scaled-down fonts (e.g., for PS4 Japanese UI). |
| `hud_atlas` | string | `"hud.tex"` | Path to the HUD texture atlas (resolve via `HUD_ATLAS`). |
| `bg` | `Image` | — | Background image widget showing the recipe popup container. |
| `contents` | `Widget` | — | Container widget for all recipe-specific UI elements. |
| `name` | `Text` | — | Displays the recipe’s product name. |
| `desc` | `Text` | — | Displays the recipe description, multiline and truncated. |
| `button` | `ImageButton` | — | Clickable button for keyboard/mouse input to build. |
| `ingredient_backing` | `Image` | — | Background slot for the first ingredient, changes texture on availability. |
| `ingredient` | `Image` or `nil` | `nil` | Visual representation of the first ingredient. |
| `num_ingredients` | `Text` | — | Numeric count displayed over the ingredient slot. |
| `teaser` | `Text` | — | Dynamic hint text for gamepad controls (shows control binding or “Needs stuff”). |
| `recipe_held` | boolean | `false` | Internal flag used to distinguish short click vs. hold for build. |
| `last_recipe_click` | number or `nil` | `nil` | Timestamp of last button release, used for rapid double-click detection. |

## Main functions
### `BuildNoSpinner()`
* **Description:** Constructs or reconstructs the non-spinner UI layout for the popup, including background, name, description, ingredient display, and either a button or teaser text for controls. Called internally by `Refresh()` and in the constructor.
* **Parameters:** None.
* **Returns:** Nothing.

### `Refresh()`
* **Description:** Updates all UI elements to reflect the current state of `self.recipe` and `self.owner`. Checks recipe knowledge, build buffering, and ingredient availability; updates names, descriptions, ingredient visuals, and control hints (button vs. gamepad teaser). Must be called after changing `recipe` or `owner`.
* **Parameters:** None.
* **Returns:** `false` if `self.owner` is `nil`; otherwise returns `nil` (no meaningful return).
* **Error states:** Silently returns early if `self.owner == nil`.

### `SetRecipe(recipe, owner)`
* **Description:** Binds the popup to a new recipe and owner entity, then immediately triggers a refresh.
* **Parameters:**
  * `recipe` (table) — the recipe data to display.
  * `owner` (`ent`) — the player entity that will be used to check build conditions (builder/inventory replicas).
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Override of base widget control handling. Delegates to parent class for standard UI interactions. Currently unimplemented beyond calling the base method.
* **Parameters:**
  * `control` (string) — the control identifier.
  * `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if handled by parent, otherwise `nil`.

## Events & listeners
**None identified**