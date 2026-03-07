---
id: rook
title: Rook
description: A large chess-piece-themed monster prefab that uses the ECS to manage combat, movement, AI behavior, and environmental interactions including platform hopping and ground destruction upon collision.
tags: [combat, ai, boss, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b05d1be0
system_scope: entity
---

# Rook

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rook` is a boss-level hostile entity implemented as a prefab using the Entity Component System (ECS). It is designed for the Chess set in DST and features aggressive movement (including platform hopping), collision-based ground destruction, sleeping/waking behavior, and two variants: standard and nightmare mode. The prefab uses `clockwork_common` utilities for shared logic (e.g., retargeting, sleep/wake tests), integrates with the `combat`, `health`, `locomotor`, `sleeper`, and `lootdropper` components, and supports both client- and server-side behaviors (e.g., ground FX).

## Usage example
```lua
-- Standard Rook prefab
local rook = Prefab("rook", ...) -- instantiation handled by engine via return values in source file

-- nightmare variant
local nightmare_rook = Prefab("rook_nightmare", ...)

-- The `SpawnGroundFx()` method is exposed publicly on the instance:
-- rook_instance.SpawnGroundFx()
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `health`, `inspectable`, `knownlocations`, `lootdropper`, `locomotor`, `embarker`, `drownable`, `sleeper`, `acidinfusible` (nightmare only).  
**Tags added:** `monster`, `hostile`, `chess`, `rook`, `largecreature` (normal only), `cavedweller` (nightmare only), `shadow_aligned` (nightmare only).  
**Tags checked:** None directly via `HasTag`, but `IsAsleep()` and state graph tags (`running`, `running_collides`) are used in logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `groundfx` | `net_event` | `nil` (assigned at runtime) | Network event used to trigger ground FX on clients. |
| `recentlycharged` | table | `{}` (empty table) | Tracks entities recently collided with to avoid repeated collisions within 3 seconds. |
| `override_combat_fx_size` | string | `"med"` | Controls size of combat hit FX. |
| `kind` | string | `""` | Unused (commented as *unused?*); likely legacy. |
| `soundpath` | string | `""` | Sound base path (set per variant). |
| `effortsound` | string | `""` | Effort sound path (set per variant). |

## Main functions
### `SpawnGroundFx(inst)`
*   **Description:** Triggers client-side ground FX for the rook. Pushes a networked event and spawns a one-time FX entity only on non-dedicated clients.
*   **Parameters:** `inst` (Entity instance) — the rook instance calling the function.
*   **Returns:** Nothing.
*   **Error states:** No FX is spawned on dedicated servers (`TheNet:IsDedicated()` returns true).

### `InitGroundFx_Client(inst)`
*   **Description:** Registers the listener for the `rook.groundfx` event on the client to trigger `OnGroundFx_Client`.
*   **Parameters:** `inst` (Entity instance) — the rook instance.
*   **Returns:** Nothing.

### `OnGroundFx_Client(inst)`
*   **Description:** Client-side FX spawner. Constructs and positions a `collapse_small`-style FX entity at the rook's location and plays a sound.
*   **Parameters:** `inst` (Entity instance) — the rook instance.
*   **Returns:** Nothing.

### `DoCollideShake(inst)`
*   **Description:** Triggers a camera shake effect for all clients when the rook collides at high speed.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `oncollide(inst, other)`
*   **Description:** Collision callback. Detects high-speed collisions with destructible workables, triggers shake, schedules `onothercollide`, and caches collision time to prevent spam.
*   **Parameters:**  
  `inst` (Entity) — the rook.  
  `other` (Entity) — the collided object.  
*   **Returns:** Nothing.
*   **Error states:** Early exits if state graph is not `running_collides`, target is invalid/player, or collision speed < `sqrt(42)`.

### `onothercollide(inst, other)`
*   **Description:** Handles actual destruction of destructible objects (`workable` with valid action ≠ `NET`) upon collision; otherwise clears the collision cache.
*   **Parameters:**  
  `inst` (Entity) — the rook.  
  `other` (Entity) — the collided workable.  
*   **Returns:** Nothing.

### `Retarget(inst)`
*   **Description:** Helper used by `combat:SetRetargetFunction`. Delegates to `clockwork_common.Retarget` with `TUNING.ROOK_TARGET_DIST`.
*   **Parameters:** `inst` (Entity) — the rook instance.
*   **Returns:** Boolean — whether a new target should be selected.

### `KeepTarget(inst, target)`
*   **Description:** Helper used by `combat:SetKeepTargetFunction`. Allows target retention while `running` or per `clockwork_common.KeepTarget`.
*   **Parameters:**  
  `inst` (Entity) — the rook.  
  `target` (Entity) — the current target.  
*   **Returns:** Boolean — whether to retain the target.

### `MakeRook(...)`
*   **Description:** Core prefab factory function. Returns a `Prefab` closure that instantiates the entity and attaches all required components, sets state graph/brain, and runs variant-specific post-init logic.
*   **Parameters:**  
  `name` (string) — prefab name (e.g., `"rook"`, `"rook_nightmare"`).  
  `common_postinit` (function?) — per-variant initialization (e.g., build setup, tags).  
  `master_postinit` (function?) — server-only initialization (e.g., loot tables, regen).  
  `_assets`, `_prefabs` — arrays for asset and sub-prefab dependencies.  
*   **Returns:** `Prefab` — the resulting prefab factory.

### `MakeRook` nested factory `fn()`
*   **Description:** Inner instantiation function called by the `Prefab` system. Sets up transform, physics, components, tags, state graph, brain, and listeners.
*   **Parameters:** None (called internally by `Prefab`).
*   **Returns:** `Entity` — fully constructed and initialized rook instance.

### `normal_common_postinit(inst)`, `normal_master_postinit(inst)`
*   **Description:** Standard rook post-initialization logic. Sets build, tag `largecreature`, loot table, and health regen.
*   **Parameters:** `inst` (Entity) — the rook instance.
*   **Returns:** Nothing.

### `nightmare_common_postinit(inst)`, `nightmare_master_postinit(inst)`
*   **Description:** Nightmare rook post-initialization. Adds cavedweller/shadow tags, sets acid infusibility, updates sound paths, and sets nightmare loot table.
*   **Parameters:** `inst` (Entity) — the rook instance.
*   **Returns:** Nothing.

### `onruinsrespawn(inst, respawner)`
*   **Description:** Callback for `RuinsRespawner`. Forces the rook into the `"ruinsrespawn"` state if the respawner is awake.
*   **Parameters:**  
  `inst` (Entity) — the rook instance.  
  `respawner` (Entity) — the ruins respawner triggering the callback.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `clockwork_common.OnAttacked` for status effects.  
  `newcombattarget` — triggers `clockwork_common.OnNewCombatTarget` for AI updates.  
  `rook.groundfx` (client only) — triggers `OnGroundFx_Client` for visual FX.  
  `animover` — on FX entity, triggers `inst.Remove`.  
- **Pushes:**  
  `rook.groundfx` (client-side net event) — triggers FX rendering.  
  (Events are pushed by other components or via `PushEvent` in `clockwork_common`, not directly in rook code.)