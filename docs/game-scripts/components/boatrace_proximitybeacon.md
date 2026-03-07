---
id: boatrace_proximitybeacon
title: Boatrace Proximitybeacon
description: Registers event callbacks for boat race start and finish events on an entity, enabling custom logic when a boat race begins or ends.
tags: [event, race, callback]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 22d5291b
system_scope: entity
---

# Boatrace Proximitybeacon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatRace_ProximityBeacon` is a lightweight component attached to entities that participate in or monitor boat races. It acts as a callback handler for `boatrace_start` and `boatrace_finish` events. The component does not determine proximity or run game logic itself — instead, it provides hooks to respond when a boat race event occurs, typically in coordination with a `boatrace_proximitychecker` component or similar system.

## Usage example
```lua
local beacon = CreateEntity()
beacon:AddComponent("boatrace_proximitybeacon")
beacon.components.boatrace_proximitybeacon:SetBoatraceStartedFn(function(inst, data)
    print("Boat race started!")
end)
beacon.components.boatrace_proximitybeacon:SetBoatraceFinishedFn(function(inst, start, winner)
    print("Boat race finished. Winner:", winner)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `boatrace_proximitybeacon` to the entity.

## Properties
No public properties

## Main functions
### `SetBoatraceStartedFn(fn)`
*   **Description:** Sets the callback function invoked when the `boatrace_start` event is fired.  
*   **Parameters:** `fn` (function) — a function accepting two arguments: `inst` (the beacon entity) and `data` (event data table).
*   **Returns:** Nothing.

### `SetBoatraceFinishedFn(fn)`
*   **Description:** Sets the callback function invoked when the `boatrace_finish` event is fired.  
*   **Parameters:** `fn` (function) — a function accepting three arguments: `inst` (the beacon entity), `start` (start position data), and `winner` (winner identifier).
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up the component upon removal: removes the `boatrace_proximitybeacon` tag and unregisters all event listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `boatrace_start` — triggers `self.boatrace_started_fn`, if set.  
  - `boatrace_finish` — triggers `self.boatrace_finished_fn`, if set.  
- **Pushes:** None identified
