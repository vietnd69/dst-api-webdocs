---
id: SGcrabking_mob
title: Sgcrabking Mob
description: Manages the state machine and behavior logic for the Crab King mob, handling movement, combat (including melee and spin attacks), drowning, diving, and state transitions.
tags: [ai, combat, stategraph, boss, creature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 35c6a01b
system_scope: ai
---

# Sgcrabking Mob

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGcrabking_mob` stategraph defines the core behavior of the Crab King mob in DST. It orchestrates state transitions for idle, movement, combat (single-target and area-of-effect spin attacks), diving, drowning, breaking, and flying. It leverages components like `combat`, `locomotor`, `health`, `drownable`, and `lootdropper`, and integrates with common state handlers (`CommonHandlers`) for shared behaviors like sleep, freeze, and electrocute states.

## Usage example
This stategraph is applied to a prefab by returning it from the stategraph file (e.g., in the prefab's `master_postinit`). It is not directly added as a component, but instantiated as the entity's stategraph:
```lua
inst.entity:AddStateGraph("crabking_mob")
inst.sg = StateGraph("crabking_mob", ...)
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `health`, `drownable`, `lootdropper`  
**Tags:** States use various tags including `busy`, `moving`, `idle`, `attack`, `canrotate`, `nosleep`, `nofreeze`, `noattack`, `noelectrocute`, `nomorph`, `drowning`, `invisible`, `spinning`, `jumping`, `nointerrupt`, `nopredict`, `doing`.

## Properties
No public properties defined. This file is a stategraph definition, not a component with instance state.

## Main functions
### `AOEAttack(inst, dist, radius, targets)`
*   **Description:** Performs an area-of-effect (AOE) attack for the Crab King. Sets `ignorehitrange` on the combat component, finds valid entities in a circle centered offset by `dist` in the facing direction, and executes `DoAttack` on each valid target within `radius`. Resets `ignorehitrange` afterward.
*   **Parameters:**
    *   `inst` (Entity) — The mob instance performing the attack.
    *   `dist` (number) — Offset distance to apply to the attack center along the mob's facing direction.
    *   `radius` (number) — Base radius for AOE hit detection.
    *   `targets` (table or nil) — Optional table to track already-hit targets to prevent duplicates.
*   **Returns:** Nothing.
*   **Error states:** Does not explicitly fail; non-existent or invalid targets in the radius are skipped due to validation checks (`IsValid()`, `IsInLimbo()`, `IsDead()`, `CanTarget()`).

## Events & listeners
- **Listens to:**
    - `"onsink"` — Triggers `dive_pst_water` if drowning conditions are met.
    - `"attacked"` — Initiates `hit` state unless already busy, attacking, moving, or electrocuting; handles electrocution via `CommonHandlers.TryElectrocuteOnAttacked`.
    - `"doattack"` — Initiates `attack` or `spin_attack` based on tag `largecreature` and target distance; otherwise `attack`.
    - `"locomote"` — Synchronizes state with locomotion intent: transitions to `premoving` when starting movement (if not attacking) or `idle` when stopping.
    - `"death"` — Triggers `death` state unconditionally.
    - `"animover"` — Used in multiple states to transition to next state upon animation completion.
    - `"hit_ground"` — Used in `flying` state to determine transition to `flying_pst_land` or `flying_pst_water`.
    - `"ontimeout"` — Used in `premoving`, `spin_attack`, `spin_attack_loop`, `taunt`, `break_water`, and `break_land` to handle timed transitions.
- **Pushes:** None directly (event pushing is handled via stategraph framework and common handlers).