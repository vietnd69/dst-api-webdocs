---
id: floater
title: Floater
description: Manages visual and behavioral effects when an entity enters or remains in water, including wetness application, splash spawning, and floating animations.
tags: [water, visual, inventory, physics]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a43af92f
system_scope: entity
---

# Floater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `floater` component handles the logic and visual feedback when an entity enters water (e.g., ocean). It determines when floating effects should be active based on world geometry, applies wetness to unheld items via the `inventoryitem` component, spawns splash FX, and manages floating-related animations and visual FX (front/back layers). It operates separately on server and client, with network synchronization for key state (`_is_landed`, `_erode_time`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("floater")
inst.components.floater:SetSize("med")
inst.components.floater:SetVerticalOffset(0.1)
inst.components.floater:SetScale({1.2, 1.2, 1.2})
```

## Dependencies & tags
**Components used:** `inventoryitem` (for `IsHeld` and `MakeMoistureAtLeast`), `Transform`, `AnimState`, `float_fx_front`, `float_fx_back` prefabs.
**Tags:** Checks `likewateroffducksback` to skip wetness application.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `size` | string | `"small"` | Size variant for FX (`"small"`, `"med"`, `"large"`). |
| `vert_offset` | number or nil | `nil` | Vertical offset applied to FX relative to the entity. |
| `xscale`, `yscale`, `zscale` | number | `1.0` | Scale factors applied to FX entities. |
| `should_parent_effect` | boolean | `true` | If true, FX is parented to the entity; otherwise, FX position is absolute. |
| `do_bank_swap` | boolean | `false` | Whether to use alternate animation bank/anim on float. |
| `float_index` | number | `1` | Frame index used when bank swap is active. |
| `swap_data` | table or nil | `nil` | Optional table containing `bank`, `anim`, `sym_name`/`sym_build` for swapping animations/symbols. |
| `showing_effect` | boolean | `false` | Local state indicating if floating FX are currently active. |
| `bob_percent` | number | `1` | Bobbing intensity passed to `AnimState:SetFloatParams`. |
| `splash` | boolean | `true` | Whether to spawn splash FX on water entry. |
| `is_obstable` | boolean | `false` | Passed to `TheWorld.Map:IsOceanAtPoint` as obstacle flag. |
| `_is_landed` | net_bool | `nil` | Networked boolean tracking if entity is landed in water. |
| `_erode_time` | net_float | `nil` | Networked float for erode timing (used in `erodetimedirty` event). |

## Main functions
### `SetIsObstacle(bool)`
* **Description:** Sets whether the entity should be treated as an obstacle in water when querying map geometry.
* **Parameters:** `bool` (boolean) — If `true` or omitted, treats the entity as an obstacle.
* **Returns:** Nothing.

### `SetSize(size)`
* **Description:** Configures the size of floating FX animations (controls suffix in `"idle_front_"` and `"idle_back_"` animation names).
* **Parameters:** `size` (string) — Expected values: `"small"`, `"med"`, `"large"`.
* **Returns:** Nothing.

### `SetVerticalOffset(offset)`
* **Description:** Sets the vertical offset for floating FX, updating existing FX immediately if present.
* **Parameters:** `offset` (number or nil) — Vertical offset in world units. If `nil`, reverts to zero offset.
* **Returns:** Nothing.

### `SetScale(scale)`
* **Description:** Applies uniform or per-axis scaling to floating FX. Accepts either a single number (uniform) or a 3-element table (`{x, y, z}`).
* **Parameters:** `scale` (number or table) — Scale factor(s).
* **Returns:** Nothing.

### `SetBankSwapOnFloat(should_bank_swap, float_index, swap_data)`
* **Description:** Configures animation swapping when entering floating state (e.g., holding spears).
* **Parameters:**  
  - `should_bank_swap` (boolean) — Enable animation swap.  
  - `float_index` (number, optional) — Frame index to display when swapping. Defaults to `1`.  
  - `swap_data` (table or nil) — Optional metadata containing `bank`, `anim`, `sym_name`, `sym_build`.
* **Returns:** Nothing.

### `SetSwapData(swap_data)`
* **Description:** Updates only the `swap_data` configuration without altering other swap flags.
* **Parameters:** `swap_data` (table or nil) — Same structure as in `SetBankSwapOnFloat`.
* **Returns:** Nothing.

### `ShouldShowEffect()`
* **Description:** Determines whether floating FX should be active based on world geometry: must be over ocean, but not on solid visual ground.
* **Parameters:** None.
* **Returns:** boolean — `true` if the entity is over water and not on solid ground.
* **Error states:** Returns `false` if ocean query fails or if entity is on solid ground.

### `AttachEffect(effect)`
* **Description:** Positions and scales a FX prefab (`float_fx_front` or `float_fx_back`) relative to the entity.
* **Parameters:** `effect` (Entity) — The FX entity to attach.
* **Returns:** Nothing.

### `IsFloating()`
* **Description:** Returns whether the floating effect is currently active (local `showing_effect` state).
* **Parameters:** None.
* **Returns:** boolean — `true` if currently floating.

### `SwitchToFloatAnim()`
* **Description:** Changes animation bank and animation to a floating-specific variant, optionally applying symbol overrides (e.g., spear types).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `do_bank_swap` is `false`. Applies frame index using `math.abs(float_index)`.

### `OnLandedServer()`
* **Description:** Server-side logic executed when entity is detected as landed in water. Applies wetness, spawns splash, updates state, and triggers client animation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Skips wetness application if entity is held or tagged with `"likewateroffducksback"`.

### `OnLandedClient()`
* **Description:** Client-side logic to spawn and play floating FX when entering water state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SwitchToDefaultAnim(force_switch)`
* **Description:** Restores default animation (and clears symbol override if active).
* **Parameters:** `force_switch` (boolean) — If `true`, overrides `do_bank_swap` check.
* **Returns:** Nothing.

### `Erode(erode_time)`
* **Description:** Sets the erode duration on the networked `_erode_time` field, triggering `erodetimedirty` on clients to animate FX fading.
* **Parameters:** `erode_time` (number) — Time in seconds for FX to erode.
* **Returns:** Nothing.
* **Error states:** Only updates networked value if `ismastersim`.

### `OnNoLongerLandedServer()`
* **Description:** Server-side logic when entity leaves water: clears floating state, pushes event, and restores default animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnNoLongerLandedClient()`
* **Description:** Client-side cleanup: removes FX entities, resets float params, clears `showing_effect` state.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `on_landed` (server) — Triggers `OnLandedServer`.  
  - `on_no_longer_landed` (server) — Triggers `OnNoLongerLandedServer`.  
  - `onremove` (server) — Triggers `OnNoLongerLandedServer`.  
  - `landeddirty` (client) — Triggers `OnLandedClient` or `OnNoLongerLandedClient` depending on `_is_landed` state.  
  - `erodetimedirty` (client) — Triggers `ErodeAway` on `front_fx` and `back_fx` using `_erode_time`.
- **Pushes:**  
  - `floater_startfloating` — fired when entering floating state.  
  - `floater_stopfloating` — fired when leaving floating state.
