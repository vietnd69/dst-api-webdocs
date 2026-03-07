---
id: gestalt_alterguardian_projectile
title: Gestalt Alterguardian Projectile
description: Creates a fast-flying, combat-capable projectile entity used by Gestalt-related bosses to chase and attack nearby targets.
tags: [combat, ai, boss, projectile]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b8f6e186
system_scope: entity
---

# Gestalt Alterguardian Projectile

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gestalt_alterguardian_projectile` is aPrefab generator function that produces fast-moving, flying entities used by Gestalt’s alterguardian variants in DST. These projectiles are spawned as short-lived combat units that fly toward a target position, hunt enemies within range, and deal damage via direct combat or non-combat interactions (e.g., sanity drain, grogginess, or sleepiness). They rely heavily on the `combat`, `sanityaura`, and `follower` components, and support multiple subclasses (gestalt, small guard, hat guard, large guard, and planting visual) with varying stats, scales, and targeting logic.

## Usage example
```lua
local inst = SpawnPrefab("smallguard_alterguardian_projectile")
inst.Transform:SetPosition(x, y, z)
inst.SetTargetPosition(inst, target_pos) -- Optional: sets the destination/track point
inst:SetProjectileDistance(10, my_callback) -- For custom projectiles only
```

## Dependencies & tags
**Components used:** `combat`, `sanityaura`, `follower`, `transparentonsanity`, `health`, `grogginess`, `sleeper`, `sanity`  
**Tags added:** `brightmare`, `NOBLOCK`, `NOCLICK`, `lunar_aligned`, and subclass-specific tags such as `brightmare_gestalt`, `brightmare_guard`, `crazy`, `extinguisher`, `_health`, `_combat`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `attack_speed` | number | `TUNING.ALTERGUARDIAN_PROJECTILE_SPEED` | Forward motor speed (X-axis override), modified per subclass scale. |
| `attack_speed_mod` | number | `1` | Dynamic multiplier applied during flight (set via `SetProjectileDistance`). |
| `_no_combat_gestalt` | boolean | `false` | If true, disables periodic attack tasks during flight. |
| `find_attack_victim` | function | `default_find_attack_victim` | Function used to locate the nearest valid target within range. |
| `blobhead` | Entity | `nil` (client-only) | Reference to the spawned head FX entity used for transparency effects. |
| `persists` | boolean | `false` | Indicates the projectile does not save to world. |
| `scrapbook_hide` | table | `{"angry"}` | Animation layers hidden in scrapbook. |

## Main functions
### `SetTargetPosition(inst, target_pos)`
*   **Description:** Sets the internal `_target_pos` reference used during flight control and final positioning. Used to guide the projectile to a destination before attack state.
*   **Parameters:** `inst` (Entity), `target_pos` (Vector3 or location object with `:Get()`) — destination position.
*   **Returns:** Nothing.

### `attack_behaviour(inst, target)`
*   **Description:** Executes combat or alternative effects (sanity/grogginess/sleepiness) on the target, depending on its components and state (e.g., not knocked out or asleep).
*   **Parameters:** `inst` (Entity), `target` (Entity) — the entity being attacked.
*   **Returns:** `true` if any attack effect was applied, `false` if attack was blocked or invalid.
*   **Error states:** May return `false` if `CanBeAttacked` fails or no compatible component is present.

### `try_attack(inst)`
*   **Description:** Queries for a valid attack victim using `find_attack_victim` and invokes `attack_behaviour` if one is found. Cancels the scheduled stop motion task to immediately end flight.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** No-op if no victim found or `combat` is missing and no applicable target components exist.

### `SetProjectileDistance(inst, dist, callback)`
*   **Description:** Adjusts `attack_speed_mod` and registers a callback for the exact landing position and final animation transition. Used for visual planting effects (e.g., in `gestalt_evolved_planting_visual_projectile`).
*   **Parameters:**  
    - `dist` (number) — desired travel distance before stopping.  
    - `callback` (function) — called after motion ends and position locked.  
*   **Returns:** Nothing.
*   **Error states:** Only applies to subclasses that support custom distance (i.e., `plantingvisualfn`).

## Events & listeners
- **Listens to:** `animover` — triggers `on_anim_over` to handle emergence completion, animation transitions, and cleanup.
- **Pushes:** None directly. However, `attacked` is pushed on the *target* entity when non-combat damage is applied.
- **Callbacks:**  
    - `OnEntitySleep` — schedules removal if entity sleeps.  
    - `OnEntityWake` — cancels scheduled removal on wake.
