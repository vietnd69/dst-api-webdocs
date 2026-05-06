---
id: petleash
title: Petleash
description: Manages spawned pet entities attached to an owner, enforcing limits and handling lifecycle events.
tags: [pets, followers, entity-management]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 9d8cfdde
system_scope: entity
---

# Petleash

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`PetLeash` manages a collection of pet entities spawned by or attached to an owner entity. It enforces global and per-prefab pet limits, tracks pet counts, and handles pet lifecycle events including spawning, despawning, and removal. The component integrates with the `leader` component to automatically register pets as followers when spawned or attached.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("petleash")
inst:AddComponent("leader")

inst.components.petleash:SetPetPrefab("hound")
inst.components.petleash:SetMaxPets(3)
inst.components.petleash:SetOnSpawnFn(function(owner, pet) pet.components.locomotor:Run() end)

local pet = inst.components.petleash:SpawnPetAt(inst.Transform:GetWorldPosition())
```

## Dependencies & tags
**Components used:**
- `leader` -- pets are automatically added as followers via `AddFollower()` when linked

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | -- | The entity instance that owns this component. |
| `petprefab` | string | `nil` | Default prefab name to spawn when no override is provided. |
| `pets` | table | `{}` | Table mapping pet entities to themselves (acts as a set). |
| `maxpets` | number | `1` | Maximum number of pets allowed globally. |
| `numpets` | number | `0` | Current count of non-prefab-limited pets. |
| `maxpetsperprefab` | table | `nil` | Table mapping prefab names to their individual max limits. |
| `numpetsperprefab` | table | `nil` | Table mapping prefab names to their current counts. |
| `onspawnfn` | function | `nil` | Callback invoked when a pet is spawned or loaded. |
| `ondespawnfn` | function | `nil` | Callback invoked when a pet is despawned. |
| `onpetremoved` | function | `nil` | Callback invoked when a pet is removed from the collection. |

## Main functions
### `SetPetPrefab(prefab)`
* **Description:** Sets the default prefab name to use when spawning pets without an override.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** None.
* **Error states:** None.

### `SetOnSpawnFn(fn)`
* **Description:** Sets the callback function to invoke when a pet is spawned or loaded.
* **Parameters:** `fn` -- function(owner, pet).
* **Returns:** None.
* **Error states:** None.

### `SetOnDespawnFn(fn)`
* **Description:** Sets the callback function to invoke when a pet is despawned. If not set, pets are removed directly.
* **Parameters:** `fn` -- function(owner, pet).
* **Returns:** None.
* **Error states:** None.

### `SetOnRemovedFn(fn)`
* **Description:** Sets the callback function to invoke when a pet is removed from the collection.
* **Parameters:** `fn` -- function(owner, pet).
* **Returns:** None.
* **Error states:** None.

### `SetMaxPets(num)`
* **Description:** Sets the maximum number of pets allowed globally (for non-prefab-limited pets).
* **Parameters:** `num` -- number maximum pet count.
* **Returns:** None.
* **Error states:** None.

### `GetMaxPets()`
* **Description:** Returns the maximum number of pets allowed globally.
* **Parameters:** None.
* **Returns:** Number representing the max pet limit.
* **Error states:** None.

### `GetNumPets()`
* **Description:** Returns the current count of non-prefab-limited pets.
* **Parameters:** None.
* **Returns:** Number representing current pet count.
* **Error states:** None.

### `IsFull()`
* **Description:** Checks if the global pet limit has been reached.
* **Parameters:** None.
* **Returns:** Boolean `true` if `numpets >= maxpets`, otherwise `false`.
* **Error states:** None.

### `IsPetAPrefabLimitedOne(prefab)`
* **Description:** Checks if a prefab has a specific per-prefab pet limit configured.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** Boolean `true` if the prefab has a limit, otherwise `false`.
* **Error states:** None.

### `SetMaxPetsForPrefab(prefab, maxpets)`
* **Description:** Sets a maximum pet limit for a specific prefab type.
* **Parameters:**
  - `prefab` -- string prefab name.
  - `maxpets` -- number maximum count for this prefab.
* **Returns:** None.
* **Error states:** None.

### `GetMaxPetsForPrefab(prefab)`
* **Description:** Returns the maximum pet limit for a specific prefab type.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** Number representing the max limit, or `0` if not configured.
* **Error states:** None.

### `GetNumPetsForPrefab(prefab)`
* **Description:** Returns the current count of pets for a specific prefab type.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** Number representing current count, or `0` if not tracked.
* **Error states:** None.

### `GetNumReservedPetsForPrefab(prefab)`
* **Description:** Returns the number of reserved pet slots for a specific prefab type.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** Number representing reserved count, or `0` if not tracked.
* **Error states:** None.

### `GetPetsWithPrefab(prefab)`
* **Description:** Returns a table of all pets matching the specified prefab.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** Table of pet entities, or `nil` if no pets match.
* **Error states:** None.

### `IsFullForPrefab(prefab)`
* **Description:** Checks if the pet limit for a specific prefab has been reached (including reserved slots).
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** Boolean `true` if limit reached, otherwise `false`.
* **Error states:** None.

### `ReservePetWithPrefab(prefab)`
* **Description:** Reserves a pet slot for a specific prefab type.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** None.
* **Error states:** None.

### `UnreservePetWithPrefab(prefab)`
* **Description:** Releases a reserved pet slot for a specific prefab type.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** None.
* **Error states:** None.

### `HasPetWithTag(tag)`
* **Description:** Checks if any pet in the collection has the specified tag.
* **Parameters:** `tag` -- string tag name.
* **Returns:** Boolean `true` if a pet has the tag, otherwise `false`.
* **Error states:** None.

### `GetPets()`
* **Description:** Returns the table of all tracked pets.
* **Parameters:** None.
* **Returns:** Table mapping pet entities to themselves.
* **Error states:** None.

### `IsPet(pet)`
* **Description:** Checks if an entity is currently tracked as a pet.
* **Parameters:** `pet` -- entity instance.
* **Returns:** Boolean `true` if the entity is a tracked pet, otherwise `false`.
* **Error states:** None.

### `SpawnPetAt(x, y, z, prefaboverride, skin)`
* **Description:** Spawns a pet entity at the specified position. Enforces pet limits before spawning.
* **Parameters:**
  - `x` -- number world X coordinate.
  - `y` -- number world Y coordinate.
  - `z` -- number world Z coordinate.
  - `prefaboverride` -- string prefab name or `nil` to use `petprefab`.
  - `skin` -- string skin name or `nil`.
* **Returns:** Spawned pet entity, or `nil` if spawn fails or limits exceeded.
* **Error states:** Errors if `prefaboverride` and `petprefab` are both `nil` (returns `nil` gracefully).

### `AttachPet(pet)`
* **Description:** Attaches an existing entity as a pet without spawning. Enforces pet limits.
* **Parameters:** `pet` -- entity instance to attach.
* **Returns:** Boolean `true` if attached successfully, `false` if already attached or limits exceeded.
* **Error states:** None.

### `DetachPet(pet)`
* **Description:** Detaches a pet from the collection without despawning it.
* **Parameters:** `pet` -- entity instance to detach.
* **Returns:** None.
* **Error states:** None.

### `DespawnPet(pet)`
* **Description:** Despawns a pet entity. Calls `ondespawnfn` if set, otherwise removes the pet directly.
* **Parameters:** `pet` -- entity instance to despawn.
* **Returns:** None.
* **Error states:** None.

### `DespawnAllPets()`
* **Description:** Despawns all pets in the collection.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `DespawnAllPetsWithPrefab(prefab)`
* **Description:** Despawns all pets matching a specific prefab.
* **Parameters:** `prefab` -- string prefab name.
* **Returns:** None.
* **Error states:** None.

### `OnSave()`
* **Description:** Serializes all pets for save data. Returns a table with pet save records.
* **Parameters:** None.
* **Returns:** Table with `pets` array containing save records, or `nil` if no pets.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Loads pets from save data by spawning save records and linking them.
* **Parameters:** `data` -- table containing `pets` array of save records.
* **Returns:** None.
* **Error states:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `TransferComponent(newinst)`
* **Description:** Placeholder for transferring component state to a new entity instance.
* **Parameters:** `newinst` -- target entity instance.
* **Returns:** None.
* **Error states:** None (currently empty implementation).

## Events & listeners
- **Listens to:** `onremove` - listens on each pet entity to detect when pets are removed, triggers `_onremovepet` callback.
- **Pushes:** None identified.