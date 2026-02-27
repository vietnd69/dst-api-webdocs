---
id: moonbutterflybrain
title: Moonbutterflybrain
description: Controls the behavior tree logic for moonbutterfly entities, managing panic responses, fleeing from threats, homing, and wandering behavior.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: de37f84d
---

# Moonbutterflybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component implements the behavior tree for moonbutterfly entities. It defines priority-based decision-making, including panic responses (e.g., from electric fences or enemies with the `scarytoprey` tag), fleeing when threats approach within `RUN_AWAY_DIST`, homing to the remembered "home" location via `Wander`, and escaping dangerous situations. The brain relies on shared behavior logic (`behaviours/` module) and external components (`knownlocations`, `skilltreeupdater`) to determine relevant state and context.

## Dependencies & Tags
- **Components used:**  
  - `knownlocations` — used to store and retrieve the "home" position via `RememberLocation` and `GetLocation`.  
  - `skilltreeupdater` — checked to determine if the `wormwood_bugs` skill is activated, which modifies flee behavior.  
- **Tags:**  
  - Checks for the `scarytoprey` tag on other entities to trigger fleeing.  
  - The brain itself does not modify tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RUN_AWAY_DIST` | number | `5` | Distance threshold (units) at which the moonbutterfly begins fleeing from a threat. |
| `STOP_RUN_AWAY_DIST` | number | `10` | Distance threshold (units) at which the moonbutterfly stops fleeing and resumes normal behavior. |
| `POLLINATE_FLOWER_DIST` | number | `10` | Not used in this version of the brain. Likely reserved for future or variant logic. |
| `SEE_FLOWER_DIST` | number | `30` | Not used in this version of the brain. |
| `MAX_WANDER_DIST` | number | `20` | Maximum radius (units) from the "home" position the moonbutterfly will wander. |
| `inst` | Entity | (inherited) | Reference to the entity this brain controls. |
| `bt` | BehaviorTree | `nil` | Behavior tree instance; initialized in `OnStart`. |

## Main Functions
### `GetHomePos(inst)`
* **Description:** Helper function that retrieves the stored "home" position for the moonbutterfly using the `knownlocations` component.
* **Parameters:**  
  - `inst` — The entity instance whose home location is queried.  
* **Returns:**  
  - `Vector` — The position stored under the key `"home"` in `inst.components.knownlocations.locations`. Returns `nil` if no home location is set.

### `ButterflyBrain:OnStart()`
* **Description:** Initializes the behavior tree for the moonbutterfly. Builds a priority-based root node containing panic, flee, and wander behaviors. The behavior tree is only active while this function is called.
* **Parameters:** None.  
* **Returns:** None.  
* **Notes:**  
  - The behavior tree root prioritizes behaviors in this order:  
    1. `BrainCommon.PanicTrigger`  
    2. `BrainCommon.ElectricFencePanicTrigger`  
    3. `RunAway` — configured to flee entities with the `scarytoprey` tag (unless `wormwood_bugs` is activated).  
    4. `Wander` — uses `GetHomePos` as the home reference and `MAX_WANDER_DIST` as the wander radius.

### `ButterflyBrain:OnInitializationComplete()`
* **Description:** Records the moonbutterfly’s current position as its "home" location. This call happens after the entity is fully spawned and initialized.
* **Parameters:** None.  
* **Returns:** None.  
* **Notes:**  
  - Calls `RememberLocation("home", position, true)` with `dont_overwrite = true`, ensuring the home position is set only once.

## Events & Listeners
None. This brain does not register or emit any events directly. It relies entirely on the behavior tree system and its integrated behaviors (e.g., `RunAway`, `Wander`) to react to world changes and triggers.