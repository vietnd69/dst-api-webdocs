---
id: stageusher
title: Stageusher
description: Manages the stageusher entity, a large shadowy boss that alternates between standing (attacking) and sitting (repairing) states, using shadow hands and arms to pursue and damage players.
tags: [combat, boss, shadow, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9655e957
system_scope: entity
---

# Stageusher

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stageusher` is a boss entity prefab that implements a hybrid working/combat behavior. It begins in a "sitting" state where it regenerates health and resets work progress when damaged by players. When the player attempts to work on it (e.g., with a hammer), it switches to a "standing" state and becomes combat-capable, attacking players with shadow hands. It uses the `workable`, `health`, `combat`, and `burnable` components, and coordinates with an external brain (`stageusherbrain`) to orchestrate its behavior.

## Usage example
```lua
local inst = Prefab("stageusher")
inst:AddComponent("stageusher")
-- The stageusher prefab is self-contained and should be created via Prefab("stageusher", ...)
-- Its state is controlled internally via events and component interactions.
-- Typical usage is via the game's world generation and boss spawner logic.
```

## Dependencies & tags
**Components used:** `burnable`, `locomotor`, `inspectable`, `knownlocations`, `workable`, `health`, `combat`, `sanityaura`, `stretcher`, `updatelooper`  
**Tags added by prefab:** `antlion_sinkhole_blocker`, `electricdamageimmune`, `notarget`, `notraptrigger`, `stageusher`, `shadow_aligned`, `NOCLICK`, `FX`, `shadowhand`, `ignorewalkableplatforms`, `flying`, `ghost`, `playerghost`, `player` (context-dependent, via targets)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_is_standing` | boolean | `false` | Tracks whether the stageusher is in the standing (combat) state. |
| `_giveup_timer` | Task | `nil` | Task that triggers combat give-up if no damage occurs within `TUNING.STAGEUSHER_GIVEUP_TIME`. |
| `_target` | Entity or `nil` | `nil` | Target currently being pursued by shadow hands. |
| `_arms` | table or `nil` | `nil` | List of active shadow arms attached to the stageusher. |
| `_on_hand_removed` | function or `nil` | `nil` | Listener callback attached to shadow hands. |
| `_on_owner_removed` | function or `nil` | `nil` | Listener for shadow hand owner removal. |
| `_on_target_removed` | function or `nil` | `nil` | Listener for shadow hand target removal. |
| `IsStanding` | function | `nil` | Reference to `IsStanding` function for external queries. |
| `ChangeStanding` | function | `nil` | Reference to `ChangeStanding` function to toggle states. |
| `StartAttackingTarget` | function | `nil` | Reference to `StartAttackingTarget` function to launch shadow hands. |
| `OnSave` | function | `nil` | Save callback. |
| `OnLoad` | function | `nil` | Load callback. |

## Main functions
### `IsStanding(inst)`
* **Description:** Returns whether the stageusher is currently in the standing state.
* **Parameters:** `inst` (Entity) — the stageusher instance.
* **Returns:** `boolean` — `true` if standing, `false` if sitting.

### `ChangeStanding(inst, new_standing)`
* **Description:** Toggles the stageusher between standing (combat) and sitting (repairing) states. Switches physics collision, enables/disables combat, and resets health and work when sitting.
* **Parameters:** 
  * `inst` (Entity) — the stageusher instance.
  * `new_standing` (boolean or `nil`) — if provided, the target state; if `nil`, toggles from current state.
* **Returns:** Nothing.

### `StartAttackingTarget(inst, target)`
* **Description:** Spawns and configures a shadow hand to chase and damage the given target. Returns `false` if target is invalid or missing.
* **Parameters:** 
  * `inst` (Entity) — the stageusher instance.
  * `target` (Entity or `nil`) — the entity to attack.
* **Returns:** `boolean` — `true` if the hand was spawned, `false` otherwise.

### `SetCreepTarget(inst, target)`
* **Description:** (Shadow hand method) Starts a creeping behavior toward the target, spawns a shadow arm to follow, and begins tracking for damage targets.
* **Parameters:** 
  * `inst` (Entity) — the shadow hand instance.
  * `target` (Entity) — the entity to creep toward.
* **Returns:** Nothing.

### `SetOwner(inst, owner)`
* **Description:** (Shadow hand method) Associates the hand with an owner and sets a listener to remove the hand if the owner is removed.
* **Parameters:** 
  * `inst` (Entity) — the shadow hand instance.
  * `owner` (Entity) — the stageusher or other entity controlling this hand.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `newcombattarget` — on stageusher: starts `_giveup_timer` and pushes `standup` event to change state to standing.
  - `droppedtarget` — on stageusher: cancels `_giveup_timer`.
  - `attacked` — on stageusher: restarts `_giveup_timer` if health > min health.
  - `onremove` — on stageusher: attached to shadow hand to trigger `handfinished` event.
  - `onremove` — on shadow hand: attached to owner and target to trigger removal.
  - `onremove` — on shadow arm: attached to stageusher to trigger removal.
  - `animover` — on shadow hand: triggers hand removal after "grab" animation completes.
- **Pushes:**
  - `standup` — on stageusher: notifies state change to standing when a new combat target is acquired.
  - `handfinished` — on stageusher: fired when a shadow hand is removed.
  - `giveuptarget` — via `combat:GiveUp()`.