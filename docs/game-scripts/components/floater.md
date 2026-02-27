---
id: floater
title: Floater
description: Manages floating/water interaction effects, animations, and state synchronization for entities that land on or are submerged in ocean water.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a43af92f
---

# Floater

## Overview
This component handles the logic and visual feedback for when an entity interacts with ocean water—specifically, transitioning between dry and floating states (e.g., when an item lands on water). It synchronizes floating state between server and clients, triggers visual effects (splash and floating animations), manages animated assets (e.g., "float_fx_front/back"), and supports optional animation swaps for wet states.

## Dependencies & Tags
- Relies on `inst.Transform`, `inst.AnimState`, and `inst.components.inventoryitem` (when present).
- Uses networked properties: `net_bool` (`floater._is_landed`) and `net_float` (`floater._erode_time`).
- Listens for events: `on_landed`, `on_no_longer_landed`, `onremove`, `landeddirty`, `erodetimedirty`.
- No tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity. |
| `ismastersim` | `boolean` | — | Whether the current instance is running master simulation. |
| `size` | `string` | `"small"` | Size class used for effect prefabs (`small`, `med`, `large`). |
| `vert_offset` | `number?` | `nil` | Optional vertical offset for effect positioning. |
| `xscale`, `yscale`, `zscale` | `number` | `1.0` | Scale factors applied to floating effects. |
| `should_parent_effect` | `boolean` | `true` | If true, floating effects are parented to the entity; otherwise, world-anchored. |
| `do_bank_swap` | `boolean` | `false` | Whether to use alternate animation banks (e.g., left/right). |
| `float_index` | `number` | `1` | Animation frame index offset (used with bank swap). |
| `swap_data` | `table?` | `nil` | Optional table defining animation overrides (`sym_name`, `sym_build`, `bank`, `anim`). |
| `showing_effect` | `boolean` | `false` | Tracks whether the floating effect is currently active. |
| `bob_percent` | `number` | `1` | Controls bobbing intensity for animation (via `AnimState:SetFloatParams`). |
| `splash` | `boolean` | `true` | Whether to spawn a splash effect on landing. |
| `is_obstable` | `boolean` | `true` | Controls whether the entity acts as an obstacle for water (affects `IsOceanAtPoint`). |
| `_is_landed` | `net_bool` | — | Networked boolean representing landed state. |
| `_erode_time` | `net_float` | — | Networked float representing remaining erode time. |

## Main Functions

### `SetIsObstacle(bool)`
* **Description:** Sets whether the entity blocks water flow (affects `IsOceanAtPoint` logic).
* **Parameters:**  
  `bool` (`boolean?`) — If `false`, obstacle status is disabled; otherwise, enabled (default behavior).

### `SetSize(size)`
* **Description:** Sets the floating effect size, which determines the animation played on the effect prefabs.
* **Parameters:**  
  `size` (`string`) — One of `"small"`, `"med"`, or `"large"`.

### `SetVerticalOffset(offset)`
* **Description:** Adjusts the vertical position of attached floating effects; immediately applies if effects exist.
* **Parameters:**  
  `offset` (`number?`) — Vertical Y-offset from the entity’s position.

### `SetScale(scale)`
* **Description:** Sets the scale of floating effects. Accepts scalar or a table of `[x, y, z]` values.
* **Parameters:**  
  `scale` (`number | table?`) — Uniform scale (number) or per-axis scale table.

### `SetBankSwapOnFloat(should_bank_swap, float_index, swap_data)`
* **Description:** Enables/disables animation swapping (e.g., left/right bank for spear-like items) when floating.
* **Parameters:**  
  `should_bank_swap` (`boolean`) — Enables animation swap.  
  `float_index` (`number?`) — Animation frame index (negative = left bank).  
  `swap_data` (`table?`) — Table with `sym_name`, `sym_build`, `bank`, and `anim` keys.

### `SetSwapData(swap_data)`
* **Description:** Updates the animation swap data used during floating state.
* **Parameters:**  
  `swap_data` (`table?`) — Same structure as in `SetBankSwapOnFloat`.

### `ShouldShowEffect()`
* **Description:** Determines if the floating effect should be visible based on position and obstacle status.
* **Parameters:** None  
* **Returns:** `boolean` — `true` if entity is over ocean and not on visual ground.

