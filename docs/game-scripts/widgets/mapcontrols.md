---
id: mapcontrols
title: Mapcontrols
description: Renders interactive control buttons for map toggling, pausing, and camera rotation in the UI.
tags: [ui, controls, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d94703b7
system_scope: ui
---

# Mapcontrols

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MapControls` is a UI widget component that manages the display and interaction logic for essential HUD buttons: minimap toggle, pause, and left/right camera rotation. It extends `Widget` and instantiates `ImageButton` children for each control, positioning and scaling them appropriately. It integrates with input localization via `TheInput:GetLocalizedControl` to display dynamic control hints in tooltips.

## Usage example
```lua
-- Typically added to the HUD by the game engine; not usually instantiated manually by mods.
-- Example of programmatic usage (rare):
local mapcontrols = MapControls()
ThePlayer.HUD.controls:AddChild(mapcontrols)
mapcontrols:Show()
```

## Dependencies & tags
**Components used:** `playercontroller` (via `ThePlayer.components.playercontroller:RotLeft()` and `:RotRight()`), `hud.controls`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `minimapBtn` | `ImageButton` | `nil` | Button for toggling the map view. |
| `pauseBtn` | `ImageButton` | `nil` | Button to open the pause screen. |
| `rotleft` | `ImageButton` | `nil` | Left rotation button (icon scaled horizontally flipped). |
| `rotright` | `ImageButton` | `nil` | Right rotation button. |

## Main functions
### `RefreshTooltips()`
* **Description:** Updates tooltip text for all buttons using localized input control strings and predefined UI strings (e.g., `STRINGS.UI.HUD.MAP`, `STRINGS.UI.HUD.ROTLEFT`). Ensures tooltips reflect current controller bindings.
* **Parameters:** None.
* **Returns:** Nothing.

### `Show()`
* **Description:** Makes all child buttons visible and refreshes tooltips. Overrides base class method.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowMapButton()`
* **Description:** Explicitly shows the minimap button and positions the pause button at `(0, -50, 0)`. Used when the map is active or visible.
* **Parameters:** None.
* **Returns:** Nothing.

### `HideMapButton()`
* **Description:** Hides the minimap button and repositions the pause button to `(0, -40, 0)`. Used when the map is hidden.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.