---
id: SGbrightmare_gestalt
title: Sgbrightmare Gestalt
description: Animation state machine for the Brightmare Gestalt entity, governing locomotion, combat attacks, emergence, death, and capture states.
tags: [stategraph, ai, boss, animation]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 02e01150
system_scope: entity
---

# Sgbrightmare Gestalt

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`SGbrightmare_gestalt` is an animation state machine attached to the gestalt prefab. It governs idle, walk, emerge, attack, death, relocation, and capture animations while reacting to engine events such as `locomote`, `doattack`, `gestaltcapturable_targeted`, and `captured`. Stategraphs are attached via `StartStateGraph(inst, "sgname")` during prefab construction, not called as utility functions. Major state categories: locomotion (idle, walk, emerge), combat (attack, guardattack), lifecycle (death, relocate, captured), and transformation (mutate_pre).

## Usage example
```lua
-- Stategraphs are attached to a prefab during construction:
inst.sg = StartStateGraph(inst, "gestalt")

-- Trigger a state from external code:
inst.sg:GoToState("attack")

-- Query state-tag membership:
if inst.sg:HasStateTag("busy") then
    return
end

-- Listen for stategraph events from a component:
inst:ListenForEvent("doattack", function(inst, data)
    -- Attack triggered
end)

-- Listen for attacked event (pushed by DoSpecialAttack):
inst:ListenForEvent("attacked", function(inst, data)
    -- Target was attacked
end)
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- shared locomotion/death state factories and common event handlers

**Components used:**
- `locomotor` -- Stop(), WantsToMoveForward() queried for movement state during transitions
- `gestaltcapturable` -- IsTargeted(), SetEnabled() to control capture availability
- `combat` -- target, StartAttack(), DropTarget(), CanTarget(), DoAttack() for attack logic
- `sanity` -- DoDelta() applied to attack targets
- `grogginess` -- AddGrogginess() applied to attack targets

**Tags:**
- `idle` -- added in idle state
- `moving` -- added in walk states (via CommonStates)
- `busy` -- added in attack/emerge/death/relocate/captured states to block other transitions
- `noattack` -- added in non-combat states to prevent attack triggering
- `attack` -- added on attack onenter
- `jumping` -- added in attack/guardattack/mutate_pre states
- `canrotate` -- added in idle/emerge/relocate states
- `hidden`, `invisible` -- added in relocating state
- `nointerrupt` -- added in captured state
- `NOCLICK` -- added in captured state to prevent player interaction

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | -- | -- | This stategraph has no file-scope local constants to document. |

## Main functions
### `onenter (idle)`
* **Description:** Stops locomotion and plays the idle animation. Sets `idle` and `canrotate` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` or `inst.AnimState` is nil (no nil guard present).

### `onenter (emerge)`
* **Description:** Stops locomotion, plays the emerge animation, and disables gestaltcapturable to prevent capture during emergence. Sets `busy`, `noattack`, and `canrotate` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor`, `inst.AnimState`, or `inst.components.gestaltcapturable` is nil (no nil guard present).

### `onexit (emerge)`
* **Description:** Re-enables gestaltcapturable after emergence completes.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.gestaltcapturable` is nil (no nil guard present).

### `onenter (death)`
* **Description:** If entity is asleep, removes it immediately. Otherwise stops locomotion, plays melt animation, sets `persists = false`, and disables gestaltcapturable. Sets `busy` and `noattack` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor`, `inst.AnimState`, or `inst.components.gestaltcapturable` is nil (no nil guard present).

### `onexit (death)`
* **Description:** Re-enables gestaltcapturable (should not be reached in normal flow).
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.gestaltcapturable` is nil (no nil guard present).

### `onenter (relocate)`
* **Description:** Stops locomotion, plays melt animation, and disables gestaltcapturable. Sets `busy`, `noattack`, and `canrotate` tags. Transitions to `relocating` state after animation completes.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor`, `inst.AnimState`, or `inst.components.gestaltcapturable` is nil (no nil guard present).

### `onexit (relocate)`
* **Description:** Re-enables gestaltcapturable only if relocation did not complete (statemem.relocating is false).
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.gestaltcapturable` is nil (no nil guard present).

