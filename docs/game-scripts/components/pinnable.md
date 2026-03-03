---
id: pinnable
title: Pinnable
description: Manages the pinned state and visual wear-off effect for entities that can be stuck by goo-based attacks.
tags: [combat, physics, fx]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0e479f73
system_scope: entity
---

# Pinnable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `pinnable` component enables entities (typically enemies) to be "pinned" in place when struck by goo-based attacks, such as those from Sprout. When pinned, the entity is visually covered with a goo symbol, movement and targeting are disabled, and the goo gradually wears off over time or with additional attacks. This component integrates with `combat` (to drop targets), `health` (to prevent pinning dead entities), and `locomotor` (to halt movement). It uses a dynamic symbol override and particle effects to represent the goo's current coverage.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pinnable")

-- Customize wear-off behavior
inst.components.pinnable:SetDefaultWearOffTime(10)

-- Attempt to pin the entity
if inst.components.pinnable:IsValidPinTarget() then
    inst.components.pinnable:Stick("goo_build_name")
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`  
**Tags:** Adds `pinned` while stuck; checks `debuffed` (implicitly via `IsDead()`), `hiding` (via `combat:ShouldAggro`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbepinned` | boolean | `true` | Whether the entity can be pinned at all. |
| `stuck` | boolean | `false` | Current pinned state. |
| `wearofftime` | number | `TUNING.PINNABLE_WEAR_OFF_TIME` | Total duration (in seconds) for the goo to wear off naturally. |
| `attacks_since_pinned` | number | `0` | Number of attacks received while pinned, accelerating wear-off. |
| `last_stuck_time` | number | `0` | Server time (via `GetTime()`) when pinned. |
| `last_unstuck_time` | number | `0` | Server time when last unpinned, used for recovery leeway. |
| `fxlevel` | number | `1` | Unused (preserved for legacy compatibility). |
| `fxdata` | table | `{}` | Unused (preserved for legacy compatibility). |
| `goo_build` | string or nil | `nil` | Custom goo symbol build name provided on `Stick`. |
| `splashfxlist` | table or nil | `splashprefabs` | Custom splash FX prefabs list provided on `Stick`. |

## Main functions
### `Stick(goo_build, splashfxlist)`
* **Description:** Applies the pinned state to the entity, disabling brain, combat targeting, and locomotion. Adds the `pinned` tag and displays the appropriate goo symbol.
* **Parameters:**
  * `goo_build` (string or nil) – Optional custom animation symbol build name for the goo overlay.
  * `splashfxlist` (table or nil) – Optional custom list of splash FX prefabs to use.
* **Returns:** Nothing.
* **Error states:** Has no effect if `canbepinned` is false, the entity is not visible, or `health` component exists and reports the entity is dead.

### `Unstick()`
* **Description:** Removes the pinned state, restores brain and locomotion, clears the goo symbol override, and spawns a shatter FX. Fires the `onunpin` event.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `stuck` is `false`.

### `IsStuck()`
* **Description:** Returns whether the entity is currently pinned.
* **Parameters:** None.
* **Returns:** `true` if `stuck` is `true`, otherwise `false`.

### `IsValidPinTarget()`
* **Description:** Checks if the entity can currently be pinned.
* **Parameters:** None.
* **Returns:** `true` if `canbepinned` is `true`, `stuck` is `false`, and enough time has passed since the last unpin (`GetTime() > last_unstuck_time + TUNING.PINNABLE_RECOVERY_LEEWAY`).
* **Error states:** Returns `false` if the entity is currently pinned or in the short recovery window after being unpinned.

### `RemainingRatio()`
* **Description:** Calculates the fraction of goo remaining (from `1.0` to `0.0`), based on elapsed time and attack count.
* **Parameters:** None.
* **Returns:** number in range `[0, 1]`.
* **Error states:** Returns `0` if `stuck` is `false` (though this case is typically handled by callers).

### `UpdateStuckStatus()`
* **Description:** Updates the visual goo symbol and wear-off task based on current `RemainingRatio`. Removes pin if ratio reaches `0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnShatterFX(ratio)`
* **Description:** Spawns a splash FX particle effect based on the current goo coverage (`ratio`). If `ratio` is omitted, uses `RemainingRatio()`.
* **Parameters:**
  * `ratio` (number or nil) – Coverage level (`0.0` = empty, `1.0` = full). Defaults to current remaining ratio.
* **Returns:** Nothing.
* **Error states:** Effect is added only if `SpawnPrefab` returns a non-`nil` result (which is always true if the FX prefab exists and loads).

### `SetDefaultWearOffTime(wearofftime)`
* **Description:** Overrides the default natural wear-off duration for this instance.
* **Parameters:** `wearofftime` (number) – New wear-off duration in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `unpinned` – Calls `Unstick`.  
  - `attacked` – Increments `attacks_since_pinned` and triggers shatter FX if pinned.  
  - `death` – Calls `Unstick` (via `OnUnpinned`).  
- **Pushes:**  
  - `pinned` – Fired once when transitioning from unstuck to stuck.  
  - `onunpin` – Fired when `Unstick` completes.
