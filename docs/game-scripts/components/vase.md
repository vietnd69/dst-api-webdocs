---
id: vase
title: Vase
description: Manages flower placement, wilting behavior, and dynamic lighting for decorative vases in the game.
tags: [flower, lighting, decoration, timer, map]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1b95e77f
system_scope: world
---

# Vase

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Vase` is a world-scoped component that handles the visual and logical state of decorative vases—including flower selection, wilting timers, and dynamic light emission based on flower freshness and type. It integrates with the `perishable` and `stackable` components (via `inventoryitem`) to process flower input, update lighting via callbacks, and persists its state during world saves/loads. The component is typically attached to static map objects like vases and does not control entity physics or behavior directly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vase")
inst.components.vase:SetOnDecorateFn(function(inst, giver, item, flowerid)
    print("Flower", flowerid, "added by", giver)
end)
inst.components.vase:Decorate(giver, flower_item)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `perishable`, `stackable` (via external calls)  
**Tags:** Adds `vase` when enabled; removes `vase` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Entity instance the component is attached to. |
| `enabled` | boolean | `true` | Whether the vase accepts new flowers. |
| `deleteitemonaccept` | boolean | `true` | If true, the input flower item is destroyed after successful decoration. |
| `flowerid` | string or `nil` | `nil` | Identifier of the currently placed flower. |
| `fresh` | boolean | `false` | Whether the current flower is fresh (not wilted). |
| `light` | boolean | `false` | Whether the vase emits light. |
| `wilttask` | `DoTaskInTime` or `nil` | `nil` | Timer task for wilting if applicable. |
| `lighttask` | `DoPeriodicTask` or `nil` | `nil` | Periodic task updating light values. |
| `onupdateflowerfn` | function or `nil` | `nil` | Callback triggered when flower state updates (`fn(inst, flowerid, fresh)`). |
| `onupdatelightfn` | function or `nil` | `nil` | Callback triggered when light state updates (`fn(inst, radius, intensity, falloff)`). |
| `ondecorate` | function or `nil` | `nil` | Backward-compatible callback after flower is added (`fn(inst, giver, item, flowerid)`). |

## Main functions
### `SetFlower(flowerid, wilt_time)`
* **Description:** Sets the flower placed in the vase and configures wilting and lighting based on `wilt_time` and flower type. Accepts `wilt_time = 0` to force immediate wilting; `nil` or positive values for fresh flowers.
* **Parameters:**  
  `flowerid` (string) — Flower identifier from `TUNING.VASE_FLOWER_MAP`.  
  `wilt_time` (number or `0` or `nil`) — Duration until wilting (in seconds); `0` forces wilted state without timer; `nil` or omitted uses `TUNING.ENDTABLE_FLOWER_WILTTIME` for light-source flowers.
* **Returns:** Nothing.
* **Error states:** If `flowerid` is `nil` or not in `TUNING.VASE_FLOWER_MAP`, behavior is undefined (should not occur in normal use). Call `ClearFlower()` to explicitly remove a flower.

### `Decorate(giver, item)`
* **Description:** Attempts to place a flower into the vase using an item. Validates the item, extracts fresh/wilt time from its `perishable` component, removes it from inventory, and updates the vase state.
* **Parameters:**  
  `giver` (Entity or `nil`) — Entity giving the item (used for callbacks).  
  `item` (Entity or `nil`) — The flower item to place in the vase. Must have a valid mapping in `TUNING.VASE_FLOWER_MAP`.
* **Returns:** `true` if the item was accepted and vase state updated; `false` otherwise.
* **Error states:** Returns `false` if `item` is `nil` or `vase.enabled` is `false`. Also returns `false` if `item.prefab` has no entry in `TUNING.VASE_FLOWER_MAP`.

### `WiltFlower()`
* **Description:** Forces the current flower to wilt, clears associated timers, extinguishes light, and notifies listeners.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Has no effect if the vase currently has no flower or the flower is already wilted.

### `ClearFlower()`
* **Description:** Removes the current flower entirely (sets `flowerid` to `nil`), cancels all timers, extinguishes light, and notifies listeners.
* **Parameters:** None.
* **Returns:** Nothing.

### `Enable()` / `Disable()`
* **Description:** Toggles the `enabled` flag, which controls whether `Decorate` accepts new items. Updates the `vase` tag accordingly.
* **Parameters:** None.
* **Returns:** Nothing.

### `HasFlower()`
* **Description:** Checks whether a flower is currently placed in the vase.
* **Parameters:** None.
* **Returns:** `true` if `flowerid ~= nil`; otherwise `false`.

### `HasFreshFlower()`
* **Description:** Checks whether the current flower is fresh (not wilted).
* **Parameters:** None.
* **Returns:** `true` if `fresh == true`; otherwise `false`.

### `GetTimeToWilt()`
* **Description:** Returns the remaining time until the current flower wilts, if applicable.
* **Parameters:** None.
* **Returns:** Number of seconds remaining (number), or `nil` if no wilt timer is active.

### `PushLight(radius, intensity, falloff)`
* **Description:** Triggers the user-defined light update callback (`onupdatelightfn`) with light parameters. Called internally by `UpdateLight`.
* **Parameters:**  
  `radius` (number) — Light radius.  
  `intensity` (number) — Light intensity.  
  `falloff` (number) — Light falloff factor.
* **Returns:** Nothing.

### `PushFlower(flowerid, fresh)`
* **Description:** Triggers the user-defined flower update callback (`onupdateflowerfn`) with flower state.
* **Parameters:**  
  `flowerid` (string or `nil`) — Current flower identifier or `nil` if cleared.  
  `fresh` (boolean) — Freshness state.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Adjusts the wilt timer for frame-based updates (e.g., for world sleep/skip). Recalculates and reschedules `wilttask` to preserve remaining time.
* **Parameters:**  
  `dt` (number) — Elapsed time since last update.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes current flower and wilt state for world save.
* **Parameters:** None.
* **Returns:** Table of the form `{ flower = id, wilt = time_or_nil_or_0 }`, or `nil` if no flower.

### `OnLoad(data)`
* **Description:** Restores vase state from saved data. Supports `wilt = nil` (fresh, no timer), `wilt = 0` (wilted), or `wilt > 0` (resumed wilt timer).
* **Parameters:**  
  `data` (table or `nil`) — Saved state returned by `OnSave()`.
* **Returns:** Nothing.

### `SetOnUpdateFlowerFn(fn)`
### `SetOnUpdateLightFn(fn)`
### `SetOnDecorateFn(fn)`
* **Description:** Sets optional callback functions for flower updates, light updates, or decoration events. Used by prefabs to customize visual behavior.
* **Parameters:**  
  `fn` (function or `nil`) — Callback function.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `exitlimbo` (internal: `OnExitLimbo`) — Restarts light timer when entity exits limbo.  
  - `enterlimbo` (internal: `OnEnterLimbo`) — Cancels light timers when entity enters limbo.  
  - `wilt` (internal: `OnWilt`) — Triggered when wilt timer expires, calls `WiltFlower()`.
- **Pushes:** None directly (relies on callbacks via `PushLight()`/`PushFlower()`).
