---
id: migrationpetowner
title: Migrationpetowner
description: Provides a lightweight mechanism for an inventory item to store and retrieve one or more associated migration-capable pets via a callback function.
tags: [inventory, migration, pet]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 02ba9f87
system_scope: inventory
---

# Migrationpetowner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MigrationPetOwner` is a lightweight component designed to be attached to inventory items (e.g., wearable items or held objects) that may carry one or more pets during world migration (e.g., when a player enters or exits the Caves). It does not manage pet logic itself but stores a callback function (`petfn`) that the game can invoke to fetch associated pet entities at runtime. This enables flexible, decoupled pet–item associations without hard dependencies.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("migrationpetowner")

-- Set a callback that returns a single pet or a table of pets
inst.components.migrationpetowner:SetPetFn(function(owner)
    return owner.components.inventory and owner.components.inventory:GetEquippedItem(EQUIPSLOTS.HEAD)
end)

-- Retrieve the primary pet
local pet = inst.components.migrationpetowner:GetPet()

-- Retrieve all associated pets (as a table)
local pets = inst.components.migrationpetowner:GetAllPets()
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in constructor) | The entity instance to which this component is attached. |
| `get_pet_fn` | `function?` | `nil` | Optional callback function that accepts `owner` as argument and returns either a single pet entity or a table of pet entities. |

## Main functions
### `SetPetFn(petfn)`
* **Description:** Assigns the callback function used to retrieve associated pet(s) when `GetPet` or `GetAllPets` is called.
* **Parameters:** `petfn` (function) — a function taking `owner` (the entity instance) as its sole argument and returning either a single entity or a table of entities.
* **Returns:** Nothing.

### `GetPet()`
* **Description:** Returns the *first* pet associated with this owner, for convenience (e.g., to check existence or perform simple operations). This method is partially deprecated in favor of `GetAllPets` for new usages.
* **Parameters:** None.
* **Returns:** 
  * The first pet entity (if any), or
  * `nil` if no petfn is set, or no pets are returned.
* **Error states:** If the callback returns a table, returns the first element (`pets[1]`). If the callback returns a non-table, returns that value directly.

### `GetAllPets()`
* **Description:** Returns *all* pets associated with this owner as a table (ensuring consistent output type). This is the recommended method for retrieving multiple pets.
* **Parameters:** None.
* **Returns:** 
  * A table of pet entities (possibly empty or `nil`), or
  * `nil` if no petfn is set or the callback returns `nil`.
* **Error states:** Ensures backward compatibility: if the callback returns a non-table, wraps it in a table before returning.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
