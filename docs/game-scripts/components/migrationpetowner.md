---
id: migrationpetowner
title: Migrationpetowner
description: Provides a lightweight interface for associating and retrieving pet entities that migrate alongside an inventory item.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 02ba9f87
---

# Migrationpetowner

## Overview
This component serves as a lightweight container for storing and retrieving one or more pet entities associated with an inventory item. It does not manage pet logic itself but instead delegates pet retrieval to an externally provided function (`get_pet_fn`), enabling flexible integration across prefabs that support migrating pets (e.g., during item transfers or crafting).

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to. Set during construction. |
| `get_pet_fn` | `function?` | `nil` | A callback function that, when invoked with `inst`, returns pet entity (or table of pets). Set via `SetPetFn`. |

## Main Functions
### `SetPetFn(petfn)`
* **Description:** Assigns the callback function used to retrieve associated pet(s) when requested.
* **Parameters:**  
  - `petfn` (`function`): A function that accepts the owner entity (`inst`) and returns either a single pet entity or a table of pet entities.

### `GetPet()`
* **Description:** Returns the first pet entity (or `nil` if none exist). Intended for basic existence checks; marked as partially deprecated for broader use due to lack of support for multiple pets.
* **Parameters:** None.

### `GetAllPets()`
* **Description:** Returns a table of all associated pet entities (or `{nil}` if no pets exist). Ensures backward compatibility by returning a single-pet result as a list if needed.
* **Parameters:** None.

## Events & Listeners
None.