---
id: lavaarena_firebomb
title: Lavaarena Firebomb
description: Provides a throwable weapon for the Lava Arena event that projects an AOE targeting reticule and fires projectiles on use.
tags: [combat, event, weapon, aoe]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b034a9c7
system_scope: combat
---

# Lavaarena Firebomb

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavaarena_firebomb` prefab defines a throwable weapon used during the Lava Arena event. It is a character-held item that integrates with the `aoetargeting` component to provide a radial area-of-effect targeting reticule for placement. Upon activation, it spawns a projectile entity which triggers an explosion on impact. The prefab includes several associated FX prefabs (projectile, explosion, procedure FX, and sparks) used during its lifecycle.

This prefab does not define a standalone component class. Instead, it is a prefab definition that configures default entity properties and attaches components via `inst:AddComponent("aoetargeting")`. As such, it is intended for use as an inventory item in the Lava Arena challenge mode.

## Usage example
```lua
local firebomb = SpawnPrefab("lavaarena_firebomb")
firebomb.Transform:SetPosition(x, y, z)
firebomb:Remove() -- remove when done, e.g. when discarding or using
```

## Dependencies & tags
**Components used:** `aoetargeting` (attached and configured in constructor)  
**Tags added:** `throw_line`, `weapon`, `rechargeable`  
**Tags removed:** None  
**Tags checked:** None  

## Properties
No public properties are defined in the constructor for direct external modification. Reticule behavior is configured via the `aoetargeting` component's `reticule` subtable (e.g., `reticuleprefab`, `targetfn`), but these are initialized internally and not exposed as instance properties on the firebomb prefab itself.

## Main functions
No custom main functions are defined on the firebomb prefab entity. Reticule placement is handled by the `aoetargeting` component's `SetTarget` and `OnUse` workflows (see `aoetargeting.lua`). The `reticule.targetfn` is set to the `ReticuleTargetFn` helper (see below) which computes the valid ground target location.

### `ReticuleTargetFn()`
*   **Description:** Helper function used as the `targetfn` for the AOE reticule. Casts a ray from the player forward to find the nearest valid ground position within casting range (max 5 units), ensuring it is passable and not blocked by terrain or structures.
*   **Parameters:** None.
*   **Returns:** `Vector3` — the target ground position, or a zero vector if no valid point is found.

## Events & listeners
- **Listens to:** None (the prefab does not register event listeners directly).
- **Pushes:** None (no events are explicitly pushed by the prefab itself; event handling occurs in post-init functions `event_server_data(...).firebomb_postinit` and component-level logic).

> **Note:** Entity-specific behavior (e.g., projectile spawn, explosion logic) is deferred to `event_server_data(...).firebomb_postinit`, `projectile_postinit`, `explosion_postinit`, `procfx_postinit` functions defined in the `event_server_data` namespace. These are not included in the source file provided.