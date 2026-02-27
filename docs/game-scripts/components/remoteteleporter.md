---
id: remoteteleporter
title: Remoteteleporter
description: This component enables remote teleportation logic by selecting a target teleporter and moving the player (and optionally nearby items) to it using configurable activation and teleportation callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 2b06eb31
---

# Remoteteleporter

## Overview
This component provides the core logic for remote teleportation in DST, primarily used by Winona's Teleportation Pads. It identifies valid target teleporters, verifies teleportation permissions, executes the teleport (including optional item transport), and invokes custom callback functions at key stages. It does not manage networking directly but supports networked behavior via event propagation and server-side teleport logic.

## Dependencies & Tags
- **Component Usage**: Relies on `TheWorld.components.winonateleportpadmanager` (if present) to enumerate teleporter targets.
- **Entity Tags Checked**: Uses internal filtering tags for items:  
  `MustHaveTags = {"_inventoryitem"}`  
  `CantHaveTags = {"INLIMBO", "FX", "NOCLICK", "DECOR"}`  
- **No tags are added or removed** by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (e.g., a teleporter). |
| `canactivatefn` | `function (self.inst, doer) → boolean?` | `nil` | Optional callback to determine if teleportation can be initiated by `doer`. Returns `true` if `nil`. |
| `checkdestinationfn` | `function (self.inst, target, doer) → boolean?` | `nil` | Optional callback to validate a target teleporter for the `doer`. Returns `true` if `nil`. |
| `onstartteleportfn` | `function (self.inst, doer)` | `nil` | Callback invoked *before* teleport begins. |
| `onteleportedfn` | `function (self.inst, doer, success, target, items, from_x, from_z)` | `nil` | Callback invoked *after* teleport completes, with success status and item list. |
| `onstopteleportfn` | `function (self.inst, doer, success)` | `nil` | Callback invoked on teleport abort or completion (success/failure). |
| `itemteleportradius` | `number` | `nil` | Radius around the player to scan for items to teleport alongside them. |
| `nearbyitems` | `table` (array of `Entity`) | `nil` | Precomputed list of items to teleport; populated via `Teleport_GetNearbyItems()` and stored for use in `Teleport_Internal()`. |

## Main Functions

### `SetCanActivateFn(fn)`
* **Description:** Sets the callback used to determine whether a specific entity (`doer`) is allowed to activate this teleporter.
* **Parameters:**  
  `fn` (`function`): Signature `(self.inst, doer) → boolean`. Return `false` to block activation.

### `SetCheckDestinationFn(fn)`
* **Description:** Sets the callback used to validate each potential teleport destination target.
* **Parameters:**  
  `fn` (`function`): Signature `(self.inst, target, doer) → boolean`. Return `false` to exclude a target.

### `SetOnStartTeleportFn(fn)`
* **Description:** Registers a callback invoked immediately before teleport execution begins.
* **Parameters:**  
  `fn` (`function`): Signature `(self.inst, doer)`.

### `SetOnTeleportedFn(fn)`
* **Description:** Registers a callback invoked after teleport completes, regardless of success.
* **Parameters:**  
  `fn` (`function`): Signature `(self.inst, doer, success, target, items, from_x, from_z)`.  
  - `success`: `true` if teleport succeeded, else `false`.  
  - `target`: Target teleporter entity or `nil` on failure.

### `SetOnStopTeleportFn(fn)`
* **Description:** Registers a callback invoked when teleport is interrupted or finished.
* **Parameters:**  
  `fn` (`function`): Signature `(self.inst, doer, success)`.

### `SetItemTeleportRadius(radius)`
* **Description:** Configures the radius for scanning nearby items to teleport alongside the player.
* **Parameters:**  
  `radius` (`number`): Radius to search (world units). If `nil`, no items are collected.

### `CanActivate(doer)`
* **Description:** Determines if `doer` is permitted to use this teleporter.
* **Parameters:**  
  `doer` (`Entity`): The entity attempting to teleport.  
  Returns `true` if no `canactivatefn` is set or if the callback returns truthy.

### `Teleport_GetNearbyItems(doer)`
* **Description:** Collects and returns items within `itemteleportradius` of `doer` that meet filtering criteria (must have `_inventoryitem`, must not have blocking tags, and must be pickable up).
* **Parameters:**  
  `doer` (`Entity`): Source entity whose position is used for radius search.  
  Returns: Array of valid `Entity` items.

### `SetNearbyItems(nearbyitems)`
* **Description:** Stores a precomputed list of items to teleport later during `Teleport_Internal()`.
* **Parameters:**  
  `nearbyitems` (`table`): Array of `Entity` items to include in teleport.

### `Teleport(doer)`
* **Description:** Initiates the full remote teleport sequence: finds the best valid target (preferably *outside* the detection radius if possible, else closest *within*), performs the teleport, and triggers callbacks.  
  Selects the **closest out-of-camera** target first (by distance), falling back to the **furthest in-camera** target if none are out-of-range. Skips destinations blocked by line-of-sight or failing `checkdestinationfn`.
* **Parameters:**  
  `doer` (`Entity`): Entity performing teleport (usually a player).  
  Returns: `true` on success, or `false, "NODEST"` on failure (no valid destination).

### `Teleport_Internal(target, from_x, from_z, to_x, to_z, doer)`
* **Description:** Executes the actual teleport physics for the `doer` and any collected `items`. Invokes the `onteleportedfn` callback and emits the `"remoteteleportreceived"` event on the target teleporter. Also moves items relative to `doer`’s new position.
* **Parameters:**  
  `target` (`Entity`): Destination teleporter.  
  `from_x`, `from_z` (`number`): Original world coordinates of `doer`.  
  `to_x`, `to_z` (`number`): Destination world coordinates.  
  `doer` (`Entity`): Entity being teleported.

### `OnStartTeleport(doer)`
* **Description:** Calls the `onstartteleportfn` callback (if set).
* **Parameters:**  
  `doer` (`Entity`).

### `OnStopTeleport(doer, success)`
* **Description:** Calls the `onstopteleportfn` callback (if set), indicating teleport termination.
* **Parameters:**  
  `doer` (`Entity`), `success` (`boolean`).

## Events & Listeners
- **Listens For:** None (this component does not use `inst:ListenForEvent`).
- **Emits Events:**  
  - `"teleported"`: Pushed on each teleported item.  
  - `"remoteteleportreceived"`: Pushed on the *target* teleporter entity with payload `{ teleporter = self.inst, doer = doer, items = items, from_x = from_x, from_z = from_z }`.  
  - *(Callback `onteleportedfn` also fires separately with structured data.)*