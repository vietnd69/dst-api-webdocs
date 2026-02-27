---
id: fruitflybrain
title: Fruitflybrain
description: Controls the behavior tree for fruit fly entities, handling movement, combat, farming, and optional child summoning based on tag type.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2bb60fda
---

# Fruitflybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`FruitFlyBrain` is a brain component responsible for defining the AI behavior of fruit fly entities in `Don't Starve Together`. It uses a behavior tree (BT) to orchestrate high-level decision-making, including wandering, attacking plants, sowing weeds on soil tiles, returning home, and optionally summoning minions (for lord fruit flies). The brain integrates with components such as `combat`, `follower`, `leader`, and `knownlocations` to coordinate movement and targeting logic. It inherits from the base `Brain` class and customizes behavior based on whether the entity has the `lordfruitfly` tag.

## Dependencies & Tags

- **Components used:**
  - `combat` — to check for active targets and attack cooldowns
  - `follower` — to retrieve leader position for home navigation
  - `leader` — to determine if this entity is a leader and to prevent duplicate targeting
  - `knownlocations` — to retrieve the "home" location when no leader exists

- **Tags:**
  - `lordfruitfly` — determines extended behavior: enables child summoning, dodge, and attack staging logic.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | — | The entity instance this brain controls. |
| `self.bt` | `BT` | `nil` | Behavior tree instance, initialized in `OnStart`. |
| `inst.soiltarget` | `Entity` or `nil` | `nil` | Cached soil target for sowing weeds; set by `ShouldSowWeeds`. |
| `inst.planttarget` | `Entity` or `nil` | `nil` | Target plant for attack/farm actions (set externally by `FindFarmPlant`). |

## Main Functions

### `CanSpawnChild(inst)`
* **Description:** Determines whether the fruit fly is allowed to spawn a child. Requires sufficient age, remaining spawn quota, and an active combat target or pending plant/soil target.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `boolean` — `true` if all conditions are met for spawning a child.

### `GetFollowPos(inst)`
* **Description:** Computes the position the fruit fly should use for navigation and home return logic. Prioritizes the leader's position (via `follower`), falls back to the "home" location (via `knownlocations`), or defaults to the entity's own position.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `Vector` — The target position for follow/home behavior.

### `GetLeader(inst)`
* **Description:** Determines the effective leader of this fruit fly. If the entity itself has a `leader` component, it is considered the leader; otherwise, it returns the leader of its `follower` component.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `Entity` or `nil` — The leader entity, if any.

### `GoHomeAction(inst)`
* **Description:** Constructs a `WALKTO` action that moves the entity to its home position (via `GetFollowPos`) if no combat target is present.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `Action` or `nil` — A buffered walk action, or `nil` if there is a combat target.

### `ShouldGoHome(inst)`
* **Description:** Checks whether the entity is farther away from its home position than `GO_HOME_DIST` (30 world units). Uses squared distance to avoid `sqrt`.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `boolean` — `true` if distance exceeds threshold.

### `IsNearFollowPos(inst, soil)`
* **Description:** Checks whether a given soil entity is within `SEE_DIST` (20 world units) of the entity's home/follow position.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
  - `soil` (`Entity`): The soil entity to check.
* **Returns:** `boolean` — `true` if the soil is near the follow position.

### `SowWeedsAction(inst)`
* **Description:** Constructs a `PLANTWEED` action on the cached `soiltarget` if set.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `Action` or `nil` — A buffered plant weeds action, or `nil` if no soil target.

### `ShouldSowWeeds(inst)`
* **Description:** Searches for a suitable soil tile within `SEE_DIST` using `FindEntity`, ensuring the tile is near the home/follow position and not already targeted by another entity (via `leader:IsTargetedByOther`).
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `boolean` — `true` if a valid soil target is found.

### `ShouldTargetPlant(inst, plant)`
* **Description:** Checks whether a given plant can be safely targeted. Ensures no other entity (especially the leader) is already targeting it.
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
  - `plant` (`Entity`): The plant entity to evaluate.
* **Returns:** `boolean` — `true` if no conflict exists.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target to run away *from* (used by the `RunAway` behavior).
* **Parameters:**
  - `inst` (`Entity`): The fruit fly entity instance.
* **Returns:** `Entity` or `nil` — The combat target to avoid.

### `FruitFlyBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Configures behaviors conditionally based on the `lordfruitfly` tag:
  - Lord fruit flies get: summon child node (with `MinPeriod`), attack staging (attack/dodge phases), and dodging during cooldown.
  - Regular fruit flies get: `ChaseAndAttack` with a simple `CanTargetAndAttack` condition.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners

None identified.

---