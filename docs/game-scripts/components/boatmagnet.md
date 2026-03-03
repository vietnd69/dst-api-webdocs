---
id: boatmagnet
title: Boatmagnet
description: Manages the magnetic attraction behavior of a boat toward a paired beacon, calculating forces and velocity to pull the boat toward the beacon's location while avoiding collisions and adapting to motion.
tags: [locomotion, physics, boat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: db572168
system_scope: physics
---

# Boatmagnet

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatMagnet` is a component attached to boats to enable magnetic pulling behavior toward a paired `boatmagnetbeacon` (e.g., placed on another boat). It listens for beacon state changes (on/off, pairing, removal), computes pull direction and force based on distance and relative motion, and dynamically adjusts the boat's movement constraints. It integrates with `boatphysics`, `hull`, and `locomotor` components to apply realistic physics-based attraction while respecting tuning parameters.

The component operates via a task that initializes the boat association at startup and maintains event-based pairing and cleanup logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatmagnet")
inst:AddComponent("boatphysics")
inst:AddComponent("hull")
inst:AddTag("boat")

-- Later, after beacon pairing logic (typically handled by UI or input):
local beacon = GetNearbyBeacon()
if beacon and beacon:HasTag("boatmagnetbeacon") then
    inst.components.boatmagnet:PairWithBeacon(beacon)
end

-- During gameplay, the component automatically applies pull forces and handles disengagement.
```

## Dependencies & tags
**Components used:**  
- `boatmagnetbeacon` (via beacon)  
- `boatphysics` (to add/remove magnet and query velocity/direction)  
- `hull` (to get radius for minimum safe distance)  
- `locomotor` (to query follow target’s run speed when beacon is carried on foot)

**Tags:** Adds `paired` when a beacon is paired; removes it on unpair.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *passed in* | The entity (boat) this component is attached to. |
| `canpairwithfn` | function | `(beacon) => bool` | Predicate used to filter valid beacons during pairing (e.g., beacon not already paired). |
| `ClearEverything` | function | *(see source)* | Handler to fully reset pairing, boat, and tasks. |
| `OnBeaconTurnedOn` / `OnBeaconTurnedOff` | function | *(see source)* | Callbacks invoked when the paired beacon toggles state. |
| `OnInventoryBeaconLoaded` | function | *(see source)* | Handles beacon restoration during world load (for serialized pairing). |
| `_setup_boat_task` | `Task` | *initially scheduled* | Deferred task to discover and associate the initial boat platform. |
| `onpairedwithbeaconfn` | function | `nil` | Optional custom callback fired on successful pairing. |
| `onunpairedwithbeaconfn` | function | `nil` | Optional custom callback fired on unpairing. |
| `beaconturnedonfn` / `beaconturnedofffn` | function | `nil` | Optional callbacks for beacon state changes. |
| `beacon` | `Entity?` | `nil` | Reference to the currently paired beacon entity. |
| `boat` | `Entity?` | `nil` | Reference to the boat entity this magnet is attached to. |
| `prev_guid` | number? | `nil` | Saved GUID for deserialization (legacy support). |
| `magnet_guid` | number? | `nil` | Self-GUID used during save/load. |

## Main functions
### `SetBoat(boat)`
* **Description:** Assigns or clears the associated boat entity. Adds/removes this magnet instance from the boat’s physics system and registers/cancels cleanup events.
* **Parameters:** `boat` (`Entity?`) — the boat to attach to; `nil` to unpair from current boat.
* **Returns:** Nothing.
* **Error states:** No-op if `boat` is unchanged.

### `IsActivated()`
* **Description:** Indicates whether the magnet is currently paired with a beacon.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.beacon` is non-`nil`.

### `PairedBeacon()`
* **Description:** Returns the currently paired beacon.
* **Parameters:** None.
* **Returns:** `Entity?` — the beacon entity, or `nil`.

### `IsBeaconOnSameBoat(beacon)`
* **Description:** Checks if a given beacon is attached to the same boat as this magnet.
* **Parameters:** `beacon` (`Entity?`) — the beacon entity to test.
* **Returns:** `boolean` — `true` if beacon exists, has a beacon component, and is on the same boat.

### `FindNearestBeacon()`
* **Description:** Scans for the nearest valid, unpaired beacon within `TUNING.BOAT.BOAT_MAGNET.PAIR_RADIUS`, respecting `canpairwithfn`.
* **Parameters:** None.
* **Returns:** `Entity?` — the nearest beacon entity, or `nil`.
* **Error states:** Returns `nil` if no valid beacon is found.

### `PairWithBeacon(beacon)`
* **Description:** Establishes a pairing with the given beacon, registers event listeners for state changes, starts update callbacks, and sets the `paired` tag.
* **Parameters:** `beacon` (`Entity`) — the beacon entity to pair with.
* **Returns:** Nothing.
* **Error states:** Early return if beacon or `boatmagnetbeacon` component is missing.

### `UnpairWithBeacon()`
* **Description:** Terminates the beacon pairing: removes event listeners, notifies the beacon component to unpair, stops update callbacks, and removes the `paired` tag.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if not currently paired (`self.beacon == nil`).

### `GetFollowTarget()`
* **Description:** Determines the entity the magnet should follow (boat or carried beacon entity).
* **Parameters:** None.
* **Returns:** `Entity?` — the follow target (usually the beacon’s boat), or `nil`.
* **Error states:** Returns `nil` if beacon or its boat parent is invalid.

### `CalcMaxVelocity()`
* **Description:** Computes the maximum pull velocity for the boat toward the beacon, considering distance, turn alignment, and beacon speed.
* **Parameters:** None.
* **Returns:** `number` — max speed (≥ `0`). Returns `0` if beacon is off, detached, or invalid.
* **Error states:** Returns `0` if `beacon` is `nil`, turned off, or `getFollowTarget()` fails.

### `CalcMagnetDirection()`
* **Description:** Computes the unit direction vector and scalar distance from the magnet’s boat to the follow target.
* **Parameters:** None.
* **Returns:** `Vector3, number` — direction vector and distance.
* **Error states:** Returns `Vector3(0,0,0)` and `0` if `followtarget` is `nil`.

### `CalcMagnetForce()`
* **Description:** Calculates the scalar pull force to apply (based on distance and hull radii).
* **Parameters:** None.
* **Returns:** `number` — `TUNING.BOAT.BOAT_MAGNET.MAGNET_FORCE` if distance > minimum safe distance, else `0`.
* **Error states:** Returns `0` if beacon is off, boat/beacon missing, or within safe distance.

### `OnUpdate(dt)`
* **Description:** Per-frame logic for active pairing: handles same-boat disengagement, applies pull force via rotation (via `Transform:SetRotation`), and disengages if out of range.
* **Parameters:** `dt` (`number`) — delta time.
* **Returns:** Nothing.
* **Error states:** Early return if boat/beacon missing. Disengages if beacon is on same boat or distance exceeds max range.

### `GetDebugString()`
* **Description:** Returns a string representation of the beacon for debugging.
* **Parameters:** None.
* **Returns:** `string` — beacon entity debug string or empty string.

## Events & listeners
- **Listens to:**  
  - `onremove` — triggers `ClearEverything` or `UnpairWithBeacon` when beacon/boat is removed.  
  - `death` — same as above for entity death.  
  - `onturnon` — fires `OnBeaconTurnedOn` callback when beacon is activated.  
  - `onturnoff` — fires `OnBeaconTurnedOff` callback when beacon is deactivated.  
  - Custom event `boatmagnet_pull_start` — pushed when magnet starts pulling (beacon on different boat, active).  
  - Custom event `boatmagnet_pull_stop` — pushed when pulling stops (e.g., same-boat pairing).  
- **Pushes:**  
  - `boatmagnet_pull_start`, `boatmagnet_pull_stop` — used to notify animation/stategraph systems.
