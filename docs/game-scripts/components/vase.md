---
id: vase
title: Vase
description: Manages flower placement, wilting behavior, and dynamic lighting for a vase entity in the game.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 1b95e77f
---

# Vase

## Overview
This component manages the vase's interaction with flowers—including accepting, placing, wilting, and clearing them—while also handling dynamic lighting updates based on flower freshness and time-to-wilt. It integrates with the Entity Component System to provide state persistence, periodic light updates, and event-driven behavior (e.g., entering/exiting limbo).

## Dependencies & Tags
- **Adds/Removes Tag:** `"vase"` (via `onenabled` hook and `OnRemoveFromEntity`)
- **Listens For Events:** `"exitlimbo"`, `"enterlimbo"`
- **Uses Tuning Values:** `TUNING.ENDTABLE_FLOWER_WILTTIME`, `TUNING.ENDTABLE_LIGHT_UPDATE`, `TUNING.VASE_FLOWER_SWAPS`, `TUNING.VASE_FLOWER_MAP`
- **Component Dependencies (implicitly):** `inst` must support `DoTaskInTime`, `DoPeriodicTask`, `RemoveEventCallback`, `ListenForEvent`, `IsInLimbo`, and have components like `stackable`, `perishable`, `inventoryitem` when accepting items.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (assigned in `_ctor`) | Reference to the owning entity. |
| `deleteitemonaccept` | `boolean` | `true` | If `true`, the accepted flower item is removed from the world after placement. |
| `enabled` | `boolean` | `true` | Whether the vase accepts new flowers. |
| `fresh` | `boolean` | `false` | Indicates if the current flower is fresh (non-wilted). |
| `light` | `boolean` | `false` | Indicates if the vase emits light. |
| `flowerid` | `string?` | `nil` | Identifier for the currently placed flower. |
| `wilttask` | `Task?` | `nil` | Task scheduled to wilt the flower after a time delay. |
| `lighttask` | `Task?` | `nil` | Periodic task updating light parameters. |
| `onupdateflowerfn` | `function?` | `nil` | Callback invoked when flower state changes (`flowerid`, `fresh`). |
| `onupdatelightfn` | `function?` | `nil` | Callback invoked when light properties (radius, intensity, falloff) change. |
| `ondecorate` | `function?` | `nil` | Backward-compatible callback after successful decoration (includes `giver`, `item`, `flowerid`). |

## Main Functions

### `SetFlower(flowerid, wilt_time)`
* **Description:** Places a flower in the vase, initializes wilting and lighting behavior based on flower type and `wilt_time`. Handles fresh vs. wilted states, light emission, and task scheduling.
* **Parameters:**
  - `flowerid` (`string`): Identifier for the flower (e.g., `"flower_red"`).
  - `wilt_time` (`number?`): Time in seconds until the flower wilts. If `0`, flower is wilted immediately. If `nil`, uses `TUNING.ENDTABLE_FLOWER_WILTTIME`. Non-lightsource flowers ignore `wilt_time` and remain fresh without lighting.

### `WiltFlower()`
* **Description:** Forces the current flower to wilt, canceling tasks and disabling light emission if it was fresh. Triggers a flower update event.

### `ClearFlower()`
* **Description:** Removes the current flower, resetting state (`flowerid`, `fresh`, `light`) and canceling all associated tasks and event listeners.

### `Decorate(giver, item)`
* **Description:** Accepts a placed flower item, validates it, and calls `SetFlower`. Handles item removal and calculates wilt time based on perishability. Returns `true` on success.
* **Parameters:**
  - `giver` (`Entity?`): The entity that placed the flower (optional).
  - `item` (`GameItem?`): The flower item being placed. Must have a valid `prefab` mapped in `TUNING.VASE_FLOWER_MAP`.

### `PushFlower(flowerid, fresh)`
* **Description:** Invokes the `onupdateflowerfn` callback (if set) with the current flower state.
* **Parameters:**
  - `flowerid` (`string?`): Current flower ID (or `nil` if empty).
  - `fresh` (`boolean`): Whether the flower is fresh.

### `PushLight(radius, intensity, falloff)`
* **Description:** Invokes the `onupdatelightfn` callback (if set) with dynamic light parameters.
* **Parameters:**
  - `radius` (`number`): Light radius (0–3.0).
  - `intensity` (`number`): Light brightness (0–0.8).
  - `falloff` (`number`): Light falloff factor (0–1.0).

### `Enable()`, `Disable()`
* **Description:** Sets the `enabled` state. Affects whether `Decorate` accepts new items.

### `HasFlower()`, `HasFreshFlower()`
* **Description:** Returns `true` if a flower is present (`flowerid ~= nil`) or fresh (`fresh == true`), respectively.

### `GetTimeToWilt()`
* **Description:** Returns remaining time (in seconds) until the current flower wilts, or `nil` if no wilt task is active.

### `LongUpdate(dt)`
* **Description:** Adjusts the wilting task when game time is advanced (e.g., during fast-forward or pause). Maintains accurate remaining time.

### `OnSave()`, `OnLoad(data)`
* **Description:** Handles serialization (`OnSave`) and deserialization (`OnLoad`) of flower and wilt state.

### `GetDebugString()`
* **Description:** Returns a debug string showing the `enabled` state.

## Events & Listeners
- **Listens For:**
  - `"exitlimbo"` → triggers `OnExitLimbo`
  - `"enterlimbo"` → triggers `OnEnterLimbo` (only when light-emitting flower is present)
- **Pushes Events:**
  - None (uses callbacks instead of event pushing for notifications).