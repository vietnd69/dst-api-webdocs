---
id: lavaepetbrain
title: Lavaepetbrain
description: Controls the behavior tree of the Lavae pet companion, managing hunger-driven eating, food production, following its owner, and affectionate interactions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: df9ef8ec
---

# Lavaepetbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component defines the behavior tree (`BT`) for the `Lavae` pet entity, implementing core AI logic for companionship in Don't Starve Together. It orchestrates behavior through a priority-based tree that prioritizes survival (hunger management), followed by following the owner, and finally affection-based interactions when conditions are met.

Key responsibilities include:
- Triggering panic and starvation response behaviors via `BrainCommon.PanicTrigger`
- Eating edible items from inventory or on the ground
- Producing edible food items by nuzzling eligible entities
- Following the owner within configurable distance thresholds
- Performing affectionate "nuzzles" when near the owner and sufficiently fed

The brain depends on several components: `follower` to identify the owner, `hunger` to monitor nutritional status, `inventory` for finding and managing items, `eater` for food validation, and `inventoryitem` for pickup eligibility checks.

## Dependencies & Tags

- **Components used:**
  - `follower` (`GetLeader`)
  - `hunger` (`GetPercent`)
  - `inventory` (`FindItem`)
  - `eater` (`CanEat`)
  - `inventoryitem` (`canbepickedup`)

- **Tags:**
  - `"pocketdimension_container"` (checked via `HasTag`, used to prevent following items inside containers)
  - Behavior-specific tags used for entity filtering:
    - `MAKE_FOOD_TAGS`: `"canlight"`, `"fire"`, `"smolder"`
    - `NO_MAKE_FOOD_TAGS`: `"INLIMBO"`, `"_equippable"`, `"outofreach"`, plus all `FUELTYPE` values suffixed with `"_fueled"`
    - `FINDFOOD_MUST_TAGS`: `"edible_BURNT"`, `"_inventoryitem"`
    - `FINDFOOD_CANT_TAGS`: `"INLIMBO"`, `"fire"`, `"catchable"`, `"outofreach"`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this brain controls (owned by the `Lavae` pet). |
| `bt` | `BT` | `nil` | The behavior tree instance constructed in `OnStart`. Initialized internally. |
| `MIN_FOLLOW_DIST` | `number` | `0` | Minimum distance to maintain from the owner before stopping movement. |
| `MAX_FOLLOW_DIST` | `number` | `8` | Distance beyond which the pet begins to move toward the owner. |
| `TARGET_FOLLOW_DIST` | `number` | `5` | Target distance the pet attempts to maintain from the owner. |
| `MAX_WANDER_DIST` | `number` | `3` | Maximum wander radius (not directly used in current behavior tree). |
| `FIND_FOOD_ACTION_DIST` | `number` | `12` | Radius around the pet within which food-finding actions search for entities. |

## Main Functions

### `GetOwner(inst)`
* **Description:** Retrieves the pet’s current owner (leader) by querying the `follower` component, but excludes owners that are items inside a pocket dimension container.
* **Parameters:**
  - `inst` (`Entity`): The pet entity instance.
* **Returns:** `Entity?` — The owner entity, or `nil` if no valid leader or if leader is inside a container.

### `EatFoodAction(inst)`
* **Description:** Scans the pet’s inventory for an edible item and returns an `ACTIONS.EAT` buffered action for it, if possible and not busy.
* **Parameters:**
  - `inst` (`Entity`): The pet entity instance.
* **Returns:** `BufferedAction?` — Action to eat the first edible item found, or `nil` if none available or entity is busy.

### `MakeFoodAction(inst)`
* **Description:** Finds an eligible entity in range to "nuzzle" (produce food from), and returns a buffered `ACTIONS.NUZZLE` action.
* **Parameters:**
  - `inst` (`Entity`): The pet entity instance.
* **Returns:** `BufferedAction?` — Action to nuzzle a suitable target, or `nil` if no target found or entity is busy.
* **Notes:** Targets must have tags in `MAKE_FOOD_TAGS` and lack any in `NO_MAKE_FOOD_TAGS`.

### `CanPickup(item)`
* **Description:** Validates whether an item can be picked up based on `inventoryitem.canbepickedup` and ground suitability.
* **Parameters:**
  - `item` (`Entity`): The item entity to validate.
* **Returns:** `boolean` — `true` if the item can be picked up, `false` otherwise.

### `FindFoodAction(inst)`
* **Description:** Searches for edible items in range that meet food-finding tags, validates them for pickup, and returns an `ACTIONS.PICKUP` action if found.
* **Parameters:**
  - `inst` (`Entity`): The pet entity instance.
* **Returns:** `BufferedAction?` — Action to pickup the first valid food item, or `nil` if none found or entity is busy.

### `OwnerIsClose(inst)`
* **Description:** Determines whether the owner is within a very short distance (2.5 units), indicating proximity for affection behaviors.
* **Parameters:**
  - `inst` (`Entity`): The pet entity instance.
* **Returns:** `boolean` — `true` if owner is within range, `false` otherwise.

### `LoveOwner(inst)`
* **Description:** Attempts to perform an affectionate nuzzle on the owner if conditions are met (not busy, owner is a player, hunger > 50%, and luck check passes).
* **Parameters:**
  - `inst` (`Entity`): The pet entity instance.
* **Returns:** `BufferedAction?` — Action to nuzzle the owner, or `nil` if conditions not met or entity is busy.

### `LavaePetBrain:OnStart()`
* **Description:** Initializes the behavior tree by constructing the root priority node with starvation handling, following logic, and affection behaviors.
* **Parameters:** None.
* **Returns:** `nil`.
* **Notes:** This method populates `self.bt` with a `BT` instance based on a behavior tree rooted in a priority list including panic triggers, starvation response, following, eating, facing, and affection logic.

## Events & Listeners

None identified. The brain uses synchronous actions via the behavior tree and does not register any event listeners directly.