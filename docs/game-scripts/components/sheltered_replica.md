---
id: sheltered_replica
title: Sheltered Replica
description: Manages the dynamic shadeoverride state for an entity's animation based on its sheltered status, with smooth interpolation between exposed and sheltered values.
tags: [animation, rendering, world, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b46dadbb
system_scope: environment
---

# Sheltered Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sheltered` is a client-side component responsible for smoothly animating the `AnimState.OverrideShade()` value of an entity based on whether it is currently sheltered. It uses a networked boolean (`_issheltered`) to determine the target shade, and interpolates smoothly using precomputed speeds over fixed time constants. The component updates its shade value each frame until it reaches the target, then stops updating to conserve resources.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sheltered_replica")

-- Mark the entity as sheltered (e.g., under a roof or inside a cave entrance)
inst.components.sheltered_replica:StartSheltered()

-- Later, expose the entity to full light
inst.components.sheltered_replica:StopSheltered()

-- Check if the entity is currently sheltered and fully transitioned
if inst.components.sheltered_replica:IsSheltered() then
    -- Perform sheltered-specific logic
end
```

## Dependencies & tags
**Components used:** `AnimState` (accessed via `inst.AnimState`), `net_bool` via `net_bool(...)` helper  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_updating` | boolean | `false` | Whether the component is currently being updated each frame. |
| `_shade` | number | `1` (EXPOSED_SHADE) | Current interpolated shade value applied to `AnimState`. |
| `_targetshade` | number | `1` (EXPOSED_SHADE) | Target shade (either `SHELTERED_SHADE` or `EXPOSED_SHADE`). |
| `_shelterspeed` | number | `2` | Rate at which shade decreases when moving to sheltered state. |
| `_exposespeed` | number | `4` | Rate at which shade increases when moving to exposed state. |
| `_issheltered` | net_bool | N/A | Networked boolean tracking shelter status (client-server synced). |

## Main functions
### `StartSheltered(level)`
*   **Description:** Marks the entity as sheltered and triggers a transition toward the sheltered shade value. The `level` parameter is unused in current implementation.
*   **Parameters:** `level` (any) — retained for API compatibility but ignored.
*   **Returns:** Nothing.

### `StopSheltered()`
*   **Description:** Marks the entity as no longer sheltered and triggers a transition toward the exposed shade value.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsSheltered()`
*   **Description:** Returns whether the entity is considered fully transitioned to the sheltered state (i.e., currently marked sheltered *and* shade value at or below `SHELTERED_SHADE`).
*   **Parameters:** None.
*   **Returns:** `true` if sheltered, `false` otherwise.

### `CheckShade()`
*   **Description:** Recalculates the target shade based on `_issheltered` status and starts or stops per-frame updates if needed. This is the core logic gate for initiating or halting interpolation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Interpolates `_shade` toward `_targetshade` each frame using fixed-speed stepping, applying the current value via `AnimState:OverrideShade()`. Stops updating when the target is reached.
*   **Parameters:** `dt` (number) — Delta time in seconds since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `issheltereddirty` — Triggered by the `net_bool` when the sheltered state changes on the client. Fires `CheckShade()` to recompute the target shade.

- **Pushes:** None identified.
