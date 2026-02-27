---
id: squidbrain
title: Squidbrain
description: Controls AI behavior for squid entities, managing movement, combat, fishing interactions, and herd coordination.
tags: [ai, combat, fishing, herd, entity]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d87a5ae2
---

# Squidbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

Squidbrain is a behavior tree-based AI controller for squid entities in Don't Starve Together. It manages a wide range of behaviors including combat (with ink-throwing), swimming, food seeking, fishing interactions (when hooked by a fishing rod), homing to herd locations, and avoidance of environmental hazards. The brain integrates with multiple components—Combat, Eater, Follower, Herd, HerdMember, HomeSeeker, KnownLocations, OceanFishable, and OceanFishingRod—to coordinate complex responses to environmental and entity-based stimuli. Behavior priority is handled through nested PriorityNode and WhileNode constructs in a behavior tree structure.

## Usage example

This brain is typically attached automatically to squid entities via their prefab definition. However, for reference, a minimal entity setup would look like:

```lua
local inst = Entity("squid")
inst:AddTag("squid")
inst:AddComponent("combat")
inst:AddComponent("eater")
inst:AddComponent("herdmember")
inst:AddComponent("knownlocations")
inst:AddComponent("oceanfishable")
inst:AddComponent("timer")

inst.brain = require("brains/squidbrain")(inst)
inst:StartBrain() -- implicitly invoked by the game when SG (StateGraph) transitions to active state
```

## Dependencies & tags

**Components used:**
- `combat`
- `eater`
- `follower`
- `herd`
- `herdmember`
- `homeseeker`
- `inventoryitem`
- `knownlocations`
- `oceanfishable`
- `oceanfishingrod`
- `timer`

**Tags:**
- Internal tags used for entity filtering:
  - `"INLIMBO"` (exclusion tag for寻 food)
  - `"outofreach"` (exclusion tag for寻 food)
  - `"oceanfish"` (tag for valid ocean fish targets)
  - `"wall"` (tag for wall detection)
  - `"pocketdimension_container"` (checked on item owner to prevent invalid food tracking)

## Properties

| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst.foodtarget` | `EntityRef` or `nil` | `nil` | Cache of the currently targeted fish for eating; used to maintain focus across behavior tree ticks. |
| `inst.bt` | `BehaviorTree` | `nil` | Behavior tree root node constructed during `OnStart()`. |
| `SEE_DIST` | `number` | `30` | Maximum distance to scan for targets (combat, walls, etc.). |
| `MIN_FOLLOW_FOOD` | `number` | `2` | Minimum food count to trigger follow behavior. |
| `MAX_FOLLOW_FOOD` | `number` | `6` | Maximum food count to trigger follow behavior. |
| `TARGET_FOLLOW_FOOD` | `number` | `4` | Target food count to approach (midpoint of min/max). |
| `MAX_CHASE_TIME` | `number` | `10` | Maximum seconds to chase target before aborting. |
| `MAX_CHASE_DIST` | `number` | `30` | Maximum distance to pursue target. |
| `WANDER_DIST` | `number` | `15` | Default wander radius for idle movement. |
| `SEE_FOOD_DIST` | `number` | `15` | Distance to scan for fish while in ocean. |
| `MAX_FISER_DIST` | `number` | `TUNING.OCEAN_FISHING.MAX_HOOK_DIST` | Max distance when pulled by fishing rod. |
| `FISHING_COMBAT_DIST` | `number` | `8` | Max distance to engage fisher when hooked. |
| `FINDFOOD_CANT_TAGS` | `table` | `{ "INLIMBO", "outofreach" }` | Tags that exclude entities from food search. |

## Main functions

### `SquidBrain:OnStart()`
* **Description:** Initializes the behavior tree with hierarchical priority logic for squid AI. Defines root-level behavior nodes including panic responses, wall avoidance, combat sequence, fishing struggle state handling, and wander/follow behaviors.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None; assumes required components exist and `self.inst` is valid.

### `EatFoodAction(inst)`
* **Description:** Finds a nearby edible item within `SEE_DIST` and returns a buffered EAT action if one is found and valid (i.e., on passable terrain and not in limbo).
* **Parameters:**
  - `inst` (`Entity`): The squid entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no valid food found, if `FindEntity` fails, or if `IsOnPassablePoint` returns `false`.

### `GetLeader(inst)`
* **Description:** Retrieves the current leader of the squid (via follower component) or `nil`.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Entity?` — leader entity or `nil`.
* **Error states:** Returns `nil` if `follower` component missing.

