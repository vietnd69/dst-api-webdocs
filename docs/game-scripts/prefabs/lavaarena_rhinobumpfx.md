---
id: lavaarena_rhinobumpfx
title: Lavaarena Rhinobumpfx
description: Spawns a non-networked particle effect entity when a rhino-like entity collides, used only on the client for visual feedback.
tags: [fx, visual, client, collision]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b98928f9
system_scope: fx
---

# Lavaarena Rhinobumpfx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_rhinobumpfx` is a lightweight prefab that creates a transient visual effect (`FX` tag) to represent a collision or impact event in the Lava Arena. It is instantiated only on non-dedicated clients and destroyed automatically after animation completes or after a short delay on the master simulation. The entity is non-persistent, non-networked, and solely for rendering purposes.

## Usage example
This prefab is not typically instantiated directly by modders. It is spawned internally via `TheNet:SpawnEntity()` or similar network-aware logic (e.g., when a rhino or similar creature bump occurs in the Lava Arena). Example usage in a mod context would be:

```lua
local fx = Prefab("rhinobumpfx")()
fx.Transform:SetPosition(x, y, z)
```

However, in practice, it is expected to be spawned by high-level game logic and receive position via a proxy GUID, not manually positioned.

## Dependencies & tags
**Components used:** None (uses only `entity`, `transform`, `animstate`, and `network`).
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
### `PlayImpactAnim(proxy)`
*   **Description:** Inner helper function that creates and configures the FX entity. It uses the `proxy` entity's transform as a positional source and plays a short animation (`rhino_impact/anim`) with a fixed offset. Automatically removes the entity when the animation finishes.
*   **Parameters:** `proxy` (entity proxy) — A proxy reference used to synchronize the FX entity’s transform to the source entity’s location.
*   **Returns:** Nothing (void). The entity is self-contained and auto-removed.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** `animover` — Fires when the animation completes, triggering `inst.Remove()` to clean up the entity.
- **Pushes:** None.