---
id: alterguardian_phase3trap
title: Alterguardian Phase3Trap
description: Manages the lifecycle, behavior, and effects of the Alterguardian's Phase 3 meteor trap, including landing damage, grogginess pulses, and trap destruction/loot handling.
tags: [combat, boss, ai, trap, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9cfd933c
system_scope: environment
---

# Alterguardian Phase3Trap

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`alterguardian_phase3trap.lua` defines three interrelated prefabs involved in the Alterguardian boss's Phase 3 ability: a falling meteor projectile, the grounded trap itself, and a ground FX entity. The projectile falls, performs a camera shake and AoE damage/destruction on impact, and spawns the grounded trap. The grounded trap periodically emits grogginess/sleepiness pulses, charges, and can be destroyed by players to drop moon glass. If struck by an Alterguardian laser, it spawns a Gestalt. The component relies heavily on the `timer`, `workable`, and `lootdropper` components for lifecycle management.

## Usage example
```lua
-- The trap prefabs are automatically instantiated by the Alterguardian boss AI.
-- Example of manually spawning and configuring a trap (typically done internally):
local trap = SpawnPrefab("alterguardian_phase3trap")
trap.Transform:SetPosition(x, y, z)
trap.SetGuardian(some_guardian_entity)
-- Timers and behaviors are then handled internally by the prefab functions.
```

## Dependencies & tags
**Components used:** `timer`, `workable`, `lootdropper`, `inspectable`  
**Tags added/removed:** Adds `moonglass`, `FX`, `NOCLICK`, `DECOR`, `CLASSIFIED` depending on prefab variant. Checks for `smashable`, `_combat`, `CHOP_workable`, `DIG_workable`, `HAMMER_workable`, `MINE_workable`, `shadowminion`, `_health`, `_sleeper`, `grogginess`, `sleeper`, etc.

## Properties
No public properties are exposed. Internal state is held in:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_guardian` | entity reference | `nil` | Reference to the Alterguardian that spawned this trap. Used for damage attribution and tracking. |
| `_pulse_fx` | entity reference | `nil` | Reference to the `alterguardian_phase3trapgroundfx` entity used for pulse visuals. Lazily instantiated. |

## Main functions
### `set_guardian(inst, guardian)`
*   **Description:** Internal helper used by projectiles to associate the trap with its originating Alterguardian for combat attribution and tracking.
*   **Parameters:** `guardian` (entity) — the Alterguardian entity.
*   **Returns:** Nothing.

### `do_landed(inst)`
*   **Description:** Executed on projectile impact. Applies a camera shake, calculates AoE damage/destruction for nearby targets, and handles `smashable` entities by killing them.
*   **Parameters:** `inst` (entity) — the projectile entity being landed.
*   **Returns:** Nothing.
*   **Error states:** Temporarily overrides combat damage, damage is restored afterward. Targets must pass tag filtering and distance checks to be affected.

### `spawn_trap(inst)`
*   **Description:** Called when the projectile's `meteor_pre` animation ends. Spawns the grounded `alterguardian_phase3trap`, positions it, and informs the guardian if present.
*   **Parameters:** `inst` (entity) — the projectile being destroyed.
*   **Returns:** Nothing.

### `do_groggy_pulse(inst)`
*   **Description:** Applies grogginess or sleepiness effects to nearby entities. Hits entities with `grogginess` or `sleeper` components (if not already knocked out/sleeping), and `shadowminion` entities.
*   **Parameters:** `inst` (entity) — the grounded trap.
*   **Returns:** Nothing.

### `finish_pulse(inst)`
*   **Description:** Ends a pulse sequence by playing the post-animation for the ground FX and resetting timers to begin the next charge phase.
*   **Parameters:** `inst` (entity) — the grounded trap.
*   **Returns:** Nothing.

### `start_pulse(inst)`
*   **Description:** Begins a grogginess pulse sequence by playing ground FX animations and scheduling periodic `pulse` events.
*   **Parameters:** `inst` (entity) — the grounded trap.
*   **Returns:** Nothing.

### `start_charge(inst)`
*   **Description:** Switches the trap’s animation to the charging phase and schedules the next `start_pulse`.
*   **Parameters:** `inst` (entity) — the grounded trap.
*   **Returns:** Nothing.

### `on_trap_timer(inst, data)`
*   **Description:** Callback for `timerdone` events. Routes timer completions to `start_charge`, `start_pulse`, `pulse`, `finish_pulse`, or `trap_lifetime` handlers.
*   **Parameters:** `inst` (entity), `data` (table) — timer data with field `name`.
*   **Returns:** Nothing.

### `on_trap_removed(inst)`
*   **Description:** Cleanup and loot logic when the trap is removed. Drops loot, triggers post FX, and cleans up ground FX.
*   **Parameters:** `inst` (entity) — the trap being removed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` — triggers `spawn_trap` for projectiles.  
  `timerdone` — routes to `on_trap_timer`.  
  `onremove` — triggers `on_trap_removed`.  
  `onalterguardianlasered` — triggers `spawn_gestalt`.
- **Pushes:**  
  `attacked` — fired with `{attacker = inst, damage = 0}` when grogginess/sleepiness is applied (but no knock-out occurred).