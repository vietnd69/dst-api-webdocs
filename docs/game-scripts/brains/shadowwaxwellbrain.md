---
id: shadowwaxwellbrain
title: Shadowwaxwellbrain
description: Controls AI behavior for Shadow Waxwell minions (e.g., shadowworker, shadowprotector, shadowduelist) by managing priority-based behavior trees focused on following, dancing, avoiding danger, performing work, and combat.
tags: [ai, brain, boss, minion, combat]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 4e15b5e9
---

# Shadowwaxwellbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`ShadowWaxwellBrain` is a brain component that implements behavior-tree-based AI for Shadow Waxwell minions in Don't Starve Together. It is attached to entities such as `shadowworker`, `shadowprotector`, and `shadowduelist`, and determines how these minions respond to dynamic conditions such as proximity to the leader (Shadow Waxwell), ongoing minigames, nearby threats (e.g., explosions, hostile entities), and designated work targets (e.g., trees, rocks, graves). The behavior is highly modular and varies by minion type using conditional logic inside the constructor.

The brain integrates with multiple components:
- `combat`: To check for active combat, cooldowns, and target validity.
- `follower`: To identify and maintain proximity to the leader.
- `workable`, `burnable`: To select and verify valid work targets (e.g., avoid burning flora).
- `minigame_participator`, `minigame`: To respond to minigame states and crowd positions.
- `health`, `explosive`: To trigger fleeing behaviors for safety.

It relies on pre-built behavior definitions (`wander`, `chaseandattack`, `panic`, `faceentity`, `leash`, `runaway`, `standstill`) from the `behaviours/` directory and on `BrainCommon` for helper utilities.

## Usage example

This brain is typically added automatically by the game when spawning Shadow Waxwell minions; modders do not usually instantiate it manually. However, an example of typical usage (e.g., for testing or mod extension) is shown below:

```lua
local myminion = Prefabs:CreatePrefab("myminion", "myminion")
myminion:AddComponent("brain")
myminion:AddComponent("combat")
myminion:AddComponent("health")
myminion:AddComponent("follower")
myminion:AddComponent("workable")
myminion:AddComponent("burnable")
myminion:AddComponent("explosive")
myminion:AddComponent("minigame_participator")

myminion.brain = ShadowWaxwellBrain(myminion)
myminion.brain:OnStart()
```

## Dependencies & tags

**Components used:**
- `combat` (via `inst.components.combat`)
- `follower` (via `inst.components.follower`)
- `health` (via `inst.components.health`)
- `workable` (via `inst.components.workable`)
- `burnable` (via `inst.components.burnable`)
- `explosive` (via `inst.components.explosive`)
- `minigame_participator` (via `inst.components.minigame_participator`)
- `minigame` (via `components.minigame`)

**Tags added/removed:** None directly. Tags used conditionally for selection:
- `stump`, `grave`, `farm_debris` (for dig actions)
- `CHOP_workable`, `MINE_workable`, `DIG_workable` (work target filtering)
- `fire`, `smolder`, `event_trigger`, `waxedplant`, `INLIMBO`, `NOCLICK`, `carnivalgame_part` (excluded from work targets)
- `shadowcreature`, `nightmarecreature`, `stalker`, `monster`, `hostile`, `player`, `companion`, `spiderden` (for threat evaluation)
- `prechop`, `premine`, `predig` (stategraph tags checked for repeating work actions)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this brain controls. Inherited from `Brain._ctor`. |
| `bt` | `BT` (Behavior Tree) | `nil` (set in `OnStart`) | The active behavior tree; assigned after `OnStart` completes. |

## Main functions

### `ShadowWaxwellBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) based on `self.inst.prefab`. Constructs a root `PriorityNode` hierarchy with conditional and priority-based branches for different minion types (worker, protector, fallback). Priorities include: dancing, minigame watching, explosion/danger avoidance, combat work (workers), and chasing/attacking (protectors/duelists).
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented. May fail silently if required components (e.g., `combat`, `follower`) are missing or the prefab is unsupported.

### `ShadowWaxwellBrain:OnInitializationComplete()`
* **Description:** Saves the spawn point if `inst.SaveSpawnPoint` exists. Prevents overwriting existing spawn data.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented.

## Helper Functions (Internal, Not Part of the API)

The following local functions are used internally by `OnStart` but are not called directly by external code. They are included for context:

- `GetLeader(inst)`, `GetLeaderPos(inst)` — retrieve the leader entity (via `follower`) and its position.
- `GetFaceTargetFn(inst)`, `KeepFaceTargetFn(inst, target)` — determine and verify a nearby player to face.
- `GetFaceLeaderFn(inst)`, `KeepFaceLeaderFn(inst, target)` — determine and verify the leader to face.
- `IsNearLeader(inst, dist)` — checks if leader is within distance `dist`.
- `FindEntityToWorkAction(inst, action, addtltags)` — *(deprecated)* finds a valid work target for `action`.
- `FindAnyEntityToWorkActionsOn(inst, ignorethese)` — preferred version; returns a `BufferedAction` for any valid work (CHOP/MINE/DIG).
- `DanceParty(inst)` — pushes `"dance"` event to trigger dancing animation.
- `ShouldDanceParty(inst)` — checks if leader is dancing (`"dancing"` state tag).
- `ShouldAvoidExplosive(target)` — ensures target is either non-explosive or already burning/smoldering.
- `ShouldRunAway(target, inst)` — determines if target is a lethal or hostile entity.
- `ShouldKite(target, inst)` — returns true if kiting is appropriate (e.g., combat active and target is valid and alive).
- `ShouldWatchMinigame(inst)` — checks if a minigame is active and the minion’s combat target is either nil or also a minigame participator.
- `WatchingMinigame(inst)` — returns the minigame instance if participating.
- `WatchingMinigame_MinDist/TargetDist/MaxDist(inst)` — return distance thresholds from `minigame.watchdist_*`.
- `CreateWanderer(self, maxdist)` — returns a `Wander` behavior node.
- `CreateIdleOblivion(self, delay, range)` — returns a `LoopNode` that triggers `"seekoblivion"` if leader moves too far from spawn.
- `IsLeaderInCombat(leader)` — checks if leader recently attacked or was damaged (within `COMBAT_TIMEOUT`).
- `FilterAnyWorkableTargets(targets, ignorethese, leader, worker)` — filters and prioritizes work targets, ignoring those currently reserved or burning.
- `PickValidActionFrom(target)` — returns the matching action (`ACTIONS.CHOP`, `MINE`, or `DIG`) for a workable target.

## Events & listeners

This component itself does not register event listeners directly via `inst:ListenForEvent`. Instead, it embeds event-driven behavior in stategraph-interfacing actions (e.g., `DanceParty` pushes `"dance"` via `inst:PushEvent`). However, the following events are referenced in behavior logic:

- **Pushes:**
  - `"dance"` — triggered by `DanceParty(inst)` when leader is dancing.
  - `"seekoblivion"` — triggered by `CreateIdleOblivion` when leader exceeds the spawn radius.
  - `"follow"` (via `Follow`/`Leash` behaviors — internal to behavior system).
  - `"panic"`/`"runaway"` (via `RunAway` behavior — internal to behavior system).
  - `"face"` (via `FaceEntity` behavior — internal to behavior system).

- **Listens to:** None directly. The component assumes the host entity’s stategraph and behavior-tree engine handle state transitions and reacting to game events (e.g., combat, proximity, damage).