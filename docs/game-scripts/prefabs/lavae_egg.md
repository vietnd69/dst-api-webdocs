---
id: lavae_egg
title: Lavae Egg
description: Manages the lifecycle of a Lavae egg, including temperature responsiveness, hatching behavior, and loot generation upon failure or successful hatching.
tags: [creature, egg, hatchable, loot, playerprox]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 79a4765d
system_scope: entity
---

# Lavae Egg

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavae_egg` prefab implements a hatcher-based creature egg that responds to player proximity and environmental temperature. It supports two states: a standard `lavae_egg` (unhatched/cracked) and `lavae_egg_cracked` (on the verge of hatching). It leverages the `hatchable`, `inventoryitem`, `inspectable`, `playerprox`, and `lootdropper` components to manage hatching conditions, interaction, status display, proximity detection, and loot generation. Hatching occurs only when a player is nearby and the egg is in the `"hatch"` state.

## Usage example
```lua
-- Spawning a standard unhatched lavae egg
local egg = SpawnPrefab("lavae_egg")
egg.Transform:SetPosition(x, y, z)

-- Spawning a cracked egg ready to hatch (requires player nearby to hatch)
local cracked_egg = SpawnPrefab("lavae_egg_cracked")
cracked_egg.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:**  
- `hatchable` – for temperature sensitivity and hatching state management  
- `inventoryitem` – for picking up, dropping, and inventory interaction  
- `inspectable` – for status text display (e.g., `"COLD"`, `"COMFY"`)  
- `playerprox` – for detecting nearby players to trigger hatching  
- `lootdropper` – for dropping loot (`lavae_tooth`, `rocks`)  

**Tags:** None explicitly added or removed by this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `loot_cold` | table | `{"rocks"}` | Loot list used when the egg fails to hatch (dies from cold). |

## Main functions
### `common_fn(anim)`
*   **Description:** Shared prefab constructor for both `lavae_egg` and `lavae_egg_cracked`. Sets up core entity components (AnimState, Transform, SoundEmitter, Network), adds inventory/inspectable/hatchable/playerprox/lootdropper components (on master), configures hatching timers and temperature preferences, and wires event callbacks.
*   **Parameters:** `anim` (string) – the initial animation to play (e.g., `"idle"` or `"happy"`).
*   **Returns:** `inst` – the created entity instance.
*   **Error states:** Returns early on non-master clients without adding most components (prefabs are pristined on all sides).

### `StartSpawn(inst)`
*   **Description:** Initiates the hatching sequence when the egg is ready to hatch and the player is nearby. Plays the `"hatch"` animation and emits timing-specific sounds, then removes the egg upon animation completion and spawns the Lavae pet.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** Not applicable.

### `SpawnLavae(inst)`
*   **Description:** Spawns the `lavae_tooth` pet at the egg’s location if the pet leash is not full, then destroys the egg.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early if spawning the `lavae_tooth` fails or if `petleash:IsFull()` is true.

### `DropLoot(inst)`
*   **Description:** Spawns loot when the egg dies due to cold. Adds `loot_cold` loot and prevents the egg from persisting or being picked up.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.

### `OnHatchState(inst, state)`
*   **Description:** Callback triggered when the `hatchable.state` changes. Handles visual/audio feedback and transitions based on the new state:  
    - `"crack"`: spawns and removes cracked egg prefabs; plays cracking/bouncing sounds.  
    - `"uncomfy"`: plays shiver animation/sound if `toocold` is true.  
    - `"comfy"`: plays the `"happy"` idle animation.  
    - `"hatch"`: checks if player is nearby and starts hatching.  
    - `"dead"`: plays death sound/animations, drops loot, and removes the egg after delay.
*   **Parameters:**  
    - `inst` (entity) – the egg entity.  
    - `state` (string) – the new `hatchable.state` value (`"unhatched"`, `"crack"`, `"uncomfy"`, `"comfy"`, `"hatch"`, `"dead"`).
*   **Returns:** Nothing.

### `CheckHatch(inst)`
*   **Description:** Conditionally triggers hatching if player is within proximity, the egg is in `"hatch"` state, and it is not currently held.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Enables hatching updates and checks for hatching when the egg is dropped.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Pauses hatching updates when the egg is placed in an inventory.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Ensures proper hatchable/inventory state on load: if held on load, pauses hatching updates.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** Nothing.

### `describe(inst)`
*   **Description:** Returns human-readable status text for the `inspectable` component: `"COLD"` (if `uncomfy`), `"COMFY"` (if `comfy`), or `"GENERIC"` otherwise.
*   **Parameters:** `inst` (entity) – the egg entity.
*   **Returns:** `string` – status description.

## Events & listeners
- **Listens to:**  
  - `animover` – triggers `SpawnLavae` when the `"hatch"` animation completes.  
  - `OnLoadPostPass` – internal hook used to resolve component load order (not a game event; used internally by DST).

- **Pushes:** None directly.  
  (Note: `SpawnLootPrefab` and other components may push internal events, but none are explicitly pushed by this script.)
