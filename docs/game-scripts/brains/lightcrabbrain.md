---
id: lightcrabbrain
title: Lightcrabbrain
description: Implements the decision-making logic for lightcrabs, prioritizing panic avoidance, food consumption, and home return over random wandering.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: cc717915
---

# Lightcrabbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `LightCrabBrain` component defines the behavior tree for lightcrab entities. It inherits from `Brain` and orchestrates high-priority reactive behaviors—including panic responses to nearby players or electric fences, food consumption when bait is present, and a fallback wander state—using a prioritized sequence of behavior nodes. It integrates with the `homeseeker` component to enable returning to a designated home location, and relies on the `eater` and `bait` components to validate edible items during foraging.

## Dependencies & Tags
- **Components used:**
  - `homeseeker` (accessed via `inst.components.homeseeker` for `home` property and `IsValid` check)
  - `eater` (accessed via `item.components.eater:CanEat(item)`)
  - `bait` (accessed via `item.components.bait` existence)
- **Tags checked:**
  - `"INLIMBO"` (excluded via `FINDFOOD_CANT_TAGS`)
  - `"outofreach"` (excluded via `FINDFOOD_CANT_TAGS`)
  - `"trapped"` (checked via `self.inst.sg:HasStateTag("trapped")`)
  - `"planted"` (excluded via direct tag check on target item)
- **Tags added/removed:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this brain controls, inherited from `Brain`. |
| `bt` | `BT` | `nil` | Behavior tree root assigned in `OnStart`. |
| `AVOID_PLAYER_DIST` | `number` | `5` | Distance threshold at which the crab initiates fleeing from a player. |
| `AVOID_PLAYER_STOP` | `number` | `9` | Distance at which fleeing ceases after initiating. |
| `SEE_BAIT_DIST` | `number` | `5` | Search radius for edible bait items. |
| `FINDFOOD_CANT_TAGS` | `table` | `{ "INLIMBO", "outofreach" }` | Tags that disqualify entities from being considered as food targets. |
| `WANDER_TIMING` | `table` | `{ minwaittime = 10, randwaittime = 10 }` | Timing parameters for the wander behavior (min wait + random offset). |

## Main Functions
### `GoHomeAction(inst)`
* **Description:** Constructs a `BufferedAction` that triggers `ACTIONS.GOHOME` on the home location if the home exists, is valid, and the crab is not currently trapped.
* **Parameters:**
  - `inst` (`Entity`): The lightcrab instance requesting the action.
* **Returns:** A `BufferedAction` object or `nil` if conditions are unmet.

### `EatFoodAction(inst)`
* **Description:** Searches for the nearest entity within `SEE_BAIT_DIST` that is edible (`eater:CanEat`), has a `bait` component, is not planted, is on a passable point, and resides on the same platform. Returns a buffered eat action if such an item is found.
* **Parameters:**
  - `inst` (`Entity`): The lightcrab instance requesting the action.
* **Returns:** A `BufferedAction` for `ACTIONS.EAT` with a `validfn` check against limbo state, or `nil`.

### `LightCrabBrain:OnStart()`
* **Description:** Initializes the behavior tree with a priority-based sequence of nodes. The root prioritizes:
  1. Immediate response while in a `"jumping"` state (standby).
  2. Panic triggers for nearby players and electric fences (via `BrainCommon`).
  3. Runaway behavior (`RunAway`) when within `AVOID_PLAYER_DIST`.
  4. Eating bait (`DoAction` with `EatFoodAction`).
  5. Default wandering behavior (`Wander`).
* **Parameters:** None.
* **Returns:** None. Assigns `self.bt` to a `BT` instance using the constructed root node.

## Events & Listeners
None identified.