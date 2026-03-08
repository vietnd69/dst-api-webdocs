---
id: SGalterguardian_phase1
title: Sgalterguardian Phase1
description: Controls the state machine and AI behavior of the Alter Guardian boss during its first phase, handling movement, attacks (rolling, tantrum AOE), shield mechanics, and lunar-based regeneration upon min_health.
tags: [boss, ai, combat, stategraph, lunar]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2cf70038
system_scope: entity
---

# Sgalterguardian Phase1

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGalterguardian_phase1` defines the stategraph for the Alter Guardian's Phase 1 encounter. It orchestrates the boss’s movement (walking, rolling), attack patterns (AOE tantrum, charged roll), shield transitions, death and revival sequences (including the special lunar rift mechanic), and camera/audio feedback. The stategraph integrates heavily with the entity’s `combat`, `health`, `locomotor`, `timer`, `lootdropper`, `talker`, and `gestaltcapturable` components, and responds to networked and local events (e.g., `doattack`, `attacked`, `minhealth`).

## Usage example
This file defines a `StateGraph`, not a reusable component, so it is instantiated automatically by the engine when the `alterguardian_phase1` prefab loads. Modders typically interact with it by listening to its events (e.g., `phasetransition`, `ms_alterguardian_phase1_lunarrift_capturable`) or extending `CommonStates` for movement state overlays.

```lua
-- Example: Listening to phase transition event in a mod script
TheWorld:ListenForEvent("phasetransition", function(data)
    if data.inst and data.inst.prefab == "alterguardian_phase1" then
        print("Alter Guardian Phase 1 ended!")
    end
end)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `timer`, `lootdropper`, `talker`, `gestaltcapturable`, `wagpunk_arena_manager` (world-level).  
**Tags:** Common tags used in state definitions include `busy`, `attack`, `idle`, `charge`, `shield`, `hit`, `dead`, `noattack`, `nointerrupt`, `noaoestun`, `nosleep`, `nostun`, `canrotate`, `canroll`, `temp_invincible`, `spawn_lunar`, `NOCLICK`. State tags (`HasStateTag`, `HasAnyStateTag`) are used extensively for conditional behavior.

## Properties
No public properties are initialized directly in this file. The stategraph depends on Tuning values (e.g., `TUNING.ALTERGUARDIAN_PHASE1_AOEDAMAGE`) and runtime state stored in `inst.sg.statemem` or `inst.sg.mem`.

## Main functions
### `ChooseAttack(inst, target)`
* **Description:** Determines whether the Alter Guardian should perform an AOE tantrum (close-range) or a charged roll (far-range) based on target distance and roll cooldown.
* **Parameters:** `inst` (Entity) — the boss instance; `target` (Entity?) — the current combat target.
* **Returns:** Nothing.
* **Error states:** If `target` is invalid or too close, it immediately transitions to `tantrum_pre`. If roll is on cooldown, it also defaults to tantrum.

### `DoAOEAttack(inst, range)`
* **Description:** Performs a ground-based AoE attack, checking for valid targets in range and applying damage using the `combat` component.
* **Parameters:** `inst` (Entity); `range` (number) — maximum radial distance to target.
* **Returns:** Nothing.
* **Error states:** Applies `ALTERGUARDIAN_PHASE1_AOEDAMAGE` first, then reverts to `ALTERGUARDIAN_PHASE1_ROLLDAMAGE` after targeting.

### `OnUpdateRollAttack(inst)`
* **Description:** Called every frame during roll states (`roll`, `roll_stop`) to detect and damage targets hit by the rolling boss.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Skips if `inst.sg.statemem.rollhits` is nil or target already recorded as hit.

### `lunarspawn_set_lightvalues(inst, frame)`
* **Description:** Adjusts lighting intensity, radius, and falloff and applies an animation light override during the `spawn_lunar` state to simulate a rising moon effect.
* **Parameters:** `inst` (Entity); `frame` (number) — current animation frame index.
* **Returns:** Nothing.
* **Error states:** No effect if `frame` exceeds `LUNAR_SPAWN_LIGHTMODULATION` table bounds.

## Events & listeners
- **Listens to:**  
  - `locomote` — triggers walk transitions (`walk_start`/`walk_stop`).  
  - `doattack` — initiates attack selection via `ChooseAttack`.  
  - `attacked` — triggers hit recovery (`hit`) or shield hit (`shield_hit`) when not invincible/immune.  
  - `entershield` / `exitshield` — transitions into/out of shield states.  
  - `minhealth` — triggers lunar death sequence (`death_lunar`).  
  - `startspawnanim` — forces transition to `spawn`.  
  - `phasetransition` — consumed internally after `death`.  
  - `ms_alterguardian_phase1_lunarrift_capturable` — pushed when gestalt becomes capturable.  
  - Common death/sink/fall-in-void handlers from `CommonHandlers`.
- **Pushes:**  
  - `invincibletoggle` — via `health:SetInvincible`.  
  - `locomote` — on movement state changes.  
  - `attackstart` — when roll sequence begins.  
  - `phasetransition` — after death animation completes.  
  - `entity_droploot` — internally via `lootdropper:DropLoot`.  
  - `ms_alterguardian_phase1_lunarrift_capturable` — to signal gestalt readiness.