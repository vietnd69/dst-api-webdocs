---
id: SGalterguardian_phase2
title: Sgalterguardian Phase2
description: Manages the behavior state machine for the Alter Guardian Phase 2 boss encounter, including movement, attack selection, and transition logic.
tags: [combat, ai, boss, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1cf9a842
system_scope: ai
---

# Sgalterguardian Phase2

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGalterguardian_phase2` defines the stategraph for the Alter Guardian's Phase 2 boss encounter. It orchestrates movement, animation, combat, and attack selection using a set of named states (`spawn`, `idle`, `atk_chop`, `spin_pre`, `spin_loop`, `spin_pst`, `atk_summon`, `antiboat_attack`, `death`, etc.). It integrates closely with the `health`, `combat`, `locomotor`, `timer`, `lootdropper`, and `workable` components to control behavior during each phase of the fight. The stategraph handles AI targeting, timing of attacks (including conditional cooldowns), camera shake, sound effects, and visual FX.

## Usage example
This stategraph is not added manually to entities. Instead, it is loaded as part of the Alter Guardian Phase 2 prefab's initialization logic. It is returned as a registered stategraph named `"alterguardian_phase2"` and referenced via `inst.sg:GoToState("state_name")` from within the boss component logic.

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `timer`, `lootdropper`, `workable`  
**Tags:** `busy`, `noaoestun`, `noattack`, `nosleep`, `nostun`, `idle`, `canrotate`, `canroll`, `attack`, `spin`, `dead` (added conditionally per state)  
**Tags checked:** `brightmareboss`, `brightmare`, `INLIMBO`, `FX`, `NOCLICK`, `playerghost`, `flight`, `invisible`, `notarget`, `noattack`, `_health`, `CHOP_workable`, `HAMMER_workable`, `MINE_workable`, `smashable`, `player`

## Properties
No public properties — the component is a `StateGraph` object and does not expose state or data fields to external code.

## Main functions
This file does not define any external callable functions (e.g., `inst:DoSomething()`), only internal helper functions used within the stategraph (e.g., `set_lightvalues`, `do_gestalt_summon`, `spawn_spintrail`). These helpers are called during state transitions, timeline events, or updates.

### `set_lightvalues(inst, val)`
*   **Description:** Adjusts the boss’s light intensity, radius, and falloff based on a normalized input value `val` (0.0–1.0). Used during `spawn`, `death`, and `idle` to simulate charging or dying light effects.
*   **Parameters:** `inst` (Entity instance), `val` (number) — intensity scaling factor.
*   **Returns:** Nothing.

### `spawn_spintrail(inst)`
*   **Description:** Spawns FX prefabs (`alterguardian_spintrail_fx`, `mining_moonglass_fx`) at a calculated offset in front of the boss to indicate spin direction and motion.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `do_gestalt_summon(inst)`
*   **Description:** Spawns five `smallguard_alterguardian_projectile` prefabs in a spreading, alternating pattern behind the boss toward the target’s position, eachDelayed by `3*FRAMES`.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `doattack` — triggers conditional attack state transition based on target position, cooldowns, and validity.
  - `animover` — returns to `idle` state after most animations complete.
  - `healthdelta`, `invincibletoggle`, `locomote`, `entity_droploot`, `phasetransition` — propagated from component events; handled via `CommonHandlers` and custom `EventHandler` entries.

- **Pushes:**
  - `phasetransition` — fired on `death` timeout to trigger next phase logic (e.g., Phase 3 transition).
  - `healthdelta`, `invincibletoggle`, `locomote`, `entity_droploot` — inherited from component behavior.
