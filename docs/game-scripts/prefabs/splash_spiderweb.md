---
id: splash_spiderweb
title: Splash Spiderweb
description: Creates a non-networked, one-frame visual effect (particle/animation) for spiderweb splash impacts, used exclusively on the client.
tags: [fx, animation, client-only]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 335319bd
system_scope: fx
---

# Splash Spiderweb

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`splash_spiderweb` is a lightweight, client-side FX prefab that spawns a short-lived animation at a specific location in the world. It is not persisted, does not run on dedicated servers, and is designed solely for visual feedback — specifically, to render a splash animation when a spiderweb effect occurs (e.g., during impact or interaction). The entity uses a proxy transform to position itself relative to the source of the effect and automatically destroys itself after the animation completes or after a fixed delay.

## Usage example
This prefab is instantiated internally by the game engine and is not typically added directly by modders. A typical usage pattern (e.g., from a mod or script) would be:
```lua
-- Spawn the splash effect at a given world position
local fx = SpawnPrefab("splash_spiderweb")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network` (via `entity:AddNetwork()`)  
**Tags:** Adds `FX` tag to spawned entities; no other tags used.

## Properties
No public properties.

## Main functions
### `PlaySplashAnim(proxy)`
*   **Description:** Creates and configures a non-persistent FX entity to play the splash animation. This function runs only on the client and spawns a temporary entity that plays the `idle` animation with a final offset of `3`, then removes itself on animation completion.
*   **Parameters:** `proxy` (table) — an entity reference whose GUID is used to synchronize the transform position via `SetFromProxy`.
*   **Returns:** Nothing.
*   **Error states:** Returns early silently if entity creation fails; relies on engine safety for invalid proxy GUIDs.

### `fn()`
*   **Description:** Main prefab constructor. Initializes the core FX entity, sets up networking (but skips FX spawn on dedicated servers), assigns the `FX` tag, and ensures the entity is non-persistent. On the master simulation, it schedules self-destruction after 1 second; otherwise (client), it defers `PlaySplashAnim` by one frame.
*   **Parameters:** None (called internally by `Prefab` system).
*   **Returns:** `inst` — the created entity (client-side FX container).
*   **Error states:** Returns `nil` implicitly only in case of engine failure during entity creation; otherwise always returns a valid entity.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` on animation completion to clean up the FX entity.
- **Pushes:** None.