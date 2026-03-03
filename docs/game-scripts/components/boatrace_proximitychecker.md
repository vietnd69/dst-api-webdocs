---
id: boatrace_proximitychecker
title: Boatrace Proximitychecker
description: Checks for proximity to boatrace proximity beacons and triggers detection events after a sustained overlap period.
tags: [boatrace, proximity, event, world, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 368130cc
system_scope: world
---

# Boatrace Proximitychecker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatRace_ProximityChecker` is a map-level component that enables an entity to detect when `boatrace_proximitybeacon` entities enter its configured radius. It maintains a history of overlapping beacons and triggers detection events only after a beacon remains within range for a sustained delay (`found_delay`). The component is designed to work in coordination with `boatrace_proximitybeacon` entities and uses periodic tasks during active boat races to avoid running expensive proximity checks every frame.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatrace_proximitychecker")

-- Optional: configure custom range or delay
inst.components.boatrace_proximitychecker.range = 15
inst.components.boatrace_proximitychecker.found_delay = 2.0

-- Assign a custom callback for when a beacon is detected
inst.components.boatrace_proximitychecker.on_found_beacon = function(checker, beacon)
    print("Beacon detected:", beacon.prefab)
end

-- Start proximity checks (typically called when a race begins)
inst.components.boatrace_proximitychecker:OnStartRace()

-- Stop proximity checks (typically called when a race ends)
inst.components.boatrace_proximitychecker:OnFinishRace()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `boatrace_proximitychecker` to the owning entity. Checks for entities with tag `boatrace_proximitybeacon`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in constructor) | Reference to the entity that owns this component. |
| `proximity_check_must_flags` | table | `{"boatrace_proximitybeacon"}` | List of tags an entity must have to be considered a potential beacon. |
| `range` | number | `TUNING.BOATRACE_DEFAULT_PROXIMITY` | Search radius (world units) around the checker for beacons. |
| `found_delay` | number | `1.5` | Minimum time (seconds) a beacon must remain within range before detection is triggered. |
| `stored_beacons` | table | `{}` | Stores beacons currently detected, keyed by beacon entity, with timestamp of first entry or extended timestamp upon detection. |
| `_per_update_found_beacons` | table | `{}` | Temporary table used per-update to track which beacons are currently in range. |
| `on_found_beacon` | function? | `nil` | Optional user-defined callback invoked when a beacon is detected. Signature: `callback(checker_entity, detected_beacon_entity)`. |

## Main functions
### `OnStartRace()`
* **Description:** Starts a periodic task that runs `OnUpdateProximity` approximately every 5 frames to check for beacons. Should be called when a boatrace begins.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnFinishRace()`
* **Description:** Cancels the periodic proximity check task and clears all stored beacon records. Should be called when a race ends.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Removes the `boatrace_proximitychecker` tag from the entity when the component is removed.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:**
  - `"found_by_boatrace_checker"` — Fired on the detected `boatrace_proximitybeacon` entity when it has been continuously within range for `found_delay` seconds. The event data is the checker entity (`inst`).
