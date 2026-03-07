---
id: alterguardian_summon_fx
title: Alterguardian Summon Fx
description: Creates a visual and lighting effect sequence for the Alterguardian summoning animation, including pre-loop-post phases and a synchronized back effect.
tags: [fx, boss, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 221a5fb7
system_scope: fx
---

# Alterguardian Summon Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`alterguardian_summon_fx` is a client-side prefab responsible for rendering the summoning visual sequence for the Alterguardian boss. It manages a multi-phase animation (`summon_pre` → `summon_loop` → `summon_pst`) and dynamically adjusts light intensity, radius, and falloff using frame-specific modulation tables. On non-dedicated clients, it also spawns and synchronizes a separate "back effect" entity (`alterguardian_summon_backfx`) that plays in parallel. The component is non-persistent and self-deleting after the full animation completes.

## Usage example
This prefab is created internally by the game engine via `Prefab("alterguardian_summon_fx", fn, assets)` and is not typically added manually by modders. A typical usage pattern would be:
```lua
-- Not intended for direct instantiation by modders.
-- The game spawns this prefab as needed during Alterguardian summoning.
-- Example (internal use only):
local fx = SpawnPrefab("alterguardian_summon_fx")
fx.Transform:SetPosition(pos)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `light`, `network`
**Tags:** Adds `FX`; self-removes on animation completion.

## Properties
No public properties.

## Main functions
### `CLIENT_MakeBackFX()`
* **Description:** Creates and returns a standalone "back" FX entity (`alterguardian_summon_backfx`) used for layered visuals behind the main FX. It plays `summon_back_pre` followed by a looping `summon_back_loop`.
* **Parameters:** None.
* **Returns:** `inst` (Entity) — the created back FX entity, or `nil` if creation fails.

### `set_lightvalues(inst, val)`
* **Description:** Updates the entity’s light properties (intensity, radius, falloff) and animation light override based on a scalar `val`.
* **Parameters:**  
  - `val` (number) — a modulation factor in `(0, 1]` used to scale light parameters.
* **Returns:** Nothing.

### `periodic_light_update(inst)`
* **Description:** Called periodically (every `FRAMES`) to update light values based on the current animation frame. It selects the appropriate modulation table (pre-loop-post) and applies the corresponding `val`.
* **Parameters:**  
  - `inst` (Entity) — the FX instance.
* **Returns:** Nothing.

### `on_endloop(inst)`
* **Description:** Triggered by the `endloop` event when the loop animation finishes. Plays the post-animation (`summon_pst`), signals completion via `_end_loop` event, and registers cleanup on `animover`.
* **Parameters:**  
  - `inst` (Entity) — the FX instance.
* **Returns:** Nothing.

### `pre_over(inst)`
* **Description:** Marks the pre-animation phase as finished by setting `_pre_finished = true`, which influences light modulation table selection.
* **Parameters:** None.
* **Returns:** Nothing.

### `CLIENT_end_backfx(inst)`
* **Description:** Ends the back FX sequence by playing `summon_back_pst` and scheduling removal after animation ends.
* **Parameters:**  
  - `inst` (Entity) — the main FX instance (used to access `_back_fx`).
* **Returns:** Nothing.

### `CLIENT_start_back_fx(inst)`
* **Description:** Spawns the back FX entity at the same position as `inst`, and registers a listener to end the back FX when the main FX loops.
* **Parameters:**  
  - `inst` (Entity) — the main FX instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `endloop` — triggers `on_endloop` when the `summon_loop` animation completes.  
  - `animover` — triggers `Remove` to clean up the entity after animation finishes (set in `on_endloop`).  
  - `alterguardian_summon_fx._end_loop` — triggers `CLIENT_end_backfx` on the main entity (client-side only).
- **Pushes:**  
  - `alterguardian_summon_fx._end_loop` — networked event fired via `inst._end_loop:push()` at loop completion.
