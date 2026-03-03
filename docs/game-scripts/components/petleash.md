---
id: petleash
title: Petleash
description: Manages a set of pet entities associated with an owner, including limits, spawning, attaching, and despawning.
tags: [pet, inventory, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 64e01e91
system_scope: entity
---
# Petleash

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PetLeash` is a component that tracks and manages a collection of pet entities owned by an entity (typically a player or mob). It supports both global and per-prefab pet counts with configurable limits, and provides methods to spawn, attach, detach, and despawn pets. It automatically links pets to the owner's `leader` component if present, enabling follower behavior. This component is commonly used for characters or prefabs that can tame or control other creatures.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("petleash")
inst.components.petleash:SetPetPrefab("pigman")
inst.components.petleash:SetMaxPets(3)
inst.components.petleash:SetMaxPetsForPrefab("pigman", 2)
local pet = inst.components.petleash:SpawnPetAt(0, 0, 0)
```

## Dependencies & tags
**Components used:** `leader` (optional; calls `AddFollower` on pets if present)
**Tags:** Checks `pet.prefab` and `v:HasTag(tag)`; no tags added or removed directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity that owns this component. |
| `petprefab` | `string?` | `nil` | Default prefab name for newly spawned pets. |
| `pets` | `table` | `{}` | Map of pet entities currently attached (`pet -> pet`). |
| `maxpets` | `number` | `1` | Maximum total number of pets allowed. |
| `numpets` | `number` | `0` | Current total number of pets. |
| `maxpetsperprefab` | `table?` | `nil` | Map of prefab name → max count for per-prefab limits. |
| `numpetsperprefab` | `table?` | `nil` | Map of prefab name → current count for per-prefab limits. |
| `reservedpetsperprefab` | `table?` | `nil` | Map of prefab name → reserved pet slots (prevents overbooking during load/transition). |
| `onspawnfn` | `function?` | `nil` | Callback fired when a pet is spawned (`fn(owner, pet)`). |
| `ondespawnfn` | `function?` | `nil` | Callback fired when a pet is despawned (`fn(owner, pet)`). |
| `onpetremoved` | `function?` | `nil` | Callback fired when a pet is removed via `onremove` event (`fn(owner, pet)`). |

## Main functions
### `SetPetPrefab(prefab)`
*   **Description:** Sets the default prefab to use when spawning new pets.
*   **Parameters:** `prefab` (string) - prefab name to use as default.
*   **Returns:** Nothing.

### `SetMaxPets(num)`
*   **Description:** Sets the maximum total number of pets allowed.
*   **Parameters:** `num` (number) - new pet limit.
*   **Returns:** Nothing.

### `GetMaxPets()`
*   **Description:** Returns the configured maximum total pet count.
*   **Parameters:** None.
*   **Returns:** `number` — the current `maxpets` value.

### `GetNumPets()`
*   **Description:** Returns the current count of pets (non-prefab-specific).
*   **Parameters:** None.
*   **Returns:** `number` — current total pet count.

### `IsFull()`
*   **Description:** Checks if the global pet limit has been reached.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `numpets >= maxpets`, otherwise `false`.

### `SetMaxPetsForPrefab(prefab, maxpets)`
*   **Description:** Configures a per-prefab pet limit.
*   **Parameters:** `prefab` (string), `maxpets` (number).
*   **Returns:** Nothing.

### `GetMaxPetsForPrefab(prefab)`
*   **Description:** Returns the per-prefab limit for a given prefab.
*   **Parameters:** `prefab` (string).
*   **Returns:** `number` — `0` if no limit is set.

### `GetNumPetsForPrefab(prefab)`
*   **Description:** Returns the current number of pets for a given prefab.
*   **Parameters:** `prefab` (string).
*   **Returns:** `number` — current count for that prefab.

### `IsFullForPrefab(prefab)`
*   **Description:** Checks if both the active and reserved pet counts for a prefab have exceeded its limit.
*   **Parameters:** `prefab` (string).
*   **Returns:** `boolean` — `true` if `active + reserved >= max`.

### `ReservePetWithPrefab(prefab)`
*   **Description:** Reserves a slot for a pet of the given prefab (used during loading or speculative spawning).
*   **Parameters:** `prefab` (string).
*   **Returns:** Nothing.

### `UnreservePetWithPrefab(prefab)`
*   **Description:** Releases a reserved slot for a pet of the given prefab.
*   **Parameters:** `prefab` (string).
*   **Returns:** Nothing.

### `HasPetWithTag(tag)`
*   **Description:** Checks whether any attached pet has the specified tag.
*   **Parameters:** `tag` (string).
*   **Returns:** `boolean` — `true` if at least one pet has the tag.

### `GetPets()`
*   **Description:** Returns the internal pets table.
*   **Parameters:** None.
*   **Returns:** `table` — the `pets` map.

### `IsPet(pet)`
*   **Description:** Checks if a given entity is currently attached as a pet.
*   **Parameters:** `pet` (`Entity`).
*   **Returns:** `boolean` — `true` if `pet` is in `pets`.

### `SpawnPetAt(x, y, z, prefaboverride, skin)`
*   **Description:** Spawns a new pet at the given coordinates, applying prefab and skin overrides if provided.
*   **Parameters:**  
  - `x`, `y`, `z` (number) — spawn position.  
  - `prefaboverride` (string?, optional) — overrides `petprefab`.  
  - `skin` (string?, optional) — skin name to pass to `SpawnPrefab`.
*   **Returns:** `Entity?` — the spawned pet, or `nil` if limits exceeded or prefab not set.

### `AttachPet(pet)`
*   **Description:** Attaches an externally spawned pet to the leash, respecting all limits.
*   **Parameters:** `pet` (`Entity`).
*   **Returns:** `boolean` — `true` if successfully attached, `false` if already attached or limits exceeded.

### `DetachPet(pet)`
*   **Description:** Removes a pet from the leash without destroying it (used for manual control of pet lifecycle).
*   **Parameters:** `pet` (`Entity`).
*   **Returns:** Nothing.

### `DespawnPet(pet)`
*   **Description:** Removes and destroys a pet. If `ondespawnfn` is set, it is called instead of `pet:Remove()`.
*   **Parameters:** `pet` (`Entity`).
*   **Returns:** Nothing.

### `DespawnAllPets()`
*   **Description:** Destroys or despawns all attached pets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DespawnAllPetsWithPrefab(prefab)`
*   **Description:** Destroys or despawns all pets of a specific prefab.
*   **Parameters:** `prefab` (string).
*   **Returns:** Nothing.

### `GetPetsWithPrefab(prefab)`
*   **Description:** Returns a list of pets matching the given prefab.
*   **Parameters:** `prefab` (string).
*   **Returns:** `table?` — array of pets (table), or `nil` if none exist.

### `OnSave()`
*   **Description:** Serializes all pets into a save record.
*   **Parameters:** None.
*   **Returns:** `{ pets: table }` — table of save records, or `nil` if no pets.

### `OnLoad(data)`
*   **Description:** Deserializes pets from save data and attaches them.
*   **Parameters:** `data` (table?) — must contain `{ pets: table }`.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up event listeners on all attached pets when component is removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on pets) — triggers `self._onremovepet` to decrement counters and fire `onpetremoved` callback.
- **Pushes:** No events directly; events are handled via callbacks.

