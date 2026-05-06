---
id: gestalt_alterguardian_projectile
title: Gestalt Alterguardian Projectile
description: Defines five projectile prefabs used by the Alterguardian boss fight, featuring flight physics, sanity-based transparency, and targeted attack behavior.
tags: [prefab, boss, projectile, combat]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: db5999b3
system_scope: entity
---

# Gestalt Alterguardian Projectile

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`gestalt_alterguardian_projectile.lua` registers five distinct projectile prefabs used during the Brightmare Boss fight. All variants share a core construction function (`commonfn`) that sets up flight physics, animation, and client-side transparency effects based on observer sanity. Server-side logic handles targeting, combat damage, and movement tasks. The prefabs are designed to fly toward a target position, attack entities in range, and remove themselves after impact or animation completion.

## Usage example
```lua
-- Spawn the standard gestalt projectile at world origin:
local inst = SpawnPrefab("gestalt_alterguardian_projectile")
inst.Transform:SetPosition(0, 0, 0)

-- Set target position for flight (master only):
if TheWorld.ismastersim then
    inst.SetTargetPosition(inst, Vector3(10, 0, 10))
end

-- Spawn a guard variant with combat capabilities:
local guard = SpawnPrefab("largeguard_alterguardian_projectile")
```

## Dependencies & tags
**External dependencies:**
- `prefabutil` -- helper functions for prefab construction
- `TUNING` -- global balance constants for damage, speed, and sanity effects

**Components used:**
- `transparentonsanity` -- controls alpha transparency based on observer sanity (client)
- `sanityaura` -- emits sanity aura around the entity (master, optional)
- `combat` -- handles damage calculation and targeting (master, guard variants)
- `follower` -- links projectile to a leader entity (master, hat/visual variants)

