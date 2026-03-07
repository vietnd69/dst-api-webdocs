---
id: lavaarena_creature_spawn_fx
title: Lavaarena Creature Spawn Fx
description: Creates visual and audio effects for lava arena creature spawning, including teleport smoke and spark particles, with instance-limited audio volume scaling and server/client separation.
tags: [fx, audio, lavaarena, network, prefabs]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ec9e0e4d
system_scope: fx
---

# Lavaarena Creature Spawn Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines prefabs for lava arena creature spawning visual and audio effects. It provides two factory functions: `makespawnfx` for teleport effects (including smoke spawns), and `makespawndecorfx` for decorative spark effects. These prefabs are instance-aware (using `instance_page` to track concurrent effects), support client-server separation (skipping FX on dedicated servers), and dynamically scale audio volume based on active instance count. The prefabs are non-persistent, short-lived entities tagged `FX` or `DECOR`, designed to be spawned locally in sync with creature teleports in the Lava Arena event.

## Usage example
```lua
-- Use one of the exported prefabs directly (e.g., small spawn effect)
local fx = SpawnPrefab("lavaarena_creature_teleport_small_fx")
-- Positioning is handled internally via proxy GUID during spawn
-- No further configuration needed; audio and smoke effects play automatically
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `SoundEmitter`, `Network`
**Tags:** Adds `FX`, `NOCLICK`, and conditionally `DECOR`. Uses `instance_page` as a runtime property.

## Properties
No public properties.

## Main functions
### `PlayAnim(proxy, fxanim, instance_page)`
* **Description:** Spawns a short-lived FX entity with animation, sound, and bloom. Handles position sync from the proxy entity and registers/unregisters the effect from instance counting for volume scaling. Automatically removed on animation finish.
* **Parameters:**  
  `proxy` (Entity) — entity whose transform is used as the source for position.  
  `fxanim` (string) — animation name to play (e.g., `"spawn_small"`).  
  `instance_page` (number) — index used to track concurrent FX instances for audio scaling.
* **Returns:** None. The created entity is returned via prefab instantiation logic.
* **Error states:** None.

### `SpawnSmokeFx(inst)`
* **Description:** Spawns one of three random smoke prefabs at the position of the given `inst`.
* **Parameters:**  
  `inst` (Entity) — entity whose position is used for spawning the smoke.
* **Returns:** None.
* **Error states:** None.

### `PlayDecor(proxy, anims, instance_page)`
* **Description:** Spawns a decorative spark FX entity, attaching to the proxy’s parent if available. Plays a sequence of animations with looping, and scales sound volume via instance count.
* **Parameters:**  
  `proxy` (Entity) — entity whose transform and parent are used for positioning.  
  `anims` (table of strings) — ordered animation sequence (first plays immediately; subsequent ones pushed for playback).  
  `instance_page` (number) — index used for instance tracking and volume scaling.
* **Returns:** None. The created entity is returned via prefab instantiation logic.
* **Error states:** None.

### `ScaleVolume(count, maxcount, minvolume)`
* **Description:** Computes a volume multiplier based on the number of active FX instances. Ensures volume doesn’t drop below `minvolume` and applies quadratic attenuation.
* **Parameters:**  
  `count` (number) — current active instance count for the page.  
  `maxcount` (number) — cap used for normalization (e.g., `10` or `18`).  
  `minvolume` (number) — lower bound for volume (e.g., `0.5`).
* **Returns:** number — volume scalar in `[minvolume, 1]`.
* **Error states:** Returns `minvolume` if `count >= maxcount`.

### `RegisterInstance(inst, instance_page)`
* **Description:** Registers an FX entity for instance counting and schedules its unregistration after 0.1s (or on removal). Sets up `inst.instance_page` and `inst.OnRemoveEntity`.
* **Parameters:**  
  `inst` (Entity) — the FX entity.  
  `instance_page` (number) — page index (1, 2, or 3) used for separation.
* **Returns:** None.
* **Error states:** None.

### `ClearInstance(inst)`
* **Description:** Decrements the instance count for `inst.instance_page` and clears the cleanup hook.
* **Parameters:** `inst` (Entity)
* **Returns:** None.
* **Error states:** None.

### `makespawnfx(instance_page, name, fxanim)`
* **Description:** Factory for teleport FX prefabs (e.g., `"lavaarena_creature_teleport_small_fx"`). Handles network separation (non-Dedicated only), registers instance, spawns smoke delayed, and removes the entity after 1 second.
* **Parameters:**  
  `instance_page` (number) — instance tracking page.  
  `name` (string) — prefab name.  
  `fxanim` (string) — animation to play on the FX entity.
* **Returns:** Prefab — usable via `SpawnPrefab`.
* **Error states:** Returns early with `nil` for non-master clients if `TheWorld.ismastersim` is `false`.

### `makespawndecorfx(instance_page, name, anims)`
* **Description:** Factory for decorative spark FX prefabs (e.g., `"lavaarena_spawnerdecor_fx_small"`). Similar logic to `makespawnfx`, but uses different assets and animation sequences. Does not spawn smoke.
* **Parameters:**  
  `instance_page` (number) — instance tracking page.  
  `name` (string) — prefab name.  
  `anims` (table of strings) — animation sequence.
* **Returns:** Prefab — usable via `SpawnPrefab`.

## Events & listeners
- **Listens to:**  
  - `"animover"` — triggers `inst.Remove` on FX entities created by `PlayAnim`.  
  - `"animqueueover"` — triggers `inst.Remove` on FX entities created by `PlayDecor`.  
- **Pushes:** None.