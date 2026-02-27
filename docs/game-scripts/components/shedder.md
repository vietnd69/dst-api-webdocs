---
id: shedder
title: Shedder
description: A component that periodically spawns items (e.g., shedded parts) at a fixed height above the entity and optionally applies outward physics velocity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8598794c
---

# Shedder

## Overview
The `Shedder` component manages periodic or one-time spawning of items (e.g., shedded body parts) from an entity. It supports both single and batch shedding, optionally applying physics velocity to spawned items to simulate scattering. This is typically used for creatures like Bearger that shed physical objects (e.g., fur, chitin) during seasonal transitions or other game events.

## Dependencies & Tags
- Relies on the presence of `Transform` and `Physics` components on the parent entity (`self.inst`) for position and velocity operations.
- Automatically registers a cleanup handler via `Shedder.OnRemoveFromEntity = Shedder.StopShedding`, ensuring shedding stops when the component is removed from the entity.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned by constructor) | Reference to the host entity. |
| `shedItemPrefab` | `string?` | `nil` | Prefab name of the item to spawn when shedding occurs. |
| `shedHeight` | `number` | `6.5` | Vertical (Y-axis) position offset where shed items appear. |
| `shedTask` | `GorillaTask?` | `nil` | Reference to the recurring periodic task; `nil` if shedding is inactive. |

## Main Functions

### `StartShedding(interval)`
* **Description:** Starts a recurring task that triggers shedding at a fixed time interval. Cancels any existing shedding task first.
* **Parameters:**
  - `interval` (`number?`, optional): Time in seconds between sheds. Defaults to `60`.

### `StopShedding()`
* **Description:** Cancels any active periodic shedding task and clears the task reference.

### `DoSingleShed()`
* **Description:** Spawns a single item at the entity’s current position, offset vertically by `shedHeight` and horizontally by a small random amount (±0.5 units). Returns the spawned item instance or `nil` if no item could be spawned.
* **Parameters:** None.

### `DoMultiShed(max, random)`
* **Description:** Spawns multiple items (`max` count or `random` count if `random` is `true`) using `DoSingleShed`, then applies outward physics velocity to each spawned item to scatter them radially.
* **Parameters:**
  - `max` (`number`): Maximum number of items to shed.
  - `random` (`boolean`): If `true`, the actual number of items shed is a random integer between 1 and `max`.

## Events & Listeners
- Listens to entity removal via `Shedder.OnRemoveFromEntity`, which is set to `Shedder.StopShedding` to ensure cleanup when the component is removed.