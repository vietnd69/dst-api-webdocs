---
id: fumeover
title: Fumeover
description: Manages dynamic visual overlays for fume and debuff effects on the player, based on proximity to spore clouds.
tags: [ui, fx, player, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: bcfeed4b
system_scope: ui
---

# Fumeover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Fumeover` is a UI widget component that renders animated visual overlays on the screen when the player is exposed to fumes (typically from spore clouds). It monitors the player's proximity to nearby entities tagged with `"sporecloud"`, dynamically adjusting opacity of two visual layers (`over` and `top`) based on cumulative fume intensity. The component also responds to debuff events (`startfumedebuff`, `startcorrosivedebuff`) to override or enhance the visual state. It is attached to the player entity and functions as a screen-space overlay.

## Usage example
```lua
--Typically added automatically by the player prefab during initialization:
local inst = ThePlayer
inst:AddComponent("fumeover")
--No direct API calls are required; the component reacts to events and environment.

--If manually testing in a mod:
inst:PushEvent("startfumedebuff", { owner = inst, debuff = some_debuff_prefab })
inst:PushEvent("startcorrosivedebuff", { owner = inst, debuff = some_corrosive_prefab })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `sporecloud`, `playerghost`; sets internal layer states (`base_level`, `level`, `k`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | *assigned in constructor* | The player entity this widget overlays for. |
| `over.bg` | `Image` | `Image("images/fx2.xml", "fume_over.tex")` | Background image for the primary fume layer. |
| `top.bg` | `Image` | `Image("images/fx2.xml", "fume_top.tex")` | Background image for the secondary (debuff) layer. |
| `debuffs` | table | `{}` | Stores active fume debuffs keyed by debuff instance. |
| `corrosives` | table | `{}` | Stores active corrosive debuffs keyed by debuff instance. |
| `_updateperiod` | number | `SLOW_PERIOD` (`.5`) | Time interval (seconds) for periodic updates. |
| `_updatetask` | `GScriptTask` | *assigned in constructor* | Periodic task executing `UpdateLayers`. |

## Main functions
### `TurnOn(layer, intensity)`
* **Description:** Activates the specified layer with an initial opacity level based on intensity. Starts updating the layer.
* **Parameters:**  
  `layer` (table) — The layer table (`self.over` or `self.top`).  
  `intensity` (number?, default `1`) — Fume intensity value (0 to 1+).  
* **Returns:** Nothing.

### `TurnOff(layer)`
* **Description:** Deactivates the specified layer by setting its base level to 0. Starts fading out the layer.
* **Parameters:**  
  `layer` (table) — The layer table (`self.over` or `self.top`).  
* **Returns:** Nothing.

### `DoUpdate(layer, dt)`
* **Description:** Interpolates the current layer opacity (`layer.level`) toward `layer.base_level` using a smooth exponential decay. Controls fade-in/fade-out behavior.
* **Parameters:**  
  `layer` (table) — The layer table to update.  
  `dt` (number) — Delta time in seconds.  
* **Returns:** Nothing.  
* **Error states:** No-op if `layer.level == layer.base_level`.

### `OnUpdate(dt)`
* **Description:** The core update loop, called every frame while the widget is updating. Handles smooth interpolation for both layers, visibility toggling, and stops updating when idle.
* **Parameters:**  
  `dt` (number) — Delta time in seconds.  
* **Returns:** Nothing.  
* **Error states:** Skips updates if `TheNet:IsServerPaused()` is true, or if `dt <= 0` or `dt > 0.1` (to avoid instability).

## Events & listeners
- **Listens to:**  
  `startfumedebuff` — Registers the debuff and triggers immediate layer update to include debuff state.  
  `startcorrosivedebuff` — Activates the `over` layer and hides the `top` layer.  
  `onremove` (on debuff/corrosive instance) — Removes the debuff/corrosive and schedules re-evaluation of fume levels.  
- **Pushes:** None.