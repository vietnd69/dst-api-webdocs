---
id: lavaarena_portal
title: Lavaarena Portal
description: Defines the prefabs for the Lava Arena portal structure, including its static mesh, keyhole, and activation effect.
tags: [environment, fx, prefabs]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 51060cb5
system_scope: environment
---

# Lavaarena Portal

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines three prefabs used in the Lava Arena event: the main portal structure (`lavaarena_portal`), its unopened keyhole variant (`lavaarena_keyhole`), and a visual effect for when the portal is active (`lavaarena_portal_activefx`). These prefabs are static renderable entities with appropriate animation states and layering, created only on the client (except for non-mastersim entities, which return early to avoid server-side overhead). The main portal includes an optional drop-shadow entity and delegates master-side initialization via `event_server_data`.

## Usage example
```lua
-- Example: Spawning the portal prefab
local portal = SpawnPrefab("lavaarena_portal")
portal.Transform:SetPosition(x, y, z)

-- Example: Spawning the keyhole (pre-activation state)
local keyhole = SpawnPrefab("lavaarena_keyhole")
keyhole.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None (uses only core engine services: `Transform`, `AnimState`, `SoundEmitter`, `Network`).
**Tags:** 
- `lavaarena_portal`: Adds `DECOR`, `NOCLICK` to the shadow entity.
- `lavaarena_keyhole`: Adds `inspectable` component (via `inst:AddComponent("inspectable")`).
- `lavaarena_portal_activefx`, `lavaarena_portal`: Neither adds tags beyond engine defaults.

## Properties
No public properties.

## Main functions
### `CreateDropShadow(parent)`
* **Description:** Creates a non-networked, non-persistent shadow entity attached to the parent portal. Renders a predefined shadow symbol beneath the portal on the background layer.
* **Parameters:** `parent` (Entity) — The entity instance to which the shadow is attached.
* **Returns:** Entity — The newly created shadow entity.
* **Error states:** None identified.

### `fn()`
* **Description:** Constructor for the main `lavaarena_portal` prefab. Sets up visual state, orientation, and layering. Skips full initialization on dedicated servers and non-mastersim clients. On mastersim, calls `master_postinit` via `event_server_data`.
* **Parameters:** None (used internally by `Prefab` constructor).
* **Returns:** Entity — The initialized portal instance.

### `keyhole_fn()`
* **Description:** Constructor for the `lavaarena_keyhole` prefab. Sets up the keyhole visual, hides the "key" symbol, applies slight scale, and marks as non-persistent.
* **Parameters:** None (used internally by `Prefab` constructor).
* **Returns:** Entity — The initialized keyhole instance.

### `activefx_fn()`
* **Description:** Constructor for the `lavaarena_portal_activefx` prefab. Plays a pre-animation (`portal_pre`) on instantiation, then pushes the `portal_loop` animation on mastersim. Used as a transient visual effect during portal activation.
* **Parameters:** None (used internally by `Prefab` constructor).
* **Returns:** Entity — The initialized effect entity.

## Events & listeners
None.