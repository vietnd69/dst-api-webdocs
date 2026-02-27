---
id: controlminions
title: Controlminions
description: Controls minion behavior by locating nearby interactable entities and assigning buffered harvesting, picking, or pickup actions to the nearest available minion.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: e5bc79f8
---

# Controlminions

## Overview
`ControlMinions` is a behaviour node that enables an entity (typically the player or a controller) to direct minions—spawned via a `minionspawner` component—to perform specific tasks on nearby interactable entities. It operates by scanning for valid interactable objects (such as crops, stewers, dryers, or pickable items) within a calculated radius around the controller, then assigns the nearest idle minion to perform the appropriate action (e.g., `HARVEST`, `PICK`, or `PICKUP`). This behaviour integrates closely with `minionspawner` and several target components (`crop`, `stewer`, `dryer`, `pickable`, `inventoryitem`) to determine task eligibility and execution.

## Dependencies & Tags
- **Components used:**
  - `minionspawner` (`self.ms`): Provides minion list, count, and position history.
  - `crop`: Checked for `IsReadyForHarvest()`.
  - `stewer`: Checked for `IsDone()`.
  - `dryer`: Checked for `IsDone()`.
  - `pickable`: Checked for `CanBePicked()` and `caninteractwith`.
  - `inventoryitem`: Checked for `cangoincontainer`, `canbepickedup`, and `canbepickedupalive`.
- **Tags used for entity filtering:**
  - `NO_TAGS`: Entities *with any* of these tags are excluded from search: `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `irreplaceable`, `heavy`, `lureplant`, `eyeplant`, `notarget`, `noattack`, `flight`, `invisible`, `catchable`, `fire`, `eyeplant_immune`.
  - `ACT_TAGS`: Entities *must have at least one* of these tags to be considered: `_inventoryitem`, `pickable`, `donecooking`, `readyforharvest`, `dried`.

## Properties

| Property       | Type    | Default Value | Description |
|----------------|---------|---------------|-------------|
| `inst`         | `Entity`| —             | The entity instance to which this component is attached. |
| `ms`           | `MinionSpawner` component | — | Cached reference to `inst.components.minionspawner`. |
| `radius`       | `number` or `nil` | `nil` | Calculated search radius around the controller; derived from minion position history. |
| `minionrange`  | `number` | `3.5` | Maximum distance (squared threshold: `3.5^2`) from a target at which a minion can be assigned to act on it. |

## Main Functions

### `GetClosestMinion(item, minions)`
* **Description:** Identifies the nearest minion to the given `item` entity, within the configured `minionrange`. Excludes the item itself (if mistakenly included) and invalid entities.
* **Parameters:**
  - `item`: `Entity` — The target entity to measure distance from.
  - `minions`: `table` — A list (array-like) of minion entities.
* **Returns:** `Entity?` — The closest minion within range, or `nil` if none found.

### `Visit()`
* **Description:** The core behaviour logic. Determines if minions exist, calculates an appropriate search radius, scans for eligible entities, assigns buffered actions to idle minions, and updates the behaviour status (`SUCCESS`, `FAILED`, or remains `RUNNING` during state transitions).
* **Parameters:** None.
* **Returns:** None. Updates `self.status` internally.
* **Details:**
  - Starts in `READY` state; transitions to `RUNNING` only if `self.ms.numminions > 0`.
  - Computes `radius` using the most recent minion position (from `self.ms.minionpositions`) if not already set.
  - Filters entities using `TheSim:FindEntities()` with `NO_TAGS` and `ACT_TAGS`.
  - For each valid entity, checks for actionable states via component inspection:
    - `crop:IsReadyForHarvest()` → `HARVEST`
    - `stewer:IsDone()` or `dryer:IsDone()` → `HARVEST`
    - `pickable:CanBePicked()` and `caninteractwith` → `PICK`
    - `inventoryitem.cangoincontainer` and either pick-up flag → `PICKUP`
  - Assigns a `BufferedAction` to the nearest idle minion (no `busy` state tag), forces the minion to face the target, and marks `SUCCESS` only if at least one minion was assigned an action.
  - Returns `FAILED` if no minions, no valid entities, or radius couldn't be computed.

## Events & Listeners
None.