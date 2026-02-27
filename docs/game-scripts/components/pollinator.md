---
id: pollinator
title: Pollinator
description: Manages flower collection and spore-based reproduction for entities capable of pollination in DST.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 0b798f36
---

# Pollinator

## Overview  
This component enables an entity to collect nearby flowers, store them, and spawn a new flower at its location once sufficient pollination has occurred. It enforces distance- and density-based constraints to regulate flower spawning, ensuring ecological balance in the world.

## Dependencies & Tags  
- Adds the tag `"pollinator"` to the entity on construction.  
- Removes the `"pollinator"` tag when the component is removed from the entity.  
- Relies on external functionality: `TheSim:FindEntities`, `SpawnPrefab`, `GetRandomItem`, and entity properties such as `IsOnValidGround` and `Transform`.

## Properties  
| Property      | Type     | Default Value | Description                                                                 |
|---------------|----------|---------------|-----------------------------------------------------------------------------|
| `inst`        | `Entity` | `nil`         | Reference to the entity the component is attached to.                       |
| `flowers`     | `table`  | `{}`          | List of flower prefabs collected by the pollinator.                         |
| `distance`    | `number` | `5`           | Radius (in world units) used when checking flower density around the entity. |
| `maxdensity`  | `number` | `4`           | Maximum number of nearby flowers allowed for density checks.                |
| `collectcount`| `number` | `5`           | Minimum number of collected flowers required to trigger flower spawning.    |
| `target`      | `Entity?`| `nil`         | Reference to a currently targeted flower; reset to `nil` on pollination.    |

## Main Functions  
### `Pollinate(flower)`
* **Description:** Adds a valid flower to the internal `flowers` collection and clears the `target` field.  
* **Parameters:**  
  - `flower` (`Entity`): The flower entity to collect. Must pass the `CanPollinate` check.

### `CanPollinate(flower)`
* **Description:** Validates whether a given entity can be collected as a flower.  
* **Parameters:**  
  - `flower` (`Entity?`): The entity to validate. Must be non-`nil`, tagged `"flower"`, and not already in `self.flowers`.

### `HasCollectedEnough()`
* **Description:** Checks if the number of collected flowers exceeds `collectcount`.  
* **Returns:** `boolean` — `true` if more than `collectcount` flowers are stored.

### `CreateFlower()`
* **Description:** Spawns a new flower at the pollinator’s current position if sufficient flowers have been collected and the entity stands on valid ground. The internal `flowers` list is cleared after spawning.  
* **Notes:** Uses random selection from the stored flower prefabs; spawns with `planted = true`.

### `CheckFlowerDensity()`
* **Description:** Determines whether the pollinator’s surrounding area has fewer than `maxdensity` flowers within `distance` units. Used to prevent excessive local flower density.  
* **Returns:** `boolean` — `true` if density is acceptable for spawning.  
* **Implementation Details:** Uses `TheSim:FindEntities` with a fixed set of `FLOWERDENSITY_ONEOF_TAGS` (`{"FX", "NOBLOCK", "INLIMBO", "DECOR"}`).

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current pollinator state.  
* **Returns:** `string` — e.g., `"flowers: 3, cancreate: false"`.

## Events & Listeners  
None identified.