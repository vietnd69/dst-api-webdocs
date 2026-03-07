---
id: lunarrift_crystals
title: Lunarrift Crystals
description: Handles the creation and behavior of lunarrift crystals, including spawn-in logic, mining interactions, recoil mechanics, and loot distribution.
tags: [mining, loot, environment, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a193dcb
system_scope: environment
---

# Lunarrift Crystals

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarrift_crystals.lua` defines two prefab constructors — `lunarrift_crystal_big` and `lunarrift_crystal_small` — which represent large and small moonglass crystal structures found in the Lunar Rift biome. The logic supports initial spawn-in behavior (delayed activation while checking for blockers), mining via the `workable` component with recoil protection, and proper loot dropping upon destruction. It integrates closely with `lootdropper`, `workable`, `timer`, and `savedrotation` components.

## Usage example
This file defines prefabs, not standalone components, but here is how the small crystal prefab would be instantiated and used in a mod:

```lua
local small_crystal = SpawnPrefab("lunarrift_crystal_small")
if small_crystal:IsValid() then
    small_crystal.Transform:SetPosition(x, y, z)
    small_crystal:PushEvent("docrystalspawnin", { time = 5.0 })
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `timer`, `inspectable`, `savedrotation`  
**Tags added:** `birdblocker`, `boulder`, `crystal`  
**Special tags checked:** `flying`, `ghost`, `playerghost`, `INLIMBO`, `FX`, `DECOR`, `character`, `structure`, `toughworker`, `explosive`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._anim_prefix` | string | `"full"` or `"small"` | Animation bank prefix used for the crystal's initial animation state. |
| `inst._recoils` | table or `nil` | `nil` | Maps worker entities to timestamps; used to enforce recoil delay between mining attempts. |
| `inst._spawnin_attempts` | number or `nil` | `nil` | Counter for how many times spawn-in detection has been retried (max 30 attempts). |

## Main functions
### `basecrystal_fn(anim_prefix, physics_size)`
*   **Description:** Shared constructor function that builds the base entity for both crystal sizes. Sets up physics, animation, minimap icon, and core components (`lootdropper`, `workable`, `timer`, `savedrotation`, `inspectable`), registers event listeners, and makes the entity hauntable.
*   **Parameters:**
    *   `anim_prefix` (string) — animation state prefix (`"full"` or `"small"`).
    *   `physics_size` (number) — radius for `MakeObstaclePhysics`.
*   **Returns:** `inst` (Entity) — a fully initialized entity instance.
*   **Error states:** Returns a client-only replica if `TheWorld.ismastersim` is false (non-master simulation). No damage occurs on client.

### `do_crystal_spawnin(inst, time)`
*   **Description:** Initiates spawn-in sequence: hides the crystal (plays `"empty"` anim), removes it from scene, and starts a timer. After `time` seconds, `finish_crystal_spawnin` is called.
*   **Parameters:**
    *   `inst` (Entity) — the crystal instance.
    *   `time` (number) — delay in seconds before reappearing.
*   **Returns:** Nothing.

### `finish_crystal_spawnin(inst)`
*   **Description:** Checks for entity blockers within `CRYSTAL_SPAWNIN_BLOCK_RADIUS` (1.0 unit). If none found, returns to scene and plays the appropriate animation; otherwise retries up to 30 times at 1s intervals, then destroys the instance.
*   **Parameters:** `inst` (Entity) — the crystal instance.
*   **Returns:** Nothing.

### `ShouldRecoil(inst, worker, tool, numworks)`
*   **Description:** Implements mining recoil logic: prevents workers without the `toughworker`, `explosive` tags, or a `tough` tool from doing full work when more than one mining unit remains. Returns `true, reduced_work` on recoil.
*   **Parameters:**
    *   `inst` (Entity) — crystal instance.
    *   `worker` (Entity) — mining entity (player/monster).
    *   `tool` (Entity or `nil`) — tool used.
    *   `numworks` (number) — intended work amount per strike.
*   **Returns:** `true, numworks * 0.1` on recoil, otherwise `false, numworks`.

### `on_big_crystal_worked(inst, worker, work_left)`
*   **Description:** Callback for big crystal mining; handles animation switching at half-progress (`HALF_WORK`) and final destruction with loot drop.
*   **Parameters:**
    *   `inst` (Entity) — crystal instance.
    *   `worker` (Entity) — miner.
    *   `work_left` (number) — remaining work required.
*   **Returns:** Nothing.

### `on_small_crystal_worked(inst, worker, work_left)`
*   **Description:** Callback for small crystal mining; only triggers loot drop on complete destruction.
*   **Parameters:**
    *   `inst` (Entity) — crystal instance.
    *   `worker` (Entity) — miner.
    *   `work_left` (number) — remaining work required.
*   **Returns:** Nothing.

### `do_deterraform_cleanup(inst)`
*   **Description:** Extra-safe cleanup to remove crystal if terraformer revert fails. Clears loot and destroys via `workable:Destroy`.
*   **Parameters:** `inst` (Entity) — crystal instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves `spawnin_attempts` to save data.
*   **Parameters:**
    *   `inst` (Entity) — crystal instance.
    *   `data` (table) — save table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores spawn-in state: restores `spawnin_attempts`, and resumes pending timer if present.
*   **Parameters:**
    *   `inst` (Entity) — crystal instance.
    *   `data` (table or `nil`) — loaded data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    *   `docrystalspawnin` — triggers `do_crystal_spawnin`.
    *   `timerdone` — triggers `on_crystal_timerdone`, dispatching to `finish_crystal_spawnin` or `do_deterraform_cleanup`.
- **Pushes:**
    *   None directly (event pushing is handled by components like `lootdropper`).