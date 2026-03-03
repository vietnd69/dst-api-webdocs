---
id: findfarmplant
title: Findfarmplant
description: Selects a suitable farm plant for tending based on stress state and proximity, then initiates movement to it.
tags: [ai, behavior, farming]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: ai
source_hash: efc10382
system_scope: ai
---

# Findfarmplant

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FindFarmPlant` is a behavior node used in the DST AI system to locate and move toward a farm plant that meets specific criteria. It is typically part of a larger AI behavior tree, used by characters or entities that tend crops (e.g., Bee Queen or Willow's Chicken Coop AI). The node identifies a target plant within a fixed radius (`SEE_DIST = 20`) based on proximity to a dynamic follow position, tending eligibility, and desired stress state (happy or stressed). Once a valid target is found, it issues a walk action to reach the plant.

The component relies on the `farmplantstress`, `growable`, and `locomotor` components, and integrates with DST's buffered action system for locomotion control.

## Usage example
```lua
-- Example: Create a behavior task to find and move toward a stressed farm plant
local findFarmPlantNode = FindFarmPlant(inst, ACTIONS.TEND, true, nil, nil)

-- In a behavior tree:
-- myTree:ReplaceNode("find_target", findFarmPlantNode)
```

## Dependencies & tags
**Components used:** `farmplantstress`, `growable`, `locomotor`  
**Tags:** `farmplantstress` (required), `farm_plant_killjoy` (excluded)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity owning this behavior node (e.g., the character tending plants). |
| `wantsstressed` | boolean | `false` | Whether the target plant must be stressed (`stressors.happiness == true`) or happy (`false`). |
| `action` | `ACTIONS` | — | The action to perform upon reaching the target (e.g., `ACTIONS.TEND`). |
| `getfollowposfn` | function | `genericfollowposfn` | Callback returning the reference position for proximity checks; defaults to `inst:GetPosition()`. |
| `validplantfn` | function \| `nil` | `nil` | Optional custom filter function `(entity, plant) → boolean` to further validate candidate plants. |
| `planttarget` | `Entity` \| `nil` | `nil` | Publicly readable target plant selected during `PickTarget()`. |

## Main functions
### `PickTarget()`
* **Description:** Locates and assigns a suitable farm plant to `self.inst.planttarget`. Uses `FindEntity` to search within `SEE_DIST` for a plant with the required components and stress state, excluding those with the `farm_plant_killjoy` tag.
* **Parameters:** None.
* **Returns:** Nothing (modifies `self.inst.planttarget` internally).
* **Error states:** None; may leave `planttarget` as `nil` if no valid plant is found.

### `Visit()`
* **Description:** The core behavior logic executed each frame. In `READY` state, it calls `PickTarget()` and initiates locomotion toward the plant. In `RUNNING` state, it verifies the target remains valid and checks the stress condition—succeeding if the plant's stress state matches `wantsstressed`, or failing if the plant is invalid or no longer nearby.
* **Parameters:** None.
* **Returns:** Nothing (updates `self.status` to `RUNNING`, `SUCCESS`, or `FAILED`).
* **Error states:** Returns early if status is neither `READY` nor `RUNNING`. Failure conditions include: target loss, invalidity, out-of-range, invalid `validplantfn` result, non-tendable growth stage, or stress mismatch.

### `DBString()`
* **Description:** Returns a debug string identifying the current target plant, used in AI debug overlays.
* **Parameters:** None.
* **Returns:** `string` – e.g., `"Go to farmplant abigail"`.

## Events & listeners
None.
