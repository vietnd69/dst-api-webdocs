---
id: birdcage
title: Birdcage
description: Manages the behavior of a birdcage that houses birds, handles feeding, interaction, sleeping cycles, and loot generation based on bird state and food type.
tags: [bird, inventory, interaction, animation, storage]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6be2b6c6
system_scope: entity
---

# Birdcage

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `birdcage` prefab implements a structure that can house birds as occupants. It integrates with multiple components to manage feeding behavior (including loot generation such as eggs, guano, or spoiled food), sleep/wake cycles synchronized with the bird’s internal clock, visual state changes (idle, sick, dead, empty), and trader-style food acceptance logic. It also integrates with `shelf` to temporarily hold poisoned items and supports saving/loading across server restarts.

## Usage example
```lua
local inst = SpawnPrefab("birdcage")
inst.Transform:SetPosition(x, y, z)

-- Add a bird occupant programmatically (e.g., a robin)
local bird = SpawnPrefab("robin")
inst.components.occupiable:Occupy(bird)

-- Feed the bird
local food = SpawnPrefab("seeds")
inst.components.trader:GiveItem(food, player)

-- Trigger sleeping manually
inst:PushEvent("gotosleep")
```

## Dependencies & tags
**Components used:**  
- `inspectable`  
- `lootdropper`  
- `occupiable`  
- `workable`  
- `trader`  
- `sanityaura`  
- `inventory`  
- `shelf`  
- `sleeper` (added dynamically)  

**Tags:**  
- `structure`, `cage`, `sanityaura` (added to pristine state)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CAGE_STATE` | string | `nil` | Current visual/state representation (`"_empty"`, `"_bird"`, `"_sick"`, `"_death"`, `"_skeleton"`). |
| `bird_type` | string | `nil` | Base name used to lookup override build animation (e.g., `"canary"`, `"mutatedbird"`). |

## Main functions
### `GetBird(inst)`
*   **Description:** Returns the bird occupant if present; otherwise returns `nil`.
*   **Parameters:** `inst` (entity) – The cage entity instance.
*   **Returns:** `Entity?` – The bird occupant or `nil`.

### `SetBirdType(inst, bird)`
*   **Description:** Configures the override build animation for the cage based on the bird type (e.g., to display different bird sprites inside the cage). Supports special overrides defined in `BUILD_OVERRIDES`.
*   **Parameters:**  
    - `bird` (string) – Prefab name of the bird (e.g., `"canary"`, `"mutatedbird"`).  
*   **Returns:** Nothing.

### `SetCageState(inst, state)`
*   **Description:** Updates the `CAGE_STATE` and adjusts visual bloom/light overrides on the `"bird_gem"` and `"crow_beak"` symbols.
*   **Parameters:**  
    - `state` (string) – One of the `CAGE_STATES` constants (`"_empty"`, `"_bird"`, `"_sick"`, `"_death"`, `"_skeleton"`).  
*   **Returns:** Nothing.

### `DigestFood(inst, food, giver)`
*   **Description:** Determines and spawns loot based on the fed food type (e.g., egg for meat, guano for non-meat, spoiled food for mutants). If the bird is a rift-type mutant, may charge and eventually spawn `purebrilliance`.
*   **Parameters:**  
    - `food` (entity) – The food item being digested (note: validity is not guaranteed at call time).  
    - `giver` (entity) – The player who fed the food.  
*   **Returns:** Nothing.

### `ShouldAcceptItem(inst, item)`
*   **Description:** Determines whether the cage/trader will accept the given item as food. Accepts seeds, meat, and lunar shards (for rift birds); rejects invalid food types.
*   **Parameters:** `item` (entity) – The item being offered.
*   **Returns:** `boolean` – Whether the item can be accepted.

### `OnOccupied(inst, bird)`
*   **Description:** Triggered when a bird enters the cage. Initializes the `sleeper` component, enables the trader, sets bird-specific animation overrides, and starts the idle animation loop.
*   **Parameters:**  
    - `bird` (entity) – The bird entity that occupied the cage.  
*   **Returns:** Nothing.

### `OnEmptied(inst, bird)`
*   **Description:** Triggered when the bird leaves or perishes. Removes the `sleeper` component, disables the trader, resets visual state, and stops animation tasks.
*   **Parameters:** `bird` (entity) – The bird entity that left.
*   **Returns:** Nothing.

### `DoAnimationTask(inst)`
*   **Description:** Randomly selects and plays an idle animation based on the bird’s hunger level (critical, hungry, content) and triggers associated sound events (chirps, wingflaps).
*   **Parameters:** `inst` (entity) – The cage entity.
*   **Returns:** Nothing.

### `ShouldSleep(inst)`
*   **Description:** Returns `true` if the bird inside should currently sleep (e.g., nighttime and not extremely hungry).
*   **Parameters:** `inst` (entity) – The cage entity.
*   **Returns:** `boolean`.

### `ShouldWake(inst)`
*   **Description:** Returns `true` if the bird should wake (e.g., daytime or very hungry).
*   **Parameters:** `inst` (entity) – The cage entity.
*   **Returns:** `boolean`.

### `OnBirdStarve(inst, bird)`
*   **Description:** Handles starvation state (sets visual `"DEAD"` state, spawns `smallmeat` as loot, stops animation loop).
*   **Parameters:**  
    - `bird` (entity) – The bird that starved.  
*   **Returns:** Nothing.

### `OnBirdPoisoned(inst, data)`
*   **Description:** Handles poisoning: replaces the bird with its poisoned variant, sets `"SICK"` visual state, starts sick animation loop, and saves the poisoned item on the shelf.
*   **Parameters:** `data` (table) – Contains `bird` and `poisoned_prefab`.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a status string used by `inspectable` (e.g., `"GENERIC"`, `"OCCUPIED"`, `"HUNGRY"`, `"SLEEPING"`, `"DEAD"`, `"SKELETON"`).
*   **Parameters:** `inst` (entity) – The cage entity.
*   **Returns:** `string`.

## Events & listeners
- **Listens to:**  
    - `onbuilt` – Triggers crafting sound and animation (`OnBuilt`).  
    - `gotosleep` – Triggers sleeping animation (`GoToSleep`).  
    - `onwakeup` – Triggers waking animation and restarts idle tasks (`WakeUp`).  
    - `birdpoisoned` – Only on worlds with `toadstoolspawner`; triggers poisoned state (`OnBirdPoisoned`).  
    - `perished` – Attached to shelf-held items; triggers skeleton state (`OnRotFn` → `OnBirdRot`).  

- **Pushes:**  
    - `ondropped` (via `inventoryitem.OnDropped`).  
    - `onwakeup`, `perished` (via bird callbacks), `entity_droploot`, `loot_prefab_spawned`.