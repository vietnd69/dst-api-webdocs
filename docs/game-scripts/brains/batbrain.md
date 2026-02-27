---
id: batbrain
title: Batbrain
description: Controls the decision-making logic for bat entities, handling behaviors such as fleeing, foraging, stealing nitre, returning home, and forming teams in response to game state and internal conditions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9e27ff13
---

# Batbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`batbrain` implements the behavior tree for bat entities in Don't Starve Together. It governs core bat behaviors including fleeing from threats, wandering, chasing and attacking targets, returning to safety (e.g., a hideout or nest), and coordinating with a team leader when present. It leverages components such as `teamattacker`, `acidinfusible`, `eater`, `inventory`, `homeseeker`, `childspawner`, `hideout`, and `knownlocations` to make context-aware decisions. Behavior selection is determined by state conditions (e.g., acid infusion, day/night, team status, threat level), and the brain prioritizes actions using a hierarchical behavior tree constructed in `OnStart`.

## Dependencies & Tags
- **Components used:** `teamattacker`, `acidinfusible`, `eater`, `inventory`, `homeseeker`, `childspawner`, `hideout`, `knownlocations`, `container`, `inventoryitem`
- **Tags:** `batdestination` (used in `EscapeAction` to locate exits like sinkholes); `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `outofreach` (exclusion tags for entity searches); `playerghost`, `fire`, `burnt`, `INLIMBO`, `outofreach` (exclusion tags for steal actions); `player`, `_container` (inclusive tags for steal targets)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | N/A | The entity instance this brain controls; inherited from `Brain` base class. |
| `bt` | `BehaviorTree` | `nil` (assigned in `OnStart`) | The root behavior tree built during initialization. |
| `MAX_CHASE_TIME` | `number` | `60` | Maximum duration (in seconds) the bat will pursue a target before giving up. |
| `MAX_CHASE_DIST` | `number` | `40` | Maximum distance from the bat at which a target can be chased. |
| `SEE_FOOD_DIST` | `number` | `30` | Search radius (in world units) for food or stealable items. |
| `MAX_WANDER_DIST` | `number` | `40` | Maximum distance from home the bat will wander. |
| `NO_TAGS` | `{string}` | `{"FX", "NOCLICK", "DECOR", "INLIMBO", "outofreach"}` | List of tags excluded from general entity searches. |
| `BATDESTINATION_TAG` | `{string}` | `{"batdestination"}` | Tag used to identify valid escape destinations (e.g., sinkholes). |
| `STEALFOOD_CANT_TAGS` | `{string}` | `{"playerghost", "fire", "burnt", "INLIMBO", "outofreach"}` | Tags that disqualify entities as steal targets. |
| `STEALFOOD_ONEOF_TAGS` | `{string}` | `{"player", "_container"}` | At least one of these tags must be present on a potential steal target. |

## Main Functions
### `GoHomeAction(inst)`
* **Description:** Constructs a buffered `GOHOME` action toward the bat’s registered home location (set via `homeseeker`), if valid. Used for returning to safe zones.
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `BufferedAction?` — Returns a `BufferedAction` if the home location is valid, otherwise `nil`.

### `EscapeAction(inst)`
* **Description:** Returns an action to escape to the nearest safe location: either the home location (if in cave day) or the nearest sinkhole tagged `batdestination` (if above ground). Prioritizes `childspawner` or `hideout` components on the destination.
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `BufferedAction?` — Returns a `BufferedAction` to escape if a valid destination is found, otherwise `nil`.

### `IsFoodValid(item, inst)`
* **Description:** Validates whether a given item is edible and safe for the bat to consume. Hunger threshold is reduced (to 1 second alive) if the bat is acid-infused.
* **Parameters:**  
  `item` (`Entity`) — The potential food item.  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `boolean` — `true` if the item is at least `1` or `8` seconds old (based on infusion), lies on a passable point, and is edible; otherwise `false`.

### `EatFoodAction(inst)`
* **Description:** Prioritizes consuming held food from inventory, otherwise attempts to pick up edible items within `SEE_FOOD_DIST`. Skips if the bat is currently in a `busy` state.
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `BufferedAction?` — Returns a `BufferedAction` to `EAT` (for inventory item) or `PICKUP` (for ground item), or `nil` if no food is found or bat is busy.

### `StealNitreAction(inst)`
* **Description:** Scans nearby players and containers to locate and steal a `nitre` item, performing a buffered `STEAL` action. Only runs if not in a `busy` state.
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `BufferedAction?` — Returns a `BufferedAction` to steal `nitre`, or `nil` if no valid nitre is found.

### `LeaveFormation(inst)`
* **Description:** Instructs the bat to ignore formation constraints (if it belongs to a team), allowing it to pursue independent actions.
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:** `nil` — Modifies internal state via `teamattacker:LeaveFormation`.

### `LeaveTeam(inst)`
* **Description:** Removes the bat from its current team and notifies the team leader (if applicable).
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:** `nil` — Modifies internal state via `teamattacker:LeaveTeam`.

### `AcidBatAction(inst)`
* **Description:** Selects an action based on the bat’s current team orders: `HOLD` → `EatFoodAction`, `ATTACK` → `StealNitreAction`, or `nil` (no order) → prefer eating, then stealing. If any action is taken, the bat leaves formation.
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `BufferedAction?` — Returns the selected `BufferedAction`, or `nil` if no action is valid.

### `GetWanderPos(inst)`
* **Description:** Returns the known “home” location (used as a reference point for wandering).
* **Parameters:**  
  `inst` (`Entity`) — The bat entity instance.
* **Returns:**  
  `Vector?` — The position stored under the `"home"` key in `knownlocations`, or `nil` if unset.

### `BatBrain:OnStart()`
* **Description:** Initializes and attaches the behavior tree to the bat. Constructs a priority-based behavior tree that handles panic conditions, electric fence avoidance, acid-infused status, team coordination, daytime returns home, and leaderless wandering/escape. This is the entry point for behavior selection.
* **Parameters:** None.
* **Returns:** `nil` — Assigns `self.bt` to a new `BT` instance.

### `BatBrain:OnInitializationComplete()`
* **Description:** Registers the bat’s initial position as its “home” location in `knownlocations`, ensuring it has a reference point for future navigation (e.g., escaping or wandering).
* **Parameters:** None.
* **Returns:** `nil` — Calls `knownlocations:RememberLocation("home", ...)`. 

## Events & Listeners
- **Listens to:** `panic` — Triggers a `Panic` behavior and forces the bat to leave formation, lasting 6 seconds.
- **Pushes:** None explicitly in this file.