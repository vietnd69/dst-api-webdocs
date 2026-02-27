---
id: occupiable
title: Occupiable
description: Manages occupancy state for an entity by tracking a current occupant and associated tags.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 25848b1e
---

# Occupiable

## Overview
This component manages the concept of "occuppation" for an entity, allowing another entity (the *occupant*) to occupy it—such as a character sitting on a stool or a creature inside a cage. It maintains state via a reference to the occupant, dynamically adjusts entity tags (`occupied`, `<type>_occupiable`), and handles lifecycle events like saving, loading, harvesting, and cleanup on removal.

## Dependencies & Tags
- **Component Dependencies:** Relies on the `occupier` component being present on the entity attempting to occupy (via `occupier:SetOwner()` and `HasTag()` checks).
- **Tags Added/Removed:**
  - Adds/Removes `"occupied"` tag based on whether an occupant is present.
  - Adds/Removes `<occupanttype>_occupiable` tag when `occupanttype` changes or is cleared, provided no occupant is currently present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity (set in constructor). |
| `occupant` | `Entity?` | `nil` | Reference to the currently occupying entity. |
| `occupanttype` | `string?` | `nil` | Tag name (e.g., `"pig"`, `"player"`) indicating what kind of entity can occupy this. |

## Main Functions

### `IsOccupied()`
* **Description:** Returns whether an occupant is currently occupying this entity.
* **Parameters:** None.

### `GetOccupant()`
* **Description:** Returns the current occupant entity, or `nil` if unoccupied.
* **Parameters:** None.

### `CanOccupy(occupier)`
* **Description:** Determines whether the given `occupier` entity is eligible to occupy this entity. Checks include:
  - This entity is not already occupied.
  - `occupanttype` is set on this component.
  - `occupier` has a matching tag (e.g., `"pig"` matches `occupanttype = "pig"`).
  - `occupier` has an `occupier` component.
* **Parameters:**
  - `occupier`: The potential occupier entity.

### `Occupy(occupier)`
* **Description:** Makes `occupier` occupy this entity. Internally:
  - Registers cleanup callbacks for `"perished"` and `"onremove"` events on the occupant.
  - Links the occupant’s `occupier` component to this entity via `SetOwner()`.
  - Adds the occupant as a child and removes it from the scene.
  - Invokes optional `onoccupied` callbacks (on both this component and the occupier).
* **Parameters:**
  - `occupier`: The entity to become the occupant. Must be valid and have an `occupier` component.
* **Returns:** `true` if occupation succeeded, `false` otherwise.

### `Harvest()`
* **Description:** Removes the occupant without destroying it, effectively "unloading" it from this entity (e.g., for picking up an item placed in a container). Returns the occupant entity to the scene and clears internal references.
* **Parameters:** None.
* **Returns:** The previously occupying entity (now restored to world state), or `nil` if no occupant or it lacked `inventoryitem`.

### `OnSave()`
* **Description:** Prepares serializable data for the current state—specifically, the save record of the occupant if valid.
* **Parameters:** None.
* **Returns:** Table with optional `occupant` field containing the occupant’s save record or `nil`.

### `OnLoad(data, newents)`
* **Description:** Restores occupation state on deserialization by spawning and re-occupying the saved occupant entity (if present).
* **Parameters:**
  - `data`: Table from `OnSave()` (or saved game data).
  - `newents`: Table of newly spawned entities used during save load.

### `OnRemoveFromEntity()`
* **Description:** Cleans up tags and references when component is removed from the entity. Explicitly removes `"occupied"` and `<type>_occupiable` tags.
* **Parameters:** None.

## Events & Listeners
- **Listens For:**
  - `"perished"` on occupant → triggers `occupier.occupiableonperish`
  - `"onremove"` on occupant → triggers `occupier.occupiableonremove`
- **Triggers (via `inst:PushEvent` or callback hooks):**
  - `onoccupied(self.inst, occupier)` — when an occupant successfully occupies.
  - `onemptied(self.inst)` — when occupancy ends (via `Harvest`, `onremove`, or `perished`).
  - `onperishfn(self.inst, self.occupant)` — if set, called when occupant perishes.