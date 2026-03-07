---
id: highlight
title: Highlight
description: Manages dynamic highlight color effects (including flashing and persistent highlights) on entity renderables.
tags: [render, visual, fx]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 97bdf38b
system_scope: fx
---

# Highlight

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Highlight` component applies and animates custom highlight colors on an entity's `AnimState` and optional child entities. It supports persistent highlighting, custom additive RGB color offsets, and timed flash effects using cubic easing. This component is typically used for targeting indicators, status effects, or visual feedback on important entities and is automatically removed when no highlight or flash is active.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("highlight")

-- Apply a persistent highlight with custom color
inst.components.highlight:Highlight(0.3, 0.1, 0.1)

-- Trigger a 0.5-second fade-in + 0.5-second fade-out red flash
inst.components.highlight:Flash(1.0, 0.5, 0.5)
```

## Dependencies & tags
**Components used:** None directly — relies on `AnimState` and optional `highlightchildren` property.  
**Tags:** Checks `player` tag and uses `ThePlayer` for visibility detection.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity this component is attached to. |
| `highlit` | boolean or `nil` | `nil` | Indicates if a persistent highlight is currently active. |
| `base_add_colour_red`, `base_add_colour_green`, `base_add_colour_blue` | number | `0` | Additive RGB values set via `SetAddColour`. |
| `highlight_add_colour_red`, `highlight_add_colour_green`, `highlight_add_colour_blue` | number or `nil` | `nil` | Additive RGB values applied during highlight state. |
| `flash_val` | number or `nil` | `nil` | Current flash intensity value computed during animation. |
| `flashing` | boolean | `false` | Whether a flash animation is currently active. |
| `flashadd` | number | `0` | Peak flash intensity for the flash effect. |
| `flashtimein` | number | `0` | Duration (in seconds) of the flash fade-in. |
| `flashtimeout` | number | `0` | Duration (in seconds) of the flash fade-out. |
| `t` | number | `0` | Accumulated time during the current flash phase. |
| `goingin` | boolean | `true` | Direction of the current flash phase (`true` = fade-in, `false` = fade-out). |

## Main functions
### `SetAddColour(col)`
* **Description:** Sets a persistent additive RGB highlight color on the entity. If not currently flashing, immediately applies the color.
* **Parameters:** `col` (vector3) — `col.x`, `col.y`, `col.z` correspond to red, green, and blue values (typically `0`–`1` range).
* **Returns:** Nothing.
* **Error states:** Has no effect if the entity lacks an `AnimState` component.

### `Flash(toadd, timein, timeout)`
* **Description:** Starts a flash animation, gradually increasing then decreasing additive color intensity using `easing.outCubic`.
* **Parameters:**
  * `toadd` (number) — peak additive value to reach (applied to all RGB channels).
  * `timein` (number) — duration of the fade-in phase in seconds.
  * `timeout` (number) — duration of the fade-out phase in seconds.
* **Returns:** Nothing.
* **Error states:** None. Automatically stops updating if the entity becomes invalid or highlight/flash ends.

### `Highlight(r, g, b)`
* **Description:** Activates a persistent highlight with optional RGB override values. Checks if the entity is visible to `ThePlayer` or has the `player` tag before applying highlights; otherwise, clears highlight color.
* **Parameters:**
  * `r`, `g`, `b` (number or `nil`) — override red, green, and blue additive values. If `nil`, uses `highlightoverride` (if present) or defaults to `0.2` for all channels.
* **Returns:** Nothing.
* **Error states:** None. Silently skips applying color if the entity is not visible or lacks required properties.

### `UnHighlight()`
* **Description:** Removes the persistent highlight. If not flashing, schedules the component for removal.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Does not interrupt an active flash.

### `ApplyColour()`
* **Description:** Computes the final additive color (base + highlight + flash) and applies it to the entity’s `AnimState` and `highlightchildren`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Skips if `AnimState` is missing.

### `OnRemoveFromEntity()`
* **Description:** Resets highlight colors to default (no highlight) for the entity and its children when the component is removed.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** None directly — updates are managed via `inst:StartUpdatingComponent(self)` and `inst:StopUpdatingComponent(self)` from `OnUpdate`.
- **Pushes:** None — this component does not fire custom events.
