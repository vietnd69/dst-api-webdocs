---
id: floatinglanternfire
title: Floatinglanternfire
description: Creates a networked fire FX entity for the floating lantern with animated lighting and camera-aware alpha rendering.
tags: [fx, lighting, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a0cfc1da
system_scope: fx
---

# Floatinglanternfire

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`floatinglanternfire` is a utility function that constructs a prefab for a floating lantern's fire effect. It instantiates an entity with animation, sound, and light components, and attaches the `firefx` and `updatelooper` components to manage dynamic lighting levels and per-frame camera fade alignment. The entity is optimized for high-altitude placement by offsetting its light source downward to prevent culling.

## Usage example
```lua
local fire = Prefab("my_floating_fire", "floatinglanternfire")
-- Alternatively, use directly via:
-- local fire = AddPrefabPostInit("floatinglanternfire", function(inst) ... end)
```
This prefab is not instantiated directly in typical mod code; instead, it is referenced as a dependency by other prefabs (e.g., floating lanterns) via the `prefabs` list.

## Dependencies & tags
**Components used:** `firefx`, `updatelooper`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `"FX"` to the instantiated entity.  
**Prefabs used:** `"firefx_light"` (required by `firefx` component).

## Properties
No public properties — this is a `Prefab` factory function returning a function, not an entity component instance.

## Main functions
### `MakeFire(name, fxlevels, fxlight_offset)`
*   **Description:** Factory function that returns a `Prefab` constructor for a fire effect entity. Configures animation, sound, light, and network behavior, and conditionally adds `updatelooper` and `firefx` components.
*   **Parameters:**
    * `name` (string) — The prefab name (e.g., `"floatinglanternfire"`).
    * `fxlevels` (table) — Fire level definitions matching the format expected by `firefx.levels`.
    * `fxlight_offset` (Vector3) — Offset applied to the light source position to prevent culling (e.g., `Vector3(0, -6, 0)`).
*   **Returns:** A `Prefab` constructor function compatible with DST's prefab registration system.
*   **Error states:** None.

### `OnPostUpdate(inst)`
*   **Description:** Per-frame callback used on non-dedicated clients to sync the fire's tint alpha with the parent entity's `camerafade` component, ensuring the fire respects world camera fade transitions (e.g., underwater or cave depth fading).
*   **Parameters:** None (passed as `inst` by `updatelooper`).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `camerafade` component is missing or `inst.entity:GetParent()` is `nil`.

## Events & listeners
*   **Listens to:** None.
*   **Pushes:** None.
