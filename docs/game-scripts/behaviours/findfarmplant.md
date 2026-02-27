---
id: findfarmplant
title: Findfarmplant
description: Identifies and selects a valid tendable farm plant for an entity to approach and tend, based on stress state (stressed or unstressed) and custom validation criteria.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: efc10382
---

# Findfarmplant

## Overview
The `FindFarmPlant` component is a behaviour node used within DST’s AI behaviour tree system. Its primary responsibility is to locate and assign a suitable tendable farm plant (`planttarget`) to the owning entity for tending actions (e.g., watering, fertilizing). It evaluates nearby entities to find a farm plant that:
- Is within search radius (`SEE_DIST = 20`),
- Passes optional custom validation (`validplantfn`),
- Is in a tendable growth stage,
- Matches the desired stress state (`wantsstressed`, i.e., `happiness == true` or `false`),
- Does not possess the `farm_plant_killjoy` tag.

This component integrates with `Locomotor` to move toward the target and `FarmPlantStress`/`Growable` to validate plant suitability.

## Dependencies & Tags
- **Components used:**
  - `locomotor` — to push a buffered tend action.
  - `farmplantstress` — checked on candidate plants to verify `stressors.happiness` matches `wantsstressed`.
  - `growable` — checked on candidate plants to confirm `GetCurrentStageData().tendable` is true.
- **Tags used:**
  - Must-have tags: `"farmplantstress"`
  - Must-not-have tags: `"farm_plant_killjoy"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity (e.g., character, pigman) that owns this behaviour and will target the plant. |
| `wantsstressed` | `boolean?` | `false` | Desired stress state: `true` to target *stressed* plants, `false` to target *unstressed* (happy) plants. |
| `action` | `string?` | — | The name of the action to perform on the target (e.g., `"tend"`), used in `BufferedAction`. |
| `getfollowposfn` | `function?` | `genericfollowposfn` | A function returning the position to compare distance from; defaults to `inst:GetPosition()`. |
| `validplantfn` | `function?` | `nil` | Optional custom filter function `(inst, plant) -> boolean` to further validate candidate plants. |

## Main Functions
### `FindFarmPlant:DBString()`
* **Description:** Returns a debug-friendly string representation for behaviour tree visualization.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"Go to farmplant <planttarget>"`.

### `FindFarmPlant:Visit()`
* **Description:** Core behaviour node execution method. In `READY` state, picks a target via `PickTarget()`, then initiates movement via `Locomotor:PushAction()`. In `RUNNING` state, continuously validates whether the current `planttarget` is still valid; fails or succeeds based on plant state, validity, or stress mismatch.
* **Parameters:** None.
* **Returns:** None — modifies `self.status` (`READY` → `RUNNING` → `SUCCESS`/`FAILED`).

### `FindFarmPlant:PickTarget()`
* **Description:** Searches the world for a valid tendable farm plant using `FindEntity()`. Applies filters for tags, proximity, growth stage, stress state, and optional custom validation. Assigns the result to `self.inst.planttarget`.
* **Parameters:** None.
* **Returns:** None — sets `self.inst.planttarget` (or `nil` if none found).

## Events & Listeners
None.

## Notes
- The `validplantfn` is optional and may be used by modders to apply context-specific logic (e.g., only certain plant types).
- Stress filtering relies entirely on `plant.components.farmplantstress.stressors.happiness`, which is `true` for unstressed/happy plants and `false` for stressed plants.
- A plant lacking the `growable` component is never selected (even if tags pass), as `tendable` is required and only `Growable` provides it.
- The behaviour succeeds early if a *non-matching* stress state plant is encountered — i.e., if `wantsstressed == true` but an unstressed plant is found, the task succeeds (to avoid repeatedly targeting the same plant).