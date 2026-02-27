---
id: eyeofterror_minibrain
title: Eyeofterror Minibrain
description: Controls the behavior tree for the Eye of Terror enemy, orchestrating movement, targeting, and feeding logic using priority-based state management.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: c2a19656
---

# Eyeofterror Minibrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `EyeOfTerrorMiniBrain` is a mini-brain component responsible for governing the behavior of the Eye of Terror enemy entity. It implements a hierarchical behavior tree (`BT`) that prioritizes responses to environmental and combat threats, including panic triggers (electric fences), wall attacks, enemy chasing and combat, food acquisition, and wandering back to a remembered spawn point. This component adheres to DST's Entity Component System and extends the base `Brain` class, relying on components like `eater` and `knownlocations` to make decisions and interact with the world.

## Dependencies & Tags
- **Components used:**
  - `eater`: Used to determine edible entities via `inst.components.eater:CanEat()`.
  - `knownlocations`: Used to store and retrieve the spawn point location via `inst.components.knownlocations:RememberLocation()` and `inst.components.knownlocations:GetLocation()`.
- **Tags checked/used:**
  - `"busy"`: Checked to prevent action initiation during non-interruptible states (`inst.sg:HasStateTag("busy")`).
  - `"outofreach"`: Used in search filtering to exclude unreachable food items.
  - `"INLIMBO"`: Excluded from valid food candidates (typically indicates non-solid or non-spawned states).

## Properties
No public instance properties are initialized in the constructor beyond those inherited from `Brain`. The only constants defined are:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FOOD_DISTANCE` | number | `20` | Maximum radius (in units) within which the Eye of Terror scans for edible items. |
| `EATFOOD_CANT_TAGS` | table | `{ "outofreach", "INLIMBO" }` | List of entity tags that disqualify an item from being considered edible. |

## Main Functions

### `OnStart()`
* **Description:** Initializes the behavior tree upon activation. Constructs a priority-based root node that evaluates conditions in order of urgency. The tree first checks if the entity is *not* in a "charge" state before proceeding to evaluate lower-priority behaviors such as panic avoidance, wall attacks, enemy targeting, food consumption, and wandering.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` to an instance of `BT` initialized with the constructed root node.

### `OnInitializationComplete()`
* **Description:** Records the entity's current spawn position (`x`, `z` with `y` clamped to `0`) under the name `"spawnpoint"` in the `knownlocations` component. The `dont_overwrite` flag ensures the location is only set once and not overwritten later.
* **Parameters:** None.
* **Returns:** None.

### `EatFoodAction(inst)`
* **Description:** A helper action function that locates and returns a buffered action to eat a nearby edible item, provided the entity is not currently busy and the item meets viability criteria (edible and on a passable point). This function is invoked by the `DoAction` behavior node.
* **Parameters:**
  - `inst`: The entity instance attempting to find food (type: `entity`).
* **Returns:** `BufferedAction` if a valid food item is found and the entity is not busy; otherwise `nil`.

### `GetSpawnPoint(inst)`
* **Description:** Retrieves the remembered spawn point location from the `knownlocations` component using the key `"spawnpoint"`. Used by the `Wander` behavior to guide motion back toward this area.
* **Parameters:**
  - `inst`: The entity instance (type: `entity`).
* **Returns:** `Vector3` (or `nil` if no spawn point is stored), representing the spawn position with `y` normalized to `0` during storage.

## Events & Listeners
None. This component does not directly register or fire events. Behavior triggers rely on the state graph (`self.inst.sg:HasStateTag()`) and the active behavior tree evaluation cycle.