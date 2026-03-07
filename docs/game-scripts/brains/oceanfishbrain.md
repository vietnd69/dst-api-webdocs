---
id: oceanfishbrain
title: Oceanfishbrain
description: Controls the AI behavior of ocean-dwelling fish entities, including feeding, fishing hook interactions, fleeing, and wandering.
tags: [ai, ocean, fish, behavior, brain]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: a12ae8fd
---

# Oceanfishbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `OceanFishBrain` is a behavior tree-based brain component that dictates the autonomous behavior of ocean-dwelling fish entities in Don't Starve Together. It handles core interactions such as responding to fishing hooks (including struggle/tired-out states), seeking and consuming food (e.g., fishing hooks, oceantrawlers), avoiding environmental threats (e.g., oceansplashes, scary entities), and general wandering. The brain integrates closely with the `oceanfishable`, `eater`, `knownlocations`, and `herdmember` components to drive context-aware decisions.

## Usage example

This brain is typically assigned to ocean fish prefabs during entity creation. The component does not require manual calls — it is activated automatically when attached to an entity.

```lua
local inst = Entity("oceanfish")
inst:AddComponent("oceanfishable")
inst:AddComponent("eater")
inst:AddComponent("knownlocations")
inst:AddComponent("herdmember")

inst:AddBrain("oceanfishbrain")
```

The brain logic is fully self-contained within the `OnStart()` method and uses the behavior tree framework to manage state transitions.

## Dependencies & tags

**Components used:**
- `eater` — for retrieving edible tags (`GetEdibleTags`)
- `herdmember` — for checking herd status (`enabled`)
- `knownlocations` — for retrieving/remembering positions (`GetLocation`, `RememberLocation`)
- `oceanfishable` — for hook status (`GetRod`, `IsStruggling`, `UpdateStruggleState`, `stamina_def`)
- `oceanfishinghook` — for interest logic (`HasLostInterest`, `SetLostInterest`, `TestInterest`, `UpdateInterestForFishable`)
- `oceanfishingrod` — for line tension (`IsLineTensionGood`)
- `oceantrawler` — for bait availability (`GetBait`, `IsLowered`)

**Tags:**
- `oceantrawler`
- `fishinghook`
- `INLIMBO`
- `planted`
- `outofreach`
- `chum`
- `scarytooceanprey`
- `partiallyhooked`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `food_target` | `entity` or `nil` | `nil` | Reference to the current food entity the fish is targeting; reset upon invalidation or consumption. |
| `num_nibbles` | `number` | `1` | Counter tracking how many nibble attempts have been made against the current food target. |
| `leaving` | `boolean` | `false` | Flag indicating whether the fish is in the process of fleeing the area. |
| `fish_def` | `table` or `nil` | `nil` | Fish definition table containing movement/wander parameters such as `walkspeed`, `wander_seek_dist`, and `herdless_wander_dist`. |

## Main functions

### `OnStart()`
* **Description:** Initializes the behavior tree root node. Constructs a priority-based hierarchy that handles states in order of precedence: leaving, hooked (struggling/tired-out), avoiding threats, seeking food, and wandering.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnInitializationComplete()`
* **Description:** Records the fish's initial position as the `"home"` location using `knownlocations:RememberLocation()`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### Helper Functions

#### `FindFoodAction(inst)`
* **Description:** Scans the environment for valid food sources (fishinghooks, oceantrawlers, or edible items) within `SEE_LURE_OR_FOOD_DIST`. Sets `inst.food_target` if a valid target is found.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `false` (always, used as a DoAction-compatible function return).
* **Error states:** Returns early if no food found; otherwise updates `inst.food_target` and `inst.num_nibbles`.

#### `NibbleFoodAction(inst)`
* **Description:** Attempts to perform an `EAT` or `WALKTO` action on the current `food_target`. Updates hook interest (`UpdateInterestForFishable`) for fishinghooks and enforces biting probability thresholds. Increases `inst.num_nibbles`.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** A `BufferedAction` instance or `nil` (if no food target or action is unavailable).
* **Error states:** Returns `nil` if `food_target` is invalid or interest is exhausted.

#### `GetFoodTarget(inst)`
* **Description:** Validates and returns the cached `inst.food_target` if it remains valid and ocean-accessible.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `entity` or `nil`.
* **Error states:** Returns `nil` and clears `inst.food_target` if the target is invalid, in limbo, or out of ocean bounds.

#### `GetFoodTargetPos(inst)`
* **Description:** Returns the world position of the current `food_target` or `nil`.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `vector3` or `nil`.
* **Error states:** Returns `nil` if `food_target` is `nil`.

#### `GetFisherPosition(inst)`
* **Description:** Returns the position of the attached fishing rod, if any.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `vector3` or `nil`.
* **Error states:** Returns `nil` if `inst.components.oceanfishable:GetRod()` is `nil`.

#### `WanderTarget(inst)`
* **Description:** Determines the target position for wandering: `"herd_offset"` if available, otherwise `"home"`.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `vector3`.
* **Error states:** Returns `nil` if neither `"herd_offset"` nor `"home"` exists (rare, as `"home"` is set at initialization).

#### `getWanderDist(inst)`
* **Description:** Calculates the wander radius based on herd membership and fish definition.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `number`.
* **Error states:** Defaults to `16` if no herd or definition value is present.

#### `getWanderData(inst)`
* **Description:** Returns wander-specific parameters if defined in `fish_def.wander_seek_dist`.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `{wander_dist = number}` or `nil`.

#### `GetTiredoutWanderData(inst)`
* **Description:** Selects appropriate wander parameters for tired-out fish based on `fish_def.walkspeed`.
* **Parameters:** `inst` (entity) — The fish entity instance.
* **Returns:** `TIREDOUT_WANDER_DATA_FAST_MOVING` or `TIREDOUT_WANDER_DATA`.

## Events & listeners

**Listens to:**
- Internal behavior tree execution via `BufferedAction` and state-tag checking (`jumping`, etc.).
- `doleave` event is pushed during leaving behavior.
- `dobreach` event is pushed on successful `WALKTO` action during non-hook feeding.

**Pushes:**
- `"doleave"` — During fleeing sequence (via `LoopNode` in `leaving` branch).
- `"dobreach"` — When a non-hook food target is walked to successfully (via `AddSuccessAction`).

Note: The brain does not register external `inst:ListenForEvent` listeners directly; all control flow is handled by the behavior tree.