---
id: explosivehit
title: Explosivehit
description: Spawns a local-only visual and audio effect for small explosions, used exclusively on the client.
tags: [fx, audio, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 94ab1669
system_scope: fx
---

# Explosivehit

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`explosivehit` is a lightweight prefab that spawns a short-lived, non-networked FX entity for localized explosion visuals and sound. It is designed to be instantiated on the client side (excluding dedicated servers) to provide visual feedback for minor explosions, such as firecracker detonations. It does not modify world state or interact with physics—its sole responsibility is rendering an animation and playing a sound at a given position.

## Usage example
```lua
-- This prefab is typically referenced indirectly via inst:PushEvent("explosion") or similar triggers,
-- but can be manually spawned as follows:
local fx = SpawnPrefab("explosivehit")
if fx ~= nil and fx.Transform ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`
**Tags:** Adds `FX` to spawned entities.

## Properties
No public properties.

## Main functions
### `PlayFXAnim(proxy)`
*   **Description:** Creates and configures a temporary FX entity that plays the "small_firecrackers" animation and sound at the position of the `proxy` entity.
*   **Parameters:** `proxy` (entity) — the entity whose transform position and rotation are copied.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `TheNet:IsDedicated()` is true — the function is not invoked on dedicated servers.

## Events & listeners
- **Listens to:** `animover` — removes the FX entity when the animation finishes (via `inst.Remove`).
- **Pushes:** None.