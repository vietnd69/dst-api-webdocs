---
id: shadeeffects
title: Shadeeffects
description: Manages dynamic leaf canopy shading effects using the ShadeRenderer system, including texture, position, rotation, and strength based on ambient light.
tags: [fx, environment, rendering]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 33a9c7c0
system_scope: fx
---

# Shadeeffects

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`shadeeffects.lua` is a client-side module responsible for configuring and updating dynamic leaf canopy shading effects in the game world. It uses the `ShadeRenderer` system to define a `LeafCanopy` shade type with texture, scaling, rotation, and translation parameters drawn from `TUNING`. It also exposes global functions to spawn/despawn canopy shades, update their strength based on ambient light, and enable/disable the renderer.

This module is not part of the ECS; it is a procedural FX utility for atmospheric rendering and runs only on non-dedicated clients.

## Usage example
```lua
-- Spawn a leaf canopy at world position (x=10, z=-5)
local canopy_id = SpawnLeafCanopy(10, -5)

-- Update all shade effects each frame (called from game loop)
ShadeEffectUpdate(dt)

-- Disable shading effects (e.g., for debugging or cutscenes)
EnableShadeRenderer(false)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties.

## Main functions
### `SpawnLeafCanopy(x, z)`
*   **Description:** Spawns a new leaf canopy shade at the specified world coordinates with a random initial rotation and configured scale.
*   **Parameters:**  
    `x` (number) - world X position.  
    `z` (number) - world Z position.  
*   **Returns:** (number) - unique shade ID assigned by the renderer.

### `DespawnLeafCanopy(id)`
*   **Description:** Removes a previously spawned leaf canopy shade using its ID.
*   **Parameters:**  
    `id` (number) - the shade ID returned by `SpawnLeafCanopy`.  
*   **Returns:** Nothing.

### `ShadeEffectUpdate(dt)`
*   **Description:** Updates all active leaf canopy shades each frame. Dynamically adjusts shade strength based on average ambient light intensity (computed from RGB values), interpolating between min/max strength values from `TUNING`.
*   **Parameters:**  
    `dt` (number) - delta time in seconds since the last frame.  
*   **Returns:** Nothing.

### `EnableShadeRenderer(enable)`
*   **Description:** Enables or disables the entire shade rendering system. Outputs a debug log when called.
*   **Parameters:**  
    `enable` (boolean) - whether to enable (`true`) or disable (`false`) the renderer.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
