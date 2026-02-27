---
id: walrusbrain
title: Walrusbrain
description: Controls the decision-making logic and behavior tree for the walrus entity, managing movement, combat, following, and home-seeking behaviors.
tags: [ai, brain, walrus, movement, combat]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9f4c7428
---

# Walrusbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `WalrusBrain` is a brain component responsible for orchestrating the high-level AI behavior of the walrus entity in Don't Starve Together. It uses a behavior tree constructed from foundational `behaviours` and shared helpers (e.g., `BrainCommon`) to implement decision priorities such as fleeing from danger, returning home at night, following its leader or nearest player, eating food, and wandering. The component inherits from `Brain` and initializes a behavior tree in `OnStart`. It interacts with several components: `combat` (targeting and cooldowns), `follower` (leader tracking), `homeseeker` (home location), and `leader` (follower counting), all via standard ECS access patterns.

## Usage example

```lua
local walrus = SpawnPrefab("walrus")
if walrus ~= nil then
    walrus:AddComponent("walrusbrain")
    -- The brain automatically initializes its behavior tree on first OnStart()
    -- No further calls are typically required by modders
end
```

## Dependencies & tags

**Components used:**  
- `combat` — accessed via `inst.components.combat` to check target presence and cooldown state  
- `follower` — accessed via `inst.components.follower` to retrieve the current leader  
- `homeseeker` — accessed via `inst.components.homeseeker` to obtain the home location  
- `leader` — accessed via `inst.components.leader` to count followers and check taunt state  

**Tags:**  
- `character` — used in filtering food and flee targets  
- `monster` — used as a positive filter in `HUNTER_PARAMS` for flee targets  
- `notarget` — used to exclude invalid targets  
- `walrus` — used as a negative filter in flee target evaluation  
- `hound` — used as a negative filter in flee target evaluation  
- `edible_MEAT` — used to identify valid food items  
- `INLIMBO`, `outofreach` — used to exclude invalid food items  
- `taunt_attack` — used in home-return logic under fear  
- `flare_summoned` — used to conditionally enable leash origin as home  

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed via constructor) | The entity instance this brain controls |
| `bt` | `BehaviorTree` | `nil` | Initialized in `OnStart` with the constructed behavior tree root node |

*Note: The constructor does not define additional public properties beyond `inst` (inherited from `Brain`), which is set by the ECS during component instantiation.*

## Main functions

### `WalrusBrain:OnStart()`
* **Description:** Constructs and initializes the behavior tree root node. It arranges child behavior nodes in a `PriorityNode`, ordered by precedence: panic triggers first, then leash, runaway, home return on fear, leader-following, combat opportunities, home return at night, solo player-following, eating, face-targeting, and finally wandering.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None documented; assumes all required components are attached.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the nearest character (or monster) within `START_FACE_DIST` that is not tagged `notarget`; used by `FaceEntity` to determine a target to face.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance querying for a face target  
* **Returns:** `Entity?` — the closest valid face target or `nil`

### `KeepFaceTargetFn(inst, target)`
* **Description:** Checks whether the walrus should continue facing the given target, based on presence of `notarget` and proximity within `KEEP_FACE_DIST`.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
  - `target` (`Entity`) — the entity being faced  
* **Returns:** `boolean` — `true` if the target remains valid and within range, otherwise `false`

### `GetLeader(inst)`
* **Description:** Retrieves the current leader via `inst.components.follower:GetLeader()`, or `nil` if no follower component or leader is set.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Entity?` — the leader entity or `nil`

### `GetNoLeaderFollowTarget(inst)`
* **Description:** Finds the nearest character (or monster) within `MAX_PLAYER_STALK_DISTANCE` when the walrus has no leader, allowing solo wandering toward players.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Entity?` — nearest eligible player/monster or `nil`

### `GetHome(inst)`
* **Description:** Retrieves the home location (`inst.components.homeseeker.home`) if the component exists, otherwise `nil`.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Entity?` — home entity (e.g., campfire, base) or `nil`

### `EatFoodAction(inst)`
* **Description:** Returns a buffered `ACTIONS.EAT` action toward the nearest edible meat item within `SEE_FOOD_DIST`, provided it is on valid ground and no characters are nearby (within `RUN_START_DIST`). Excludes items owned by other entities.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Action?` — a valid buffered action or `nil`  
* **Error states:** Returns `nil` if no suitable food is found or the food is in invalid terrain/position.

### `ShouldGoHomeAtNight(inst)`
* **Description:** Returns `true` if it is currently night, the walrus has no leader, a home exists, and it has no active combat target.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `boolean` — `true` if conditions to return home are met

### `ShouldGoHomeScared(inst)`
* **Description:** Returns `true` if the walrus has the `taunt_attack` tag, has zero followers, and lacks a valid leader (i.e., it is isolated and may retreat).
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `boolean` — `true` if fear condition for home-return is met

### `GoHomeAction(inst)`
* **Description:** Returns a buffered `ACTIONS.GOHOME` action toward the walrus’s home entity, if the home is valid and exists.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Action?` — a valid buffered action or `nil`

### `GetHomeLocation(inst)`
* **Description:** Returns the positional coordinates of the home entity (`GetHome(inst):GetPosition()`), or `nil` if no home exists.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Vector3?` — 3D position of the home or `nil`

### `GetNoLeaderLeashPos(inst)`
* **Description:** Returns the home location as the leash origin only if the walrus is not summoned via flare and has no leader.
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `Vector3?` — leash origin position or `nil`

### `CanAttackNow(inst)`
* **Description:** Returns `true` if the walrus has no combat target *or* if its current attack cooldown has elapsed (`not combat:InCooldown()`).
* **Parameters:**  
  - `inst` (`Entity`) — the walrus instance  
* **Returns:** `boolean` — `true` if the walrus is allowed to begin or continue attacking

## Events & listeners

No event listeners or events are explicitly registered by this component. Behavior is driven entirely through the `PriorityNode` and `WhileNode` conditions in the behavior tree.

---