---
id: boatmagnetbeacon
title: Boatmagnetbeacon
description: Coordinates beacon behavior for boat magnet pairs, including pairing/unpairing logic, beacon activation state, and platform (boat) tracking.
tags: [boat, magnet, platform, state, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 578aa792
system_scope: entity
---

# Boatmagnetbeacon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatMagnetBeacon` manages the state and pairing logic for a boat magnet beacon entity—typically used in conjunction with `boatmagnet` components to synchronize paired magnet devices (e.g., boat anchors or signal devices). It tracks whether the beacon is active (`turnedoff`), whether it is currently held (picked up), and maintains a reference to its paired magnet via GUID. The component automatically updates beacon visuals and stategraph transitions when turned on/off, and registers event callbacks to maintain pairing integrity when the beacon or its magnet is removed or dies.

## Usage example
```lua
local beacon = SpawnPrefabs["boat_magnet_beacon"]
beacon:AddComponent("boatmagnetbeacon")

-- Later, when pairing with a magnet
beacon.components.boatmagnetbeacon:PairWithMagnet(magnet_entity)

-- Check if beacon is active and get its magnet
if not beacon.components.boatmagnetbeacon:IsTurnedOff() then
    local magnet = beacon.components.boatmagnetbeacon:PairedMagnet()
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `boatmagnet` (via external calls)  
**Tags added/removed:** `paired`, `turnedoff`, `inventoryitem.imagename` changes (client-facing visual only)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity that owns this component. |
| `turnedoff` | boolean | `false` | Whether the beacon is currently off (disabled). |
| `ispickedup` | boolean | `false` | Whether the beacon entity is currently being held (not on a platform). |
| `boat` | `Entity?` | `nil` | Reference to the boat entity the beacon is currently attached to. |
| `magnet` | `Entity?` | `nil` | Reference to the paired `boatmagnet` entity. |
| `magnet_guid` | number? | `nil` | GUID of the currently paired magnet (used for re-pairing on load). |
| `magnet_must_tags` | table | `{"boatmagnet"}` | Tags the beacon requires in candidate magnet entities. |
| `magnet_cant_tags` | table | `{"paired"}` | Tags disqualifying a candidate magnet entity. |
| `magnet_distance` | number | `TUNING.BOAT.BOAT_MAGNET.MAX_DISTANCE` | Max radius around beacon to search for magnets. |
| `_setup_boat_task` | `Task?` | `nil` | Delayed task used during initialization to ensure platform assignment. |

## Main functions
### `OnSave()`
*   **Description:** Returns serializable data for save/load support.
*   **Parameters:** None.
*   **Returns:** Table containing `turnedoff`, `ispickedup`, and `magnet_guid`.

### `OnLoad(data)`
*   **Description:** Restores state from saved data. Reapplies tag `"turnedoff"` if needed and updates `inventoryitem` image name if applicable.
*   **Parameters:** `data` (table) — data returned by `OnSave()`.
*   **Returns:** Nothing.

### `GetBoat()`
*   **Description:** Determines and caches the current platform (boat) the beacon is attached to.
*   **Parameters:** None.
*   **Returns:** `Entity` if attached to a valid `"boat"` entity, otherwise `nil`.

### `SetBoat(boat)`
*   **Description:** Sets or updates the `boat` reference and registers/unregisters callbacks for `onremove` and `death` events on the boat.
*   **Parameters:** `boat` (`Entity?`) — the boat entity to associate, or `nil` to detach.
*   **Returns:** Nothing.

### `PairedMagnet()`
*   **Description:** Returns the currently paired magnet entity.
*   **Parameters:** None.
*   **Returns:** `Entity?` — the magnet, or `nil` if unpaired.

### `PairWithMagnet(magnet)`
*   **Description:** Establishes a pairing with the given magnet entity. Registers event listeners and activates the beacon.
*   **Parameters:** `magnet` (`Entity`) — the magnet entity to pair with (must have `boatmagnet` component).
*   **Returns:** Nothing.
*   **Error states:** Returns early if already paired (`self.magnet ~= nil`) or if `magnet` is `nil`.

### `UnpairWithMagnet()`
*   **Description:** Terminates the current magnet pairing, resets state, and turns off the beacon.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if no magnet is currently paired.

### `IsTurnedOff()`
*   **Description:** Reports whether the beacon is currently off.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if turned off, `false` otherwise.

### `TurnOnBeacon()`
*   **Description:** Activates the beacon: updates image name, transitions the stategraph to `"activate"`, fires `"onturnon"`, and removes `"turnedoff"` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TurnOffBeacon()`
*   **Description:** Deactivates the beacon: updates image name, transitions the stategraph to `"deactivate"`, fires `"onturnoff"`, and adds `"turnedoff"` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsPickedUp()`
*   **Description:** Reports whether the beacon is currently held.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if held, `false` otherwise.

### `SetIsPickedUp(pickedup)`
*   **Description:** Updates the `ispickedup` flag and refreshes the `boat` reference accordingly.
*   **Parameters:** `pickedup` (`boolean`) — whether the beacon is now held.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug string representation (e.g., magnet GUID or entity reference).
*   **Parameters:** None.
*   **Returns:** `string` — empty if unpaired, otherwise `tostring(magnet)`.

## Events & listeners
- **Listens to:**  
  `onpickup`, `ondropped` (on self)  
  `onremove`, `death` (on self, boat, and paired magnet)
- **Pushes:**  
  `"onturnon"`, `"onturnoff"` (when beacon activation state changes)
