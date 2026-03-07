---
id: fader
title: Fader
description: Manages time-based value interpolation (fading) between start and end values using custom setter callbacks.
tags: [animation, interpolation, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f2555918
system_scope: entity
---

# Fader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fader` is a lightweight component that performs linear value interpolation over time. It is typically attached to entities that need smooth transitions of numeric properties (e.g., opacity, scale, sound volume) via custom setter functions. The component tracks one or more concurrent fade operations, updates them each frame, and cleans up completed fades automatically.

It does not manage rendering or physics directly—instead, it delegates the actual value assignment to a provided setter function, enabling integration with arbitrary property systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fader")

-- Fade an entity's alpha from 1.0 to 0.0 over 2 seconds
local setter = function(val, target)
    target.Transform:SetHide(true)
    target.AnimState:SetMultAlpha(val)
end

inst.components.fader:Fade(1.0, 0.0, 2.0, setter)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `values` | table | `{}` | Array of active fade operations; each entry contains interpolation state. |
| `numvals` | number | `0` | Count of active fade operations. |

## Main functions
### `Fade(startval, endval, time, setter, atend, id)`
* **Description:** Starts a new fade operation, interpolating from `startval` to `endval` over `time` seconds. Updates the value via `setter(val, inst)` each frame, and optionally calls `atend(inst, val)` when complete.
* **Parameters:**
  * `startval` (number) — initial value of the fade.
  * `endval` (number) — target value at the end of the fade.
  * `time` (number) — duration in seconds.
  * `setter` (function) — callback taking `(val, inst)` to apply the interpolated value.
  * `atend` (function, optional) — callback taking `(inst, final_val)` fired when fade completes.
  * `id` (number or string, optional) — user-defined identifier; defaults to 1-based index.
* **Returns:** `number` — the assigned fade ID (either provided or auto-incremented).
* **Error states:** None.

### `StopAll()`
* **Description:** Immediately finishes all active fades by setting all values to their `endval`, triggers each `atend` callback (if any), clears the fade queue, and stops component updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Internal frame update handler invoked by the engine. Advances all active fades by `dt` seconds, updates via `setter`, and removes completed fades.
* **Parameters:** `dt` (number) — time elapsed since last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