### `onenter (relocating)`
* **Description:** Stops locomotion, hides the entity, disables gestaltcapturable, and sets a random timeout between 0.25 and 0.75 seconds. Sets `busy`, `noattack`, `hidden`, and `invisible` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` or `inst.components.gestaltcapturable` is nil (no nil guard present).

### `ontimeout (relocating)`
* **Description:** If `_can_despawn` is set, removes the entity. Otherwise finds a relocate point and transitions to `emerge` state, or removes entity if no valid destination found.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (relocating)`
* **Description:** Shows the entity and sets position to the stored destination if available. Otherwise re-enables gestaltcapturable.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (attack)`
* **Description:** Plays attack animation, stops locomotion, forces facing toward combat target if present, and starts attack cooldown. Sets `busy`, `noattack`, `attack`, and `jumping` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` is nil -- no nil guard before `inst.components.combat.target` access.

### `onupdate (attack)`
* **Description:** During the attack window (enable_attack flag set), finds the best attack target using `FindBestAttackTarget()`. If a target is found, applies special attack effects (sanity/grogginess damage), drops combat target, and transitions to `mutate_pre` state.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` is nil (no nil guard present before `DropTarget()` call).

### `onexit (attack)`
* **Description:** Clears motor velocity override, stops locomotion, and drops combat target if attack did not land.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.Physics`, `inst.components.locomotor`, or `inst.components.combat` is nil (no nil guard present).

### `onenter (guardattack)`
* **Description:** Plays attack animation, stops locomotion, forces facing toward combat target if present, and starts attack cooldown. Sets `busy`, `noattack`, `attack`, and `jumping` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` is nil -- no nil guard before `inst.components.combat.target` access.

### `onupdate (guardattack)`
* **Description:** During the attack window, checks if combat target is valid and within hit range. If target can be attacked, performs attack and transitions to `mutate_pre` state with speed parameter 6.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` is nil (no nil guard present before target access or method calls).

### `onexit (guardattack)`
* **Description:** Clears motor velocity override and stops locomotion.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.Physics` or `inst.components.locomotor` is nil (no nil guard present).

### `onenter (mutate_pre)`
* **Description:** Sets motor velocity override (default speed 2, or provided speed parameter), plays mutate animation, and sets `persists = false`. Sets `busy`, `noattack`, and `jumping` tags.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `speed` -- optional movement speed (default `2`)
* **Returns:** nil
* **Error states:** Errors if `inst.Physics` or `inst.AnimState` is nil (no nil guard present).

### `onenter (captured)`
* **Description:** Stops locomotion, plays melt animation at frame 1 with 2x delta time multiplier, and adds `NOCLICK` tag. Sets `busy`, `noattack`, and `nointerrupt` tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.components.locomotor` or `inst.AnimState` is nil (no nil guard present).

### `onexit (captured)`
* **Description:** Resets delta time multiplier to 1x and removes `NOCLICK` tag (should not be reached in normal flow).
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState` is nil (no nil guard present).

### `FindBestAttackTarget(inst)` (local)
* **Description:** Searches all players for the closest valid attack target within `TUNING.GESTALT_ATTACK_HIT_RANGE_SQ`. Excludes dead/ghost players and players with knockout/sleeping/bedroll/tent/waking state tags.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** Player entity or `nil` if no valid target found.
* **Error states:** Errors if `inst.Transform` is nil (no nil guard present before `GetWorldPosition()` call).

### `DoSpecialAttack(inst, target)` (local)
* **Description:** Applies sanity damage and grogginess to the target. If grogginess component exists, adds grogginess value and knockout time. Pushes `attacked` event with zero damage (special attack does not deal health damage).
* **Parameters:**
  - `inst` -- attacker entity
  - `target` -- target entity
* **Returns:** nil
* **Error states:** None -- nil guards present for sanity and grogginess components.

### `SpawnTrail(inst)` (local)
* **Description:** Spawns a `gestalt_trail` prefab at the entity's position and rotation. Skipped if `_notrail` flag is set.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if `inst.Transform` is nil (no nil guard present before `GetWorldPosition()`/`GetRotation()` calls).

## Events & listeners
- **Listens to:** `locomote` -- transitions to `walk_start` if moving and not targeted, or `walk_stop` if currently moving.
- **Listens to:** `gestaltcapturable_targeted` -- transitions to `walk_stop` if currently moving.
- **Listens to:** `doattack` -- transitions to `guardattack` (if isguard) or `attack` state if not busy.
- **Listens to:** `captured` -- interrupts any state and transitions to `captured` state.
- **Listens to:** `death` (via CommonHandlers) -- transitions to death state.
- **Pushes:** `attacked` -- fired by `DoSpecialAttack` when target has no grogginess or knockout duration is zero.