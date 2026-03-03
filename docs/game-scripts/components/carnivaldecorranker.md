---
id: carnivaldecorranker
title: Carnivaldecorranker
description: Tracks and calculates the total decorative value and rank of carnival-themed decorations within proximity of an entity.
tags: [carnival, decoration, ranking, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e1e25b69
system_scope: environment
---

# Carnivaldecorranker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalDecorRanker` is a passive component that measures the cumulative decorative value of nearby carnival-themed entities and computes a corresponding rank. It listens for proximity-based decorative items tagged with `"carnivaldecor"`, sums their values, and emits a rank change notification when the total crosses thresholds defined by `TUNING.CARNIVAL_DECOR_VALUE_PER_RANK`. The component is typically attached to structures like carnival stages or festival centers that benefit from surrounding decoration density.

It depends on `CarnivalDecor` (specifically its `GetDecorValue` method) to retrieve individual decoration values, and only counts decorations that are not attached to a platform (`decor:GetCurrentPlatform() == nil`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carnivaldecorranker")

-- Attach a listener to be notified when rank changes
inst.components.carnivaldecorranker.onrankchanged = function(inst, new_rank, prev_rank, snap)
    print("Rank changed from", prev_rank, "to", new_rank)
end

-- The component auto-calculates on initialization; manual recalculation is optional
inst.components.carnivaldecorranker:UpdateDecorValue(true)
```

## Dependencies & tags
**Components used:** `carnivaldecor` (via `GetDecorValue`)  
**Tags:** Adds `"carnivaldecor_ranker"` to the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `decor` | table | `{}` | Map of nearby decoration entities to their decorative values. |
| `totalvalue` | number | `0` | Sum of all decorative values currently tracked. |
| `rank` | number | `0` | Current rank, computed as `floor(totalvalue / TUNING.CARNIVAL_DECOR_VALUE_PER_RANK) + 1`, clamped to `TUNING.CARNIVAL_DECOR_RANK_MAX`. |
| `onrankchanged` | function | `nil` | Optional callback fired when rank changes: `function(inst, new_rank, prev_rank, snap)`. |

## Main functions
### `UpdateDecorValue(snap)`
*   **Description:** Recalculates the total decorative value from the `decor` map and updates the rank if it has changed. If `onrankchanged` is set, invokes it with the new and previous rank values.
*   **Parameters:** `snap` (boolean) — passed through to the callback; typically indicates whether the change is due to a snapshot-style recalculation (e.g., on initialization).
*   **Returns:** Nothing.

### `AddDecor(decor)`
*   **Description:** Registers a new decoration entity by retrieving and storing its decorative value via `CarnivalDecor:GetDecorValue`. Triggers an immediate recalculation.
*   **Parameters:** `decor` (Entity) — entity with a `carnivaldecor` component and no platform (`GetCurrentPlatform() == nil`).
*   **Returns:** Nothing.

### `RemoveDecor(decor)`
*   **Description:** Unregisters a previously registered decoration entity and triggers recalculation.
*   **Parameters:** `decor` (Entity) — the decoration entity to remove.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string containing decoration count, total value, and current rank.
*   **Parameters:** None.
*   **Returns:** String — formatted as `"Num Decor: X Value: Y Rank: Z"`.

## Events & listeners
- **Listens to:** None directly (uses `DoTaskInTime` on construction to trigger initial recalculation via `recalculate_decor`).
- **Pushes:** None (event notification is delivered only via the optional `onrankchanged` callback, not via `PushEvent`).
