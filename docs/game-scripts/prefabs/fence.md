---
id: fence
title: Fence
description: Provides base prefab construction logic for walls, fences, and gates, including alignment, rotation, locking, and component setup.
tags: [placement, structure, wall, door, deployment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3293348c
system_scope: world
---

# Fence

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines shared logic and factory functions (`MakeWall`, `MakeWallAnim`, `MakeInvItem`, `MakeWallPlacer`) for constructing walls, fences, and gates in DST. It handles orientation alignment with neighbors, swing direction calculation for doors, pathfinding obstacle management, door open/close state synchronization, saving/loading, and integration with components like `workable`, `health`, `combat`, `lootdropper`, `activatable`, and `klaussacklock`. Entities created via these functions are high-fidelity static structures placed in the world.

## Usage example
```lua
-- Example: Create a standard wooden fence using MakeWall
local fence_prefab = MakeWall("fence", {wide="fence", narrow="fence_thin"}, false)
-- This returns a Prefab definition ready for use in the game.
-- To create an instance and deploy it:
local fence_instance = SpawnPrefab("fence")
fence_instance.Transform:SetPosition(10, 0, 10)
fence_instance.Transform:SetRotation(0) -- faces north
fence_instance.Transform:SetEightFaced()
-- Orientation alignment is automatically handled on placement via FixUpFenceOrientation
```

## Dependencies & tags
**Components used:** `activatable`, `burnable`, `combat`, `deployable`, `fuel`, `health`, `inspectable`, `klaussacklock`, `lootdropper`, `placer`, `stackable`, `workable`.  
**Tags added to wall entities:** `wall`, `fence`, `alignwall`, `noauradamage`, `electricdamageimmune`, `rotatableobject`. Gate entities additionally receive `door`, `FX` (anim entity), `can_offset_sort_pos`, `placer`, `CLASSIFIED`, `NOCLICK`, `gatebuilder`, `junk_fence` (for `fence_junk`), and `junkmob`/`junk` in specific cases.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isdoor` | boolean | `false` | Indicates if the entity is a gate/door and should be treated as such (e.g., swing direction, open/close). |
| `offsetdoor` | boolean | `false` | Whether the door should be offset for narrow placement relative to adjacent walls. |
| `anims` | table | `nil` | Table containing animation set keys (`wide`, `narrow`, `build`). |
| `loaded_rotation_enum` | number | `0` | Temporarily stores rotation enum during load; cleared after post-pass. |
| `basebuild` | string | `nil` | Base build name used for variant selection. |
| `variant_num` | number | `nil` | Random build variant index. |
| `_isswingright` | net_bool | `nil` | Networked boolean for swing direction (right/left). |
| `_isopen` | net_bool | `nil` | Networked boolean for open/closed state (doors only). |
| `_isunlocked` | net_bool | `nil` | Networked boolean for lock state (Quagmire gates only). |
| `_ispathfinding` | net_bool | `nil` | Networked boolean indicating if this entity is a pathfinding obstacle. |
| `_pfpos` | Vector3 | `nil` | Cached position for pathfinding obstacle registration. |
| `isswingright` | boolean | `false` | Local fallback for swing direction. |
| `dooranim` | Entity | `nil` | Separate non-persistent entity used for anim/physics separation (doors only). |

## Main functions
### `FixUpFenceOrientation(inst, deployedrotation)`
*   **Description:** Aligns the entity’s rotation with adjacent walls/fences and recalculates swing direction for doors. Ensures correct facing and swing behavior based on neighbors. Called during placement and load post-pass.
*   **Parameters:** `inst` (Entity) — the fence/gate entity. `deployedrotation` (number?) — optional rotation override (used when deploying from an item).
*   **Returns:** Nothing.
*   **Error states:** None; operates robustly regardless of neighbor presence.

### `ToggleDoor(inst)`
*   **Description:** Opens or closes the door and its paired counterpart. Respects lock state. Activates `activatable` state.
*   **Parameters:** `inst` (Entity) — the door/gate entity.
*   **Returns:** `false, "LOCKED_GATE"` if locked; `nil` otherwise.
*   **Error states:** Returns `false` early if the door is locked and a key is required.

### `SetOrientation(inst, rotation, rotation_enum)`
*   **Description:** Sets the entity’s world rotation and configures animation bank (`wide` vs `narrow`) and offset. Used during placement and load.
*   **Parameters:** `inst` (Entity) — the entity. `rotation` (number) — rotation in degrees. `rotation_enum` (number?) — precomputed rotation enum for optimization.
*   **Returns:** Nothing.

### `FindPairedDoor(inst)`
*   **Description:** Locates the paired door/gate in the same structure. Used for synchronized opening/closing of double doors.
*   **Parameters:** `inst` (Entity) — the door entity.
*   **Returns:** The paired door entity if found; otherwise `nil`.

### `SetIsOpen(inst, isopen)`
*   **Description:** Sets the networked open/closed state and updates obstacle physics and sorting offset.
*   **Parameters:** `inst` (Entity) — the door entity. `isopen` (boolean) — desired open state.
*   **Returns:** Nothing.

### `MakeWall(name, anims, isdoor, klaussackkeyid, data)`
*   **Description:** Factory function that returns a `Prefab` definition for a wall, fence, or gate entity. Configures physics, components, network sync, and callbacks. Handles all state management, orientation, and lifecycle hooks (`OnSave`, `OnLoad`, `OnLoadPostPass`).
*   **Parameters:** `name` (string) — prefab name. `anims` (table) — animation definitions (`wide`, `narrow`, `build`). `isdoor` (boolean) — if `true`, sets up door/gate behavior. `klaussackkeyid` (string?) — optional lock identifier (Quagmire). `data` (table?) — optional override configuration (tags, loot, callbacks, builds).
*   **Returns:** `Prefab` — a prefab definition.

### `MakeWallAnim(name, anims, isdoor)`
*   **Description:** Factory function for non-persistent anim-only entities used by doors for rendering. Delegates to `MakeWallAnim`.
*   **Parameters:** `name` (string) — prefab name. `anims` (table) — animation definitions. `isdoor` (boolean) — configures special flags (e.g., `can_offset_sort_pos`).
*   **Returns:** `Prefab`.

### `MakeInvItem(name, placement, animdata, isdoor)`
*   **Description:** Factory function for inventory items used to place fences/gates. Configures `deployable`, `stackable`, `fuel`, and `burnable` behavior.
*   **Parameters:** `name` (string) — item prefab name. `placement` (string) — target wall prefab name. `animdata` (string) — animation bank name. `isdoor` (boolean) — determines tag (`fencebuilder` vs `gatebuilder`).
*   **Returns:** `Prefab`.

## Events & listeners
- **Listens to:** `death` — triggers `onhammered` to drop loot and remove entity. `onispathfindingdirty` — manages pathfinding obstacle registration/unregistration. `doorstatedirty` — updates sorting offset for doors (client-side).
- **Pushes:** `entity_droploot` — fired after loot drop. `doorstatedirty` — client-side event to sync door open/closed state. `onispathfindingdirty` — fired when pathfinding status changes.