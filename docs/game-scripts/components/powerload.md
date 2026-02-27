---
id: powerload
title: Powerload
description: Manages the electrical load and idle state for entities that consume or supply power in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e9c6d378
---

# Powerload

## Overview
The `PowerLoad` component tracks and exposes the electrical load (power consumption or generation) and idle state of an entity within the game's power grid system. It serves as a simple data container for power-related attributes, used by power-generating and power-consuming devices like generators, batteries, and wiring components.

## Dependencies & Tags
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `load` | `number` | `1` | The magnitude of electrical load (positive for consumption, negative for generation). |
| `isidle` | `boolean` | `false` | Indicates whether the entity is in an idle state (e.g., inactive or off). |

## Main Functions
### `SetLoad(_load, idle)`
* **Description:** Updates the electrical load value and idle state.
* **Parameters:**
  * `_load` (`number`): The new load value.
  * `idle` (`boolean?`): If `true`, sets the entity to idle state; otherwise remains unchanged unless explicitly set.

### `GetLoad()`
* **Description:** Returns the current electrical load value.
* **Parameters:** None.

### `IsIdle()`
* **Description:** Returns whether the entity is currently in an idle state.
* **Parameters:** None.

## Events & Listeners
None identified