---
id: lantern_insect_fx
title: Lantern Insect Fx
description: Creates and manages visual petal FX particles emitted from a held lantern or resting on the ground in DST.
tags: [fx, visual, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 038208ce
system_scope: fx
---

# Lantern Insect Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lantern_insect_fx` is a pair of prefabs (`lantern_insect_fx_held` and `lantern_insect_fx_ground`) that spawn dynamic particle effects (petal-like visuals) for lanterns in Don't Starve Together. These prefabs are used purely for visual feedback on the client — they are non-persistent and not simulated on dedicated servers. The held variant emits falling petals over time, while the ground variant plays an idle loop when placed on surfaces.

## Usage example
```lua
-- Spawn held lantern insect FX (e.g., attached to a lantern entity)
local held_fx = SpawnPrefab("lantern_insect_fx_held")
if held_fx ~= nil then
    held_fx.Transform:SetParent(lantern_entity.entity)
    held_fx.Transform:SetPosition(0, 0, 0)
end

-- Spawn ground lantern insect FX (e.g., when lantern is placed on floor)
local ground_fx = SpawnPrefab("lantern_insect_fx_ground")
if ground_fx ~= nil then
    ground_fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `FX` to spawned entities.

## Properties
No public properties are exposed or defined outside the internal state variables of each prefab instance.

## Main functions
This file defines two primary prefab constructors (`heldfn` and `groundfn`) — these are not component methods but factory functions used by the Prefab system.

### `heldfn()`
* **Description:** Factory function that creates and configures the held lantern FX entity. Spawns petal particles periodically in 3D space around the parent entity and detects parent movement for animation visibility.
* **Parameters:** None.
* **Returns:** Entity instance (`inst`) with `FX` tag, configured for client-side use only (non-persistent).
* **Error states:** Returns early without spawning FX on dedicated servers (`TheNet:IsDedicated()`).

### `groundfn()`
* **Description:** Factory function that creates and configures the ground lantern FX entity. Plays a looping animation sequence when placed on surfaces.
* **Parameters:** None.
* **Returns:** Entity instance (`inst`) with `FX` tag, configured for client-side use only (non-persistent).
* **Error states:** Returns early with minimal setup when `TheWorld.ismastersim` is false. Also returns `nil` on dedicated servers only if `TheNet:IsDedicated()` is implicitly handled (though not explicitly — no early return on dedicated check here, but FX is still non-persistent).

### `KillFX(inst)`
* **Description:** Handles FX removal, either immediately (if just created) or with a kill animation (if already active).
* **Parameters:** `inst` (Entity) — the FX entity to remove.
* **Returns:** Nothing.
* **Error states:** N/A.

### `OnPetalAnimOver(inst)`
* **Description:** Callback invoked after a petal's animation finishes; handles visibility toggling based on parent movement and re-attaches to the emitter's position.
* **Parameters:** `inst` (Entity) — the petal FX entity.
* **Returns:** Nothing.
* **Error states:** Removes the petal entity if its emitter becomes invalid.

### `OnGroundAnimOver(inst)`
* **Description:** Callback invoked after the ground FX animation completes; transitions between pre/loop/post animation states depending on kill state.
* **Parameters:** `inst` (Entity) — the ground FX entity.
* **Returns:** Nothing.
* **Error states:** N/A.

### `CreatePetal(petalemitter, variation, step)`
* **Description:** Spawns a single petal entity, configures its animation and rendering, and attaches it to a parent emitter.
* **Parameters:**
  * `petalemitter` (Entity) — parent entity from which the petal originates.
  * `variation` (number) — animation variation ID (`1`–`7`).
  * `step` (number) — index used by `IsMovingStep` to determine visibility state.
* **Returns:** New petal entity (`inst`) with `FX` tag.
* **Error states:** N/A.

### `IsMovingStep(step)`
* **Description:** Helper to determine if the current petal creation step corresponds to movement-aware visibility.
* **Parameters:** `step` (number) — petal creation step index.
* **Returns:** Boolean — `true` if `step` is `1` or `2`; `false` if `0` or `3`.
* **Error states:** N/A.

### `CheckMoving(inst)`
* **Description:** Detects whether the parent entity of a petal is moving; stores the result in `inst.ismoving`.
* **Parameters:** `inst` (Entity) — the petal entity.
* **Returns:** Nothing.
* **Error states:** Sets `ismoving` to `false` if no parent is found.

## Events & listeners
- **Listens to:** `animover` — used to trigger `OnPetalAnimOver` (for petal FX) and `OnGroundAnimOver` (for ground FX).
- **Pushes:** None identified.