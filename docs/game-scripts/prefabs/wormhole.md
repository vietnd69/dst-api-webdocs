---
id: wormhole
title: Wormhole
description: Manages the Wormhole prefab, a teleportation structure that opens when players approach and teleports entities (including followers) to a linked Teleporter.
tags: [teleport, world, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e2e0266c
system_scope: world
---

# Wormhole

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wormhole` prefab implements a large-scale teleportation device used for inter-world travel (e.g., Between and World Shifts) or long-distance teleportation. It is a non-colliding structure that automatically opens when a player comes within proximity, remains open during active teleportation, and closes after inactivity. It supports item and player teleportation, includes sanity loss on use, and integrates with the trader, inspectable, playerprox, and roseinspectable systems.

## Usage example
```lua
local inst = SpawnPrefab("wormhole")
inst.components.teleporter.targetTeleporter = some_other_teleporter
inst:disable_sanity_drain = true -- optional: prevent sanity loss for users
```

## Dependencies & tags
**Components used:** `inspectable`, `playerprox`, `teleporter`, `inventory`, `trader`, `roseinspectable`, `soundemitter`, `animstate`, `minimapentity`, `physics`, `network`, `transform`  
**Tags added:** `trader`, `alltrader`, `antlion_sinkhole_blocker`, `wormhole`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `disable_sanity_drain` | boolean | `false` | When `true`, prevents sanity loss for players teleporting through this wormhole. |

## Main functions
### `GetStatus(inst)`
* **Description:** Returns `"OPEN"` if the wormhole is currently in an open state (i.e., its stategraph is not `"idle"`), otherwise `nil`.
* **Parameters:** `inst` (Entity) — the wormhole entity instance.
* **Returns:** `"OPEN"` or `nil`.

### `OnActivate(inst, doer)`
* **Description:** Handles activation by a player or non-player entity. Grants achievement, applies sanity loss, closes speaker, and triggers linked teleporter cleanup if applicable.
* **Parameters:**  
  - `inst` (Entity) — the wormhole entity.  
  - `doer` (Entity) — the entity triggering teleportation.  
* **Returns:** Nothing.  
* **Error states:** Sanity loss is skipped if `doer` has tag `"nowormholesanityloss"` or `inst.disable_sanity_drain` is `true`.

### `OnActivateByOther(inst, source, doer)`
* **Description:** Forces the wormhole to open if it is not already open, regardless of player proximity.
* **Parameters:**  
  - `inst` (Entity)  
  - `source` (unknown) — unused in implementation.  
  - `doer` (Entity) — unused in implementation.  
* **Returns:** Nothing.

### `onnear(inst)`
* **Description:** Listener callback for `playerprox.onnear`; opens the wormhole if it is active and not already open.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `onfar(inst)`
* **Description:** Listener callback for `playerprox.onfar`; initiates closing if no teleportation is in progress and the wormhole is currently open.
* **Parameters:** `inst` (Entity)
* **Returns:** Nothing.

### `onaccept(inst, giver, item)`
* **Description:** Called by `trader` when an item is accepted for teleportation; drops the item into the wormhole and immediately activates teleportation.
* **Parameters:**  
  - `inst` (Entity)  
  - `giver` (Entity) — unused  
  - `item` (Entity) — the item to teleport  
* **Returns:** Nothing.

### `StartTravelSound(inst, doer)`
* **Description:** Triggers the swallowed sound effect and fires `"wormholetravel"` on the teleporting entity for local audio synchronization.
* **Parameters:**  
  - `inst` (Entity)  
  - `doer` (Entity)  
* **Returns:** Nothing.

### `CanResidueBeSpawnedBy(inst, doer)`
* **Description:** Determines whether a Charlie residue can be spawned for this wormhole, based on a specific skill tree upgrade (`winona_charlie_2`).
* **Parameters:**  
  - `inst` (Entity)  
  - `doer` (Entity or nil)  
* **Returns:** `true` if `winona_charlie_2` is activated; otherwise `false`.

### `OnResidueCreated(inst, residueowner, residue)`
* **Description:** Configures the created residue to use `WORMHOLE` map action context if the associated skill upgrade is active.
* **Parameters:**  
  - `inst` (Entity)  
  - `residueowner` (Entity)  
  - `residue` (Entity)  
* **Returns:** Nothing.

### `OnSave(inst, data)` & `OnLoad(inst, data)`
* **Description:** Serialization helpers; persist/restore the `disable_sanity_drain` flag.
* **Parameters:**  
  - `inst` (Entity)  
  - `data` (table or nil) — table for saving, or loaded data for restoring  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"starttravelsound"` — triggers `StartTravelSound()` for audio synchronization during teleport.  
  - `"doneteleporting"` — triggers `OnDoneTeleporting()` to manage post-teleport behavior (delayed closing).  

- **Pushes:**  
  - None directly (events are used internally via callbacks and listeners only).