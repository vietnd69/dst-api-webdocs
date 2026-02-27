---
id: avoidlight
title: Avoidlight
description: A behaviour node that steers an entity away from light sources by dynamically calculating避光 movement angles and coordinating locomotion.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 49248a7f
---

# Avoidlight

## Overview
The `AvoidLight` component implements a steering behaviour for entities to avoid illuminated areas. It extends `BehaviourNode` and is designed to be run as part of an entity’s behaviour tree. When active, it periodically evaluates whether the entity is in a lighted region and commands movement in the opposite direction of the nearest light source (or a random direction if no light direction is detectable). It interacts directly with the `locomotor` component to issue movement commands (`WalkInDirection`) and stop movement (`Stop`) during decision transitions.

This behaviour is typically used by light-averse entities (e.g., certain monsters, NPCs, or creatures in cave environments) to navigate away from light-emitting objects or environmental light sources.

## Dependencies & Tags
- **Components used:**  
  - `locomotor`: Calls `Stop()` and `WalkInDirection(angle)` to control entity movement.
  - `LightWatcher`: Calls `GetLightAngle()` to determine the dominant light direction.
  - `Physics`: Calls `CheckGridOffset(dx, dy)` to query grid-adjacent walkability.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behaviour controls. |
| `waiting` | `boolean` | `false` | Indicates whether the entity is currently in a "wait" phase (no movement) between direction changes. |
| `phasechangetime` | `number` | `0` | Timestamp indicating when the next phase transition (wait → move or move → wait) is allowed. |
| `waittime` | `number` | — | Set in `Wait(t)`; absolute timestamp when the current sleep period ends. |
| `angle` | `number` | — | Target angle (in degrees) for the next movement command. Set dynamically in `PickNewAngle()` or updated during `Visit()`. |

## Main Functions

### `Wait(t)`
* **Description:** Schedules a sleep period for `t` seconds and initiates a sleep state via the behaviour system (inherited from `BehaviourNode`). Used to pause the behaviour’s execution temporarily.
* **Parameters:**  
  - `t` (`number`): Duration to wait, in seconds.
* **Returns:** `nil`

### `PickNewAngle()`
* **Description:** Computes a new movement angle away from the light source. It first collects cardinal directions (up/down/left/right) that are walkable using `Physics:CheckGridOffset`. If a light direction is detected via `LightWatcher:GetLightAngle()`, it selects the walkable direction *furthest* from the light (by minimizing angular difference to the opposite direction), then adds random jitter. If no light is present, it picks a random walkable direction.
* **Parameters:** None.
* **Returns:** `number` — A single angle (in degrees) representing the chosen movement direction, randomized by ±45°.

### `Visit()`
* **Description:** The core behaviour logic executed each tick while the node is running. It handles switching between two phases:  
  1. **Wait phase** — entity stops moving for a short random duration (0.2–0.45 seconds).  
  2. **Move phase** — entity orients toward the opposite direction of the light source (or a random direction), then walks at that angle for a fixed duration (0.1 seconds) before re-evaluating.  
  The transition timing is governed by `phasechangetime`.
* **Parameters:** None.
* **Returns:** `nil`  
* **Notes:**  
  - Uses `self.waiting` to toggle between states.  
  - Updates `angle` based on light direction (if available) or defaults to previously calculated value.  
  - Calls `WalkInDirection(self.angle)` every 0.1 seconds to maintain continuous avoidance motion.  

## Events & Listeners
None.