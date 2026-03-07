---
id: spawnprotectionbuff
title: Spawnprotectionbuff
description: Applies and manages a temporary spawn protection buff that grants temporary invulnerability and collision exclusion to a target entity.
tags: [combat, protection, buff]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 16007d99
system_scope: combat
---

# Spawnprotectionbuff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spawnprotectionbuff` is a prefabricated entity component that implements a timed protective buff. When attached to a target entity, it enables temporary invulnerability by adding specific tags (`notarget`, `spawnprotection`) and disabling physical collisions with standard obstacle and character groups. It also disables AI targeting via the `notarget` tag and visualizes the effect with an associated FX prefab. The buff automatically expires under three conditions: when the target moves beyond a defined distance from the spawn point, when the target performs combat actions (e.g., attacks or is hit), or after a fixed duration of inactivity.

The component relies on the `debuff` system for lifecycle management (attachment/detachment hooks) and uses periodic and one-shot tasks to track movement and time-based expiration.

## Usage example
```lua
local inst = SpawnPrefab("spawnprotectionbuff")
inst.components.debuff:Attach(target)
-- Buff activates on attachment, and expires after inactivity, movement, or combat actions.
```

## Dependencies & tags
**Components used:** `debuff` (via `inst:AddComponent("debuff")`)
**Tags added:** `DECOR`, `NOCLICK`, `CLASSIFIED` (on the buff entity itself)  
**Tags managed on target:** `notarget`, `spawnprotection`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_pt` | vector3 | `nil` (set at attach) | Position vector of the target at attachment time, used to track departure distance. |
| `expire_task` | task | `nil` | Reference to the one-shot task that triggers buff expiration after idle duration. |
| `check_dist_task` | periodic task | `nil` | Reference to the periodic task that periodically checks distance from spawn point. |
| `fx` | entity | `nil` | Reference to the spawned FX entity (`battlesong_instant_panic_fx`). |
| `OnEnableProtectionFn` | function | `OnEnableProtectionFn` | Callback used to apply or remove protection effects (collision, tags, animation). |

## Main functions
### `OnEnableProtectionFn(target, enable)`
*   **Description:** Enables or disables spawn protection effects on the target entity. When `enable` is `true`, adds `notarget` and `spawnprotection` tags, disables physics collisions against standard groups, and sets `AnimState:SetHaunted(true)`. When `false`, reverses these changes.
*   **Parameters:**
    *   `target` (entity) — The entity receiving or losing protection.
    *   `enable` (boolean) — Whether to activate or deactivate protection.
*   **Returns:** Nothing.

### `buff_OnAttached(inst, target)`
*   **Description:** Executed automatically when the buff is attached to a target (via `debuff:Attach`). Sets up spatial tracking, spawns the FX, starts idle timer, and registers event listeners to end the buff on player actions (e.g., attacks, building, dying).
*   **Parameters:** `inst` (entity — the buff), `target` (entity — the protected entity).
*   **Returns:** Nothing.

### `buff_OnDetached(inst, target)`
*   **Description:** Executed automatically when the buff is detached. Deactivates protection, delays cleanup by 1 second (to allow visual fade), then removes the buff entity.
*   **Parameters:** `inst` (entity — the buff), `target` (entity — the protected entity).
*   **Returns:** Nothing.

### `stop_buff_fn(inst)`
*   **Description:** Utility function to stop the buff by calling `debuff:Stop()`.
*   **Parameters:** `inst` (entity — the buff).
*   **Returns:** Nothing.

### `start_exipiring(inst)`
*   **Description:** Starts a delayed task that triggers `stop_buff_fn` after `TUNING.SPAWNPROTECTIONBUFF_DURATION` seconds. Used to enforce a hard timeout.
*   **Parameters:** `inst` (entity — the buff).
*   **Returns:** Nothing.

### `check_dist_from_spawnpt(inst, target)`
*   **Description:** Periodically checks if the target has moved beyond `TUNING.SPAWNPROTECTIONBUFF_SPAWN_DIST_SQ` from the spawn point. If so, cancels distance check and starts expiration timer. If night, resets expiration timer (extension of idle time).
*   **Parameters:** `inst` (entity — the buff), `target` (entity — the protected entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to (on target):**
  - `death`
  - `doattack`
  - `onattackother`
  - `onmissother`
  - `onthrown`
  - `buildstructure`
  - `builditem`
  - `on_enter_might_gym`  
  All invoke `owner_stop_buff_fn`, which removes the buff from the target.
- **Pushes:** None (does not fire custom events).