---
id: mermkingmanager
title: Mermkingmanager
description: Manages the lifecycle of Merm Kings, including candidate selection, throne validation, transformation logic, and world state persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5e14706e
---

# Mermkingmanager

## Overview
This component orchestrates the Merm King mechanic in DST by managing throne entities, candidate selection and validation, king transformation, and event-driven state changes. It operates on the world instance (`TheWorld`) and coordinates interactions between merm candidates, thrones, and the resulting Merm King entity—including handling death, removal, persistence, and shard-aware state queries.

## Dependencies & Tags
- **Component events listened to**: `oncandidatekingarrived`, `onthronebuilt`, `onthronedestroyed`
- **Entity tags added/removed**:
  - Adds `"mermprince"` tag to valid Merm candidates
  - Removes `"mermprince"` tag when candidate is cleared (e.g., throne destroyed or king crowned)
- **World-level events pushed**:
  - `onmermkingcreated`, `onmermkingdestroyed`
- **Entity callbacks**:
  - Registers `death` and `onremove` callbacks for king and candidates

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owner entity (always `TheWorld`) |
| `main_throne` | `Entity` or `nil` | `nil` | The throne currently occupied by the active Merm King or being prepared for king transformation |
| `thrones` | `table<Entity>` | `{}` | List of all valid, non-destroyed throne entities known to this manager |
| `king` | `Entity` or `nil` | `nil` | The current Merm King entity (if one exists and is alive) |
| `king_dying` | `boolean` | `false` | Flag indicating the king is currently in the process of dying (used to avoid duplicate state resets) |
| `candidates` | `table<Entity → Entity>` | `{}` | Mapping of throne → candidate entity for thrones with an eligible Merm candidate present |
| `candidate_transforming` | `Entity` or `nil` | `nil` | Candidate currently in the process of transforming into a Merm King |

## Main Functions
### `CreateMermKing(candidate, throne)`
* **Description:** Converts a Merm candidate into a Merm King at the specified throne, replacing its prefab, clearing inventory, cleaning up listeners, marking the throne as main, and broadcasting `onmermkingcreated`.
* **Parameters:**
  - `candidate` (`Entity`): The Merm candidate entity to transform.
  - `throne` (`Entity`): The throne entity where the transformation occurs.

### `FindMermCandidate(throne)`
* **Description:** Searches for a valid Merm candidate near the given throne (within 50 units), provided no king currently exists. If found, attempts to register them as a candidate via `ShouldGoToThrone`.
* **Parameters:**
  - `throne` (`Entity`): The throne to scan for candidates.

### `ShouldGoToThrone(merm, throne)`
* **Description:** Registers a Merm as a candidate at a throne if conditions are met (no existing king, throne is valid, Merm isn’t already a candidate/king/shadow minion). Updates name override and tags accordingly.
* **Parameters:**
  - `merm` (`Entity`): The candidate Merm entity.
  - `throne` (`Entity`): The throne to assign the candidate to.
* **Returns:** `boolean` — `true` if registration succeeded; otherwise `false`.

### `OnThroneDestroyed(throne)`
* **Description:** Handles destruction of a throne: removes it from tracking, deregisters any candidate at that throne, attempts to unseat a candidate still at the throne, and if it was the main throne, kills the king (if alive) and resets king state.
* **Parameters:**
  - `throne` (`Entity`): The destroyed throne.

### `IsThroneValid(throne)`
* **Description:** Checks if a throne is still valid for king transformation: must exist, not be burning/burnt, and not have a king corpse on it.
* **Parameters:**
  - `throne` (`Entity`): The throne to validate.
* **Returns:** `boolean` — `true` if throne is valid; otherwise `false`.

### `ShouldTransform(merm)`
* **Description:** Determines whether a given Merm candidate is ready to transform into the Merm King based on location, state, and cooldowns.
* **Parameters:**
  - `merm` (`Entity`): The candidate Merm entity.
* **Returns:** `boolean` — `true` if transformation should proceed.

### `HasKingLocal()`
* **Description:** Returns `true` if a king exists and is alive on the local world shard.
* **Returns:** `boolean`

### `HasKingAnywhere()`
* **Description:** Returns `true` if a king exists anywhere across shards (checks local first, then delegates to `shard_mermkingwatcher`).
* **Returns:** `boolean`

### `HasTridentLocal()`, `HasTridentAnywhere()`, `HasCrownLocal()`, `HasCrownAnywhere()`, `HasPauldronLocal()`, `HasPauldronAnywhere()`
* **Description:** Each checks for the corresponding item (trident, crown, pauldron) on the king locally, or across shards via `shard_mermkingwatcher`.
* **Parameters:** None
* **Returns:** `boolean`

### `OnSave()`
* **Description:** Serializes component state for saving, returning data table and list of entity GUIDs needed for persistence.
* **Returns:** `data` (`table`), `ents` (`table<string>`) — where `ents` contains GUIDs forking-related entities.

### `LoadPostPass(newents, savedata)`
* **Description:** Restores component state after loading, linking saved GUIDs to their real entities and re-registering event callbacks.
* **Parameters:**
  - `newents` (`table<GUID, {entity=Entity}>`): Map of GUIDs to entity objects.
  - `savedata` (`table`): Saved state loaded from disk.

## Events & Listeners
- Listens for:
  - `"oncandidatekingarrived"` — triggers king creation if candidate and throne are valid.
  - `"onthronebuilt"` — adds new throne to `thrones`, initiates candidate search.
  - `"onthronedestroyed"` — handles throne removal and cleanup.
  - `"onremove"` and `"death"` — for king and candidates (via `OnKingRemoval`, `OnKingDeath`, `OnCandidateRemoved`).
- Emits:
  - `"onmermkingcreated"` — after successful king creation.
  - `"onmermkingdestroyed"` — after king removal.