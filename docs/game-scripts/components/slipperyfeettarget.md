---
id: slipperyfeettarget
title: Slipperyfeettarget
description: Marks an entity as a target for slippery feet effects and defines how slipperiness is evaluated at specific positions and over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0d105353
---

# Slipperyfeettarget

## Overview
This component marks an entity as a slippery feet target and provides configurable logic to determine whether a given point is "slippery" (i.e., within the entity's influence radius or via a custom predicate), and what slip rate should be applied. It is primarily used by the Slippery Feet mod (e.g., for ice, mud, or other traversal-impacting entities) to inform the player’s movement system.

## Dependencies & Tags
- Adds the `"slipperyfeettarget"` tag to the entity upon creation.
- Removes the `"slipperyfeettarget"` tag when the component is removed from the entity (in `OnRemoveFromEntity`).
- Relies on the entity potentially having the `"Physics"` and `"Transform"` components for default behavior (e.g., radius and world position). No explicit component registration is performed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity, set in constructor. |
| `isslipperyatfeetfn` | `function` | `nil` | Optional custom function to determine if a point `(x,y,z)` is slippery. Signature: `(self_inst, x, y, z) → boolean`. |
| `ratefn` | `function` | `nil` | Optional custom function to determine the slip rate for a given target. Signature: `(self_inst, target_entity) → number`. |

## Main Functions
### `SetIsSlipperyAtPoint(fn)`
* **Description:** Assigns a custom function to determine whether a point in world space is considered slippery relative to this target. Overrides the default radius-based check.
* **Parameters:**  
  `fn` (`function?`) — A function of signature `(entity, x, y, z) → boolean`, where `(x, y, z)` are world coordinates. If `nil`, reverts to default behavior on next `IsSlipperyAtPosition` call.

### `IsSlipperyAtPosition(x, y, z)`
* **Description:** Determines whether the point `(x, y, z)` is within the slippery zone of this target. Uses the custom `isslipperyatfeetfn` if present; otherwise falls back to checking distance against the entity’s physics radius (ignoring Y/height).
* **Parameters:**  
  `x` (`number`) — World X coordinate.  
  `y` (`number`) — World Y coordinate (unused in radius check but accepted).  
  `z` (`number`) — World Z coordinate.

### `SetSlipperyRate(fn)`
* **Description:** Assigns a custom function to compute the slip rate for a given target entity (e.g., the player), allowing context-sensitive slip behavior.
* **Parameters:**  
  `fn` (`function?`) — A function of signature `(self_inst, target_entity) → number`. Return values typically represent a multiplier (e.g., `1.0` = full friction, `0.0` = no friction).

### `GetSlipperyRate(target)`
* **Description:** Returns the current slip rate for the given `target`. Uses `ratefn` if assigned; otherwise returns `1` (default non-slippery rate).
* **Parameters:**  
  `target` (`Entity`) — The entity attempting to move over this target’s slippery area.

## Events & Listeners
None.