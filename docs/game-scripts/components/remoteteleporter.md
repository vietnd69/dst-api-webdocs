---
id: remoteteleporter
title: Remoteteleporter
description: Handles remote teleportation logic by selecting a valid destination pad and moving the doer and nearby items.
tags: [teleport, navigation, map, inventory]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2b06eb31
system_scope: world
---
# Remoteteleporter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RemoteTeleporter` manages the logic for initiating and executing remote teleportation from one location to the nearest or farthest valid Winona Teleport Pad. It supports dynamic destination selection based on camera proximity, custom activation/check callbacks, and optional movement of nearby inventory items. This component is typically attached to teleported entities (e.g., players or objects with a teleported target) and relies on the `winonateleportpadmanager` component in `TheWorld` to discover valid destinations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("remoteteleporter")

-- Set optional callbacks
inst.components.remoteteleporter:SetCanActivateFn(function(inst, doer) return true end)
inst.components.remoteteleporter:SetCheckDestinationFn(function(inst, target, doer) return true end)
inst.components.remoteteleporter:SetOnStartTeleportFn(function(inst, doer) print("Teleport started") end)
inst.components.remoteteleporter:SetOnTeleportedFn(function(inst, doer, success, target, items) print("Teleport result:", success) end)
inst.components.remoteteleporter:SetOnStopTeleportFn(function(inst, doer, success) end)

-- Trigger teleportation
inst.components.remoteteleporter:Teleport(doer_entity)
```

## Dependencies & tags
**Components used:** `inventoryitem` (via `item.components.inventoryitem`), `winonateleportpadmanager` (via `TheWorld.components.winonateleportpadmanager`)  
**Tags:** Checks `canbepickedup` on items, filters by `ITEM_MUST_TAGS = {"_inventoryitem"}` and `ITEM_CANT_TAGS = {"INLIMBO", "FX", "NOCLICK", "DECOR"}`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canactivatefn` | function or `nil` | `nil` | Callback determining if teleport can start. Signature: `fn(inst, doer) → boolean` |
| `checkdestinationfn` | function or `nil` | `nil` | Callback validating a destination pad. Signature: `fn(inst, target, doer) → boolean` |
| `onstartteleportfn` | function or `nil` | `nil` | Callback fired when teleport begins. Signature: `fn(inst, doer)` |
| `onteleportedfn` | function or `nil` | `nil` | Callback fired after teleport attempt (success or failure). Signature: `fn(inst, doer, success, target?, items?, from_x, from_z)` |
| `onstopteleportfn` | function or `nil` | `nil` | Callback fired on teleport completion/cancellation. Signature: `fn(inst, doer, success)` |
| `itemteleportradius` | number or `nil` | `nil` | Radius around the doer to search for items to teleport. `nil` disables item movement. |
| `nearbyitems` | table or `nil` | `nil` | List of items passed to `Teleport_Internal`; usually set via `SetNearbyItems` or computed internally. |

## Main functions
### `SetCanActivateFn(fn)`
*   **Description:** Assigns the callback used to determine whether the teleport can be initiated.
*   **Parameters:** `fn` (function or `nil`) - function taking `(self.inst, doer)` and returning `true`/`false`.
*   **Returns:** Nothing.

### `SetCheckDestinationFn(fn)`
*   **Description:** Assigns the callback used to validate each potential destination teleport pad.
*   **Parameters:** `fn` (function or `nil`) - function taking `(self.inst, target, doer)` and returning `true`/`false`.
*   **Returns:** Nothing.

### `SetOnStartTeleportFn(fn)`
*   **Description:** Assigns the callback fired before teleport physics occur.
*   **Parameters:** `fn` (function or `nil`) - function taking `(self.inst, doer)`.
*   **Returns:** Nothing.

### `SetOnTeleportedFn(fn)`
*   **Description:** Assigns the callback fired after teleport physics (success or failure).
*   **Parameters:** `fn` (function or `nil`) - function with signature `fn(self.inst, doer, success, target?, items?, from_x, from_z)`.
*   **Returns:** Nothing.

### `SetOnStopTeleportFn(fn)`
*   **Description:** Assigns the callback fired when teleport completes (regardless of success).
*   **Parameters:** `fn` (function or `nil`) - function taking `(self.inst, doer, success)`.
*   **Returns:** Nothing.

### `SetItemTeleportRadius(radius)`
*   **Description:** Sets the radius around the doer used to collect nearby items for teleportation.
*   **Parameters:** `radius` (number or `nil`) - radius to scan. `nil` disables item movement.
*   **Returns:** Nothing.

### `CanActivate(doer)`
*   **Description:** Checks if the teleport can start using the `canactivatefn` callback, if set.
*   **Parameters:** `doer` (Entity) - the entity attempting to teleport.
*   **Returns:** `true` if `canactivatefn` returns truthy or is `nil`; otherwise `false`.

### `Teleport_GetNearbyItems(doer)`
*   **Description:** Finds and returns items near the doer within `itemteleportradius` that can be picked up.
*   **Parameters:** `doer` (Entity) - the center point for the search.
*   **Returns:** `{Entity}` - list of valid items. Filters out items with `canbepickedup == false`.
*   **Error states:** Returns `nil` if `itemteleportradius` is `nil`.

### `SetNearbyItems(nearbyitems)`
*   **Description:** Manually sets the list of items to be teleported with the doer.
*   **Parameters:** `nearbyitems` (`{Entity}` or `nil`) - list of items; `nil` clears the list.
*   **Returns:** Nothing.

### `Teleport(doer)`
*   **Description:** Executes remote teleportation logic. Finds the best destination pad, moves the doer and nearby items, and fires callbacks.
*   **Parameters:** `doer` (Entity) - the entity to teleport.
*   **Returns:** `true` on success, `false` otherwise. On failure, also returns `"NODEST"`.
*   **Error states:** Returns `false, "NODEST"` if no valid destination pads exist or all candidates are blocked by `IsTeleportingPermittedFromPointToPoint` or `checkdestinationfn`.

### `Teleport_Internal(target, from_x, from_z, to_x, to_z, doer)`
*   **Description:** Performs the actual movement of the doer and any collected items.
*   **Parameters:**  
  `target` (Entity) - destination teleport pad.  
  `from_x, from_z` (number) - source world coordinates.  
  `to_x, to_z` (number) - destination world coordinates.  
  `doer` (Entity) - the entity being teleported.
*   **Returns:** Nothing.
*   **Notes:** Moves items using their physics if available, otherwise directly modifies transform. Pushes `"teleported"` event on moved entities and fires `onteleportedfn`. Pushes `"remoteteleportreceived"` on the destination pad.

### `OnStartTeleport(doer)`
*   **Description:** Invokes `onstartteleportfn`, if set.
*   **Parameters:** `doer` (Entity).
*   **Returns:** Nothing.

### `OnStopTeleport(doer, success)`
*   **Description:** Invokes `onstopteleportfn`, if set.
*   **Parameters:** `doer` (Entity), `success` (boolean).
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:**  
  - `"teleported"` on each teleported item and the `doer`.  
  - `"remoteteleportreceived"` on the destination pad (`target`), with payload `{ teleporter = self.inst, doer = doer, items = items, from_x = from_x, from_z = from_z }`.  
- **Listens to:** None.  
