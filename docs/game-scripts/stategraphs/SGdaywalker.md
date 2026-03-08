---
id: SGdaywalker
title: Sgdaywalker
description: Manages the Daywalker's state machine and combat behaviors, including movement, attacks (pounce/slam), struggle/tired states, defeat, and electrocution handling.
tags: [entity, combat, locomotion, state, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1c98d685
system_scope: entity
---

# Sgdaywalker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview

SGdaywalker is the stategraph component that controls the Daywalker entity’s behavior in Don't Starve Together. It orchestrates transitions between movement states (idle, walk, run), combat states (pounce, slam), fatigue management (struggle, tired), defeat, and electrocution resistance — using event listeners and reusable helper functions. It integrates with common handler modules for shared behaviors (locomotion, electrocution, sink) and interfaces with the combat, health, locomotor, and sound systems to execute coordinated animations, knockback, and entity reactions.

## Usage example

The Daywalker is instantiated as part of the entity definition, with its stategraph assigned via `inst:AddStateGraph("SGdaywalker")`. When the entity receives combat or environmental triggers, the stategraph responds automatically:

```lua
inst:AddStateGraph("SGdaywalker")
inst:ListenForEvent("doattack", function(inst) 
    if not inst.sg:HasStateTag("busy") then
        inst.sg:GoToState("idlewalk")
    end
end)
inst:ListenForEvent("attacked", function(inst, data) 
    inst.sg:GoToState("hit") 
end)
```

## Dependencies & tags
**Components used:**  
- `Physics` — for motor velocity control and movement stop  
- `Transform` — for rotation, facing, and world position  
- `AnimState` — for animation playback and progress monitoring  
- `SoundEmitter` — for sound effects (footsteps, voice, attacks)  
- `Locomotor` — for movement speed and ground alignment  
- `Combat` — for targeting, cooldowns, damage setting/reset  
- `Health` — for absorption control and regen suppression  
- `Timer` — for roar/stalk/despawn cooldowns  
- `Epicscare` — for area-of-effect scare during taunt  
- `Lootdropper` — for loot drop on defeat  

**Tags:**  
State tags used in transitions: `"running"`, `"busy"`, `"idle"`, `"nointerrupt"`, `"canattach"`, `"notiredhit"`, `"canelectrocute"`, `"canrotate"`, `"struggle"`, `"pounce_recovery"`, `"tired"`, `"defeated"`, `"caninterrupt"`, `"struggling"`, `"shrugging"`, `"colliding"`, `"shadow_aligned"`, `"stalking"`, `"noattack"`.  
Entity tags used in work/AOE logic: `"daywalker_pillar"`, `"MINE_workable"`, `"NPC_workable"`, `"FX"`, `"DECOR"`, `"INLIMBO"`, `"blocker"`, `"_combat"`, `"flight"`, `"invisible"`, `"notarget"`, `"noattack"`, `"heavyarmor"`, `"heavybody"`, `"stump"`, `"player"`, `"playerghost"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `ChooseAttack(inst)`
* **Description:** Determines the next attack type for the Daywalker based on state and conditions. Selects between a slam attack (if conditions are met) or a pounce attack.  
* **Parameters:**  
  - `inst`: The entity instance (the Daywalker).  
* **Returns:** `true` (explicitly returned at end).  
* **Error states:** None identified.  

### `IsPlayerMelee(data)`
* **Description:** Checks whether a combat event (`attacked`) was caused by a player’s melee attack (non-projectile).  
* **Parameters:**  
  - `data`: Event data from the `attacked` event.  
* **Returns:** `true` if the attacker is a player using a melee weapon (or no weapon) with damage > 0; else `false`.  
* **Error states:** Returns `false` if `data` or `data.attacker` is nil, or if weapon is projectile-based.  

### `hit_recovery_skip_cooldown_fn(inst, last_t, delay)`
* **Description:** Custom filter function used by `CommonHandlers.HitRecoveryDelay`. Determines whether hit recovery should skip its usual delay.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `last_t`: Last hit time (unused in body).  
  - `delay`: Delay duration (unused in body).  
* **Returns:** `true` if hit recovery delay should be skipped (i.e., when `inst.hit_recovery == TUNING.DAYWALKER_HIT_RECOVERY`, combat is in cooldown, and state has `"idle"` tag); otherwise `false`.  
* **Error states:** None identified.  

### `_transfer_statemem_to_electrocute(inst, playermelee)`
* **Description:** Transfers state tag memories (`struggle`, `tired`, `pounce_recovery`) into `inst.sg.mem` for use during electrocution state transitions.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `playermelee`: Boolean indicating if attack was from player melee.  
* **Returns:** `nil`.  
* **Error states:** None identified.  

### `RandomPillarFacing(inst)`
* **Description:** Calculates an average facing toward nearby pillars and sets a slightly randomized rotation. Falls back to random rotation if no pillars found.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** `nil`.  
* **Error states:** None identified.  

### `TryCollidePillar(inst, forward)`
* **Description:** Checks for nearby pillars in a small AOE area, triggers collision response on them, and forces transition to `"collide"` state if any are found.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `forward`: Boolean — if true, searches slightly ahead in facing direction.  
* **Returns:** `nil`.  
* **Error states:** None identified.  

### `TryDetachLeech(inst, attachpos, speedmult, randomdir)`
* **Description:** Attempts to detach leeches under specific conditions (no active incoming jumps, cooldown passed), and records new detach cooldown timestamp.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `attachpos`: Optional position/keys for detachment.  
  - `speedmult`: Velocity multiplier for detachment.  
  - `randomdir`: Whether to use random direction for detachment.  
* **Returns:** `nil` (actual detach success is internal to `inst:DetachLeech()`).  
* **Error states:** Cooldown enforced via `inst.sg.mem.detachtime`.  

### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Performs area-of-effect combat attack in a circle, optionally offset by `dist`, targeting valid entities within `radius`. Applies knockback and tracks already-hit targets via `targets` table.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `dist`: Forward offset distance.  
  - `radius`: Attack radius.  
  - `heavymult`: Knockback multiplier for heavy-armored/heavy-body targets.  
  - `mult`: Knockback multiplier for non-heavy targets.  
  - `forcelanded`: Boolean passed to knockback event.  
  - `targets`: Table used to deduplicate target hits.  
* **Returns:** `nil`.  
* **Error states:** Targets already in `targets` table are skipped; invalid or dead targets excluded.  

### `DoAOEWork(inst, dist, radius, targets, overridenontags, trampledelays)`
* **Description:** Performs area-of-effect work destruction (e.g., chopping, mining, hammering) on workable obstacles within radius. Implements trampling delay logic for blocker-tagged obstacles.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `dist`: Forward offset.  
  - `radius`: Work radius.  
  - `targets`: Table to track processed entities (optional).  
  - `overridenontags`: List of tags to *exclude* (overrides default).  
  - `trampledelays`: Table used for tracking per-obstacle trample delays.  
* **Returns:** `nil`.  
* **Error states:** Pillars trigger `OnCollided`, others proceed normally; blockers use trample threshold logic.  

### `DoFootstepAOE(inst)`
* **Description:** Convenience wrapper calling `DoAOEWork` with footstep-specific defaults.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** `nil`.  
* **Error states:** None identified.  

### `IsSlamTarget(x, z, guy, rangesq, checkrot)`
* **Description:** Checks if `guy` is a valid slam target (alive, visible, on above-ground map, within `rangesq` distance; optionally within rotation range).  
* **Parameters:**  
  - `x`, `z`: Center position of detection.  
  - `guy`: Entity to test.  
  - `rangesq`: Squared detection range.  
  - `checkrot`: Optional rotation (in degrees) to further filter by direction.  
* **Returns:** `true` if valid target; else `false`.  
* **Error states:** Skips dead, ghost, invisible, or non-visible entities.  

### `FindSlamTarget(inst, rangesq)`
* **Description:** Searches for a valid slam target starting from `inst`'s combat target, then random sampling from `inst.components.grouptargeter:GetTargets()`.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `rangesq`: Squared detection range for `IsSlamTarget`.  
* **Returns:** First valid target found, or `nil`.  
* **Error states:** May skip targets if they fail visibility, position, or map checks.  

### `TryChatter(inst, strtblname, index, ignoredelay, echotochatpriority)`
* **Description:** Wrapper that forwards chatter call to `SGDaywalkerCommon.TryChatter`, passing `CHATTER_DELAYS` table and other parameters.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `strtblname`: Key in `CHATTER_DELAYS` (e.g., `"DAYWALKER_TIRED"`).  
  - `index`: Optional extra index for chatter selection.  
  - `ignoredelay`: Bypass chatter cooldown if `true`.  
  - `echotochatpriority`: Chat priority; defaults to `CHATPRIORITIES.LOW`.  
* **Returns:** `nil`.  
* **Error states:** None identified.  

### `DoFootstep(inst, volume)`
* **Description:** Records the time of the last footstep and plays the footstep sound at the specified volume.  
* **Parameters:**  
  - `inst`: The entity instance (daywalker).  
  - `volume`: Float — volume multiplier for the footstep sound.  
* **Returns:** None.  
* **Error states:** None identified.  

## Events & listeners
- **`doattack`** — Triggers `ChooseAttack` if not busy or defeated; in `hit` state, sets `inst.sg.statemem.doattack = true` and prevents transition if not busy.  
- **`electrocute`** — Triggers `CommonHandlers.TryElectrocuteOnEvent` with `_transfer_statemem_to_electrocute` callback.  
- **`attacked`** — Handles struggle/tired/defeated states; triggers `hit` transition on player melee; manages hit recovery and electrocution state entry.  
- **`leechattached`** — Enters `"attach"` or `"collide"` state based on struggle state and interruption tags.  
- **`roar`** — Enters `"taunt"` if not defeated/busy.  
- **`minhealth`** — Enters `"defeat"` if defeated and not yet in `"defeated"` state tag.  
- **`teleported`** — Triggers recovery paths based on struggle/tired states.  
- **`animover`** — Internal state transitions after animation completion:  
  - In `idlewalk`/`idle`: no explicit handler (assumed handled elsewhere).  
  - In `hit`: transitions to `tired_pre` if fatigued/defeated; otherwise removes `busy` tag and loops/moves on.  
  - In `attack_pounce_pre`: transitions to `attack_pounce`.  
  - In `attack_pounce`: processes pounce success/failure → `attack_slam`, `attack_pounce_pst`, or `attack_pounce_pst_tired`.  
  - In `attack_pounce_pst`/`pounce_pst_tired`: transitions to `idle`, `taunt`, or `tired_pre`.  
  - In `attack_slam_pre`: transitions to `attack_slam`.  
  - In `attack_slam`: transitions to `idle` or `taunt`.  
  - In `taunt`: transitions to `idle`.  
  - In `defeat`: transitions to `defeat_idle_pre`.  
  - In `defeat_idle_pre`: transitions to `defeat_idle`.  
  - In electrocute states: transitions to `struggle_idle`, `tired_pre`, `tired`, or `idle` based on tags.