---
id: bathingpool
title: Bathingpool
description: Manages entities entering and occupying a bathing pool, tracking occupants, enforcing space limits, and calculating valid entry positions.
tags: [entity, pool, space, occupancy]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 24f67166
system_scope: entity
---

# Bathingpool

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BathingPool` is a component that manages a pool entity’s occupancy system. It tracks which entities are currently inside the pool, respects a configurable maximum occupant limit, and handles entry/exit logic including spatial availability checks and position calculation. It interacts with the entity’s stategraph via state memory (`occupying_bathingpool`) to verify occupancy status.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bathingpool")
inst.components.bathingpool:SetRadius(2.5)
inst.components.bathingpool:SetMaxOccupants(3)

inst.components.bathingpool:SetOnStartBeingOccupiedBy(function(pool, ent)
    print(ent.Name .. " entered the pool")
end)

inst.components.bathingpool:SetOnStopBeingOccupiedBy(function(pool, ent)
    print(ent.Name .. " left the pool")
end)

-- Attempt to enter the pool
if inst.components.bathingpool:EnterPool(player) then
    -- successfully entered and added as occupant
else
    -- pool full or collision prevented entry
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `ent.sg.statemem.occupying_bathingpool == self.inst` for occupancy verification; no direct tag usage.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxoccupants` | number or `nil` | `nil` | Maximum number of entities allowed in the pool simultaneously. |
| `radius` | number or `nil` | `nil` | Radius of the pool; defaults to `inst:GetPhysicsRadius(0)` if not set. |
| `occupants` | table (array) | `{}` | List of entities currently occupying the pool. |
| `onoccupantremoved` | function | (internal) | Callback used when an occupant is removed. |
| `onoccupantnewstate` | function | (internal) | Callback used to verify occupant remains valid in their current state. |
| `onstartbeingoccupiedby` | function or `nil` | `nil` | Optional callback when an entity starts occupying the pool. |
| `onstopbeingoccupiedby` | function or `nil` | `nil` | Optional callback when an entity stops occupying the pool. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up when the component is removed from its entity. Removes all current occupants, cancels event callbacks, and fires `ms_leavebathingpool` events.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetRadius(r)`
*   **Description:** Sets the radius used for occupancy checks and entry calculations.
*   **Parameters:** `r` (number) - the radius value to assign.
*   **Returns:** Nothing.

### `GetRadius()`
*   **Description:** Returns the active radius: either the explicitly set radius or the entity’s physics radius if none was set.
*   **Parameters:** None.
*   **Returns:** number — the effective radius for calculations.

### `SetMaxOccupants(max)`
*   **Description:** Sets the maximum number of occupants allowed. If reducing the limit, excess occupants are removed.
*   **Parameters:** `max` (number or `nil`) — if `nil`, no occupancy limit is enforced.
*   **Returns:** Nothing.

### `SetOnStartBeingOccupiedBy(fn)`
*   **Description:** Registers a callback invoked when an entity begins occupying the pool.
*   **Parameters:** `fn` (function) — signature: `function(pool, entity)`.
*   **Returns:** Nothing.

### `SetOnStopBeingOccupiedBy(fn)`
*   **Description:** Registers a callback invoked when an entity stops occupying the pool.
*   **Parameters:** `fn` (function) — signature: `function(pool, entity)`.
*   **Returns:** Nothing.

### `IsOccupant(ent)`
*   **Description:** Checks if a given entity is currently in the occupants list.
*   **Parameters:** `ent` (Entity) — the entity to check.
*   **Returns:** boolean — `true` if `ent` is an occupant, otherwise `false`.

### `AddOccupant(ent)`
*   **Description:** Adds an entity to the occupants list and registers event listeners for its `onremove` and `newstate` events.
*   **Parameters:** `ent` (Entity) — the entity to add.
*   **Returns:** Nothing.

### `RemoveOccupant(ent)`
*   **Description:** Removes an entity from the occupants list and cleans up its event listeners. Compacts the occupants array.
*   **Parameters:** `ent` (Entity) — the entity to remove.
*   **Returns:** Nothing.

### `ForEachOccupant(fn, ...)`
*   **Description:** Iterates over occupants in reverse order and invokes a callback on each. Stops early if the callback returns `true`.
*   **Parameters:**  
  `fn` (function) — signature: `function(pool, entity, ...)`  
  `...` (any) — additional arguments passed to `fn`.
*   **Returns:** Nothing — but may return early if `fn` returns `true`.

### `CheckOccupant(ent)`
*   **Description:** Verifies that the entity is still legally occupying the pool by checking state memory (`ent.sg.statemem.occupying_bathingpool == self.inst`).
*   **Parameters:** `ent` (Entity) — the entity to verify.
*   **Returns:** boolean — `true` if the entity’s state confirms occupancy.

### `CheckAvailableSpot(x, z, r)`
*   **Description:** Checks if a circular area centered at `(x, 0, z)` with radius `r` overlaps with any current occupant’s area.
*   **Parameters:**  
  `x` (number) — world X coordinate  
  `z` (number) — world Z coordinate  
  `r` (number) — radius of the candidate spot
*   **Returns:**  
  `true` — if no overlap found  
  `false, blocker` — if overlap found; `blocker` is the overlapping entity.

### `EnterPool(ent)`
*   **Description:** Attempts to add an entity to the pool. Handles fullness checks, spatial collision avoidance, and calculates an exact entry position (`destx`, `destz`) near the pool center.
*   **Parameters:** `ent` (Entity) — the entity attempting to enter.
*   **Returns:**  
  `true` — if successfully entered and added  
  `false, "NOSPACE"` — if pool is full or no valid position available.

### `LeavePool(ent)`
*   **Description:** Removes an entity from the pool if it is a valid occupant.
*   **Parameters:** `ent` (Entity) — the entity attempting to leave.
*   **Returns:**  
  `false` — if `ent` was not an occupant or was in an invalid state  
  `true` — if successfully removed (only if stategraph confirms exit).

### `GetDebugString()`
*   **Description:** Returns a compact string summarizing current occupancy status for debugging.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"2/3 occupants"` or `"5 occupants"`.

## Events & listeners
- **Listens to:**  
  `onremove` (on each occupant entity) — triggers `onoccupantremoved`  
  `newstate` (on each occupant entity) — triggers `onoccupantnewstate`  
- **Pushes:**  
  `ms_enterbathingpool` — immediately on successful entry with payload `{ target = pool_entity, dest = Vector3(...) }`  
  `ms_leavebathingpool` — immediately on exit, with payload `pool_entity`
