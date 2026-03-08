---
id: SGalterguardian_phase4_lunarrift
title: Sgalterguardian Phase4 Lunarrift
description: Manages thePhase 4 lunar rift boss behavior including attack sequencing, AOE effects, camera shake, and multiple defeat/cinematic states.
tags: [combat, cinematic, physics, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a8ee9ae8
system_scope: entity
---

# Sgalterguardian Phase4 Lunarrift

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph component implements the Phase 4 combat logic for the Lunar Rift variant of the Alter Guardian boss. It handles attack selection, multiple AOE types (slam, dash, supernova), camera shake effects, item toss mechanics, fissure generation, and a multi-stage defeat sequence including cinematic transitions, wagstaff interactions, and self-destruction. The component is tightly integrated with the boss entity's combat, locomotion, and timeline systems, using tags to manage interruptibility and state isolation.

## Usage example
```lua
-- During combat, the boss receives a doattack event
inst:PushEvent("doattack")

-- On animation completion, the stategraph advances automatically via animover handler
-- Example of triggering slam AOE from within a state timeline
-- inst.sg:GoToState("slam") → animover → slam_pst → calls DoSlamAOE via timeline callback

-- Internally, ChooseAttack selects between supernova/dash/slam based on cooldowns
local success = ChooseAttack(inst, target)
```

## Dependencies & tags
**Components used:** health, combat, locomotor, timer, planardamage, lootdropper, workable, mine, inventoryitem, physics

**Tags:**
- `"busy"` — added during attack sequences to block new inputs
- `"idle"` — added in hit recovery and idle states to allow idle behaviors
- `"canrotate"` — added when boss can rotate (idle states, hit recovery)
- `"caninterrupt"` — added during taunt post and dash post states
- `"nointerrupt"` — added during dash prep, charging, and most attack states
- `"noattack"` — added during taunt, supernova, charging, burst states
- `"tempinvincible"` — added only during spawn to prevent premature death
- `"attack"` — added during slam, dash, supernova states to indicate active damage
- `"hit"` — added during hit recovery
- `"jumping"` — added during dash states
- `"supernova"` — added in supernova and retained through charging/burst_pre/burst_loop
- `"supernovaburning"` — referenced by external component for burn tracking
- `"INLIMBO"`, `"flight"`, `"invisible"`, `"notarget"`, `"brightmare"`, `"FX"`, `"DECOR"`, `"NPC_workable"`, `"CHOP_workable"`, `"HAMMER_workable"`, `"MINE_workable"`, `"locomotor"`, `"_inventoryitem"`, `"_health"`, `"_combat"`, `"_inventoryitem"` — used in filtering for `FindEntities` and AOE logic but not actively added/removed in this component
- `"NOCLICK"` — added in selfdestruct at frame 16 to disable interaction

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | — | — | No documented properties defined in this stategraph. |

## Main functions
### `ChooseAttack(inst, target)`
* **Description:** Selects and executes the next attack for the boss (supernova, dash, or slam), based on cooldowns, combo counts, and randomization flags. Returns true if an attack was initiated, false otherwise.
* **Parameters:** 
  - `inst`: The boss entity instance.
  - `target`: Optional target; defaults to `inst.components.combat.target`.
* **Returns:** `true` if an attack state was transitioned to, `false` otherwise.
* **Error states:** None explicitly handled; relies on `target:IsValid()` check.

### `DoTauntShake(inst)`
* **Description:** Triggers a full camera shake for taunt animations.
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `DoSlamShake(inst)`
* **Description:** Triggers a vertical camera shake for slam (first impact).
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `DoSlamShake2(inst)`
* **Description:** Triggers a lighter vertical camera shake for slam (second impact).
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `DoChargingShake(inst)`
* **Description:** Triggers a strong full camera shake during supernova charging.
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `DoChargingShakeMild(inst)`
* **Description:** Triggers a milder full camera shake during supernova charging on first loop.
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `DoSupernovaShake(inst)`
* **Description:** Triggers a full camera shake for supernova burst.
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `DoSelfDestructShake(inst)`
* **Description:** Triggers a full camera shake for self-destruct.
* **Parameters:** `inst`: Boss entity instance.
* **Returns:** None.

### `_AOEAttack(inst, x, z, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Performs area-of-effect combat damage on entities within a circle centered at (x, z), respecting tags and validity. Handles heavy armor multiplier and knockback.
* **Parameters:** 
  - `inst`: Boss instance.
  - `x, z`: Center coordinates of the AOE.
  - `radius`: Base radius of effect.
  - `heavymult`: Damage multiplier against heavy-armored targets.
  - `mult`: Base damage multiplier.
  - `forcelanded`: Whether knockback forces landing.
  - `targets`: Table to avoid duplicate hits (updated in-place).
* **Returns:** None.

### `_AOEWork(inst, x, z, radius, targets)`
* **Description:** Destroys workable objects (e.g., camps, walls, mines) within AOE radius that match collapsible criteria.
* **Parameters:** 
  - `inst`: Boss instance.
  - `x, z`: Center coordinates.
  - `radius`: AOE radius.
  - `targets`: Table to avoid duplicate destructions.
* **Returns:** None.

### `_TossLaunch(inst, x0, z0, basespeed, startheight)`
* **Description:** Launches a tossed item (e.g., loot, mine) from a base position toward the boss, applying velocity.
* **Parameters:** 
  - `inst`: Item entity to toss.
  - `x0, z0`: Launch origin.
  - `basespeed`: Base speed multiplier.
  - `startheight`: Initial Y position for teleport.
* **Returns:** None.

### `_TossItems(inst, x, z, radius)`
* **Description:** Finds and tosses items within radius; deactivates mines and launches tossable items.
* **Parameters:** 
  - `inst`: Boss instance.
  - `x, z`: Center coordinates.
  - `radius`: AOE radius.
* **Returns:** None.

### `DoSlamAOE(inst, x, z, targets, shouldtoss)`
* **Description:** Executes slam AOE: `_AOEWork`, `_AOEAttack`, and optionally `_TossItems`.
* **Parameters:** 
  - `inst`, `x`, `z`, `targets`: As above.
  - `shouldtoss`: Boolean whether to toss items.
* **Returns:** None.

### `DoDashAOE(inst, targets)`
* **Description:** Executes dash AOE with fixed radius 3.6 (same as slam, but no toss).
* **Parameters:** 
  - `inst`: Boss instance.
  - `targets`: Table to avoid duplicate hits/destructions.
* **Returns:** None.

### `UpdateSupernovaAOE(inst, dt, firsthit)`
* **Description:** Applies supernova damage/affliction to entities in range, respecting blockers and arena boundaries.
* **Parameters:** 
  - `inst`: Boss instance.
  - `dt`: Time delta (used for throttling).
  - `firsthit`: Whether to apply initial hit logic (e.g., attack check before burning).
* **Returns:** None.

### `SnapTo45s(angle)`
* **Description:** Snaps an angle to nearest 45-degree increment.
* **Parameters:** `angle` (degrees).
* **Returns:** Angle rounded to nearest multiple of 45.

### `DoFissures(inst, offset)`
* **Description:** Generates fissure placement positions in the arena grid, following snap-to-45s orientation; spawns fissures and returns table of fissure prefabs.
* **Parameters:** 
  - `inst`: Boss instance.
  - `offset`: Initial offset iteration (default 1).
* **Returns:** Array of fissure entities or calls itself recursively on failure.

### `SetPreventDeath(inst, prevent)`
* **Description:** Sets boss health minimum to prevent death if `prevent` is true, otherwise resets.
* **Parameters:** 
  - `inst`: Boss instance.
  - `prevent`: Boolean.
* **Returns:** None.

## Events & listeners
- **Listens to:** `doattack` — When boss receives a doattack event, if not in busy state, initiates attack choice via `ChooseAttack`. If in busy state (e.g., during hit/taunt), defers to memory for later execution.
- **Listens to:** `animover` — On animation completion, transitions to next appropriate state (e.g., idle, slam post, dash loop, supernova charging); used in death/quickdefeated/defeated states to advance state sequence.
- **Listens to:** `animqueueover` — Triggers when full animation queue completes; used in “finale” state to advance to selfdestruct.

- **Pushes:** `ms_wagstaff_arena_oneshot` — Pushes from “defeated” state to trigger wagstaff monologue/movement.
- **Pushes:** `ms_wagboss_alter_defeated` — Pushes from “selfdestruct” when defeat occurs inside the arena.
- **Pushes:** `wagboss_defeated` — Pushes from “selfdestruct” when wagstaff is present (from finale or otherwise).