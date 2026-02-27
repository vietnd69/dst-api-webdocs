---
id: bunnymanbrain
title: Bunnymanbrain
description: Controls the decision-making and behavior tree for the Bunnyman entity, enabling fleeing, chasing, trading, and home-seeking behaviors in response to threats, hunger, and player interactions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 0eb14219
---

# Bunnymanbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component implements the behavior tree for the Bunnyman entity (`prefabs/bunnyman.lua`). It orchestrates high-level decision-making using a priority-based behavior tree (`BT`) that dynamically responds to environmental and combat stimuli. Key behaviors include fleeing from burning homes or perceived scarers (e.g., King Spear), seeking food, returning to home when no leader is present, attempting to trade with players, and wandering when idle. The brain integrates several components—`health`, `combat`, `eater`, `follower`, `hauntable`, `burnable`, `homeseeker`, `inventory`, and `trader`—to evaluate states and execute context-sensitive actions.

## Dependencies & Tags
- **Components used:** `health`, `combat`, `eater`, `edible`, `inventory`, `inventoryitem`, `equippable`, `follower`, `hauntable`, `burnable`, `homeseeker`, `trader`, `playercontroller`
- **Tags:** 
  - Checked: `"manrabbitscarer"`, `"INLIMBO"`, `"outofreach"`, `"NOCLICK"`, `"burnt"`
  - Used in conditionals: `busy`, `"RABBIT_PANICBOSS"`, `"RABBIT_PANICHAUNT"`, `"RABBIT_PANICFIRE"`, `"RABBIT_PANICELECTRICITY"`, `"RABBIT_RETREAT"`, `"RABBIT_PANICHOUSEFIRE"`
- **Behaviors referenced:** `wander`, `follow`, `faceentity`, `chaseandattack`, `runaway`, `doaction`, `findlight`, `panic`, `chattynode`, `leash`

## Properties
No public properties are initialized directly in the constructor; this brain relies on properties defined in shared `Brain` and behavior modules.

## Main Functions

### `BunnymanBrain:OnStart()`
* **Description:** Initializes and attaches the behavior tree root node to the instance. Constructs a `PriorityNode` hierarchy that defines action priorities and evaluates state-based conditions (e.g., panic, low health, fire, acid rain). Assigns the constructed behavior tree to `self.bt`.
* **Parameters:** None.
* **Returns:** None.

### Helper Functions (used internally in the behavior tree)

#### `GetTraderFn(inst)`
* **Description:** Scans for players within `TRADE_DIST` (`20`) units who are actively attempting to trade with this Bunnyman. Returns the first matching player or `nil`.
* **Parameters:** `inst` (`Entity`). The Bunnyman entity instance.
* **Returns:** `Entity?` — the player attempting to trade, or `nil`.

#### `KeepTraderFn(inst, target)`
* **Description:** Checks whether the given `target` player is still attempting to trade with this Bunnyman.
* **Parameters:** `inst` (`Entity`), `target` (`Entity`). The Bunnyman and the player entity.
* **Returns:** `boolean` — `true` if `target` is trying to trade, otherwise `false`.

#### `FindFoodAction(inst)`
* **Description:** Prioritizes food in the Bunnyman's inventory, then falls back to searching for food within range (`SEE_FOOD_DIST = 10`). Respects hunger duration: avoids vegetables unless the Bunnyman is long since last eaten (`TimeSinceLastEating() > 4 * PIG_MIN_POOP_PERIOD`). Skips entities with `"INLIMBO"` or `"outofreach"` tags or those not on passable terrain. Returns a buffered `EAT` action.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `BufferedAction?` — action to execute, or `nil`.

#### `HasValidHome(inst)`
* **Description:** Verifies the Bunnyman has a non-`nil`, valid, non-burned, and non-burnt `homeseeker.home` entity.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean`.

#### `GetLeader(inst)`
* **Description:** Delegates to `components.follower:GetLeader()` to retrieve the leader entity, if any.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `Entity?`.

#### `GoHomeAction(inst)`
* **Description:** Returns a buffered `GOHOME` action toward `homeseeker.home` only if the Bunnyman has no leader, no combat target, and a valid home.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `BufferedAction?`.

#### `IsHomeOnFire(inst)`
* **Description:** Checks whether the home entity is within `20` units and is currently burning (`burnable:IsBurning()`).
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean`.

#### `GetHomePos(inst)`
* **Description:** Returns the world position of a valid home via `homeseeker:GetHomePos()`, or `nil` if home is invalid.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `Vector3?`.

#### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the home position only if the Bunnyman has no leader; otherwise returns `nil`.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `Vector3?`.

#### `FindNearbyScarer(inst)`
* **Description:** Locates the nearest entity tagged `"manrabbitscarer"` within `TUNING.RABBITKINGSPEAR_SCARE_RADIUS`. Skips equipped scarers held by anyone other than the Bunnyman's leader. Returns the first matching entity or `nil`.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `Entity?`.

## Events & Listeners
This brain does not register any `inst:ListenForEvent` listeners. It relies on real-time state evaluation within the behavior tree nodes (e.g., `WhileNode`, `ChattyNode`) and does not fire custom events itself.