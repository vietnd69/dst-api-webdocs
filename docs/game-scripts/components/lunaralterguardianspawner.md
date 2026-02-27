---
id: lunaralterguardianspawner
title: Lunaralterguardianspawner
description: Spawns and manages a lunar altar guardian when triggered, handling spawn point calculation, delayed instantiation, and save/load state persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 410481d9
---

# Lunaralterguardianspawner

## Overview
This component enables an entity (typically a spawner like `wagstaff_npc_wagpunk_arena` or similar) to spawn a `alterguardian_phase1_lunarrift` entity at a nearby valid location when activated. It manages the lifecycle of the guardian—including tracking pending spawns, active guardians, and saving/loading state across sessions—while enforcing constraints such as safe spawn positions and mutual exclusivity (only one guardian can be active or pending at a time).

## Dependencies & Tags
- **Mastersim scope only**: Enforced by `assert(TheWorld.ismastersim, ...)`
- No components added to `self.inst` (this component is designed to be attached directly or used internally).
- Does not directly add or remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity this component is attached to (set in `_ctor`). |
| `_activeguardian` | `Entity?` | `nil` | Internal reference to the currently active guardian entity (or `nil` if none). |
| `guardiancomingpt` | `Vector3?` | `nil` | Spawn position for a guardian that is pending (i.e., scheduled but not yet spawned). |

## Main Functions

### `GetGuardian()`
* **Description:** Returns the current active guardian entity, if one exists.
* **Parameters:** None  
* **Returns:** `Entity?` – The guardian entity or `nil`.

### `HasGuardianOrIsPending()`
* **Description:** Checks whether a guardian is currently active *or* a spawn is pending (i.e., a spawn position has been set but the guardian hasn’t been instantiated yet).
* **Parameters:** None  
* **Returns:** `boolean` – `true` if a guardian is active or pending, otherwise `false`.

### `KickOffSpawn(delay)`
* **Description:** Creates a delayed task that spawns the `alterguardian_phase1_lunarrift` prefab at the location stored in `self.guardiancomingpt`, sets up cleanup on removal, transitions it to the `"spawn_lunar"` state, and clears `self.guardiancomingpt`.
* **Parameters:**  
  - `delay` (`number`) – Time in seconds before spawning the guardian.

### `TrySpawnLunarGuardian(spawner)`
* **Description:** Attempts to initiate a guardian spawn. Fails if a guardian is already active or pending. Otherwise, computes a safe spawn position near the spawner’s location and schedules the spawn with an appropriate delay.
* **Parameters:**  
  - `spawner` (`?Entity` or `Transform`-like object) – The source spawner (used to get position and optionally determine delay). If `nil`, the function exits early.

### `OnSave()`
* **Description:** Serializes the component’s state for saving, including the guardian’s GUID (if active) and the pending spawn point coordinates.
* **Parameters:** None  
* **Returns:**  
  - `data` (`table`) – Map of key-value pairs: `activeguid`, `guardiancomingpt_x`, `guardiancomingpt_z`.  
  - `ents` (`table`) – List of GUIDs for entities to persist alongside the component.

### `OnLoad(data)`
* **Description:** Restores pending spawn state from saved data: reconstructs the pending spawn point and re-initiates the spawn with a 4-second delay.
* **Parameters:**  
  - `data` (`table?`) – The saved data table.

### `LoadPostPass(newents, data)`
* **Description:** After entity loading is complete, resolves the saved guardian GUID to the actual entity and reattaches the `"onremove"` listener.
* **Parameters:**  
  - `newents` (`table`) – Map of GUID → `{entity = ...}` for newly loaded entities.  
  - `data` (`table`) – Saved data used to look up the guardian’s GUID.

### `_Debug_SpawnGuardian(player)`
* **Description:** Debug helper that forces a guardian spawn at the player’s (or a given player’s) location, bypassing all checks.
* **Parameters:**  
  - `player` (`?PlayerControl`) – Optional player whose position is used as spawner. Defaults to `ThePlayer`.

## Events & Listeners
- Listens to `"onremove"` on the spawned guardian to clear `_activeguardian`.
- Listens to `"onremove"` on the *saved* guardian (via `LoadPostPass`) for the same purpose.
- Does not emit any events itself (uses internal state and delayed tasks instead).