---
id: dragonfly
title: Dragonfly
description: Manages the dragonfly boss entity's state transitions, combat behavior, lavae spawning, and environmental interactions in Don't Starve Together.
tags: [combat, ai, boss,environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fb69f566
system_scope: world
---

# Dragonfly

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dragonfly` prefab defines the gameplay and logic for the Dragonfly boss entity. It orchestrates state transitions between "normal" and "enraged" (fire) modes, manages the spawning and behavior of subordinate lavae entities, handles combat targeting via group targeting logic, and integrates with core systems such as freezing, moisture, sleep, and propagation. It is typically spawned by a `dragonfly_spawner` and interacts closely with the `dragonflybrain` and associated components.

## Usage example
This is a core game prefab and is not instantiated directly by mods. It is automatically created by the world generation system when the Dragonfly boss is scheduled to spawn.

## Dependencies & tags
**Components used:** `combat`, `damagetracker`, `explosiveresist`, `groundpounder`, `grouptargeter`, `health`, `healthtrigger`, `inspectable`, `inventory`, `knownlocations`, `lootdropper`, `locomotor`, `moisture`, `propagator`, `rampingspawner`, `sleeper`, `stuckdetection`, `stunnable`, `timer`, `childspawner`, `entitytracker`, `freezable`.

**Tags:** Adds `epic`, `noepicmusic`, `monster`, `hostile`, `dragonfly`, `scarytoprey`, `largecreature`, `flying`, `ignorewalkableplatformdrowning`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enraged` | boolean | `false` | Indicates whether the dragonfly is currently in its fire/enraged state. |
| `can_ground_pound` | boolean | `false` | Whether the dragonfly can perform a ground pound attack. |
| `reset` | boolean | `nil` | Set to `true` when the dragonfly is in the process of despawning. |
| `hit_recovery` | number | `TUNING.DRAGONFLY_HIT_RECOVERY` | Time in seconds after being hit before action resumes. |
| `_isengaged` | net_bool | `nil` | Networked boolean tracking whether the dragonfly is currently in combat with players. |
| `_playingmusic` | boolean | `false` | Local client-side flag for music state. |
| `_musictask` | Task | `nil` | Periodic task managing music trigger logic. |
| `scrapbook_damage` | table | `{TUNING.DRAGONFLY_DAMAGE, TUNING.DRAGONFLY_FIRE_DAMAGE}` | Damage values shown in scrapbook. |

## Main functions
### `TransformNormal(inst)`
*   **Description:** Transforms the dragonfly back to its normal (non-fire) state. Resets combat stats, disables light and fire spreading, sets movement speed, freeze threshold, and resets moisture to full.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** Nothing.
*   **Error states:** N/A.

### `TransformFire(inst)`
*   **Description:** Transforms the dragonfly into its enraged (fire) state. Updates animations, stats, enables light and fire spreading, drains moisture, sets higher freeze resistance, and schedules a delayed revert.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing `reverttask` before scheduling a new one.

### `SetEngaged(inst, engaged)`
*   **Description:** Updates the engaged state and triggers side effects: toggles despawn timer, updates music logic, and notifies the home spawner.
*   **Parameters:** `inst` (Entity) — The dragonfly instance. `engaged` (boolean) — Whether the dragonfly is currently engaged in combat.
*   **Returns:** Nothing.
*   **Error states:** No-op if `engaged` matches current state.

### `SoftReset(inst)`
*   **Description:** Resets combat and state after a period of inactivity: restores health, unfreezes, wakes sleeper, stops spawner, and returns to normal form.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** Nothing.
*   **Error states:** Early return if combat target exists at time of check.

### `Reset(inst)`
*   **Description:** Prepares the dragonfly for despawning by resetting lavae state and setting `reset = true`.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** Nothing.
*   **Error states:** Does not immediately despawn; `DoDespawn` must be called separately.

### `DoDespawn(inst)`
*   **Description:** Final despawn logic. Returns the dragonfly to its home spawner and signals resumption of spawner activity.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** Nothing.
*   **Error states:** If no home spawner is found, the entity is removed directly.

### `UpdatePlayerTargets(inst)`
*   **Description:** Reconciles the `grouptargeter` target list with players within `DRAGONFLY_RESET_DIST` of the spawn point.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** Nothing.
*   **Error states:** N/A.

### `RetargetFn(inst)`
*   **Description:** Custom retargeting function for `combat`. Prioritizes players within aggro range, or selects from other tracked targets.
*   **Parameters:** `inst` (Entity) — The dragonfly instance.
*   **Returns:** `(target: Entity?, update: boolean)` — The new target if found, and whether to force update.
*   **Error states:** May return `nil` if no valid target exists.

## Events & listeners
- **Listens to:** `attacked` — Sets attacker as new combat target if not already engaged in range.
- **Listens to:** `death` — Triggers `OnDeath` (awards achievement, resets lavae, disengages).
- **Listens to:** `moisturedelta` — Triggers `OnMoistureDelta`, which can revert fire form if moisture crosses threshold.
- **Listens to:** `newcombattarget` — Triggers `OnNewTarget`, updates music, and manages target-death callbacks.
- **Listens to:** `rampingspawner_death` — Triggers `OnLavaeDeath`, potentially enraging if all lavae are gone.
- **Listens to:** `rampingspawner_spawn` — Triggers `OnLavaeSpawn`, sets lavae target to nearest player.
- **Listens to:** `timerdone` — Handles ground pound cooldown (`groundpound_cd`).
- **Listens to:** `isengageddirty` — Syncs engaged state on non-master clients.

- **Pushes:** `transform` — Emitted when transitioning between normal and fire state (`{ transformstate = "normal"|"fire" }`).
- **Pushes:** `dragonflyengaged` — Emitted by home spawner when engaged status changes (`{ engaged = boolean, dragonfly = inst }`).