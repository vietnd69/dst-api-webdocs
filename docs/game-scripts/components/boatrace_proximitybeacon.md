---
id: boatrace_proximitybeacon
title: Boatrace Proximitybeacon
description: Enables an entity to act as a beacon in the boat race system, executing callbacks when a race starts or finishes.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: 22d5291b
---

# Boatrace Proximitybeacon

## Overview
This component marks an entity as a "beacon" for the boat race system. Its primary responsibility is to listen for global `boatrace_start` and `boatrace_finish` events and execute specific callback functions when those events occur. It is designed to be used in conjunction with a `boatrace_proximitychecker` to identify when the beacon is within a certain range of a checker entity.

## Dependencies & Tags
- **Tags:** Adds the `boatrace_proximitybeacon` tag to the entity upon initialization. This tag is removed when the component is removed.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `boatrace_started_fn` | function | `nil` | The callback function to execute when the `boatrace_start` event is received. |
| `boatrace_finished_fn` | function | `nil` | The callback function to execute when the `boatrace_finish` event is received. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** A lifecycle method called when the component is removed from the entity. It cleans up by removing the `boatrace_proximitybeacon` tag and unregistering the event listeners.
* **Parameters:** None.

### `SetBoatraceStartedFn(fn)`
* **Description:** Sets the callback function that will be invoked when a boat race starts.
* **Parameters:**
    * `fn` (function): The function to call. It will receive the instance (`inst`) and event data (`data`) as arguments.

### `SetBoatraceFinishedFn(fn)`
* **Description:** Sets the callback function that will be invoked when a boat race finishes.
* **Parameters:**
    * `fn` (function): The function to call. It will receive the instance (`inst`), the race start beacon (`data.start`), and the winning player (`data.winner`) as arguments.

## Events & Listeners
* **`boatrace_start`**: Listens for this global event. When triggered, it executes the function assigned via `SetBoatraceStartedFn`.
* **`boatrace_finish`**: Listens for this global event. When triggered, it executes the function assigned via `SetBoatraceFinishedFn`.