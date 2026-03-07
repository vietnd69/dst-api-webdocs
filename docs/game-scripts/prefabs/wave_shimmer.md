---
id: wave_shimmer
title: Wave Shimmer
description: Creates visual shimmer wave effects in ocean water using pre-defined animation assets.
tags: [fx, water, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 15e89376
system_scope: fx
---

# Wave Shimmer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wave_shimmer` and its variants (`wave_shimmer_med`, `wave_shimmer_deep`, `wave_shimmer_flood`) are non-persistent, client-side FX prefabs used to render animated shimmer effects on ocean surfaces. They are created as temporary entities with animation states and transform components, and are automatically removed after animation completion or when the entity goes to sleep. These prefabs are exclusively used for visual rendering and do not participate in physics, input, or gameplay logic.

## Usage example
This component is a prefab factory, not a reusable component. It is invoked indirectly via the `Prefab` system during world generation or scripted events, for example:
```lua
-- Example usage in worldgen or event code (not direct component usage)
local shimmer = SpawnPrefab("wave_shimmer")
shimmer.Transform:SetPosition(x, y, z)
```
Direct instantiation of components is not applicable, as this file defines prefabs, not components.

## Dependencies & tags
**Components used:** `animstate`, `transform`, `clientsleepable` (client-only)
**Tags:** Adds `CLASSIFIED`, `FX`, `NOCLICK`, `NOBLOCK`, `ignorewalkableplatforms`

## Properties
No public properties

## Main functions
### `commonfn(Sim)`
*   **Description:** Factory function that constructs the base entity structure common to all shimmer variants. Sets up transform, animation state, ocean shader parameters, layering, and tags. Marks the entity as non-persistent and registers cleanup logic.
*   **Parameters:** `Sim` (Simulation) - the game simulation instance (unused in this implementation).
*   **Returns:** `inst` (Entity) — fully initialized entity ready for variant-specific customization.

### `shallowfn(Sim)`
*   **Description:** Variant constructor for shallow water shimmer effects.
*   **Parameters:** `Sim` (Simulation) — unused.
*   **Returns:** `inst` (Entity) — configured with `"wave_shimmer"` build, `"shimmer"` bank, and `"idle"` animation.

### `medfn(Sim)`
*   **Description:** Variant constructor for medium-depth shimmer effects.
*   **Parameters:** `Sim` (Simulation) — unused.
*   **Returns:** `inst` (Entity) — configured with `"wave_shimmer_med"` build, `"shimmer"` bank, and `"idle"` animation.

### `deepfn(Sim)`
*   **Description:** Variant constructor for deep-water shimmer effects.
*   **Parameters:** `Sim` (Simulation) — unused.
*   **Returns:** `inst` (Entity) — configured with `"wave_shimmer_deep"` build, `"shimmer_deep"` bank, and `"idle"` animation.

### `floodfn(Sim)`
*   **Description:** Variant constructor for flood-level shimmer effects.
*   **Parameters:** `Sim` (Simulation) — unused.
*   **Returns:** `inst` (Entity) — configured with `"wave_shimmer_flood"` build, `"wave_shimmer_flood"` bank, and `"idle"` animation.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove`, which destroys the entity upon animation completion.