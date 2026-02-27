---
id: petleash
title: Petleash
description: Manages a collection of summoned pet entities, enforcing spawn limits globally and per-prefab, handling pet lifecycle, and integrating with the leader-follower system.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 64e01e91
---

# Petleash

## Overview
The `PetLeash` component manages summoned pet entities attached to an entity (typically the player), tracking them in a dictionary, enforcing maximum pet counts (both global and per-prefab), and coordinating their spawning, despawning, persistence, and saving/loading. It ensures pets are linked as followers and adjusts count tracking when pets are added or removed. It also supports optional callback functions for spawn, despawn, and removal events.

## Dependencies & Tags
- **Components relied upon:** `leader` (used via `self.inst.components.leader:AddFollower(pet)` if present).
- **Tags added/removed:** None directly added, but pets are assigned `persists = false` and may inherit behavior from the system.
- **Events listened for:** `"onremove"` on individual pets to auto-remove them from internal tracking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to. |
| `petprefab` | `string?` | `nil` | Default prefab name to spawn when no override is provided. |
| `pets` | `table<Entity, Entity>` | `{}` | Dictionary mapping pet entities to themselves (used as a set). |
| `maxpets` | `number` | `1` | Global maximum number of pets allowed. |
| `numpets` | `number` | `0` | Current count of non-prefab-limited pets. |
| `maxpetsperprefab` | `table<string, number>?` | `nil` | Optional map of prefab name → max count per prefab. |
| `numpetsperprefab` | `table<string, number>?` | `nil` | Current count of pets per prefab. |
| `reservedpetsperprefab` | `table<string, number>?` | `nil` | Count of reserved pet slots per prefab. |
| `onspawnfn` | `function?` | `nil` | Callback executed after a pet is spawned (`fn(inst, pet)`). |
| `ondespawnfn` | `function?` | `nil` | Callback executed before a pet is removed (`fn(inst, pet)`). |
| `onpetremoved` | `function?` | `nil` | Callback executed when a pet is auto-removed (e.g., via `"onremove"` event). |
| `_onremovepet` | `function` | (internal) | Internal callback bound to `pet`'s `"onremove"` event. |

## Main Functions
### `SetPetPrefab(prefab)`
* **Description:** Sets the default prefab used for future `SpawnPetAt` calls.
* **Parameters:**  
  `prefab` (string): Prefab name of the default pet.

### `SetOnSpawnFn(fn)`
* **Description:** Sets a custom callback to run on pet spawn instead of default behavior.
* **Parameters:**  
  `fn` (function): A function accepting `(inst, pet)`.

### `SetOnDespawnFn(fn)`
* **Description:** Sets a custom callback to run before a pet is despawned via `DespawnPet`.
* **Parameters:**  
  `fn` (function): A function accepting `(inst, pet)`.

### `SetOnRemovedFn(fn)`
* **Description:** Sets a callback triggered when a pet is automatically removed due to its own `"onremove"` event.
* **Parameters:**  
  `fn` (function): A function accepting `(inst, pet)`.

### `SetMaxPets(num)`
* **Description:** Sets the global maximum pet limit.
* **Parameters:**  
  `num` (number): New global pet cap.

### `GetMaxPets()`
* **Description:** Returns the global pet limit.
* **Parameters:** None.

### `GetNumPets()`
* **Description:** Returns the current number of non-prefab-limited pets.
* **Parameters:** None.

### `IsFull()`
* **Description:** Returns `true` if the global pet limit has been reached.
* **Parameters:** None.

### `IsPetAPrefabLimitedOne(prefab)`
* **Description:** Returns `true` if the given prefab is subject to a per-prefab limit.
* **Parameters:**  
  `prefab` (string): The prefab name.

### `SetMaxPetsForPrefab(prefab, maxpets)`
* **Description:** Enables per-prefab limiting for the given prefab and sets its limit.
* **Parameters:**  
  `prefab` (string): Prefab name.  
  `maxpets` (number): Max number allowed of this prefab.

