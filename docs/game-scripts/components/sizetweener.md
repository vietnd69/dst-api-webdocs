---
id: sizetweener
title: Sizetweener
description: Manages smooth scaling transitions (tweening) of an entity's visual size over time.
tags: [animation, visual, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3ed354b4
system_scope: visual
---
# Sizetweener

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sizetweener` is a component that performs linear interpolation (lerp) between an entity's current scale and a target scale over a specified duration. It integrates with the entity's update loop to gradually adjust the `Transform:SetScale()` values, enabling smooth size animations. The component notifies listeners via events (`sizetweener_start`, `sizetweener_end`) and optionally invokes a user-provided callback upon completion. It is typically added to visual prefabs requiring size-changing effects (e.g., growth, shrinkage, pulsing).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sizetweener")

-- Grow the entity over 2 seconds and trigger a callback
inst.components.sizetweener:StartTween(2.0, 2, function(target)
    print("Size tween finished! New scale:", target.Transform:GetScale())
end)

-- Shrink instantly (time = 0)
inst.components.sizetweener:StartTween(0.5, 0)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `i_size` | number or `nil` | `nil` | Initial scale (x, y, z) at tween start; `nil` if no active tween. |
| `t_size` | number or `nil` | `nil` | Target scale (applied uniformly to x, y, z); `nil` if no active tween. |
| `callback` | function or `nil` | `nil` | Optional function called when the tween completes. |
| `time` | number or `nil` | `nil` | Total duration of the tween in seconds; `nil` if no active tween. |
| `timepassed` | number | `0` | Elapsed time since the tween started. |
| `tweening` | boolean | `false` | Whether a tween is currently in progress. |

## Main functions
### `StartTween(size, time, callback)`
*   **Description:** Begins a size tween. Sets the `i_size` to the current scale, stores the target `size` and `time`, and starts the update loop if `time > 0`. Immediately fires the `sizetweener_start` event.
*   **Parameters:**
    *   `size` (number) — Uniform scale factor applied to x, y, z axes.
    *   `time` (number) — Duration in seconds. If `<= 0`, the tween completes immediately.
    *   `callback` (function or `nil`) — Optional function called with `self.inst` as the sole argument upon completion.
*   **Returns:** Nothing.
*   **Error states:** If `time == 0`, the tween completes instantly, skips the update loop, and directly calls `EndTween()`.

### `EndTween()`
*   **Description:** Finalizes the tween: stops the update loop, sets the final scale, clears internal state, fires `sizetweener_end`, and invokes the callback (if any).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `tweening` is `false`. Does nothing if `t_size` is `nil`.

### `OnUpdate(dt)`
*   **Description:** Called automatically by the engine during `StartUpdatingComponent` (when `time > 0`). Advances the tween by `dt`, updates the scale via linear interpolation, and ends the tween if complete.
*   **Parameters:**
    *   `dt` (number) — Delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** If `i_size` or `t_size` is `nil`, no interpolation occurs (defensive programming; should not happen in normal flow).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:**  
  * `sizetweener_start` — fired when a tween begins (`StartTween`).  
  * `sizetweener_end` — fired when a tween completes (`EndTween`).
