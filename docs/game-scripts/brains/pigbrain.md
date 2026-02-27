---
id: pigbrain
title: Pigbrain
description: Controls the AI behavior tree for pigs, handling movement, combat, foraging, trading, minigame spectating, and response to threats or environment.
tags: [ai, entity, combat, foraging, environment]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 187edaae
---

# Pigbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`Pigbrain` is a Brain component that defines the behavior tree for pig entities (including NPC contestant pigs). It orchestrates decision-making across multiple contexts: day/night cycles, leadership loyalty, trader interactions, minigame spectating, threat responses, and environmental navigation. The component uses behavior tree nodes (`PriorityNode`, `WhileNode`, `DoAction`, `Follow`, `ChaseAndAttack`, `RunAway`, `Wander`, `Panic`, `FindLight`, `AvoidElectricFence`) and integrates with several key components: `Combat`, `Eater`, `Follower`, `HomeSeeker`, `Inventory`, `Trader`, `Health`, `Hauntable`, `Pinnable`, and `MinigameSpectator`.

## Usage example

```lua
local inst = TheWorld:SpawnPrefab("pig")
inst:AddBrain("pigbrain")
-- The brain is automatically started when the entity is added to the world
-- It manages actions based on state such as time of day, nearby threats, and loyalty
```

## Dependencies & tags

**Components used:**
- `burnable` (IsBurning)
- `combat` (HasTarget, InCooldown, TargetIs)
- `eater` (CanEat, GetEdibleTags, TimeSinceLastEating)
- `edible` (foodtype)
- `follower` (GetLeader, GetLoyaltyPercent)
- `hauntable` (panic)
- `health` (takingfiredamage)
- `homeseeker` (home, GetHomePos)
- `inventory` (FindItem, GetItemByName, Has)
- `minigame` (gametype, watchdist_min, watchdist_target, watchdist_max)
- `minigame_spectator` (GetMinigame)
- `pinnable` (IsStuck)
- `shelf`
- `timer` (TimerExists)
- `trader` (IsTryingToTradeWithMe)

**Tags:** None explicitly added or removed by this brain. Pig entities use tags from other systems (e.g., `"player"`, `"spider"`, `"pig"`, `"NPC_contestant"`, `"CHOP_workable"`, `"lightsource"`, etc.).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.brain_noveggie` | `boolean` or `nil` | `nil` | Temporary flag set during food search to restrict diet to meat only under certain satiety conditions; cleared after search. |

## Main functions

### `FindFoodAction(inst)`
* **Description:** Determines the next food-related action for the pig: eat from inventory, take food from a shelf, or seek external food (meat only when hungry or饱食度 low). Skips if pig is busy (`"busy"` state tag), spectating a minigame, or recently ate.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `BufferedAction` if a valid action exists; `nil` otherwise.
* **Error states:** Returns `nil` if inventory or eater component missing, no food found within range, or pig recently ate (`time_since_eat <= TUNING.PIG_MIN_POOP_PERIOD * 2`).

### `FindTreeToChopAction(inst)`
* **Description:** Searches for a tree to chop if the pig is willing to help (e.g., leader is chopping or a deciduous tree monster is nearby). Prioritizes deciduous tree monsters (`prefab == "deciduoustree"`) if nearby.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `BufferedAction` targeting a tree with `"CHOP_workable"` tag; `nil` otherwise.
* **Error states:** Returns `nil` if no valid tree within `SEE_TREE_DIST`.

### `GoHomeAction(inst)`
* **Description:** Initiates action to return to home if the pig has no leader, has a valid home, and is not currently in combat.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `BufferedAction` with `ACTIONS.GOHOME` if criteria met; `nil` otherwise.
* **Error states:** Returns `nil` if no leader present, home invalid/destroyed/burning, or in combat.

### `FindDeciduousTreeMonster(inst)`
* **Description:** Searches for a deciduous tree monster (`prefab == "deciduoustree"`) within `SEE_TREE_DIST / 3`.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** Entity instance if found; `nil` otherwise.
* **Error states:** Returns `nil` if no such entity exists in range.

### `GetLeader(inst)`
* **Description:** Returns the pig’s current leader from the `follower` component.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** Entity instance or `nil`.
* **Error states:** Returns `nil` if `follower` component missing or no leader assigned.

### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the home position only if the pig has no leader.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `Vector3` position or `nil`.
* **Error states:** Returns `nil` if leader exists or home invalid.

### `GetNearestLightPos(inst)`
* **Description:** Finds the nearest light source within `SEE_LIGHT_DIST` and returns its world position.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `Vector3` position or `nil`.
* **Error states:** Returns `nil` if no light source found in range.

### `GetNearestLightRadius(inst)`
* **Description:** Returns the calculated radius of the nearest light source within `SEE_LIGHT_DIST`.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `number` (radius) or `1` if no light source found.
* **Error states:** Returns `1` if no light source found.

### `RescueLeaderAction(inst)`
* **Description:** Attempts to unpig stuck leader using `ACTIONS.UNPIN`.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if leader missing, not stuck, or leader’s `pinnable` component absent.

### `WantsToGivePlayerPigTokenAction(inst)`
* **Description:** Checks if pig wants to give its loyalty token to its leader (loyalty >= `TUNING.PIG_FULL_LOYALTY_PERCENT` and token in inventory).
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `true` or `false`.
* **Error states:** Returns `false` if leader missing, token not present, or loyalty below threshold.

### `GivePlayerPigTokenAction(inst)`
* **Description:** Attempts to drop the loyalty token to the leader using `ACTIONS.DROP`.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if leader missing or token not found.

### `CurrentContestTarget(inst)`
* **Description:** Returns the current target for NPC contestant pigs during a minigame contest.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** Entity or `inst.npc_stage`.
* **Error states:** Uses `inst.npc_stage.current_contest_target` if available.

### `GetTraderFn(inst)`
* **Description:** Scans nearby players (within `TRADE_DIST`) and returns the first one attempting to trade.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** Player entity or `nil`.
* **Error states:** Returns `nil` if no trading player in range.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the pig’s current combat target as the target to run away from (e.g., during dodge behavior).
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** Entity or `nil`.
* **Error states:** Returns `nil` if no combat target.

### `IsHomeOnFire(inst)`
* **Description:** Checks if the pig’s home is burning and within a safe distance.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** `true` or `false`.
* **Error states:** Returns `false` if home missing, non-burning, too far, or burnt.

### `WatchingMinigame(inst)`
* **Description:** Returns the minigame instance if the pig is spectating.
* **Parameters:** `inst` — The pig entity instance.
* **Returns:** Minigame entity or `nil`.
* **Error states:** Returns `nil` if `minigame_spectator` component missing or no minigame assigned.

## Events & listeners

Pigbrain does not directly register or fire events. It interacts with the `inst` entity’s `sg` (stategraph) via `inst.sg:HasStateTag("busy")`, but this is part of the `DoAction` behavior wrapper, not event registration. The behavior tree is executed within the `OnStart` method and runs continuously via the `BT` behavior tree runner.