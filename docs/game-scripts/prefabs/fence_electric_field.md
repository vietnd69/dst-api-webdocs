---
id: fence_electric_field
title: Fence Electric Field
description: Manages the visual, physical, and collision detection system for electric fence beams in DST, handling entity collision effects and network-synced beam parameters.
tags: [electricity, collision, fx, network, component]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b56eaf6
system_scope: world
---

# Fence Electric Field

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fence_electric_field` is a client-server prefabricated entity component that implements the visual beam, physics mesh, and shock logic for electric fences. It dynamically generates a triangle collision mesh based on beam length and rotation, spawns visual segment entities (`seg`) with attached particle effects (`fx`), and handles collision callbacks to deliver electrocution effects. It is non-persistent (`persists = false`) and does not sleep on its own but responds to world sleep/wake events for resource efficiency.

The component integrates with the physics system via `Physics:SetCollisionCallback`, uses a networked byte property (`inst.len`, `inst.rot`) for synchronization, and relies on `SHOCK_COOLDOWNS` and `TUNING` values to determine shock behavior.

## Usage example
```lua
-- This component is typically instantiated automatically by the electric_fence prefab.
-- Manual usage is rare and only for specialized visual or testing purposes.

local inst = Prefab("fence_electric_field", nil, assets)
inst:AddComponent("locomotor") -- Required if interacting with LocoMotor:Stop
inst:SetBeam(10, 45) -- Sets beam length 10 units at 45 degrees rotation
```

## Dependencies & tags
**Components used:** `physics`, `soundemitter`, `transform`, `animstate`, `follower` (via internal `CreateSegFx`/`CreateSegAt`), `network`  
**Tags added:** `FX`, `NOCLICK`, `CLASSIFIED`, `notarget`, `no_collision_callback_for_other`  
**Tags checked:** `character`, `epic` (for shock cooldown variation)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `len` | `net_byte` | `0` | Networked beam length (0–255 scaled to `MAX_LEN` = 15). |
| `rot` | `net_byte` | `0` | Networked beam rotation (0–255 scaled to 360 degrees). |
| `segs` | table (array) | `nil` | Array of visual segment entities (created lazily on wake, cleared on sleep). |
| `targets` | table | `{}` | Map of entity → timestamp for tracking last shock time (prevents spam). |
| `update_physics_task` | `Task` | `nil` | Periodic task to refresh physics when awake. |

## Main functions
### `SetBeam(inst, len, rot)`
*   **Description:** Updates the beam's length and rotation, forcing regeneration of visual segments and physics mesh.
*   **Parameters:**  
    `len` (number) – Beam length in world units, clamped to `MAX_LEN`.  
    `rot` (number) – Beam rotation in degrees (0–360), normalized to positive range.  
*   **Returns:** Nothing.
*   **Error states:** If `inst` is asleep, physics update is deferred until wake.

### `RefreshSegs(inst)`
*   **Description:** Reconstructs the visual beam segments and updates the physics triangle mesh and collision callback. Called on wake and beam changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBeamDirty(inst)`
*   **Description:** Cleanup handler called when `beamdirty` event fires (e.g., network update); clears segments and triggers `RefreshSegs`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClearSegs(inst)`
*   **Description:** Destroys all visual segment entities, stops linked looping sound, and re-enables physics collision (for cleanup on sleep or removal).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCollisionCallback(inst, other)`
*   **Description:** Physics collision callback that schedules a frame-delayed `DoCollideShock` to deliver shock effects.
*   **Parameters:**  
    `inst` (entity) – The electric field instance.  
    `other` (entity) – The colliding entity.  
*   **Returns:** Nothing.

### `DoCollideShock(other, inst)`
*   **Description:** Applies electrocution and manages panic trigger logic for non-permanent memory of the shock source.
*   **Parameters:**  
    `other` (entity) – The entity being shocked.  
    `inst` (entity) – The electric field instance.  
*   **Returns:** Nothing.
*   **Error states:** Skips if `other` is invalid, in limbo, or on cooldown per `GetShockCooldown`.

### `GetShockCooldown(inst)`
*   **Description:** Computes shock cooldown for `inst` based on tags (`character`, `epic`) and `_electrocute_resist`.
*   **Parameters:** None.
*   **Returns:** number – Cooldown duration in seconds.

## Events & listeners
- **Listens to:**  
  `beamdirty` (client) – Triggers `OnBeamDirty` to rebuild visuals and physics.  
  `onremove` (client and server) – Used via `ListenForEvent` to clear `panic_electric_field` reference when electric field is destroyed.  
- **Pushes:**  
  `shocked_by_new_field` – Fired on `other` when shocked and `BrainCommon.HasElectricFencePanicTriggerNode(other)` is true.  
  `locomote` – Pushed by `LocoMotor:Stop` if applied (indirectly).  

> Note: This component itself does not push `locomote`; it calls `other.components.locomotor:Stop()` only in commented-out logic. The event reference is based on the `locomotor` module documentation provided.