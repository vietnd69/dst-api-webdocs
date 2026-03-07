---
id: wurt_casting_fx
title: Wurt Casting Fx
description: Generates visual and audio effect prefabs for Wurt's planar casting abilities, supporting both ground and mounted variants.
tags: [fx, animation, wurt, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7313435
system_scope: fx
---

# Wurt Casting Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wurt_casting_fx.lua` defines prefabs for visual effects used during Wurt’s casting animations. It provides two helper functions — `MakeFx` and `CreateHorrorFuelCore` — to instantiate and configure lightweight FX entities with appropriate `AnimState`, `Transform`, and `SoundEmitter` components. These prefabs are non-persistent and automatically removed upon animation completion.

The component is not a traditional ECS component but a prefabs factory: it returns four distinct `Prefab` definitions for different casting variants (Pure Brilliance and Horror Fuel, for both grounded and mounted states).

## Usage example
```lua
-- Instantiate the Pure Brilliance casting effect (grounded)
local fx = Prefab("prefabs/purebrilliance_castfx", nil, assets)
local inst = fx()

-- The prefab is pre-configured with animation, tags, and callbacks
-- It automatically removes itself when the animation completes
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network` (added via `inst.entity:AddX()`)
**Tags:** Adds `FX` tag to all instantiated entities.

## Properties
No public properties.

## Main functions
### `MakeFx(data)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a casting FX entity. It configures basic visual/audio setup, sets up facing mode, plays the specified animation, and registers post-initialization callbacks.
*   **Parameters:**
    *   `data.name` (string) – Unique name for the resulting prefab.
    *   `data.anim` (string) – Animation name to play on the entity.
    *   `data.ismount` (boolean, optional) – If `true`, sets six-faced transform; otherwise, four-faced.
    *   `data.commonpostinit` (function, optional) – Callback called after common init (both server and client).
    *   `data.clientpostinit` (function, optional) – Callback called only on non-dedicated clients after anim setup.
*   **Returns:** A `Prefab` instance that, when invoked, returns an instantiated FX entity.
*   **Error states:** Does not fail; silent no-op on dedicated servers for `clientpostinit`.

### `CreateHorrorFuelCore(parent, data)`
*   **Description:** Creates a non-networked, childed FX entity used specifically for the Horror Fuel casting effect. Attached to the parent entity’s transform.
*   **Parameters:**
    *   `parent` (Entity) – The parent entity to which this FX will be attached.
    *   `data` (table) – Contains `ismount` (boolean) to determine animation suffix.
*   **Returns:** The newly created FX entity instance.
*   **Error states:** Does not validate `parent` — caller must ensure valid reference.

## Events & listeners
- **Listens to:** `animover` – Fires on animation completion, triggers `inst.Remove` to destroy the entity.
- **Pushes:** None.