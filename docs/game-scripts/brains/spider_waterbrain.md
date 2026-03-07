---
id: spider_waterbrain
title: Spider Waterbrain
description: AI brain for water spiders that prioritizes survival behaviors including fleeing, aggression, following leaders, trading, and consuming food or oceanfish while managing environmental risks.
tags: [ai, combat, navigation, feeding, boss]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 4ef3d17c
---

# Spider Waterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`SpiderWaterBrain` is a behavior tree-based AI controller for water spider entities in Don't Starve Together. It manages complex decision-making by evaluating multiple priorities including combat readiness, predator avoidance, leader following, trade interactions, and feeding behavior (both food and oceanfish). The brain uses a priority-ordered behavior tree rooted in `PriorityNode`, delegating sub-tasks to specialized behavior classes such as `ChaseAndAttack`, `Follow`, `Wander`, and custom `DoAction` wrappers. It interacts with several core components including `health`, `eater`, `follower`, `trader`, `knownlocations`, `timer`, `burnable`, and `homeseeker` to adapt its actions to game state changes.

## Usage example
This brain component is typically attached automatically via the `spider_water` prefab definition. For custom entities that need identical behavior, add the brain using the following pattern:

```lua
inst:AddComponent("spiderwaterbrain")
inst.spiderwaterbrain = inst.components.spiderwaterbrain
inst.spiderwaterbrain:OnStart()
```

Note: This brain requires the `Brain` component and related dependencies (e.g., `health`, `eater`, `follower`, etc.) to be present on the entity instance.

## Dependencies & tags
**Components used:**
- `burnable` (checks `IsBurning`)
- `childspawner` (used to validate home entity)
- `eater` (checks `CanEat`, retrieves edible tags via `GetEdibleTags`)
- `follower` (retrieves leader via `GetLeader`)
- `health` (checks `IsDead`)
- `homeseeker` (accesses `home` property)
- `inventoryitem` (checks `IsHeld`)
- `knownlocations` (manages remembered positions including "home" and "investigate")
- `timer` (checks `TimerExists` for "eat_cooldown" and "investigating")
- `trader` (checks `IsTryingToTradeWithMe`)

**Tags:** None added or removed by this brain itself. It only reads tags from related components (e.g., `edible_*` tags from `eater:GetEdibleTags()` and `oceanfish` for fish targeting).

