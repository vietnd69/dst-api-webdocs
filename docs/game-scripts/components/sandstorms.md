---
id: sandstorms
title: Sandstorms
description: Manages sandstorm activation and intensity based on seasonal and weather conditions, while tracking oasis proximity to dampen storm effects.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 2ce66682
---

# Sandstorms

## Overview
This component determines when sandstorms occur and calculates their severity for entities, based on seasonal (summer) and weather (non-wet) conditions. It tracks registered oases to reduce or eliminate sandstorm effects when an entity is inside one, and publishes `ms_stormchanged` events when the storm state toggles. It runs exclusively on the master simulation and depends on `TheWorld.ismastersim`.

## Dependencies & Tags
- **Component Dependencies**: Uses components and properties from:
  - `TheWorld.topology.nodes`, `TheWorld.topology.edges`, `TheWorld.topology.flattenedEdges`, `TheWorld.topology.flattenedPoints`
  - Entities must have `components.areaaware` to participate in sandstorm level calculations.
- **Tags Used**:
  - `"sandstorm"` — used to determine if an entity is currently in a sandstorm region.
- **Events Listened**:
  - `weathertick`
  - `seasontick`
  - `ms_registeroasis`
- **Event Tags Registered**: None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity this component is attached to (typically `TheWorld`). |

*Note: All other key variables are private (prefixed with `_`) and initialized in the constructor.*

## Main Functions

### `self:CalcSandstormLevel(ent)`
* **Description:** Calculates a normalized sandstorm intensity level (0.0–1.0) for a given entity, based on its distance to the nearest edge of the `"sandstorm"` region. Closer to an oasis → higher level (i.e., less severe storm exposure).
* **Parameters:**
  - `ent` (`Entity`): The entity whose sandstorm exposure level is computed. Must have an `areaaware` component.

### `self:IsInOasis(ent)`
* **Description:** Checks whether the given entity is inside *any* registered oasis.
* **Parameters:**
  - `ent` (`Entity`): The entity to test.

### `self:CalcOasisLevel(ent)`
* **Description:** Returns the highest oasis proximity level (0.0–1.0) for the entity across all registered oases. A level ≥ 1 means the entity is fully inside an oasis and immune to sandstorm effects.
* **Parameters:**
  - `ent` (`Entity`): The entity to measure.

### `self:IsInSandstorm(ent)`
* **Description:** Checks if the entity is currently inside a `"sandstorm"` region *and* a sandstorm is actively active.
* **Parameters:**
  - `ent` (`Entity`): The entity to test.

### `self:GetSandstormLevel(ent)`
* **Description:** Returns the final effective sandstorm intensity for the entity (0.0–1.0), accounting for both raw sandstorm exposure and oasis mitigation. Returns 0 if the storm is inactive, entity lacks `areaaware`, or oasis fully cancels the storm.
* **Parameters:**
  - `ent` (`Entity`): The entity whose effective storm level is computed.

### `self:IsSandstormActive()`
* **Description:** Returns whether a sandstorm is currently active (`_sandstormactive`).
* **Parameters:** None.

### `self:RetrofitCheckIfWorldContainsOasis()`
* **Description:** Returns `true` if any oases have been registered (i.e., `_oases` table is non-empty).
* **Parameters:** None.

## Events & Listeners
- **Listens For:**
  - `"weathertick"` → updates `_iswet` and potentially toggles storm state
  - `"seasontick"` → updates `_issummer` and potentially toggles storm state
  - `"ms_registeroasis"` → registers a new oasis entity and begins listening to its `"onremove"` event
- **Triggers:**
  - `"ms_stormchanged"` → published when `_sandstormactive` changes state, with payload `{stormtype = STORM_TYPES.SANDSTORM, setting = boolean}`