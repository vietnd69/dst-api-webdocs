---
id: occupiable
title: Occupiable
description: Manages an entity's ability to be occupied by another entity, handling tag updates, nesting, and lifecycle callbacks.
tags: [ai, entity, nesting, lifecycle]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 25848b1e
system_scope: entity
---

# Occupiable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Occupiable` enables an entity to be occupied by another entity that has an `occupier` component. It manages state transitions between empty and occupied, updates entity tags (`occupied` and ` occupanttype + "_occupiable"`), registers callbacks for when the occupant perishes or is removed, and persists the occupant. It works in conjunction with the `occupier` component on the occupant entity to coordinate ownership and behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("occupiable")

-- Configure acceptable occupant type (e.g., "beefalo")
inst.components.occupiable:SetOccupantType("beefalo")

-- Later, when an entity with tag "beefalo" and an `occupier` component approaches:
if inst.components.occupiable:CanOccupy(behemoth) then
    inst.components.occupiable:Occupy(behemoth)
end
```

## Dependencies & tags
**Components used:** `occupier`, `inventoryitem`  
**Tags:** Adds/removes `occupied`; conditionally adds/removes `{occupanttype}_occupiable` (e.g., `beefalo_occupiable`) based on `occupanttype` and occupancy state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `occupant` | `Entity` or `nil` | `nil` | The entity currently occupying this entity. |
| `occupanttype` | `string` or `nil` | `nil` | Tag name the occupier must possess (e.g., `"beefalo"`) to qualify for occupancy. |
| `onoccupied` | `function(inst, occupier)` or `nil` | `nil` | Optional callback fired when occupation succeeds. |
| `onemptied` | `function(inst)` or `nil` | `nil` | Optional callback fired when the occupant leaves (via `Harvest`, `perished`, or removal). |
| `onperishfn` | `function(inst, occupier)` or `nil` | `nil` | Optional callback fired when the occupant perishes while occupied. |

## Main functions
### `IsOccupied()`
*   **Description:** Checks whether the entity is currently occupied.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if an occupant is present, `false` otherwise.

### `GetOccupant()`
*   **Description:** Returns the entity currently occupying this entity.
*   **Parameters:** None.
*   **Returns:** `Entity` or `nil` — the occupant entity, or `nil` if unoccupied.

### `CanOccupy(occupier)`
*   **Description:** Determines if the given entity can legally occupy this entity.
*   **Parameters:** `occupier` (`Entity`) — the potential occupier entity.
*   **Returns:** `boolean` — `true` if the occupier has the required tag (`occupanttype`), has an `occupier` component, and this entity is currently unoccupied; `false` otherwise.

### `Occupy(occupier)`
*   **Description:** Claims the entity for occupation by the given occupier.
*   **Parameters:** `occupier` (`Entity`) — the entity to occupy this one; must satisfy `CanOccupy`.
*   **Returns:** `boolean` — `true` if occupation succeeds; `nil` if preconditions fail.
*   **Error states:** Returns `nil` if already occupied, `occupier` is `nil`, or `occupier` lacks the `occupier` component.

### `Harvest()`
*   **Description:** Releases the occupant (e.g., for pickup or reuse) without destroying it.
*   **Parameters:** None.
*   **Returns:** `Entity` or `nil` — the released occupant entity, or `nil` if unoccupied or the occupant lacks `inventoryitem`.
*   **Error states:** Does not call `perished` or `onremove` callbacks; assumes intentional release.

### `OnSave()`
*   **Description:** Returns serialization data for network/save compatibility.
*   **Parameters:** None.
*   **Returns:** `table` — e.g., `{ occupant = { save_record } }`, or `{ occupant = nil }`.

### `OnLoad(data, newents)`
*   **Description:** Restores occupancy state during world load or network sync.
*   **Parameters:**  
    `data` (`table`) — data returned by `OnSave()`.  
    `newents` (`table`) — map of restored entity records to instances.
*   **Returns:** Nothing.

### `SetOccupantType(occupanttype)`
*   **Description:** (Inferred from tag manipulation logic) Sets the `occupanttype` and updates tags accordingly. Not explicitly defined in this file, but implied by `onoccupanttype` callback and `CanOccupy`.
*   **Parameters:** `occupanttype` (`string` or `nil`) — tag name required of occupiers (e.g., `"beefalo"`), or `nil` to clear restriction.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `perished` — triggers occupant cleanup via `occupier.occupiableonperish`.  
  `onremove` — triggers occupant cleanup via `occupier.occupiableonremove`.
- **Pushes:** Not directly responsible for pushing events, but sets callbacks (`onoccupied`, `onemptied`, `onperishfn`) that may be defined externally and used to trigger further logic.