### `GetHome(inst)`
* **Description:** Gets the home location entity (via homeseeker component) or `nil`.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Entity?` — home location entity or `nil`.
* **Error states:** Returns `nil` if `homeseeker` component missing or no home set.

### `GetHomePos(inst)`
* **Description:** Gets the world position of the home entity.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Vector3?` — world position or `nil`.
* **Error states:** Returns `nil` if `GetHome(inst)` returns `nil`.

### `GetNoLeaderLeashPos(inst)`
* **Description:** Returns the home position *only* if the squid currently has no leader (used for leash logic).
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Vector3?` — home position or `nil`.
* **Error states:** Returns `nil` if leader exists or home is absent.

### `GetFoodTarget(inst)`
* **Description:** Retrieves or finds a valid ocean fish entity for the squid to target. Caches target in `inst.foodtarget` if valid; clears it if item becomes invalid (e.g., held by player or in pocket dimension). Prioritizes cached target.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Entity?` — fish entity or `nil`.
* **Error states:** Returns `nil` if no fish found in range and cache invalid.

### `shouldink(inst)`
* **Description:** Returns a buffered TOSS action if combat target exists and ink cooldown timer is not active (i.e., squid can throw ink).
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `BufferedAction?` — TOSS action or `nil`.
* **Error states:** Returns `nil` if no combat target or ink is on cooldown.

### `EatFishAction(inst)`
* **Description:** Finds an ocean fish within range and attempts to eat it. Sets `inst.foodtarget`, shares target info with nearby herd members via `herd.components.herd.members`, and returns a buffered EAT action with validation to prevent eating held fish.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `BufferedAction?` — EAT action or `nil`.
* **Error states:** Returns `nil` if gobble cooldown active, no fish found, or fish is held.

### `GetFisherPosition(inst)`
* **Description:** Gets the world position of the fishing rod currently attached to the squid (via oceanfishable component).
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Vector3?` — rod position or `nil`.
* **Error states:** Returns `nil` if rod not attached.

### `TargetFisherman(inst)`
* **Description:** If the squid is hooked (via oceanfishable), checks for the rod’s fisher and sets combat target if within `FISHING_COMBAT_DIST`. Always returns `false`.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `false`.
* **Error states:** None; always returns `false`, but may call `combat:SetTarget()`.

### `getdirectionFn(inst)`
* **Description:** Generates a random steering direction (±60 degrees from current facing) for wandering. Uses a cubic random factor for smoother turns.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `number` — angle in radians (converted to `DEGREES` internally).
* **Error states:** None.

### `getstruggledirectionFn(inst)`
* **Description:** Returns a random direction *away* from the fishing rod (180° offset ± ~35°) during struggle phase.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `number` — angle in radians.
* **Error states:** None.

### `gettiredoutdirectionFn(inst)`
* **Description:** Returns a random direction from the fishing rod (±120° offset) during post-struggle tired-out state.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `number` — angle in radians.
* **Error states:** None.

## Events & listeners

- **Listens to:** None explicitly; relies on stategraph transitions and periodic behavior tree evaluation.
- **Pushes:** None explicitly; behavior actions (e.g., `BufferedAction`) may internally trigger events, but no direct `PushEvent()` calls are present.