---
id: wormwood_mutantproxy
title: Wormwood Mutantproxy
description: Serves as a temporary visual and functional spawn proxy for Wormwood’s pet transformation ability, handling the animation, sound, and delayed spawning of the actual pet prefab after a fixed delay.
tags: [visual, proxy, pet, animation, spawn]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 49f6b496
system_scope: entity
---

# Wormwood Mutantproxy

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wormwood_mutantproxy` is a prefab used as a visual and logical intermediate during Wormwood’s `Mutant` pet transformation. When Wormwood transforms a pet, this proxy entity spawns, plays a transformation animation, emits a sound, and after 15 frames, triggers the actual pet spawn via `PetLeash:SpawnPetAt`. It does not persist in the world and is automatically removed after spawning the real pet or when the animation completes.

The proxy relies on the `petleash` component on the builder (Wormwood) to spawn the target pet at the proxy’s final position, and checks the builder’s `health` component to handle cleanup (e.g., removing the newly spawned pet if the builder died during transformation).

## Usage example
```lua
-- This prefab is instantiated automatically by the game during Wormwood's pet transformation.
-- Modders do not typically spawn it manually.
-- However, to create a similar proxy for custom pets, one would:
local proxy = SpawnPrefab("wormwood_mutantproxy_carrat")
proxy.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `timer`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `finish_spawn(inst)`
* **Description:** Internal helper called when the spawn timer completes. Uses the builder’s `petleash` component to spawn the actual pet prefab at the proxy’s location. If the builder is dead, it removes the spawned pet using `pet:RemoveWormwoodPet()`.
* **Parameters:** `inst` (Entity) — the proxy instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if `inst.builder` is invalid or lacks a `petleash` component. Returns `nil` from `SpawnPetAt` if the pet could not spawn (e.g., leash full), and does not call `RemoveWormwoodPet` in that case.

### `timerdone(inst, data)`
* **Description:** Event handler for `"timerdone"`; triggers `finish_spawn` when the `"finishspawn"` timer expires.
* **Parameters:**  
  - `inst` (Entity) — the proxy instance.  
  - `data` (table) — event data containing `name` field; only triggers spawn if `name == "finishspawn"`.
* **Returns:** Nothing.

### `onbuilt(inst, data)`
* **Description:** Event handler for `"onbuilt"`. Sets `inst.builder` to the builder entity (Wormwood) and attempts to adjust the proxy’s position to a walkable spot near the builder using `FindWalkableOffset`. Also registers cleanup listener to clear `inst.builder` on removal.
* **Parameters:**  
  - `inst` (Entity) — the proxy instance.  
  - `data` (table) — builder data (typically contains `builder` field).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"timerdone"` — triggers `finish_spawn` when `"finishspawn"` timer completes.  
  - `"onbuilt"` — initializes builder reference and adjusts position.  
  - `"animover"` — calls `inst.Remove` (i.e., destroys the proxy) once animation ends.  
  - `"onremove"` (on `builder`) — clears `inst.builder` if builder is removed.
- **Pushes:** None.