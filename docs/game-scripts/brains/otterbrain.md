---
id: otterbrain
title: Otterbrain
description: AI behavior controller for the Otter character, managing foraging, looting, fishing, and home-stashing behaviors via a priority-based behavior tree.
tags: [ai, behavior, animal, inventory, home]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 1252d13c
---

# Otterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `OtterBrain` component defines the AI logic for the Otter character in Don't Starve Together. It implements a behavior tree (`BT`) that orchestrates high-priority actions like panic responses and combat, followed by secondary behaviors such as gathering food, looting containers or character inventories, fishing, harvesting kelp, and storing excess items at its home location. The brain dynamically weights its priorities based on internal states (e.g., hunger, inventory load, time of day, season) and external conditions (e.g., presence of burnable or ocean-based targets).

It leverages several components to achieve this: `homeseeker` for home location tracking, `inventory` for item management, `eater` for food validation, `locomotor` for movement, and `timer` for cooldown management. Critical behaviors like stealing or fishing are gated by ` busy` state tags and cooldown timers to prevent redundant or unsafe actions.

## Usage example

This component is not intended for direct manual instantiation by modders. It is attached to the Otter entity during prefab initialization via:

```lua
inst:AddBrain("otterbrain")
```

The brain is automatically started and stopped with the entity's state graph transitions, and its behavior tree executes in the background during simulation ticks.

## Dependencies & tags

**Components used:** `burnable`, `container`, `eater`, `edible`, `homeseeker`, `inventory`, `inventoryitem`, `knownlocations`, `locomotor`, `timer`  
**Tags added:** None identified  
**Tags checked:** `busy`, `jumping`, `INLIMBO`, `FX`, `outofreach`, `fire`, `burnt`, `playerghost`, `catchable`, `irreplaceable`, `heavy`, `spider`, `player`, `character`, `_inventory`, `_container`, `pickable`, `kelp`, `oceanfishable_creature`, `fishmeat`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_wander_dist` | number | `30` | Maximum radius around home location for wandering when not engaged in higher-priority tasks. |

## Main functions

### `GetHomeLocation(inst)`
* **Description:** Retrieves the position of the Otter's home location. It first checks if `homeseeker` is present and has a valid `home` entity; otherwise, it falls back to the known location named `"home"` stored in `knownlocations`.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A vector position (x, y, z) or `nil` if no home data is available.
* **Error states:** May return `nil` if both `homeseeker:GetHome()` and `knownlocations:GetLocation("home")` are absent or return invalid positions.

### `HasEnoughItems(inst)`
* **Description:** Determines whether the Otter's inventory is full (or overfilled), based on `TUNING.OTTER_MAX_INVENTORY_ITEMS`. Prevents picking up more items if no valid home exists to store them.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** `true` if inventory is full or home is unavailable; otherwise `false`.
* **Error states:** Returns `true` early if `homeseeker` or `homeseeker:GetHome()` is `nil`.

### `FindGroundItemAction(inst)`
* **Description:** Searches within `SEE_ITEM_DISTANCE` for a suitable item on the ground to pick up (e.g., raw food, non-meat edible). Excludes items held by others, items on the home boat, and blacklisted tags. Returns a `BufferedAction` to pick it up.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A `BufferedAction` instance or `nil` if no valid target found or cooldown/busy state active.
* **Error states:** Returns `nil` if `target` is `nil`, or if the item is already held (`isHeld == true`).

### `FindGroundFoodToEatAction(inst)`
* **Description:** Similar to `FindGroundItemAction`, but specifically targets meat-type food items (`FOODTYPE.MEAT`) suitable for immediate consumption. Adds an `"ate_recently"` cooldown timer upon success.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A `BufferedAction` instance or `nil`.
* **Error states:** Returns `nil` if no valid meat target found or item is held.

### `LootContainerFood(inst)`
* **Description:** Scans nearby closed, openable containers (`canbeopened == true`) for food items and selects one at random to steal via `ACTIONS.STEAL`. Avoids burning or already-open containers.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A `BufferedAction` instance or `nil`.
* **Error states:** Returns `nil` if no containers contain suitable food or if the container is open/burning.

### `StealCharacterFood(inst)`
* **Description:** Searches for nearby characters (`player` or `character` tags) within a short radius, scans their inventory for edible items, and attempts to steal one using `ACTIONS.STEAL`. Only targets characters on passable terrain.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A `BufferedAction` instance or `nil`.
* **Error states:** Returns `nil` if no character has edible items, or the target item is not currently held.

### `TryToPickPickables(inst)`
* **Description:** Finds the nearest kelp or other `"pickable"` entity and generates an `ACTIONS.PICK` buffered action to harvest it.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A `BufferedAction` instance or `nil`.
* **Error states:** Returns `nil` if no pickable entity is found in range or the Otter is `busy` or in cooldown.

### `GoHomeAction(inst)`
* **Description:** Generates an `ACTIONS.GOHOME` buffered action to move back to the Otter's home location.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** A `BufferedAction` instance or `nil` if home is not set.
* **Error states:** Returns `nil` if `homeseeker.home` is `nil`.

### `GetNearbyFishTarget(inst)`
* **Description:** Finds a fishable creature (`oceanfishable_creature` tag) located on the ocean surface, provided the `"fished_recently"` cooldown timer is not active.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** An entity reference or `nil`.
* **Error states:** Returns `nil` if no valid fish is in range, or the `"fished_recently"` timer is running.

### `TryToFish(inst)`
* **Description:** If a fish target is found via `GetNearbyFishTarget`, moves the Otter toward it using `locomotor:GoToEntity`.
* **Parameters:** `inst` — The Otter entity instance.
* **Returns:** `nil`. Action is performed via `locomotor` side effect.
* **Error states:** No explicit return value; behavior depends on `FindEntity` and `locomotor` success.

### `OtterBrain:OnStart()`
* **Description:** Initializes and starts the behavior tree. Registers listeners for `"onreachdestination"`, defines helper redirect functions for state checking, constructs the full priority-based behavior tree (including panic, hunger, night/winter, inventory dump, and foraging branches), and assigns it to `self.bt`.
* **Parameters:** None (instance method).
* **Returns:** `nil`.
* **Error states:** None beyond standard BT construction failures (not explicitly handled in this implementation).

### `OtterBrain:OnStop()`
* **Description:** Cleans up event listeners when the brain is stopped (e.g., entity killed, state graph changed).
* **Parameters:** None (instance method).
* **Returns:** `nil`.
* **Error states:** None.

## Events & listeners

- **Listens to:**  
  - `"onreachdestination"` — Triggers `on_reach_destination` to transition to `"toss_fish"` state if the reached destination is an ocean-dwelling creature.
- **Pushes:**  
  - None — This component does not directly fire events; it responds to them via the state graph and behavior tree.