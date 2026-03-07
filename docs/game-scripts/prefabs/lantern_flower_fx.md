---
id: lantern_flower_fx
title: Lantern Flower Fx
description: Creates and manages visual particle effects for the lantern flower item when held or placed on the ground in Don't Starve Together.
tags: [fx, visual, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8221f2b0
system_scope: fx
---

# Lantern Flower Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lantern_flower_fx` is a pair of prefabs (`lantern_flower_fx_held` and `lantern_flower_fx_ground`) that generate animated petal effects associated with the lantern flower item. It is not a reusable component but a standalone prefab factory—each instance spawns temporary FX entities (petals) that decay naturally or are killed explicitly. It runs only on the client side (except for initialization) and never persists to disk.

## Usage example
This prefab is not added via `inst:AddComponent`. Instead, it is instantiated directly when the lantern flower is equipped or placed:
```lua
-- Example of instantiating the held variant (used internally by the game)
local held_fx = SpawnPrefab("lantern_flower_fx_held")

-- Example of instantiating the ground variant
local ground_fx = SpawnPrefab("lantern_flower_fx_ground")
```

## Dependencies & tags
**Components used:** `None identified.`  
**Tags:** Adds `FX` to all spawned entities.

## Properties
No public properties are exposed on the prefabs themselves. Instances may carry internal state such as `ismoving` and `killed`, but these are not part of the public API.

## Main functions
Theprefab functions themselves (`heldfn` and `groundfn`) are the core API. They are passed to the `Prefab` constructor and return fully configured entities.

### `heldfn()`
*   **Description:** Creates and configures the held lantern flower FX entity. It spawns animated petals periodically using `DoTaskInTime` and starts a periodic task to track parent movement.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — a non-persistent FX entity.
*   **Error states:** Does nothing on dedicated servers (only client-side logic is executed); returns early if `TheNet:IsDedicated()` is true.

### `groundfn()`
*   **Description:** Creates and configures the ground-placed lantern flower FX entity. It plays the `petal_pre` animation, switches to `petal_loop`, and exposes a `KillFX` method for external cleanup.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — a non-persistent FX entity.
*   **Error states:** If `POPULATING` is true (e.g., world generation), it sets a random initial frame for `petal_loop`.

### `CreatePetal(petalemitter, variation, step)`
*   **Description:** Helper function used by `heldfn` to spawn individual animated petals. Sets up animation state, listens for animation completion, and positions the petal relative to the emitter.
*   **Parameters:**
    *   `petalemitter` (entity) — parent emitter entity reference stored on the petal.
    *   `variation` (number) — animation variant index (1–7).
    *   `step` (number) — step index used for movement state determination.
*   **Returns:** `inst` (entity) — newly created petal FX entity.
*   **Error states:** Returns `nil`-equivalent if `CreateEntity()` fails (theoretical only).

### `KillFX(inst)`
*   **Description:** Called externally (via `inst.KillFX`) to remove the ground FX entity. If the entity has been alive for more than zero time, it sets `killed = true` to trigger fade-out; otherwise, it removes the entity immediately.
*   **Parameters:** `inst` (entity) — the FX entity to kill.
*   **Returns:** Nothing.

### `OnPetalAnimOver(inst)`
*   **Description:** Callback triggered when a petal animation completes. Handles visibility toggling based on parent movement state and updates position/orientation to match the emitter.
*   **Parameters:** `inst` (entity) — the petal entity whose animation just ended.
*   **Returns:** Nothing.
*   **Error states:** Removes the petal if `petalemitter` is no longer valid.

### `OnGroundAnimOver(inst)`
*   **Description:** Callback for the ground FX entity after animation completes. Manages transitions from `petal_pre` → `petal_loop` → `petal_pst`.
*   **Parameters:** `inst` (entity) — the ground FX entity.
*   **Returns:** Nothing.
*   **Error states:** Removes the entity only after `petal_pst` completes and `killed` is true.

### `CheckMoving(inst)`
*   **Description:** Periodic task used by held FX to determine if the parent entity is moving; sets `ismoving` boolean.
*   **Parameters:** `inst` (entity) — the FX entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — used to trigger cleanup or state transitions when animations complete.
- **Pushes:** `None identified.` (No events are fired by this prefab.)