**Tags:**
- `brightmare` -- added to all variants for boss fight identification
- `NOBLOCK`, `NOCLICK` -- prevents entity from blocking movement or mouse interaction
- `lunar_aligned` -- marks entity as part of lunar faction
- `brightmare_gestalt` -- specific to standard gestalt projectile
- `brightmare_guard`, `crazy`, `extinguisher` -- specific to guard variants

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gestalt_assets` | table (local) | `{Asset("ANIM", "anim/brightmare_gestalt.zip")}` | Animation assets for standard gestalt projectile. |
| `guard_assets` | table (local) | `{Asset("ANIM", "anim/brightmare_gestalt_evolved.zip")}` | Animation assets for all guard variants (small, large, hat, visual). |
| `gestalt_prefabs` | table (local) | `{"gestalt_head"}` | Dependent prefab names for standard gestalt projectile. |
| `guard_prefabs` | table (local) | `{"gestalt_guard_head"}` | Dependent prefab names for all guard variants. |
| `HATGUARD_COMBAT_MUSHAVE_TAGS` | table (local) | `{"_combat", "_health"}` | Required tags for target search in `hatguard_find_attack_victim()`. |
| `HATGUARD_COMBAT_CANTHAVE_TAGS` | table (local) | `{"INLIMBO", "structure", "wall", "companion"}` | Excluded tags for target search in `hatguard_find_attack_victim()`. |
| `SPIKE_LAYER` | table (local) | `{"angry"}` | Animation layer hidden in scrapbook/skin previews for guard variants. |
| `GESTALT_HEADDATA` | table (local) | `{name = "gestalt_head", followsymbol = "head_fx"}` | Head prefab data for standard gestalt projectile. |
| `GESTALT_TAGS` | table (local) | `{"brightmare_gestalt"}` | Tags added to standard gestalt projectile. |
| `GUARD_HEADDATA` | table (local) | `{name = "gestalt_guard_head", followsymbol = "head_fx_big"}` | Head prefab data for guard variants. |
| `GUARD_TAGS` | table (local) | `{"brightmare_guard", "crazy", "extinguisher"}` | Tags added to guard variant projectiles. |
| `FLY_START_TIME` | constant (local) | `15*FRAMES` | Frame offset when projectile begins movement in `on_anim_over()`. |
| `FLY_END_TIME` | constant (local) | `25*FRAMES` | Frame offset when projectile stops movement in `on_anim_over()`. |
| `TIME_TO_FLY` | constant (local) | `FLY_END_TIME - FLY_START_TIME - FRAMES` | Duration of flight phase used by `SetProjectileDistance()` for speed calculation. |
| `DEFAULT_FINDVICTIM_MUST` | table (local) | `{"_health"}` | Required tags for target search in `default_find_attack_victim()`. |
| `DEFAULT_FINDVICTIM_CANT` | table (local) | `{"brightmareboss", "brightmare", "DECOR", "epic", "FX", "ghost", "INLIMBO", "playerghost"}` | Excluded tags for target search in `default_find_attack_victim()`. |
| `DEFAULT_FINDVICTIM_RANGE` | number (local) | `math.sqrt(TUNING.GESTALT_ATTACK_HIT_RANGE_SQ)` | Search radius for `default_find_attack_victim()`. |
| `SMALLGUARD_SCALE` | constant (local) | `0.75` | Scale multiplier applied to small guard variant in `smallguard_common_postinit()`. |
| `SMALLGUARD_DAMAGE` | constant (local) | `0.75 * TUNING.GESTALTGUARD_DAMAGE` | Combat damage value for small guard variant. |
| `HATGUARD_SCALE` | constant (local) | `0.4` | Scale multiplier applied to hat guard variant in `hatguard_common_postinit()`. |

## Main functions
### `gestaltfn()`
*   **Description:** Constructor for the standard `gestalt_alterguardian_projectile`. Calls `commonfn` with gestalt-specific assets and tags. No combat component attached; relies on sanity/grogginess damage.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `smallguardfn()`
*   **Description:** Constructor for `smallguard_alterguardian_projectile`. Scales entity to 0.75x. Attaches `combat` component with reduced damage (`0.75 * TUNING.GESTALTGUARD_DAMAGE`).
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `hatguardfn()`
*   **Description:** Constructor for `alterguardianhat_projectile`. Scales entity to 0.4x. Attaches `combat` and `follower` components. Uses custom `hatguard_find_attack_victim` to prioritize leader's enemies. Disables sanity aura.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `plantingvisualfn()`
*   **Description:** Constructor for `gestalt_evolved_planting_visual_projectile`. Non-combat visual variant used for planting effects. Disables attack task (`_no_combat_gestalt = true`). Adds `SetProjectileDistance` method to adjust speed based on travel distance.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `largeguardfn()`
*   **Description:** Constructor for `largeguard_alterguardian_projectile`. Standard scale. Attaches `combat` component with full `TUNING.GESTALTGUARD_DAMAGE`.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `Client_CalcSanityForTransparency(inst, observer)` (local)
*   **Description:** Calculates transparency alpha based on observer's sanity percentage. Returns higher alpha (more opaque) when observer sanity is above `TUNING.GESTALT_MIN_SANITY_TO_SPAWN`. Used as `calc_percent_fn` for `transparentonsanity` component.
*   **Parameters:**
  - `inst` -- projectile entity
  - `observer` -- player entity observing the projectile
*   **Returns:** number alpha value between 0.3 and 0.75
*   **Error states:** None

### `SetHeadAlpha(inst, alpha)` (local)
*   **Description:** Overrides the blobhead child prefab's multicolour alpha channel. Called by `transparentonsanity` component when transparency changes. Only affects client-side rendering.
*   **Parameters:**
  - `inst` -- projectile entity
  - `alpha` -- float alpha value (0-1)
*   **Returns:** None
*   **Error states:** None — `inst.blobhead` and `inst.blobhead:IsValid()` are guarded before accessing `AnimState`.

### `smallguard_common_postinit(inst)` (local)
*   **Description:** Applies scale transformation to small guard variant and its blobhead child. Called from `commonfn` as `common_postinit` parameter for `smallguard_alterguardian_projectile`.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** None
*   **Error states:** None — `inst.blobhead` nil check present before scaling child.

### `hatguard_common_postinit(inst)` (local)
*   **Description:** Applies scale transformation to hat guard variant and its blobhead child. Called from `commonfn` as `common_postinit` parameter for `alterguardianhat_projectile` and `gestalt_evolved_planting_visual_projectile`.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** None
*   **Error states:** None — `inst.blobhead` nil check present before scaling child.

### `commonfn(buildbank, headdata, tags, common_postinit, master_postinit, no_aura)`
*   **Description:** Shared constructor logic for all variants. Creates entity, sets up physics (flyers collision group), adds base tags, configures animations, and initializes client-side transparency. On master, sets up sleep/wake handlers and sanity aura.
*   **Parameters:**
    - `buildbank` -- string anim bank/build name
    - `headdata` -- table containing `name` and `followsymbol` for child head prefab
    - `tags` -- array of additional tags to add
    - `common_postinit` -- function run on both client and master
    - `master_postinit` -- function run on master only
    - `no_aura` -- boolean if true, skips adding `sanityaura` component
*   **Returns:** entity instance
*   **Error states:** Errors if `headdata.name` is not a valid prefab (spawn fails).

### `attack_behaviour(inst, target)` (local)
*   **Description:** Executes attack logic against a target. If `inst` has `combat`, uses `DoAttack`. Otherwise applies sanity delta, grogginess, or sleepiness based on target components. Pushes `attacked` event if no damage is dealt.
*   **Parameters:**
    - `inst` -- projectile entity
    - `target` -- target entity instance
*   **Returns:** `true` if attack succeeded, `false` otherwise.
*   **Error states:** None

### `default_find_attack_victim(inst)` (local)
*   **Description:** Scans for valid targets within `TUNING.GESTALT_ATTACK_HIT_RANGE_SQ`. Filters out dead, invisible, or sleeping entities. Returns closest valid target.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** entity instance or `nil`
*   **Error states:** Errors if any entity in `potential_targets` lacks `health` component (`v.components.health:IsDead()` has no nil guard).

### `hatguard_find_attack_victim(inst)` (local)
*   **Description:** Custom target finder for hat variant. Prioritizes `inst._focustarget` if valid and near. Otherwise searches near leader for non-ally entities with `_combat` and `_health` tags.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** entity instance or `nil`
*   **Error states:** Errors if `inst.components.follower` or `inst.components.combat` is missing (expected to be present on hat variant).

### `try_attack(inst)` (local)
*   **Description:** Periodic task callback passed to DoPeriodicTask(2*FRAMES, try_attack) in start_motion(). Scans for valid targets via find_attack_victim() and calls attack_behaviour(). If attack succeeds, cancels stop_task and calls stop_motion() early.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** None
*   **Error states:** None — target nil is guarded. Note: attack_behaviour() called with target may error if target lacks sanity/grogginess/sleeper components (see attack_behaviour error states).

### `start_motion(inst)` (local)
*   **Description:** Task callback passed to DoTaskInTime(FLY_START_TIME, start_motion) from on_anim_over(). Sets motor velocity override using attack_speed and attack_speed_mod, then starts periodic attack task via DoPeriodicTask if _no_combat_gestalt is false.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** None
*   **Error states:** None.

### `stop_motion(inst)` (local)
*   **Description:** Task callback passed to DoTaskInTime(FLY_END_TIME, stop_motion) from on_anim_over() or called early from try_attack(). Cancels attack task, plays "mutate" animation, and either teleports to target position (if _force_end_position_callback exists) or continues motion. Calls _force_end_position_callback if set.
*   **Parameters:** `inst` -- projectile entity
*   **Returns:** None
*   **Error states:** Errors if `inst.Physics` or `inst.AnimState` is nil (no nil guards). Also errors if `inst._target_pos` is nil when `_force_end_position_callback` is set (`_target_pos:Get()` called without guard).

### `on_anim_over(inst)` (local)
*   **Description:** Handles `animover` event. If animation is `emerge`, sets rotation/face, plays `attack`, and schedules `start_motion` and `stop_motion` tasks. If `mutate`, removes entity.
*   **Parameters:** `inst` -- entity instance
*   **Returns:** None
*   **Error states:** Errors if `inst.AnimState` is nil (no nil guard before `IsCurrentAnimation`/`PlayAnimation` calls).

### `SetTargetPosition(inst, target_pos)` (local)
*   **Description:** Stores target position in `inst._target_pos`. Used by master to direct flight path.
*   **Parameters:**
    - `inst` -- entity instance
    - `target_pos` -- Vector3 target coordinates
*   **Returns:** None
*   **Error states:** None.

### `SetProjectileDistance(inst, dist, callback)` (local)
*   **Description:** Adjusts `inst.attack_speed_mod` to ensure projectile travels exactly `dist` units during flight time. Sets `inst._force_end_position_callback` to execute on stop. Used by visual variant.
*   **Parameters:**
    - `inst` -- entity instance
    - `dist` -- float desired travel distance
    - `callback` -- function to call when flight ends
*   **Returns:** None
*   **Error states:** None.

### `on_entity_sleep(inst)` (local)
*   **Description:** Lifecycle callback assigned as inst.OnEntitySleep in commonfn(). Schedules entity removal after 3 seconds if not POPULATING. Prevents sleeping entities from persisting indefinitely.
*   **Parameters:** `inst` -- entity instance
*   **Returns:** None
*   **Error states:** None.

### `on_entity_wake(inst)` (local)
*   **Description:** Lifecycle callback assigned as inst.OnEntityWake in commonfn(). Cancels the pending removal task (_esleep_remove_task) when entity wakes up, allowing it to continue existing.
*   **Parameters:** `inst` -- entity instance
*   **Returns:** None
*   **Error states:** None.

## Events & listeners
- **Listens to:** `animover` -- triggers `on_anim_over`; transitions from emerge to attack animation and starts movement tasks.
- **Pushes:** `attacked` -- fired in `attack_behaviour` when target takes sanity/grogginess damage without health loss. Data: `{attacker = inst, damage = 0}`.
- **World state watchers:** None identified.