### `GetMaxPetsForPrefab(prefab)`
* **Description:** Returns the max allowed count for a specific prefab.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `GetNumPetsForPrefab(prefab)`
* **Description:** Returns the current count of pets with the given prefab.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `GetNumReservedPetsForPrefab(prefab)`
* **Description:** Returns the number of reserved slots for the given prefab.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `IsFullForPrefab(prefab)`
* **Description:** Returns `true` if the pet limit (including reserved slots) is reached for the given prefab.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `ReservePetWithPrefab(prefab)`
* **Description:** Increases the reserved slot count for the given prefab.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `UnreservePetWithPrefab(prefab)`
* **Description:** Decreases the reserved slot count for the given prefab; cleans up the table if count reaches zero.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `GetPetsWithPrefab(prefab)`
* **Description:** Returns an array of all pets of the given prefab type.
* **Parameters:**  
  `prefab` (string): Prefab name.

### `GetPets()`
* **Description:** Returns the internal pets dictionary (note: keys are pet entities).
* **Parameters:** None.

### `IsPet(pet)`
* **Description:** Checks if the given entity is currently managed as a pet.
* **Parameters:**  
  `pet` (Entity): Entity to check.

### `SpawnPetAt(x, y, z, prefaboverride, skin)`
* **Description:** Spawns a new pet at the specified world coordinates, respecting limits. If `prefaboverride` is provided, it is used; otherwise, `self.petprefab` is used.
* **Parameters:**  
  `x`, `y`, `z` (number): World coordinates.  
  `prefaboverride` (string?): Optional prefab to spawn instead of default.  
  `skin` (string?): Optional skin override.  
  *Returns:* `Entity?` — the spawned pet, or `nil` if spawn failed (e.g., limit reached).

### `AttachPet(pet)`
* **Description:** Attaches an already-existing pet to this component (for external spawning), respecting limits. Does not spawn.
* **Parameters:**  
  `pet` (Entity): The pet to attach.  
  *Returns:* `boolean` — `true` if successfully attached, `false` otherwise.

### `DetachPet(pet)`
* **Description:** Manually detaches a pet without removing it, decrementing count tracking.
* **Parameters:**  
  `pet` (Entity): The pet to detach.

### `DespawnPet(pet)`
* **Description:** Removes the pet using `ondespawnfn` if present, or `pet:Remove()` otherwise.
* **Parameters:**  
  `pet` (Entity): The pet to despawn.

### `DespawnAllPets()`
* **Description:** Despawns all managed pets.
* **Parameters:** None.

### `DespawnAllPetsWithPrefab(prefab)`
* **Description:** Despawns all pets of the given prefab.
* **Parameters:**  
  `prefab` (string): Prefab name to despawn.

### `OnSave()`
* **Description:** Serializes all pets for saving; sets `temp_save_platform_pos = true` on pets before saving.
* **Parameters:** None.  
  *Returns:* `{ pets = array_of_save_records }` or `nil` if no pets.

### `OnLoad(data)`
* **Description:** Loads pets from save data; respawns each pet via `SpawnSaveRecord` and links them.
* **Parameters:**  
  `data` (table): Saved data containing `"pets"` array.

### `OnRemoveFromEntity()`
* **Description:** Cleans up `"onremove"` event listeners on all pets before component removal.
* **Parameters:** None.

### `OnRemoveEntity` (alias: `DespawnAllPets`)
* **Description:** Class function; calls `DespawnAllPets` when the entity is removed.

### `TransferComponent(newinst)`
* **Description:** Stub function intended for component migration; currently empty.
* **Parameters:**  
  `newinst` (Entity): Target entity.

## Events & Listeners
- **Listens to `"onremove"` events** on each pet entity to automatically remove it from internal tracking (`self.pets`) and decrement counters.
- **Calls `self.inst:PushEvent(...)` internally?** No explicit events are pushed by this component based on the code.
- **Uses `inst:ListenForEvent("onremove", ...)`** internally.
- **Uses `inst:RemoveEventCallback(...)`** when detaching or cleaning up.