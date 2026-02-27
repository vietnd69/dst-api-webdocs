---
id: krampusbrain
title: Krampusbrain
description: Controls the AI behavior of the Krampus entity, managing aggression, item stealing, chest looting, player avoidance, and departure logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 3f047681
---

# Krampusbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`krampusbrain.lua` defines the behavior tree for the Krampus entity in Don't Starve Together. It orchestrates Krampus's core behaviors: stealing items from players, opening treasure chests when inventory is not full, fleeing from electric fences and players under certain conditions, chasing and attacking when provoked, and exiting the world after accumulating a greed threshold of items. It integrates with standard behavior tree utilities (`behaviours/`) and brain infrastructure (`BrainCommon`) to execute complex, context-aware decision-making.

The brain relies on the `inventory` component to track carried items and make stealing/chest-looting decisions, and uses `FindEntity` to locate valid targets within perception distance.

## Dependencies & Tags
- **Components used:** `inventory`, `container`, `inventoryitem`
- **Tags used for filtering targets:**
  - For stealing: Must have tag `"_inventoryitem"`, must not have tags `"INLIMBO"`, `"catchable"`, `"fire"`, `"irreplaceable"`, `"heavy"`, `"prey"`, `"bird"`, `"outofreach"`, `"_container"`.
  - For chest looting: Must have tags `"structure"`, `"_container"`, `"HAMMER_workable"`.

## Properties
| Property     | Type    | Default Value | Description |
|--------------|---------|---------------|-------------|
| `mytarget`   | Entity  | `nil`         | The current target entity Krampus is following or avoiding. Used primarily for player tracking. |
| `greed`      | Number  | Random (2–5)  | The number of items Krampus must collect before departing. Initialized once on construction. |
| `listenerfunc` | Function | `nil`     | Callback used to clear `mytarget` when the target entity is removed. Initialized lazily in `SetTarget`. |

## Main Functions

### `CanSteal(item)`
* **Description:** Predicate function used to determine whether a given item is a valid target for Krampus to steal. The item must be pick-up-able, not near a player, and on valid ground.
* **Parameters:**
  - `item` (Entity): The candidate item entity.
* **Returns:**
  - `true` if Krampus can steal the item, otherwise `false`.

### `StealAction(inst)`
* **Description:** Returns a buffered steal action (pickup) if Krampus's inventory is not full and a valid item exists within sight range. Otherwise, returns `nil`.
* **Parameters:**
  - `inst` (Entity): The Krampus entity instance.
* **Returns:**
  - `BufferedAction` instance if a target exists, otherwise `nil`.

### `CanHammer(item)`
* **Description:** Predicate function to determine if a given entity is a valid treasure chest that Krampus can open. Must be a treasure chest, contain items, not be near a player, and be on valid ground.
* **Parameters:**
  - `item` (Entity): The candidate chest entity.
* **Returns:**
  - `true` if the chest is valid for looting, otherwise `false`.

### `EmptyChest(inst)`
* **Description:** Returns a buffered hammer action to open a treasure chest if Krampus's inventory is not full and a valid chest is found. Otherwise, returns `nil`.
* **Parameters:**
  - `inst` (Entity): The Krampus entity instance.
* **Returns:**
  - `BufferedAction` instance if a chest is found, otherwise `nil`.

### `KrampusBrain:SetTarget(target)`
* **Description:** Updates the current tracking target (typically a player). Manages removal and re-addition of the `onremove` event callback for proper cleanup when the target leaves the world. Prevents duplicate assignments.
* **Parameters:**
  - `target` (Entity or `nil`): The entity to track, or `nil` to clear the target.
* **Returns:**
  - `nil`

### `KrampusBrain:OnStop()`
* **Description:** Called when the behavior tree stops. Clears the current tracking target.
* **Parameters:** None
* **Returns:** `nil`

### `KrampusBrain:OnStart()`
* **Description:** Called when the behavior tree starts. Initializes the brain: sets initial tracking target to the player that spawned Krampus (`spawnedforplayer`), and constructs the behavior tree's root node.
* **Parameters:** None
* **Returns:** `nil`

## Events & Listeners
- **Listens to:**
  - `"onremove"`: Registered on the current `mytarget` entity to clear the reference when the target is removed from the world.
- **Pushes:** None (this brain does not directly fire custom events).