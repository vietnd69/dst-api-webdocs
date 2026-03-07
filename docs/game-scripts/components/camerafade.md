---
id: camerafade
title: Camerafade
description: Manages dynamic camera-based fading of entity visuals based on distance and screen position.
tags: [camera, visual, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fe7693d1
system_scope: environment
---

# Camerafade

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Camerafade` is an entity component that dynamically adjusts the opacity (alpha) of an entity's visual representation based on camera position, distance, and optional screen-space center-based fade logic. It integrates with the wall-update system (`StartWallUpdatingComponent`/`StopWallUpdatingComponent`) to compute per-frame alpha values for smooth fade transitions. It is typically applied to static environment elements like walls, structures, or terrain features that should fade in/out as the camera approaches or recedes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("camerafade")
inst.components.camerafade:SetUp(25, 5)  -- fade range and distance
inst.components.camerafade:Enable(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `25` | Distance (in world units) over which fade-out occurs. |
| `fadetodist` | number | `5` | Distance offset used in fade calculation; affects where the fade curve begins. |
| `center_symbol` | string or nil | `nil` | Optional symbol name used for screen-position-based fade center (e.g., a boss boss symbol). |
| `center_min_dist_sq` | number or nil | `nil` | Squared minimum screen distance from center symbol to start fading. |
| `center_dist_sq` | number or nil | `nil` | Squared screen distance range over which center-based fade is applied. |
| `center_min_fade` | number or nil | `nil` | Minimum alpha multiplier applied at the center symbol. |
| `lerp_to_height` | number or nil | `nil` | Y-height threshold; alpha is interpolated toward full opacity when below this height. |
| `alpha` | number | `1` | Current computed alpha value (0 = fully transparent, 1 = fully opaque). |
| `enabled` | boolean | — | Internal flag indicating whether the fade logic is active. |
| `updating` | boolean | `false` | Internal flag indicating whether the component is subscribed to wall updates. |

## Main functions
### `Enable(enable, instant)`
* **Description:** Activates or deactivates the component. When enabled, starts wall updates; when disabled, stops them (unless `instant` is `true`, which applies immediate reset).
* **Parameters:**  
  `enable` (boolean) — whether to enable or disable fading.  
  `instant` (boolean, optional) — if `true`, immediately resets alpha to `1` and overrides visual colour; ignored unless `enable` is `false`.
* **Returns:** Nothing.
* **Error states:** None.

### `SetUp(range, fadetodist)`
* **Description:** Configures the primary distance-based fade parameters.
* **Parameters:**  
  `range` (number) — the distance threshold over which the entity fades out.  
  `fadetodist` (number) — offset distance; fade-out begins when the camera is `fadetodist` units *beyond* this value from the entity.
* **Returns:** Nothing.

### `SetUpCenterFade(symbol, min_dist_sq, dist_sq, min_fade)`
* **Description:** Configures screen-space center-based fading (e.g., to fade around a central screen element like a boss).
* **Parameters:**  
  `symbol` (string) — the name of the animation symbol whose screen position defines the fade center.  
  `min_dist_sq` (number) — squared screen-space distance at which fade starts (closer = less fade).  
  `dist_sq` (number) — squared screen-space distance over which fade transitions to full opacity.  
  `min_fade` (number) — minimum alpha multiplier applied at the center symbol (e.g., `0.5` means it stays at least 50% visible).
* **Returns:** Nothing.

### `SetLerpToHeight(height)`
* **Description:** Enables vertical height-based fade interpolation. Entities *below* the specified Y-height are smoothly faded toward full opacity.
* **Parameters:**  
  `height` (number) — Y-world-height threshold. Below this, alpha is linearly interpolated toward `1`.
* **Returns:** Nothing.

### `GetCurrentAlpha()`
* **Description:** Returns the current computed alpha value.
* **Parameters:** None.
* **Returns:** number — current alpha value (`0` to `1`).

## Events & listeners
- **Listens to:**  
  `onsleep` — triggers `OnEntitySleep`, halting wall updates and clearing visual overrides if disabled.  
  `onwake` — triggers `OnEntityWake`, resuming wall updates if enabled or non-opaque.
- **Pushes:** None identified  
*(Note: The component modifies the entity’s `AnimState` via `OverrideMultColour` but does not fire custom events.)*
