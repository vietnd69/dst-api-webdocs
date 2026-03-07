---
id: sandstorms
title: Sandstorms
description: Manages global sandstorm state and calculates storm intensity based on season, weather, location, and nearby oases.
tags: [environment, weather, world, map]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2ce66682
system_scope: environment
---

# Sandstorms

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sandstorms` is a world-scoped component that determines whether a sandstorm is currently active and computes local sandstorm intensity for any given entity. It evaluates season (summer), weather (dry conditions), and proximity to oasis regions to modulate storm severity. The component maintains a registry of oases and uses topology-based distance calculations to determine how deep an entity is inside a sandstorm node. This component exists only on the master simulation (`TheWorld.ismastersim`) and is not replicated to clients.

## Usage example
```lua
-- Add the component to the world instance (typically done automatically)
-- Example usage by external code:
if TheWorld.components.sandstorms ~= nil then
    local level = TheWorld.components.sandstorms:GetSandstormLevel(ThePlayer)
    local active = TheWorld.components.sandstorms:IsSandstormActive()
    local in_oasis = TheWorld.components.sandstorms:IsInOasis(ThePlayer)
end
```

## Dependencies & tags
**Components used:** `areaaware`, `oasis`  
**Tags:** Listens for `"sandstorm"` tag via `AreaAware:CurrentlyInTag`; registers oases via `"ms_registeroasis"` event. No tags are added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (constructor argument) | The world entity instance this component is attached to. |
| `_sandstormactive` | boolean | `false` | Internal flag indicating if a sandstorm is globally active. |
| `_issummer` | boolean | `false` | Internal flag tracking if current season is summer. |
| `_iswet` | boolean | `false` | Internal flag tracking if current weather is wet or snowy. |
| `_oases` | table | `{}` | Map of registered oasis entities; used to check oasis proximity. |

## Main functions
### `CalcSandstormLevel(ent)`
* **Description:** Calculates the sandstorm intensity level (0–1) for an entity based on its distance to the nearest non-`"sandstorm"` tagged node edge. Requires `ent.components.areaaware` to be present.
* **Parameters:** `ent` (Entity or `nil`) — the entity to evaluate.
* **Returns:** `number` — normalized intensity (0 = no storm, `TUNING.SANDSTORM_FULLY_ENTERED_DEPTH` = fully inside storm), clamped to `[0, 1]`.
* **Error states:** Returns `0` if `ent` is `nil`, or if `ent.components.areaaware` is missing.

### `IsInOasis(ent)`
* **Description:** Checks whether the entity is currently inside *any* registered oasis.
* **Parameters:** `ent` (Entity) — the entity to check.
* **Returns:** `boolean` — `true` if inside any oasis, otherwise `false`.
* **Error states:** Safely skips oases missing the `oasis` component.

### `CalcOasisLevel(ent)`
* **Description:** Computes the maximum oasis protection level (0–1) for an entity across all oases using proximity weighting.
* **Parameters:** `ent` (Entity) — the entity to evaluate.
* **Returns:** `number` — proximity-based oasis level (1 = fully inside oasis, decreasing with distance up to `TUNING.SANDSTORM_FULLY_ENTERED_DEPTH`).
* **Error states:** Returns `0` if no oases are registered or all oases lack the `oasis` component.

### `IsInSandstorm(ent)`
* **Description:** Determines if the entity is currently located inside a tagged `"sandstorm"` area and a global sandstorm is active.
* **Parameters:** `ent` (Entity) — the entity to check.
* **Returns:** `boolean` — `true` if both the sandstorm is active and the entity is in a `"sandstorm"`-tagged area.

### `GetSandstormLevel(ent)`
* **Description:** Computes the *net* sandstorm level for an entity: storm level reduced by oasis protection. Used for gameplay effects (e.g., thirst gain, visibility reduction).
* **Parameters:** `ent` (Entity) — the entity to evaluate.
* **Returns:** `number` — final net level in `[0, 1]`. Oasis protection can reduce storm level; if oasis level `>= 1`, net level is `0`.
* **Error states:** Returns `0` if no sandstorm is active, `ent.components.areaaware` is missing, or entity not in `"sandstorm"` area.

### `IsSandstormActive()`
* **Description:** Returns whether a sandstorm is currently active globally.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if sandstorm is active (summer and dry), otherwise `false`.

### `RetrofitCheckIfWorldContainsOasis()`
* **Description:** Utility function to quickly check if any oases are registered in the world.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `_oases` table is non-empty, otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `weathertick` — updates `_iswet` status and triggers storm toggle.  
  - `seasontick` — updates `_issummer` status and triggers storm toggle.  
  - `ms_registeroasis` — registers a new oasis and sets up listener for its removal.  
- **Pushes:**  
  - `ms_stormchanged` — fired when the sandstorm state changes. Payload: `{ stormtype = STORM_TYPES.SANDSTORM, setting = boolean }`.
