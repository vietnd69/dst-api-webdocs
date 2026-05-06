---
id: SGwx78_possessedbody_no_package
title: Sgwx78 Possessedbody No Package
description: Animation state machine for the shadowmaxwell entity, governing movement, combat, and special actions.
tags: [stategraph, ai, animation, combat, locomotion]
sidebar_position: 10
last_updated: 2026-05-05
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: c83f403d
system_scope: entity
---

# Sgwx78 Possessedbody No Package

> Based on game build **722832** | Last updated: 2026-05-05

## Overview
`SGwx78_possessedbody_no_package` is an animation state machine for the shadowmaxwell entity (a shadow version of Maxwell). It handles locomotion, combat, and special actions like mining, chopping, and dancing. Stategraphs are attached via `SetStateGraph()` and controlled through `sg:GoToState()` calls. Key integrations include `combat` for attack logic, `health` for death handling, and `inventory` for weapon-based animations.

## Usage example
```lua
local inst = CreateEntity("shadowmaxwell")
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:SetStateGraph("shadowmaxwell")
inst.sg:GoToState("attack")
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- Provides shared state handlers and constants

**Components used:**
- `combat` -- Used for target management, attack cooldowns, and battle cries
- `health` -- Checked for death and invincibility states
- `inventory` -- Retrieves equipped items for animation and sound selection
- `locomotor` -- Controls movement states (run, stop)
- `rider` -- Checks riding status for combat animations

**Tags:**
- `busy` -- Added in attack, death, and action states to block interruptions
- `noattack` -- Prevents attacks during spawn state
- `temp_invincible` -- Prevents damage during spawn
- `idle` -- Default resting state tag
- `canrotate` -- Allows rotation during movement states
- `moving` -- Indicates active locomotion
- `attack` -- Active attack state tag
- `working` -- Used in mining/chopping/digging states

## Properties
| State name | Tags | Description |
|------------|------|-------------|
| `spawn` | `busy`, `noattack`, `temp_invincible` | Initial state; disables collisions, plays spawn animation, and sets timeout for idle transition. |
| `idle` | `idle`, `canrotate` | Default resting state; loops idle animation. |
| `run_start` | `moving`, `running`, `canrotate` | Plays run preparation animation and transitions to run state on completion. |
| `run` | `moving`, `running`, `canrotate` | Plays run loop animation and sets timeout for continuous movement. |
| `run_stop` | `canrotate`, `idle` | Plays run post-animation and transitions to idle on completion. |
| `attack` | `attack`, `notalking`, `abouttoattack` | Handles weapon-based attacks; sets target, plays animation based on equipped item, and manages projectile delays. |
| `death` | `busy` | Plays death animation and removes entity on completion. |
| `take` | `busy` | Handles item pickup; performs action at specific frame. |
| `give` | `busy` | Handles item giving; performs action at specific frame. |
| `hit` | `busy` | Plays hit animation and removes busy tag after short delay. |
| `stunned` | `busy`, `canrotate` | Plays sanity animation and transitions to idle after timeout. |
| `chop_start` | `prechop`, `working` | Plays chop preparation animation and transitions to chop state. |
| `chop` | `prechop`, `chopping`, `working` | Plays chop loop animation and repeats action if valid. |
| `mine_start` | `premine`, `working` | Plays mine preparation animation and transitions to mine state. |
| `mine` | `premine`, `mining`, `working` | Plays mine loop animation and performs action with FX. |
| `mine_recoil` | `busy`, `recoil` | Handles mine recoil physics and transitions to idle. |
| `attack_recoil` | `busy`, `recoil` | Handles attack recoil physics and transitions to idle. |
| `dig_start` | `predig`, `working` | Plays dig preparation animation and transitions to dig state. |
| `dig` | `predig`, `digging`, `working` | Plays dig loop animation and performs action with sound. |
| `dance` | `idle`, `dancing` | Plays dance animations based on brain data. |
| `dolongaction` | `doing`, `busy`, `nodangle` | Handles long actions; performs action after timeout. |
| `doshortaction` | `doing`, `busy` | Handles short actions; performs action at specific frame. |
| `jumpout` | `busy`, `canrotate`, `jumping` | Handles jump-out sequence with physics. |

## Main functions
### `GetIceStaffProjectileSound(inst, equip)` (local)
* **Description:** Returns the appropriate sound path for ice staff attacks based on coldness level.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `equip` -- equipped item (must have `icestaff_coldness` property)
* **Returns:** String sound path
* **Error states:** None

### `TryRepeatAction(inst, buffaction, right)` (local)
* **Description:** Checks if buffered action can be repeated and sets it as new buffered action if valid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `buffaction` -- buffered action to check
  - `right` -- boolean for right-hand action (unused)
* **Returns:** `true` if action was set, `false` otherwise
* **Error states:** None

### `onenter (spawn)`
* **Description:** Stops physics, disables character collisions, plays spawn animation with multiplier, and sets timeout for transition.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `mult` -- optional animation speed multiplier (default: random between 0.8 and 1.0)
* **Returns:** nil
* **Error states:** None

### `ontimeout (spawn)`
* **Description:** Adds "caninterrupt" tag, enables character collisions, and resets animation multiplier to 1.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (spawn)`
* **Description:** Enables character collisions and resets animation multiplier if not in spawn state memory.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (run_start)`
* **Description:** Starts running and plays run preparation animation.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor component (no nil guard before inst.components.locomotor:RunForward())

### `ontimeout (run)`
* **Description:** Sets "running" state memory and transitions back to run state.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (run_stop)`
* **Description:** Stops physics and plays run post-animation.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (attack)`
* **Description:** Handles weapon-based attack setup; checks cooldown, sets target, plays animation based on equipped item, and sets timeout.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` is nil (no guard before `combat:InCooldown()`)

