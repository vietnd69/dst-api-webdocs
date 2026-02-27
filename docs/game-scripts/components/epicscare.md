---
id: epicscare
title: Epicscare
description: Triggers a scare effect on nearby visible non-dead entities within a defined radius.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: e9d93700
---

# Epicscare

## Overview
This component enables an entity to broadcast an `epicscare` event to nearby entities within a specified radius, excluding itself, invisible entities, and dead entities. It provides configurable parameters such as search range, default scare duration, and entity filtering via inclusion/exclusion/must-have tags.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned during construction) | Reference to the owning entity instance. |
| `range` | `number` | `15` | Radius (in units) within which to find entities to scare. |
| `defaultduration` | `number` | `5` | Default duration (in seconds) for the scare effect if not overridden. |
| `scaremusttags` | `table` or `nil` | `nil` | Tags that found entities *must* have (if provided). |
| `scareexcludetags` | `table` | `{"epic", "INLIMBO"}` | Tags that, if present on an entity, exclude it from being scared. |
| `scareoneoftags` | `table` | `{"_combat", "locomotor"}` | At least one of these tags must be present on an entity to be affected. |

## Main Functions

### `SetRange(range)`
* **Description:** Updates the search radius used in `Scare` to locate entities.
* **Parameters:**  
  `range` (number) — New radius in game units.

### `SetDefaultDuration(duration)`
* **Description:** Updates the default scare duration used when `Scare` is called without a `duration` argument.
* **Parameters:**  
  `duration` (number) — New default scare duration in seconds.

### `Scare(duration)`
* **Description:** Finds all entities within `range`, filters them using `scaremusttags`, `scareexcludetags`, and `scareoneoftags`, then pushes an `epicscare` event to each qualifying entity (excluding self, invisible, and dead entities).
* **Parameters:**  
  `duration` (number, optional) — Override duration for this scare instance. If omitted, `self.defaultduration` is used.

## Events & Listeners
- **Pushed Events:**
  - `epicscare` — Sent to each qualifying entity found, with payload `{ scarer = self.inst, duration = duration }`.
- **Listeners:** None.