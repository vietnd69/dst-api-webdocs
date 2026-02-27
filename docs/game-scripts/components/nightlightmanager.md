---
id: nightlightmanager
title: Nightlightmanager
description: Manages the registration, tracking, and position updates of night light entities on the server.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 3a83f46a
---

# Nightlightmanager

## Overview
This component is responsible for managing night light entities on the server side of Don't Starve Together. It tracks registered night lights, updates their world positions and associated map node information, and provides utilities to query and filter them by tag or proximity.

## Dependencies & Tags
- Requires the `inst` entity to have `TheWorld.ismastersim` (i.e., runs only on the master simulation).
- Listens for the `"ms_registernightlight"` event to register new night lights.
- Adds no new tags to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `nightlights` | `table` | `{}` | Map of registered night light entities to their internal metadata tables. |

## Main Functions
### `IsNightLightDataInAnyTag(nightlightdata, tags)`
* **Description:** Checks whether any of the given `tags` are present in the `nightlightdata.node_tags` table.
* **Parameters:**
  - `nightlightdata`: Table containing metadata for a night light, including `node_tags`.
  - `tags`: Array of strings representing tag names to check.

### `GetNightLightsWithFilter(filterfn, ...)`
* **Description:** Iterates over all registered night lights and returns a list of those that satisfy the provided filter function.
* **Parameters:**
  - `filterfn`: A function taking `(nightlightmanager, nightlight, nightlightdata, ...)` and returning `true` if the night light should be included.
  - `...`: Additional arguments passed to the filter function.

### `FindClosestNightLightFromListToInst(nightlights, inst)`
* **Description:** Returns the night light in the given list that is closest (by squared distance) to the given entity instance.
* **Parameters:**
  - `nightlights`: Array of night light entity references.
  - `inst`: Entity to measure distance from.

### `UpdateNightLightPosition(nightlight)`
* **Description:** Updates the stored world position and associated map node index/tags for a given night light. Clears old node tag data if the node changes or becomes unavailable.
* **Parameters:**
  - `nightlight`: The night light entity whose position should be updated.

### `OnRegisterNightLight(nightlight)`
* **Description:** Registers a new night light entity, attaching callbacks to detect changes in its built state and platform availability. Only registers the night light if it currently has no platform (i.e., is not yet built). Also sets up cleanup when the night light is removed.
* **Parameters:**
  - `nightlight`: The night light entity to register.

## Events & Listeners
- **Listens for `"ms_registernightlight"`**: Triggers `OnRegisterNightLight_Bridge`, which forwards the event to `OnRegisterNightLight`.
- **Listens for `"onremove"`** (on registered night lights): Removes the night light from the internal tracking table.
- **Listens for `"onbuilt"`, `"entitywake"`, `"entitysleep"`**: Triggers internal position and platform state updates during registration.