### `AttachEffect(effect)`
* **Description:** Attaches a floating effect prefab (e.g., `float_fx_front`) to the entity with proper position and scale.
* **Parameters:**  
  `effect` (`Entity`) — The effect entity to attach.

### `IsFloating()`
* **Description:** Reports whether the floater is currently in floating state.
* **Parameters:** None  
* **Returns:** `boolean` — `true` if `showing_effect` is true.

### `SwitchToFloatAnim()`
* **Description:** Activates floating animation (including bank swap and frame override) on the entity.
* **Parameters:** None

### `SwitchToDefaultAnim(force_switch)`
* **Description:** Restores the default animation after floating ends.
* **Parameters:**  
  `force_switch` (`boolean`) — Forces animation switch even if bank swap was not used.

### `Erode(erode_time)`
* **Description:** (Server-side only) Initiates the erode process by syncing erode time to clients.
* **Parameters:**  
  `erode_time` (`number`) — Time in seconds until the effect erodes away.

### `OnLandedServer()`
* **Description:** Server-side handler when entity lands; applies moisture (if applicable), spawns splash, starts floating effect, and pushes `"floater_startfloating"` event.
* **Parameters:** None

### `OnLandedClient()`
* **Description:** Client-side handler; spawns and animates floating effects (`float_fx_front`, `float_fx_back`).
* **Parameters:** None

### `OnNoLongerLandedServer()`
* **Description:** Server-side handler when floating ends; pushes `"floater_stopfloating"` event.
* **Parameters:** None

### `OnNoLongerLandedClient()`
* **Description:** Client-side handler; removes floating effects and resets animation parameters.
* **Parameters:** None

## Lifecycle Hooks

### Event: `on_landed`
Triggered when the entity lands on water. Calls `OnLandedServer()` and `OnLandedClient()`.

### Event: `on_no_longer_landed`
Triggered when the entity is no longer on water. Calls `OnNoLongerLandedServer()` and `OnNoNoLongerLandedClient()`.

### Event: `onremove`
Cleans up floating effects to prevent orphan prefabs.

### Event: `landeddirty`
Triggers a network sync if landed state changed.

### Event: `erodetimedirty`
Syncs updated erode time when modified.

## Notes & Edge Cases

- **Moisture Handling:** Only applies if `inventoryitem` component exists and `IsHeld()` returns false (i.e., item is on ground or in water). This ensures only *landed* items get wet, not held gear.
- **Effect Scaling:** If `scale` is a table, each axis is scaled individually. Otherwise, uniform scaling is applied.
- **Effect Visibility:** `ShouldShowEffect()` checks `IsOceanAtPoint(self.inst.Transform:GetWorldPosition(), self.is_obstable)`; if `is_obstable=false`, entities do not block water flow and may not be considered landed.
- **Bank Swap Behavior:** When `do_bank_swap=true`, the `float_index` is passed to `AnimState:SetBankAndPlayAnimation`. If `swap_data` is present, a symbol override for `"swap_spear"` is cleared when exiting floating state.

## Example Usage

```lua
-- In an entity’s `master_postinit`
local floater = inst:AddComponent("floater")
floater:SetSize("med")
floater:SetVerticalOffset(0.2)
floater:SetScale(1.5)
floater.splash = true -- Optional splash on landing
floater.do_bank_swap = true
floater.swap_data = {
    sym_name = "spear_side",
    sym_build = "spear_side",
    bank = "left",
    anim = "idle",
}
floater.float_index = -1 -- Left bank animation
```

```lua
-- In code: manually trigger floating state
inst:PushEvent("on_landed") -- Will invoke OnLandedServer/Client
```

## Known Issues

- Floating effects (`float_fx_*`) are spawned even if `ShouldShowEffect()` returns `false`; visibility is controlled by animation, not presence of FX.
- There is no cleanup logic in `OnNoLongerLandedClient` for animation overrides (e.g., `float_index` reset), meaning the entity may retain the last floating frame in default anim unless `SwitchToDefaultAnim` is used.

## See Also

- [`water`](../world/water.md) — Ocean simulation.
- [`inventoryitem`](../entity/inventoryitem.md) — Handles item wetness/moisture.
- [`animstate`](../entity/animstate.md) — Manages animation banks, layers, and frame offsets.
- [`float_fx_front`](../prefabs/float_fx_front.lua) — Visual effect prefab used for floating.