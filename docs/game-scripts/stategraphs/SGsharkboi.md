---
id: SGsharkboi
title: Sgsharkboi
description: Manages the state machine and behavior of the sharkboi entity, including movement, combat, digging, AOE attacks, and defeat sequences.
tags: [stategraph, entity, combat, locomotion, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 494d870f
system_scope: entity
---

# Sgsharkboi

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
SGsharkboi is the stategraph component that defines the full behavioral lifecycle of the sharkboi entity, integrating combat, locomotion, digging, AOE attacks, and UI feedback. It manages state transitions for idle, moving, fin swimming, diving, jumping, torpedo usage, dizzy recovery, and defeat. The stategraph coordinates with multiple components (combat, locomotor, timer, physics, animstate, sound) to implement complex mechanical interactions, including knockback scaling, terrain interaction via AOE work, visual FX (swipe, ice plow/impact/trail/hole), and chatter triggers.

## Usage example
```lua
-- Typical usage within the sharkboi's stategraph constructor
local SGsharkboi = Class(function(self, inst)
    -- Register event listeners for core behaviors
    inst:ListenForEvent("doattack", function() inst.sg:GoToState("attack1") end)
    inst:ListenForEvent("locomote", function() inst.sg:GoToState(inst.components.locomotor:IsMoving() and "move" or "idle") end)
    inst:ListenForEvent("attacked", function()
        if inst.sg:HasStateTag("caninterrupt") and not inst.sg:HasStateTag("busy") then
            inst.sg:GoToState("hit")
        end
    end)
    inst:ListenForEvent("electrocute", CommonHandlers.TryElectrocuteOnEvent)
    -- ... additional handlers and state definitions ...
end)
```

## Dependencies & tags
**Components used:** health, combat, locomotor, timer, talker, physics, animstate, soundemitter, transform, workable, pickable, mine, inventoryitem  
**Tags:** "fin", "moving", "idle", "canrotate", "try_restore_canrotate", "running", "busy", "caninterrupt", "frozen", "dizzy", "torpedoready", "defeated", "digging", "hit", "attack", "jumping", "nosleep", "noelectrocute", "cantalk", "temp_invincible", "notalksound", "candefeat", "notarget", "noattack", "invisible", "fastdig", "ington", "sleep", "sleeping"

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.sg.statemem.hits` | number | 0 | Tracks number of hits in current attack sequence |
| `inst.sg.statemem.target` | entity | nil | Current combat target for AOE and attack logic |
| `inst.sg.statemem.targetpos` | vector | nil | Cached world position of target for trajectory/orientation |
| `inst.sg.statemem.diving` | boolean | false | Indicates if currently in a diving sequence |
| `inst.sg.statemem.jumping` | boolean | false | Indicates if currently in a jumping phase |
| `inst.sg.statemem.fin` | boolean | false | Indicates if currently using fin swim movement |
| `inst.sg.statemem.fx` | table | {} | Stores FX instance references for cleanup (e.g., `swipe`, `iceplow`, `iceimpact`, `icetrail`, `icehole`) |
| `inst.sg.statemem.nextstateparams` | table | {} | Parameters passed during state transitions (e.g., timing, overrides) |
| `inst.sg.mem.lastfootstep` | number | 0 | Timestamp of last footstep sound for cooldown |
| `inst.sg.mem.lasttalktime` | number | 0 | Timestamp of last chatter for cooldown |

## Main functions
### `DoImpactShake(inst)`
* **Description:** Triggers a vertical camera shake effect for impact events such as landing or spawning.
* **Parameters:**  
  - `inst`: The entity instance triggering the shake.  
* **Returns:** None  
* **Error states:** None  

### `DoJumpOutShake(inst)`
* **Description:** Triggers a full-field camera shake effect when jumping out of water.
* **Parameters:**  
  - `inst`: The entity instance triggering the shake.  
* **Returns:** None  
* **Error states:** None  

### `DoDiggingShake(inst)`
* **Description:** Triggers a lower-intensity full-field camera shake during digging actions.
* **Parameters:**  
  - `inst`: The entity instance triggering the shake.  
* **Returns:** None  
* **Error states:** None  

### `ChooseAttack(inst, target)`
* **Description:** Determines and initiates the appropriate attack state (e.g., fin-based finishing move, torpedo summon, standing dive, melee) based on cooldowns, proximity, and current state.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `target`: Optional target; defaults to `inst.components.combat.target`.  
* **Returns:** Boolean — `true` if an attack state was initiated, `false` otherwise.  

### `ShouldBeDefeated(inst)`
* **Description:** Checks whether the entity's current health is at or below its minimum (i.e., should transition to defeat).
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** Boolean — `true` if health ≤ minimum, `false` otherwise.  

### `_transfer_statemem_to_electrocute(inst)`
* **Description:** Callback used during electrocution events to preserve critical state memory (e.g., defeat flag, hits, target) for restoration post-electrocution.
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  
* **Error states:** None  

### `_AOEAttack(inst, dig, dist, radius, arc, heavymult, mult, forcelanded, targets)`
* **Description:** Executes area-of-effect combat attacks. Supports dig mode (kills non-locomoting entities) or attack mode (knocks back entities with armor-weighted scaling), optional arc-based targeting, and target deduplication.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `dig`: Boolean — if true, kills non-locomoting entities instead of attacking.  
  - `dist`: Distance offset from center.  
  - `radius`: Radius of effect (meters).  
  - `arc`: Arc width in degrees; if nil, full circle.  
  - `heavymult`, `mult`: Knockback multipliers for heavy-armor and light-body entities.  
  - `forcelanded`: Boolean — passed to knockback event.  
  - `targets`: Optional table to track already-hit targets and prevent duplicates.  
* **Returns:** None  

### `DoAOEWork(inst, dig, dist, radius, arc, targets)`
* **Description:** Performs AOE harvesting/digging on nearby interactable objects (e.g., chop, mine, dig, pick), respecting collapsible/non-collapsible tags.
* **Parameters:** Same as `_AOEAttack`.  
* **Returns:** None  

### `TossLaunch(inst, launcher, basespeed, startheight, startradius)`
* **Description:** Launches an item in a physics-based trajectory from a launcher, with randomized angle and speed.
* **Parameters:**  
  - `inst`: The item to launch.  
  - `launcher`: Entity launching the item.  
  - `basespeed`: Base speed multiplier.  
  - `startheight`, `startradius`: Starting vertical and radial offset.  
* **Returns:** None  

### `TossItems(inst, dist, radius)`
* **Description:** Finds nearby items and tosses them; handles special cases for ice (destroyed) and mineable items (deactivated).
* **Parameters:**  
  - `inst`: Entity performing the toss.  
  - `dist`: Offset distance.  
  - `radius`: Search radius.  
* **Returns:** None  

### `DoAOEAttackAndWork(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Executes non-dig AOE work (e.g., chop, mine) and non-dig AOE attack in one call.
* **Parameters:** Same as `DoAOEWork`/`_AOEAttack`.  
* **Returns:** None  

### `DoAOEAttackAndDig(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Executes dig-mode AOE work, dig-mode AOE attack, and item tossing in one call.
* **Parameters:** Same as `DoAOEWork`/`_AOEAttack`.  
* **Returns:** None  

### `DoArcAttack(inst, dist, radius, arc, heavymult, mult, forcelanded, targets)`
* **Description:** Executes AOE work and attack with arc-based targeting.
* **Parameters:** Same as `DoAOEWork`/`_AOEAttack`.  
* **Returns:** None  

### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Executes standard non-arc, non-dig AOE work and attack.
* **Parameters:** Same as `DoAOEWork`/`_AOEAttack`.  
* **Returns:** None  

### `DoRunWork(inst)`
* **Description:** Performs AOE work during running, using fixed offset=1, radius=2.
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `DoLandingWork(inst)`
* **Description:** Performs AOE work on landing, using offset=0, radius=2.
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `DoFinWork(inst)`
* **Description:** Performs AOE work and item tossing during fin swimming (offset=0.3, radius=0.8).
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `SpawnSwipeFX(inst, offset, reverse)`
* **Description:** Spawns `sharkboi_swipe_fx` prefab at the entity, with optional X-offset and animation reversal.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `offset`: X-offset relative to entity.  
  - `reverse`: Boolean — whether to reverse FX animation.  
* **Returns:** None  

### `KillSwipeFX(inst)`
* **Description:** Safely removes `sharkboi_swipe_fx` from scene if valid and stored in `statemem`.
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `SpawnIcePlowFX(inst, sideoffset)`
* **Description:** Spawns `sharkboi_iceplow_fx` at a side-relative position based on entity rotation.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `sideoffset`: Offset to left/right (±).  
* **Returns:** None  

### `SpawnIceImpactFX(inst, x, z)`
* **Description:** Spawns `sharkboi_iceimpact_fx` at world coordinates (or `inst` position if omitted).
* **Parameters:**  
  - `inst`: Entity instance (fallback).  
  - `x`, `z`: Optional world coordinates; `x=nil` uses `inst` position.  
* **Returns:** None  

### `SpawnIceTrailFX(inst)`
* **Description:** Spawns `sharkboi_icetrail_fx` at `inst`, aligning rotation.
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `SpawnIceHoleFX(inst, x, z)`
* **Description:** Spawns `sharkboi_icehole_fx` at specified or `inst` position.
* **Parameters:** Same as `SpawnIceImpactFX`.  
* **Returns:** FX instance (prefab instance).  

### `IsTargetInFront(inst, target, arc)`
* **Description:** Checks whether `target` lies within a given arc in front of `inst`.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `target`: Target entity.  
  - `arc`: Angular tolerance in degrees; defaults to `180`.  
* **Returns:** Boolean — `true` if target is in front, `false` for invalid/nil target.  

### `IsSpawnPointClear(pt)`
* **Description:** Verifies that position `pt` (table `{x, z}`) contains no blocking entities (e.g., NPCs, creatures).
* **Parameters:**  
  - `pt`: Table with `x`, `z` coordinates.  
* **Returns:** Boolean — `true` if clear, `false` otherwise.  

### `TryChatter(inst, strtblname, index, ignoredelay, force)`
* **Description:** Triggers a chatter line if cooldown passed. Supports forced, priority-echoed, or delayed speech.
* **Parameters:**  
  - `inst`: Entity instance.  
  - `strtblname`: Name of string table (e.g., `"SHARKBOI_REFUSE_EMPTY"`).  
  - `index`: Optional index override; otherwise random.  
  - `ignoredelay`: Boolean — bypass delay.  
  - `force`: Boolean — force playback even if muted.  
* **Returns:** None  
* **Error states:** Uses global `CHATTER_DELAYS`/`CHATTER_ECHO_PRIORITIES`; falls back to defaults.

## Events & listeners
**Listened events:**  
- `electrocute` — triggers `_transfer_statemem_to_electrocute` via `CommonHandlers.TryElectrocuteOnEvent`.  
- `locomote` — triggers transitions between idle/moving/walking/running/fins states.  
- `attacked` — handles hit/recovery logic and interruption of vulnerable states.  
- `minhealth` — triggers hit/defeat transitions if `candefeat` and not blocked.  
- `doattack` — invokes `ChooseAttack` unless busy or defeated.  
- `ontalk` — initiates `talk` state if not busy; updates last talk time.  
- `trade` — delivers `pendingreward` if set.  
- `onrefuseitem` — initiates `refuse` state if not busy.  
- `animover` — state-specific post-animation logic (e.g., `torpedo_pst`, `dive_jump`, `defeat_loop`).  
- `animqueueover` — transitions from `"dive_dig_loop"` to `"dive_dig_pst"`.

**Pushed events:**  
- `knockback` — via `_AOEAttack` → `v:PushEvent("knockback", ...)`.  
- `doattack` — early return in `attack1`'s `events` table prevents further propagation.  
- `animover` — fired on animation completion across many states.  
- `animqueueover` — fired when animation queue finishes (`"dive_dig_loop"`).