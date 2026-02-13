---
id: boatrace_proximitychecker
title: Boatrace Proximitychecker
description: Detects nearby 'boatrace_proximitybeacon' entities within a specified range after a set duration.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Boatrace Proximitychecker

## Overview
This component enables an entity to detect other entities tagged as `boatrace_proximitybeacon`. It periodically scans a defined radius for these beacons. When a beacon remains within this radius for a specified delay, it is considered "found," triggering an event on the beacon and an optional callback function. This is primarily used to manage checkpoints or objectives in the boat race event.

## Dependencies & Tags
- **Adds Tag:** `boatrace_proximitychecker`

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `proximity_check_must_flags` | `table` | `{"boatrace_proximitybeacon"}` | A table of tags that a nearby entity must have to be considered a target. |
| `range` | `number` | `TUNING.BOATRACE_DEFAULT_PROXIMITY` | The radius (in game units) within which to search for beacons. |
| `found_delay` | `number` | `1.5` | The duration (in seconds) a beacon must be continuously in range to be officially detected. |
| `stored_beacons` | `table` | `{}` | A key-value store tracking beacons currently within range and the time they were detected. |
| `on_found_beacon` | `function` | `nil` | An optional callback function that is executed when a beacon is officially detected. It receives the checker's instance and the beacon's instance as arguments. |

## Main Functions
### `OnStartRace()`
* **Description:** Begins the proximity checking process by starting a periodic task that runs every 5 frames. This task is responsible for finding and validating nearby beacons.
* **Parameters:** None.

### `OnFinishRace()`
* **Description:** Stops the proximity checking task and clears all internal data about tracked beacons. This should be called when the race or event concludes.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** A cleanup function that removes the `boatrace_proximitychecker` tag from the entity when the component is removed.
* **Parameters:** None.

## Events & Listeners
This component pushes an event on the *beacon entity* it detects.
- **`found_by_boatrace_checker`**: Pushed on a beacon entity when it has been successfully detected by the checker. The event data payload is the instance of the entity that owns this component.