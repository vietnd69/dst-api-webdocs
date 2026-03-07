---
id: buzzardspawner
title: Buzzardspawner
description: Spawns buzzards in response to environmental conditions and events, managing their lifecycle, shadow proxies, and seasonal behaviors.
tags: [ai, spawner, environment, weather]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 727333ae
system_scope: environment
---

# Buzzardspawner

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`buzzardspawner` is a prefab that acts as an environmental spawner for buzzards, primarily used for procedural generation of predatory behavior in the game world. It manages a pool of buzzard entities via the `childspawner` component, dynamically adjusts spawning based on world state (night/winter/lunar hail), and maintains visual shadow proxies (`circlingbuzzard`) around itself when awake and conditions permit. It also handles special interactions with flares (miniflare/megaflare) and food hunting logic.

## Usage example
```lua
local spawner = SpawnPrefab("buzzardspawner")
spawner.Transform:SetPosition(x, y, z)
spawner.components.childspawner:StartSpawning()
spawner.components.childspawner:StartRegen()
```

## Dependencies & tags
**Components used:** `childspawner`, `circler`, `homeseeker`  
**Tags:** Adds `"buzzardspawner"` and `"CLASSIFIED"` to the instance. No tags are dynamically added/removed on child entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buzzardshadows` | table of entities | `{}` | List of `circlingbuzzard` entities representing visual shadows. |
| `foodtask` | task reference | `nil` | Periodic task for looking for food; `nil` when inactive. |
| `waketask` | task reference | `nil` | Delayed task triggered after wake to update shadows. |
| `forcefall` | boolean | `nil` | Temporarily set before spawning to force buzzards into `fall` state. |
| `_drop_buzzards_at_lunar_hail_level` | number | `nil` | Threshold level at which lunar hail triggers corpse spawn. |

## Main functions
### `SpawnBuzzardShadow(inst)`
* **Description:** Creates a `circlingbuzzard` entity, attaches it to the spawner as a shadow, and starts it circling the spawner using `circler`.
* **Parameters:** `inst` (entity) — the spawner instance.
* **Returns:** Nothing (the shadow entity is stored in `inst.buzzardshadows`).
* **Error states:** Does not return `nil`; assumes `circler` is properly attached to `circlingbuzzard`.

### `UpdateShadows(inst)`
* **Description:** Synchronizes the number of active shadows to match `childreninside` count from the child spawner.
* **Parameters:** `inst` (entity) — the spawner instance.
* **Returns:** Nothing.
* **Error states:** May remove or add shadow entities; assumes `inst.buzzardshadows` is a valid list.

### `OnSpawn(inst, child)`
* **Description:** Called when a child buzzard is successfully spawned. Positions and animates the child using remaining shadow data, then removes the used shadow.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `child` (entity) — the newly spawned buzzard.
* **Returns:** Nothing.
* **Error states:** Returns early if no shadow remains (e.g., if `childreninside` was updated concurrently).

### `LookForFood(inst)`
* **Description:** Searches for edible prey or meat items within range and spawns a buzzing buzzard to target it if conditions permit.
* **Parameters:** `inst` (entity) — the spawner instance.
* **Returns:** Nothing.
* **Error states:** Returns early if spawner cannot spawn or with 25% random chance per call.

### `ReturnChildren(inst)`
* **Description:** Instructs all active buzzard children to return home using `homeseeker:GoHome()`, sets `shouldGoAway = true`, and pushes `"gohome"` event.
* **Parameters:** `inst` (entity) — the spawner instance.
* **Returns:** Nothing.

### `SpawnerOnIsNight(inst, isnight)`
* **Description:** Handles spawning/regen state transitions when entering or exiting night. Stops spawning at night, starts regen if not full.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `isnight` (boolean) — new night state.
* **Returns:** Nothing.
* **Error states:** Calls `ReturnChildren()` on night transition.

### `SpawnerOnIsLunarHailing(inst, islunarhailing)`
* **Description:** Starts listening to `lunarhaillevel` when lunar hail begins, spawns `buzzardcorpse` when the hail level reaches the computed threshold, and stops spawning/regen during hail.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `islunarhailing` (boolean) — whether lunar hail is currently active.
* **Returns:** Nothing.

### `SpawnerOnIsWinter(inst, iswinter)`
* **Description:** Disables spawning and returns all children during winter; re-enables when winter ends.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `iswinter` (boolean) — whether winter is active.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onpickup"` on food entities — clears food hunting pair.  
  - `"onremove"` on food and buzzard entities — clears food hunting pair.  
  - `"miniflare_detonated"` (on `TheWorld`) — triggers spawns near flare.  
  - `"megaflare_detonated"` (on `TheWorld`) — triggers up to 5 spawns near flare.  
  - World state changes: `"iswinter"`, `"isnight"`, `"islunarhailing"`, `"lunarhaillevel"` via `WatchWorldState`.

- **Pushes:**  
  - `"gohome"` on child buzzards during `ReturnChildren()`.  
  - `"buzzardspawner:spawned"` (implicitly via `childspawner` callback chain, but not explicitly in this file).