---
id: iceover
title: IceOver
description: Manages a visual freeze overlay effect and sound feedback when an entity's temperature drops.
tags: [visual, sound, ui, weather]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ccfdbe36
system_scope: ui
---

# IceOver

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`IceOver` is a UI widget that displays a dynamic freeze overlay (alpha-faded fullscreen image) on the player's screen when their temperature falls into freezing ranges. It reacts to temperature changes via an event listener on the owner entity and adjusts visual intensity and freeze-related sound playback across four temperature thresholds. It uses the `temperature` component on the owner to determine the current temperature, with a fallback to player class data or default tuning values.

## Usage example
```lua
local owner = ThePlayer
owner:Installwidget("iceover", IceOver(owner))
-- The widget automatically activates upon listening to 'temperaturedelta' events on the owner.
-- No additional manual initialization is required after construction.
```

## Dependencies & tags
**Components used:** `temperature` (via `GetCurrent()`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity instance | `nil` | The entity whose temperature triggers the overlay. |
| `img` | Image widget | `nil` | The fullscreen image child used for the freeze visual. |
| `laststep` | number | `0` | Current freeze stage index (0–4). |
| `alpha_min` | number | `1` | Current minimum alpha value of the overlay. |
| `alpha_min_target` | number | `1` | Target minimum alpha value for smooth interpolation. |

## Main functions
### `OnIceChange()`
* **Description:** Responds to temperature changes by evaluating current temperature against freeze thresholds, advancing or retreating the freeze stage (`laststep`), updating `alpha_min_target`, and optionally playing a freeze sound. If the stage increases, it starts continuous update; if fully thawed, it hides the overlay.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** Smoothly interpolates `alpha_min` toward `alpha_min_target` using linear interpolation (lerp). Updates the image's alpha range accordingly, shows/hides the widget based on `alpha_min`, and manages update cycle via `StartUpdating`/`StopUpdating`.
* **Parameters:** `dt` (number) — delta time in seconds since last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `temperaturedelta` — fired on the owner entity when temperature changes; triggers `OnIceChange()`.  
- **Pushes:** None.