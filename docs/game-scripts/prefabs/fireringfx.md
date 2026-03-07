---
id: fireringfx
title: Fireringfx
description: Creates a visual ring-shaped particle effect for the dragonfly boss, played locally on non-dedicated clients.
tags: [fx, boss, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 206ee7d3
system_scope: fx
---

# Fireringfx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fireringfx` is a local-only visual effect prefab used to render a ring-shaped animation, typically associated with the Dragonfly boss’s attacks or abilities. It is not replicated to dedicated servers, and all logic runs only on clients where visual feedback is needed. The effect uses a dedicated animation bank (`dragonfly_ring_fx`) and automatically destroys itself after 3 seconds or upon animation completion.

## Usage example
```lua
-- This prefab is created internally by the game; external instantiation is not typical.
-- Example usage in mod code (if needed):
local fx = SpawnPrefab("firering_fx")
if fx ~= nil and fx.Transform ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`. No entity tags are removed or queried.

## Properties
No public properties.

## Main functions
### `PlayRingAnim(proxy)`
*   **Description:** Internal helper function that spawns and configures the local visual entity. It copies the transform position/orientation from the source entity (`proxy`) and plays the ring animation.
*   **Parameters:** `proxy` (Entity) — the source entity whose transform properties are copied.
*   **Returns:** Nothing (entity is created and returned via `CreateEntity()` inside the function).
*   **Error states:** None. The effect is immediately removed on `animover` event.

### `fn()`
*   **Description:** Prefab constructor function. Creates and initializes the effect entity. It ensures non-dedicated clients spawn the effect, while dedicated servers skip visual creation.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the created effect entity (or `nil` on dedicated servers if no FX is spawned).
*   **Error states:** Returns an incomplete entity on non-mastersim instances (client-side); only sets `persists = false` and schedules removal on mastersim.

## Events & listeners
- **Listens to:** `animover` — triggers immediate removal of the FX entity via `inst.Remove`.
- **Pushes:** None.