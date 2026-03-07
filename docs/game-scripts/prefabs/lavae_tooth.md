---
id: lavae_tooth
title: Lavae Tooth
description: Serves as the spawn point and container for a Lavae pet; when despawned, it transforms into ash and drops at the location with visual and audio feedback.
tags: [pet, spawn, drop, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 45c58aaa
system_scope: entity
---

# Lavae Tooth

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavae_tooth` is a prefab that functions as a visual and logical placeholder for the Lavae boss's pet-spawning mechanism. It exists as a small, floating inventory item (an "egg tooth") and enables controlled spawning of the `lavae_pet` via the `petleash` component. When removed (e.g., via despawn or ownership loss), it triggers a cleanup sequence that spawns `small_puff` FX, converts itself to `ash`, and attempts to return the ash to its original inventory/container slot if available. This prefab is integral to the Lavae boss fight progression.

## Usage example
```lua
-- Typically created internally via the prefab system
local tooth = SpawnPrefab("lavae_tooth")

-- When attached to a Lavae entity (e.g., as a boss token), the petleash component manages pet lifecycle
if tooth.components.petleash then
    tooth.components.petleash:SpawnPet()  -- triggers OnSpawnFn (see below)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `leader`, `petleash`, `transform`, `animstate`, `network`  
**Tags:** Adds `donotautopick`  
**Prefabs spawned:** `lavae_pet`, `small_puff`, `ash`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `nospawnfx` | boolean | `nil` | When truthy, suppresses spawnFX (small_puff) on pet spawn. |

## Main functions
### `OnSpawn(inst, pet)`
* **Description:** Executed when the `lavae_pet` is spawned. Plays a spawn FX (`small_puff`) unless `nospawnfx` is set, and registers a listener for the pet's `onremove` event to trigger cleanup.
* **Parameters:**  
  `inst` (Entity) — the `lavae_tooth` instance.  
  `pet` (Entity) — the spawned `lavae_pet`.
* **Returns:** Nothing.

### `OnDespawn(inst, pet)`
* **Description:** Executed when the `lavae_pet` is removed manually or via despawn. Spawns `small_puff` FX, clears the `onremove` listener, and destroys the pet entity.
* **Parameters:**  
  `inst` (Entity) — the `lavae_tooth` instance.  
  `pet` (Entity) — the despawned `lavae_pet`.
* **Returns:** Nothing.

### `OnPetLost(inst, pet)`
* **Description:** Called when the `lavae_pet` is removed. Spawns `ash`, attempts to retain inventory slot position if the original owner had an inventory or container, and emits a sound. This ensures ash remains contextually placed (e.g., in player inventory).
* **Parameters:**  
  `inst` (Entity) — the `lavae_tooth` instance.  
  `pet` (Entity) — the lost `lavae_pet`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on the `lavae_pet` instance) — triggers `OnPetLost` when the pet is removed.
- **Pushes:** None identified.
