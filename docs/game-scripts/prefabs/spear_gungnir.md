---
id: spear_gungnir
title: Spear Gungnir
description: A specialized ranged weapon prefabs with reticule-based targeting, designed for the Lava Arena event, featuring lunge-based attacks and visual effects integration.
tags: [combat, weapon, lavaarena, fx, targeting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7d716c3
system_scope: combat
---

# Spear Gungnir

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines two prefabs: `spear_gungnir`, a combat weapon used in the Lava Arena, and `spear_gungnir_lungefx`, a temporary visual effect entity. The `spear_gungnir` prefab integrates with the `aoetargeting` and `reticule` components to provide real-time cursor-based targeting for lunge attacks, with custom animation, position, and rotation interpolation logic. It is optimized by pre-adding key tags (`weapon`, `aoeweapon_lunge`, `rechargeable`, `sharp`, `pointy`) to avoid runtime component additions. The weapon is strictly server-validated (`TheWorld.ismastersim`) and uses a dedicated post-initialization hook for Lava Arena logic.

## Usage example
```lua
-- Create the spear Gungnir weapon
local weapon = Prefab("spear_gungnir", fn, assets, prefabs)

-- Typical instantiation occurs via server-side logic in Lava Arena contexts
-- Manual client-side instantiation (not recommended without proper context):
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
inst:AddComponent("aoetargeting")
-- ... configure reticule and tags manually per fn() implementation
```

## Dependencies & tags
**Components used:** `aoetargeting`, `reticule`, `Transform`, `AnimState`, `Network`, `Inventory`, `Physics`, `Combat` (via tags), `aoeweapon_lunge`, `rechargeable`
**Tags:** Adds `sharp`, `pointy`, `weapon`, `aoeweapon_lunge`, `rechargeable` on the weapon instance.

## Properties
No public properties are defined or exposed on the entity itself in this file.

## Main functions
### `ReticuleTargetFn()`
*   **Description:** Calculates the absolute target position for the reticule by projecting 6.5 units forward along the player's local forward vector. Used for fixed-range targeting when mouse input is inactive.
*   **Parameters:** None.
*   **Returns:** `Vector3` - World-space position 6.5 units ahead of the local player.

### `ReticuleMouseTargetFn(inst, mousepos)`
*   **Description:** Projects the mouse position onto a circle of radius 6.5 around the weapon owner, clamping the target to the maximum lunge distance. Used for mouse-driven reticule positioning.
*   **Parameters:** 
    *   `inst` (Entity) - The weapon entity instance.
    *   `mousepos` (Vector3 or nil) - Current mouse position in world space.
*   **Returns:** `Vector3` - Clamped target position, or falls back to `reticule.targetpos` if mouse position is invalid or coincides with the owner's position.

### `ReticuleUpdatePositionFn(inst, pos, reticule, ease, smoothing, dt)`
*   **Description:** Updates the reticule entity's position and rotation to match the weapon and target direction. Supports smooth rotational interpolation when `ease` is enabled and `dt` is provided.
*   **Parameters:** 
    *   `inst` (Entity) - The weapon entity instance.
    *   `pos` (Vector3) - Target position in world space.
    *   `reticule` (Entity) - The reticule entity to update.
    *   `ease` (boolean) - Whether to interpolate rotation.
    *   `smoothing` (number) - Interpolation speed factor.
    *   `dt` (number) - Delta time for interpolation.
*   **Returns:** Nothing (modifies `reticule.Transform` in-place).

### `FastForwardFX(inst, pct)`
*   **Description:** (Used by `spear_gungnir_lungefx`) Jumps the effect animation to a specific percentage of its duration and schedules removal after the remaining time plus a small buffer.
*   **Parameters:** 
    *   `inst` (Entity) - The FX entity.
    *   `pct` (number) - Animation progress (0 to 1).
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing scheduled removal task before re-scheduling.

### `fn()`
*   **Description:** Constructor for the `spear_gungnir` weapon prefab. Initializes entity, transforms, animation, physics, tags, and `aoetargeting` component with custom reticule behavior.
*   **Parameters:** None.
*   **Returns:** `Entity` - Fully initialized weapon instance (pristine on server only).
*   **Error states:** Returns the entity early on non-master simulation without triggering the Lava Arena post-init hook.

### `fxfn()`
*   **Description:** Constructor for the `spear_gungnir_lungefx` visual effect prefab. Creates a non-persistent, temporary FX entity with smoke animation and yellow tint.
*   **Parameters:** None.
*   **Returns:** `Entity` - Fully initialized FX instance.
*   **Error states:** Sets `persists = false` and schedules automatic removal after animation duration.

## Events & listeners
No event listeners or events are explicitly defined or triggered in this file.