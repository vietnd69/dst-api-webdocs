---
id: malbatrossbrain
title: Malbatrossbrain
description: Controls the decision-making and behavior tree for the Malbatross entity, orchestrating combat, foraging, fleeing, and water/land transitions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7bbb5238
---

# Malbatrossbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `MalbatrossBrain` is a brain component that implements the decision-making logic for the Malbatross entity using a behavior tree. It manages core behaviors such as chasing and attacking players, fleeing and diving into water, foraging for food, attacking Ocean Trawlers, and transitioning between land and sea. It integrates with components like `combat`, `knownlocations`, `container`, and `inventoryitem` to make context-aware decisions. This component does not handle rendering or physics directly but serves as the high-level controller for the entity's dynamic behavior.

## Dependencies & Tags
- **Components used:**
  - `combat`: Calls `SetTarget`, accesses `target`, and checks combat state.
  - `knownlocations`: Calls `RememberLocation`, `GetLocation`, and `ForgetLocation` to track `home` and `spawnpoint` positions.
  - `container`: Uses `IsFull` to determine if Ocean Trawlers contain fish.
  - `inventoryitem`: Uses `IsHeld` to verify if fish items are drop-able.
- **Tags:** None explicitly added/removed by this component.

## Properties
No public properties are initialized in the constructor. The instance (`inst`) stores temporary runtime state (e.g., `staredown`, `landtimer`, `swooptask`, `willdive`, `readytoswoop`, `readytodive`, `willswoop`) as fields on `inst`, but these are not part of the component class structure.

## Main Functions

### `GetWanderPos(inst)`
* **Description:** Returns the position to use as a wandering target. Prioritizes the `"home"` location if available, otherwise falls back to `"spawnpoint"`.
* **Parameters:**  
  `inst`: The entity instance (Malbatross).
* **Returns:** A position table (or `nil` if neither location is set).

### `GetNewHome(inst)`
* **Description:** Assigns a new `"home"` location by selecting a point away from the current position using `GetWanderAwayPoint`, records it in `knownlocations`, and schedules a delayed forget task (after 30 seconds).
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `nil`.

### `GetCombatFaceTargetFn(inst)`
* **Description:** Determines whether the Malbatross should face a target for "staredown" during combat. Returns `nil` if fleeing, outside home range, or if the target is invalid (`notarget` tag).
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** A target entity or `nil`.

### `KeepCombatFaceTargetFn(inst, target)`
* **Description:** Validates continued engagement with a combat face target. Updates the combat target if a closer player approaches within `RETURNTOFIGHT_DIST`, resets `staredown`, and enforces home-range bounds.
* **Parameters:**  
  `inst`: The entity instance.  
  `target`: The current face target entity.
* **Returns:** A boolean indicating whether to keep facing (`true`) or break face (`false`).

### `GetHomePos(inst)`
* **Description:** Retrieves the `"home"` location; if missing, invokes `GetNewHome` to assign one before returning.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** A position table.

### `CheckForFleeAndDive(inst)`
* **Description:** Checks if the Malbatross should initiate a dive or swoop attack when near a combat target. Triggers `"doswoop"` or `"dosplash"` events and returns the target.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** The combat target entity (if action triggered), or `nil`.

### `GetEatAction(inst)`
* **Description:** Scans for edible ocean fish within `SEE_BAIT_DIST` that are not held and not on passable terrain. Returns a buffered `EAT` action if a valid target is found.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** A `BufferedAction` (if hungry and a valid fish is found), or `nil`.

### `LookForTrawlerAction(inst)`
* **Description:** Searches for Ocean Trawlers containing fish. If found, may trigger a `"doswoop"` or plan a `HAMMER` attack. Uses random chance to select the attack type.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** The target entity (if action planned), or `nil`.

### `ShouldLeaveLand(inst)`
* **Description:** Detects if the Malbatross has remained on land for more than 5 seconds. If so, pushes the `"depart"` event to signal re-entry into the water.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `nil`.

### `MalbatrossBrain:OnStart()`
* **Description:** Initializes the behavior tree root node, defining the priority order of behaviors (land departure, fleeing, facing, chasing, eating, attacking trawlers, wandering). Excludes actions during `"swoop"` state tag.
* **Parameters:** None.
* **Returns:** `nil`.

### `MalbatrossBrain:OnInitializationComplete()`
* **Description:** Records the spawn position as `"spawnpoint"` in `knownlocations` upon initialization.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
- **Listens to:** None.
- **Pushes:** `"doswoop"`, `"dosplash"`, `"depart"`.