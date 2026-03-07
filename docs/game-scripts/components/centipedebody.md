---
id: centipedebody
title: Centipedebody
description: Manages the physical structure and movement coordination of a multi-segment centipede-like entity, including segment spawning, constraint linking, rotation synchronization, and brain control handover.
tags: [ai, locomotion, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8c8fd8bb
system_scope: entity
---

# Centipedebody

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CentipedeBody` is a component that orchestrates the lifecycle and physical behavior of a segmented, physics-constrained entity (e.g., a centipede or worm-like boss). It handles segment spawning (`head` and `torso` prefabs), physics pinning between adjacent segments using point-to-point constraints, rotation interpolation, and brain control delegation between multiple heads. It integrates with the locomotion system via `LocoMotor` to synchronize movement direction and orientation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("centipedebody")
inst.components.centipedebody.headprefab = "my_centipede_head"
inst.components.centipedebody.torsoprefab = "my_centipede_torso"
inst.components.centipedebody.num_torso = 3
inst.components.centipedebody.max_torso = 8
inst.components.centipedebody:CreateFullBody()
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** Checks and manages tag `centipede_head` on head segments; internally uses `self.halted`, `self.head_in_control`, `self.bodies`, `self.heads`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bodies` | table | `{}` | List of all physics bodies (segments) in order from head to tail. |
| `heads` | table | `{}` | List of segment instances with `headprefab`. |
| `headprefab` | string | `"shadowthrall_centipede_head"` | Prefab name used for head segments. |
| `torsoprefab` | string | `"shadowthrall_centipede_body"` | Prefab name used for torso segments. |
| `num_torso` | number | `5` | Initial number of torso segments to spawn on `CreateFullBody()`. |
| `backwards_locomoting` | boolean | `false` | Flag indicating backward movement (set during head handoff). |
| `turnspeed` | number | `TUNING.SHADOWTHRALL_CENTIPEDE.TURNSPEED` | Angular interpolation rate for segment rotation. |
| `max_torso` | number | `TUNING.SHADOWTHRALL_CENTIPEDE.MAX_SEGMENTS` | Maximum allowed torso segments (used by `GrowNewSegment`). |
| `halted` | boolean | `false` | Whether the entire centipede is currently halted. |
| `head_in_control` | entity instance | `nil` | Current head segment that dictates movement direction and segment rotations. |

## Main functions
### `Halt()`
*   **Description:** Stops all heads' brains using `"centipedebody_halt"` reason and sets `halted = true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CheckUnhalt()`
*   **Description:** Checks if all body segments are awake; if so, resets `halted = false` and restarts all heads' brains.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsHalted()`
*   **Description:** Returns the current halted state.
*   **Parameters:** None.
*   **Returns:** `true` if all brains are halted, otherwise `false`.

### `GiveControlToHead(head)`
*   **Description:** Transfers control to the specified head. Stops all locomotion on segments, updates segment rotations relative to the new head, sets `backwards_locomotion` for non-controlling heads, and updates `head_in_control`.
*   **Parameters:** `head` (entity instance) – must be one of `self.heads`.
*   **Returns:** Nothing.

### `SpawnHead()`
*   **Description:** Convenience wrapper for `SpawnSegment` using `headprefab`.
*   **Parameters:** None.
*   **Returns:** (entity instance) The newly spawned head segment.

### `SpawnTorso()`
*   **Description:** Convenience wrapper for `SpawnSegment` using `torsoprefab`.
*   **Parameters:** None.
*   **Returns:** (entity instance) The newly spawned torso segment.

### `SpawnSegment(prefab, pos, index)`
*   **Description:** Spawns a new segment, inserts it into `self.bodies`, sets up constraints, and registers event callbacks.
*   **Parameters:** 
    *   `prefab` (string) – prefab name to spawn.
    *   `pos` (Vector3 or `nil`) – optional spawn position; computed relative to last segment if `nil`.
    *   `index` (number or `nil`) – insertion index; if `nil`, appends to end.
*   **Returns:** (entity instance) The newly spawned segment.

### `GrowNewSegment(index)`
*   **Description:** Inserts a new torso segment at the given `index` (or random internal position) if segment cap not exceeded; notifies with `"grow_segment"` event.
*   **Parameters:** `index` (number or `nil`) – insertion point; defaults to a random internal segment if `nil`.
*   **Returns:** (entity instance or `nil`) The new segment if spawned, or `nil` if `max_torso` limit reached.

### `OnUpdate(dt, force_pivot_update)`
*   **Description:** Continuously updates segment rotations and physics pivots based on the controlling head's orientation and movement direction. Called automatically via `StartUpdatingComponent`.
*   **Parameters:** 
    *   `dt` (number) – Delta time.
    *   `force_pivot_update` (boolean) – If `true`, updates pivots even if head is not moving.
*   **Returns:** Nothing.

### `SetSegment(body, index)`
*   **Description:** Internal helper to register a body in `self.bodies`, attach physics constraints, and assign behavior tags (`flipped`, `has_brain_control`) for heads.
*   **Parameters:** 
    *   `body` (entity instance) – The segment to register.
    *   `index` (number or `nil`) – Optional insertion position in `self.bodies`.
*   **Returns:** Nothing.

### `ForEachSegment(fn, ...)`
*   **Description:** Iterates over all segments in `self.bodies` and invokes `fn(body, ...)` for each.
*   **Parameters:** 
    *   `fn` (function) – Callback to execute for each segment.
    *   `...` – Extra arguments passed to `fn`.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Cleans up and removes all owned segments during entity destruction.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes GUIDs of all segments for saving.
*   **Parameters:** None.
*   **Returns:** `{ bodies = { guid1, guid2, ... } }` if bodies exist; `nil` otherwise.

### `LoadPostPass(newents, savedata)`
*   **Description:** Reconnects segments by GUID during load; reassigns head control via `GiveControlToRandomHead()`.
*   **Parameters:** 
    *   `newents` (table) – Map of `guid → { entity = entity }`.
    *   `savedata` (table) – Data returned by `OnSave()`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `"death"` – Triggers `OnDeath`, which stops component updates.
  - `"entitysleep"` – On segment sleep, calls `Halt()`.
  - `"entitywake"` – On segment wake, calls `CheckUnhalt()`.
  - `"onremove"` – On segment removal, deletes the controller entity.
- **Pushes:** 
  - `"locomote"` – Via `LocoMotor:Stop()` during head handoff or halt/reset (indirect via `Stop()`).