## Properties
The constructor does not define custom instance properties beyond those inherited from `Brain`. All key state and behavior configuration is expressed through local functions and variables defined inside the `SpiderWaterBrain:OnStart` method.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TRADE_DIST` | number | `20` | Maximum linear distance for trade partner detection (squared value `TRADE_DIST_SQ = 400` used for performance). |
| `TRADE_DIST_SQ` | number | `400` | Squared trade distance, used in `FindPlayersInRangeSq` for distance comparisons. |
| `SEE_FOOD_DIST` | number | `10` | Search radius for valid food items during `EatFoodAction`. |
| `SEE_FISH_DISTANCE` | number | `15` | Search radius for valid oceanfish during `EatFishAction`. |
| `MAX_CHASE_TIME` | number | `8` | Passed to `SpringCombatMod` to influence combat duration scaling. |
| `DEF_MIN_FOLLOW_DIST`, `DEF_TARGET_FOLLOW_DIST`, `DEF_MAX_FOLLOW_DIST` | numbers | `2`, `5`, `8` | Follow distances used when `self.inst.defensive` is true. |
| `AGG_MIN_FOLLOW_DIST`, `AGG_TARGET_FOLLOW_DIST`, `AGG_MAX_FOLLOW_DIST` | numbers | `2`, `6`, `10` | Follow distances used when `self.inst.defensive` is false. |
| `MAX_WANDER_DIST` | number | `32` | Maximum wander radius from home location. |
| `_fishtarget` | Entity | `nil` | Temporary local reference to the most recently selected fish target (used by `fish_target_valid_on_action`). |

## Main functions
### `SpiderWaterBrain:OnStart()`
* **Description:** Initializes the behavior tree for the spider by constructing a `PriorityNode`-based decision tree that evaluates each sub-behavior in priority order. This function must be called once after the entity is fully initialized.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Assumes all required components (e.g., `health`, `eater`, `follower`, `trader`, `knownlocations`, `timer`, `homeseeker`, `burnable`, `childspawner`) exist and provide the expected interface. Behavior tree nodes (e.g., `ChaseAndAttack`, `Follow`, `Wander`) may fail silently or behave unexpectedly if their internal conditions are not met.

### `SpiderWaterBrain:OnInitializationComplete()`
* **Description:** Records the spider's current world position as the "home" location in `knownlocations` once initialization is finished. This is critical for home-seeking behaviors (e.g., `GoHomeAction`) to function correctly.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Fails to record home position if `knownlocations` is missing.

### Local Functions Used by Behavior Nodes

#### `GetTraderFn(inst)`
* **Description:** Locates a player within `TRADE_DIST` who is attempting to initiate a trade with the spider. Used by the `FaceEntity` behavior for trader interaction.
* **Parameters:** 
  - `inst` (Entity): The spider entity.
* **Returns:** `Entity` (the first player attempting to trade) or `nil` if none found.
* **Error states:** Returns `nil` if `trader` component is absent, no players nearby, or no active trade attempt.

#### `KeepTraderFn(inst, target)`
* **Description:** Confirms that a specific player is still attempting to trade with the spider (used by `FaceEntity` to validate target persistence).
* **Parameters:** 
  - `inst` (Entity): The spider entity.
  - `target` (Entity): The candidate trade partner.
* **Returns:** `true` if `trader` component exists and `IsTryingToTradeWithMe(target)` is `true`; otherwise `false`.
* **Error states:** Returns `false` if `trader` component is missing or player is no longer trading.

#### `GoHomeAction(inst)`
* **Description:** Constructs a buffered "GOHOME" action if the spider has a valid, non-dead, non-burning home (typically a spawners or chamber with `childspawner`).
* **Parameters:** 
  - `inst` (Entity): The spider entity.
* **Returns:** `BufferedAction` or `nil` if no valid home is found or conditions are unmet.
* **Error states:** Returns `nil` if `homeseeker` or `home` is invalid, or if `health` or `burnable` checks fail.

#### `InvestigateAction(inst)`
* **Description:** Creates an "INVESTIGATE" buffered action at a remembered location named "investigate".
* **Parameters:** 
  - `inst` (Entity): The spider entity.
* **Returns:** `BufferedAction` or `nil` if no "investigate" location is remembered.
* **Error states:** Returns `nil` if `knownlocations` is missing or location not recorded.

#### `GetLeader(inst)`
* **Description:** Helper function to retrieve the spider's current leader from the `follower` component.
* **Parameters:** 
  - `inst` (Entity): The spider entity.
* **Returns:** `Entity` (leader) or `nil` if `follower` component is absent or no leader exists.
* **Error states:** Returns `nil` if leader is not set.

#### `IsFoodValid(item, inst)`
* **Description:** Validates whether an item is acceptable food for the spider and meets environmental constraints (not held, on passable point, age threshold).
* **Parameters:** 
  - `item` (Entity): Potential food entity.
  - `inst` (Entity): The spider entity.
* **Returns:** `true` if `eater:CanEat(item)` is `true` and item passes additional validity checks; otherwise `false`.
* **Error states:** Returns `false` if item is held, too young, or fails passability checks.

#### `EatFoodAction(inst)`
* **Description:** Searches for nearby valid food and returns an "EAT" action if cooldown allows.
* **Parameters:** 
  - `inst` (Entity): The spider entity.
* **Returns:** `BufferedAction` or `nil` if no valid food is found or "eat_cooldown" timer is active.
* **Error states:** Returns `nil` if timer check or `FindEntity` fails.

#### `IsFishValid(fish)`
* **Description:** Validates that a target entity is located in ocean terrain (used for oceanfish targeting).
* **Parameters:** 
  - `fish` (Entity): Candidate fish entity.
* **Returns:** `true` if the fish's position is in ocean terrain; otherwise `false`.
* **Error states:** Always returns `false` for entities outside ocean or if `TheWorld.Map` is unavailable.

#### `EatFishAction(inst)`
* **Description:** Searches for nearby oceanfish and returns a "EAT" action if cooldown allows. The selected fish is stored in `_fishtarget`, and a custom `validfn` ensures the fish is not held by another entity.
* **Parameters:** 
  - `inst` (Entity): The spider entity.
* **Returns:** `BufferedAction` or `nil` if no valid fish found or "eat_cooldown" timer is active.
* **Error states:** Returns `nil` if timer check or `FindEntity` fails. If fish becomes held between selection and execution, `validfn` causes the action to be cancelled.

## Events & listeners
None identified. This component does not register event listeners or push events directly. It relies on the behavior tree's polling-based node evaluation cycle and component query hooks (e.g., `IsBurning`, `IsTryingToTradeWithMe`) for state updates.