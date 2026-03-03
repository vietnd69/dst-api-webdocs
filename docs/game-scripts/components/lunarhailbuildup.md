---
id: lunarhailbuildup
title: Lunarhailbuildup
description: Manages the lunar hail buildup mechanic for a structure, tracking accumulation and decay during lunar hail events, and handling work required to remove the buildup.
tags: [environment, entity, world, weather]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 73ebd5f2
system_scope: environment
---

# Lunarhailbuildup

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lunarhailbuildup` tracks the accumulation and decay of lunar hail buildup on an entity (typically a building or structure). It responds to the global `islunarhailing` world state, manages periodic buildup ticks during hail events, decay ticks when hail stops, and supports work-based removal of the buildup. When the buildup reaches full capacity and has remaining work, it initializes a workable state (adding the `"LunarBuildup"` tag) to allow players to remove it via the `"worked"` event. It interacts with the `rainimmunity` component to bypass buildup during hail.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lunarhailbuildup")
inst.components.lunarhailbuildup:SetTotalWorkAmount(200)
inst.components.lunarhailbuildup:SetMoonGlassAmount(3)
inst.components.lunarhailbuildup:DoWorkToRemoveBuildup(50, player)
```

## Dependencies & tags
**Components used:** `rainimmunity` (checked conditionally to skip buildup during hail)
**Tags:** Adds `"LunarBuildup"` when buildup is workable (i.e., `buildupcurrent == buildupmax` and `workleft > 0`), removes it when buildup resets or work finishes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buildupmax` | number | `1` | Maximum buildup level (used as denominator for percentages). |
| `buildupcurrent` | number | `0` | Current buildup level. |
| `workleft` | number | `0` | Remaining work required to finish buildup removal (after full buildup is reached). |
| `totalworkamount` | number | `TUNING.LUNARHAIL_BUILDUP_TOTAL_WORK_AMOUNT_MEDIUM` | Total work amount needed for full removal. |
| `moonglassamount` | number | `TUNING.LUNARHAIL_BUILDUP_MOONGLASS_AMOUNT_MEDIUM` | Base count of moonglass rewards dropped on removal. |
| `onstartislunarhailingfn` | function or nil | `nil` | Callback invoked when lunar hail starts. |
| `onstopislunarhailingfn` | function or nil | `nil` | Callback invoked when lunar hail stops. |

## Main functions
### `DoLunarHailTick(buildingup)`
* **Description:** Advances buildup by a fixed amount over time. If `buildingup` is `true`, increases buildup during lunar hail; otherwise, decreases buildup (decay) after hail stops. Skips ticks if the entity has `rainimmunity` or `ignorelunarhailticks` is `true`.
* **Parameters:** `buildingup` (boolean) — `true` to increase buildup, `false` to decrease it.
* **Returns:** Nothing.
* **Error states:** No-op if entity has `rainimmunity` or `ignorelunarhailticks` is `true` during buildup phase.

### `DoBuildupDelta(delta)`
* **Description:** Adjusts `buildupcurrent` by `delta`, clamping it to `0`–`buildupmax`. Triggers state transitions and events when crossing thresholds (e.g., reaching full buildup or zero).
* **Parameters:** `delta` (number) — change in buildup level.
* **Returns:** Nothing.
* **Error states:** Calls `StopTickTask()` and does not fire events if `buildupcurrent` does not change after clamping.

### `DoWorkToRemoveBuildup(workcount, doer)`
* **Description:** Reduces `workleft` by `workcount`. If `workleft` reaches `0`, drops moonglass rewards, calls `OnWorkFinished()`, and resets buildup state.
* **Parameters:** `workcount` (number) — amount of work to apply; `doer` (entity or nil) — the entity performing the work.
* **Returns:** Nothing.
* **Error states:** May drop fewer rewards than expected if `workcount` exceeds remaining `workleft`; no partial work refund.

### `SetTotalWorkAmount(totalworkamount)`
* **Description:** Sets the total work required to remove the buildup and adjusts `workleft` downward if necessary.
* **Parameters:** `totalworkamount` (number) — new total work amount.
* **Returns:** Nothing.

### `SetMoonGlassAmount(moonglassamount)`
* **Description:** Sets the base number of moonglass items to drop on removal.
* **Parameters:** `moonglassamount` (number) — base reward count.
* **Returns:** Nothing.

### `GetBuildupPercent()`
* **Description:** Returns the current buildup as a fraction of `buildupmax`.
* **Parameters:** None.
* **Returns:** number — buildup percentage in `[0, 1]`.

### `SetBuildupPercent(percent)`
* **Description:** Sets buildup level directly to `percent * buildupmax`.
* **Parameters:** `percent` (number) — target buildup fraction (`0` to `1`).
* **Returns:** Nothing.

### `IsBuildupWorkable()`
* **Description:** Returns whether buildup can be worked on (i.e., `workleft > 0`).
* **Parameters:** None.
* **Returns:** boolean.

### `StartBuildupTask()` / `StartDecayTask()`
* **Description:** Initiates a periodic task to advance buildup (hail) or decay (post-hail) respectively. Tasks are canceled by `StopTickTask()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnWorkFinished()`
* **Description:** Finalizes buildup removal: clears `workleft`, removes `"LunarBuildup"` tag, and resets buildup to `0` if valid.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()` / `OnLoad(data)`
* **Description:** Serializes/deserializes relevant state (`workleft`, `buildupcurrent`) for save/load support.
* **Parameters:** `data` (table or nil) — for `OnLoad`, the saved data table.
* **Returns:** `OnSave` returns a table; `OnLoad` returns nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing buildup, remaining work, and next tick time.
* **Parameters:** None.
* **Returns:** string.

## Events & listeners
- **Listens to:** `islunarhailing` — via `WatchWorldState` to trigger buildup/decay tasks; `"worked"` — to react to external work events.
- **Pushes:** `lunarhailbuildupdelta` — when buildup changes; `lunarhailbuildupworked` — when work is applied; `lunarhailbuildupworkablestatechanged` — when workability state changes; `lunarhailbuildupworkablestatechanged` — when work finishes; `"workinglunarhailbuildup"` on the `doer` entity if provided.
