---
id: pigbrain
title: Pigbrain
description: AI behavior tree controlling pig NPC behaviors including following, trading, eating, combat, and event participation.
tags: [ai, brain, npc, behavior]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: brains
source_hash: a1fc97d5
system_scope: brain
---

# Pigbrain

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Pigbrain` defines the complete AI behavior tree for pig NPCs in Don't Starve Together. It manages daily routines including following leaders, trading with players, finding food, combat responses, and special event participation (Year of the Beast contests, minigames). The brain prioritizes survival behaviors (panic, fleeing fire) over normal activities and adapts behavior based on day/night cycles and leader presence.

## Usage example
```lua
local inst = SpawnPrefab("pigman")
local brain = require "brains/pigbrain"
RunBrain(inst, brain:new(inst))

-- Brain automatically handles:
-- Following assigned leaders
-- Trading when players approach with trade actions
-- Finding and eating food during day/night
-- Panicking from fire, monsters, or haunted entities
-- Participating in contest events when tagged
```

## Dependencies & tags
**External dependencies:**
- `behaviours/wander` -- wandering behavior node
- `behaviours/follow` -- following leader behavior node
- `behaviours/faceentity` -- facing target entity node
- `behaviours/chaseandattack` -- combat chase and attack node
- `behaviours/runaway` -- fleeing behavior node
- `behaviours/doaction` -- action execution node
- `behaviours/findlight` -- light source seeking node
- `behaviours/panic` -- panic state behavior node
- `behaviours/chattynode` -- chatter dialog during behaviors
- `behaviours/leash` -- home leash constraint node
- `brains/braincommon` -- shared brain utility functions

**Components used:**
- `trader` -- checks `IsTryingToTradeWithMe()` for trade interactions
- `inventory` -- uses `FindItem()`, `Has()`, `GetItemByName()` for item management
- `eater` -- uses `CanEat()`, `TimeSinceLastEating()`, `GetEdibleTags()` for food logic
- `edible` -- checks `foodtype` property for diet restrictions
- `follower` -- uses `GetLeader()`, `GetLoyaltyPercent()` for leader following
- `homeseeker` -- uses `GetHomePos()`, `home` property for home location
- `burnable` -- checks `IsBurning()` for fire detection on home
- `health` -- checks `takingfiredamage` property for self-fire status
- `combat` -- uses `HasTarget()`, `InCooldown()`, `TargetIs()`, `target` for combat
- `hauntable` -- checks `panic` property for ghost haunting
- `pinnable` -- checks `IsStuck()` for rescuing stuck leaders
- `minigame_spectator` -- uses `GetMinigame()` for minigame participation
- `minigame` -- accesses `gametype`, `watchdist_min`, `watchdist_target`, `watchdist_max`
- `timer` -- uses `TimerExists()` for contest panic timer
- `shelf` -- checks `itemonshelf`, `cantakeitem` for shelf food access

**Tags:**
- `outofreach` -- excluded from food finding
- `takeshelfitem` -- identifies shelf items for food finding
- `lightsource` -- identifies light sources for night behavior
- `player` -- checked for trade and runaway behavior
- `playerlight` -- checked for safe light distance calculation
- `pig` -- checked for pig-vs-pig combat avoidance
- `_combat` -- checked for pig-vs-pig combat avoidance
- `NPC_contestant` -- enables contest behavior tree branch
- `INLIMBO` -- excluded from prize collection
- `spider` -- triggers runaway behavior at night
- `minigame_participator` -- triggers runaway during minigames
- `burnt` -- checked for valid home status

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `OnStart()`
* **Description:** Initializes the pig behavior tree with prioritized nodes for survival, daily routines, and special events. Builds a `PriorityNode` root with branches for panic states, combat, trading, leader rescue, contest participation, minigame watching, and day/night cycles.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil when accessing components (no nil guard on `self.inst.components.X` calls throughout the function).

## Events & listeners
Not applicable — this brain file uses behavior tree nodes rather than direct event listeners. Events are handled through the behavior system (e.g., `ChattyNode`, `Panic`, `RunAway` nodes respond to entity state changes).