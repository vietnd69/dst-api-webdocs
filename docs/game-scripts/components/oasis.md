---
id: oasis
title: Oasis
description: This component provides proximity-based detection and scoring logic for determining how close an entity is to the center of an oasis region in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 541db6d8
---

# Oasis

## Overview
The `Oasis` component is attached to an entity (typically a special marker or location in the world) to define a circular region representing an oasis. It enables proximity checks to determine whether another entity is within the oasis and calculates a normalized proximity level (0.0–1.0) based on distance from the boundary.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | Reference to the entity the component is attached to (the oasis center). Set in constructor. |
| `radius` | `number` | `1` | Radius of the oasis region (in units), used for proximity calculations. |

## Main Functions

### `IsEntityInOasis(ent)`
* **Description:** Checks whether the given entity `ent` is inside the oasis region (i.e., within or at the defined radius from the center entity).
* **Parameters:**  
  `ent` (`Entity`) — The entity to test.

### `GetProximityLevel(ent, range)`
* **Description:** Returns a normalized proximity level (a float in [0, 1]) indicating how close `ent` is to being *fully inside* the oasis.  
  - Returns `1` if the entity is fully within the oasis boundary (`distance ≤ radius`).  
  - Returns `0` if the entity is at or beyond `radius + range` from the center.  
  - Returns an interpolated value in between based on distance.  
  The "range" parameter defines the transition zone width beyond the oasis radius.
* **Parameters:**  
  `ent` (`Entity`) — The entity to evaluate.  
  `range` (`number`) — The distance *outside* the oasis radius over which proximity transitions smoothly from 1 to 0.

## Events & Listeners
None.