### `onupdate (attack)`
* **Description:** Handles projectile delay timing; plays projectile sound and performs action when delay expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `dt` -- delta time
* **Returns:** nil
* **Error states:** None

### `ontimeout (attack)`
* **Description:** Removes "attack" tag and adds "idle" tag.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (attack)`
* **Description:** Clears target and cancels attack if "abouttoattack" tag is present.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst has no combat component (no nil guard before inst.components.combat:SetTarget or CancelAttack())

### `onenter (mine_recoil)`
* **Description:** Sets up recoil physics for mine action; plays recoil animation and spawns impact FX.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- event data containing target information
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor component (no nil guard before inst.components.locomotor:Stop())

### `onenter (attack_recoil)`
* **Description:** Sets up recoil physics for attack action; plays recoil animation and spawns impact FX.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- event data containing target information
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor component (no nil guard before inst.components.locomotor:Stop())

### `onenter (dig)`
* **Description:** Sets up dig action; plays dig loop animation and schedules action with sound.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dolongaction)`
* **Description:** Handles long action setup; plays build animation and schedules action at timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `timeout` -- optional timeout (default: 1 second)
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor component (no nil guard before inst.components.locomotor:Stop())

### `onenter (doshortaction)`
* **Description:** Handles short action setup; plays pickup animation and schedules action at specific frame.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor component (no nil guard before inst.components.locomotor:Stop())

### `onenter (jumpout)`
* **Description:** Starts jump-out sequence with physics and sets motor velocity.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst has no locomotor component (no nil guard before inst.components.locomotor:Stop())

## Events & listeners
**Listens to:**
- `locomote` -- handled by `CommonHandlers.OnLocomote` to manage movement states
- `death` -- handled by `CommonHandlers.OnDeath` to transition to death state
- `attacked` -- transitions to "disappear" state if not dead or invincible
- `doattack` -- transitions to "lunge_pre" or "attack" state based on combat range
- `dance` -- transitions to "dance" state if not busy and dance data is available