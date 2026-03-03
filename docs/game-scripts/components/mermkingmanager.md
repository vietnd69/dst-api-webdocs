---
id: mermkingmanager
title: Mermkingmanager
description: Manages the lifecycle of Merm Kings, including throne selection, candidate transformation, and world-wide king state tracking in Don't Starve Together.
tags: [boss, ai, merm, quest, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5e14706e
system_scope: world
---

# Mermkingmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MermKingManager` is a world-scoped component responsible for managing the emergence, transformation, and destruction of the Merm King and his candidates in Don't Starve Together. It tracks valid thrones, identifies eligible Merm candidates, handles transformation logic when a candidate's calorie threshold is met, and coordinates state persistence and replication across game shards. It integrates closely with the `mermcandidate`, `health`, `inventory`, and `inspectable` components to manage state transitions.

## Usage example
```lua
-- Typically attached automatically to TheWorld; not manually added by mods.
-- Example interaction with the manager:
local manager = TheWorld.components.mermkingmanager
if not manager:HasKingAnywhere() then
    -- Force a new king search (requires a valid throne and Merm candidate)
    local throne = GetValidThroneSomehow()
    manager:FindMermCandidate(throne)
end
```

## Dependencies & tags
**Components used:** `burnable`, `health`, `inspectable`, `inventory`, `mermcandidate`, `shard_mermkingwatcher`  
**Tags checked:** `merm`, `player`, `mermking`, `mermguard`, `shadowminion`, `creaturecorpse`, `NOCLICK`, `mermprince`, `burnt`  
**Tags added/removed:** `mermprince` (added/removed for candidates), `shadowminion` (checked)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `main_throne` | `Entity?` | `nil` | The throne currently occupied by the active Merm King (if any). |
| `thrones` | `table<Entity>` | `{}` | List of all valid thrones in the world. |
| `king` | `Entity?` | `nil` | The current Merm King entity (if active). |
| `king_dying` | `boolean` | `false` | Whether the king is currently in the process of dying or has been killed but not yet removed. |
| `candidates` | `table<Entity>` | `{}` | Map from `throne → candidate` representing candidates waiting to transform at each throne. |
| `candidate_transforming` | `Entity?` | `nil` | The candidate currently undergoing transformation to king. |
| `inst` | `Entity` | *(inherited)* | The owning entity (always `TheWorld`). |

## Main functions
### `OnThroneDestroyed(throne)`
*   **Description:** Removes a destroyed throne from tracking, cleans up associated candidate state, and kills the Merm King if the destroyed throne is the main throne (only via deconstruction staff).
*   **Parameters:** `throne` (`Entity`) — the destroyed throne entity.
*   **Returns:** Nothing.

### `CreateMermKing(candidate, throne)`
*   **Description:** Transforms a Merm candidate into the Merm King, consumes the throne, clears all other candidates, and registers death/removal callbacks.
*   **Parameters:**  
    `candidate` (`Entity`) — the Merm candidate to promote.  
    `throne` (`Entity`) — the throne the candidate occupied.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if called without a valid candidate/throne.

### `FindMermCandidate(throne)`
*   **Description:** Searches for a new Merm candidate near the specified throne if no king currently exists.
*   **Parameters:** `throne` (`Entity?`) — the throne to check; if `nil`, only searches global logic if called externally.
*   **Returns:** Nothing.

### `ShouldGoToThrone(merm, throne)`
*   **Description:** Attempts to register a Merm candidate for a specific throne. Sets `nameoverride`, adds `mermprince` tag, and registers removal/death callbacks.
*   **Parameters:**  
    `merm` (`Entity`) — the candidate entity.  
    `throne` (`Entity`) — the throne to occupy.  
*   **Returns:** `true` if the candidate was successfully assigned; otherwise `false`.

### `ShouldTransform(merm)`
*   **Description:** Determines if the given Merm candidate meets all conditions (calories, throne proximity, no ongoing transformation) to transform into the Merm King.
*   **Parameters:** `merm` (`Entity?`) — the candidate entity to evaluate.
*   **Returns:** `true` if transformation should proceed; `false` otherwise.

### `IsThroneValid(throne)`
*   **Description:** Validates whether a throne can host a Merm King candidate (e.g., not burning, no king corpse present).
*   **Parameters:** `throne` (`Entity?`) — the throne to validate.
*   **Returns:** `true` if the throne is valid; `false` otherwise.

### `GetKing()`, `GetMainThrone()`, `GetCandidate(throne)`, `GetThrone(merm)`
*   **Description:** Simple getters for current state (king, throne, candidate).
*   **Parameters:** See namesake argument in function signatures.
*   **Returns:** `GetKing() → Entity?`, `GetMainThrone() → Entity?`, `GetCandidate(throne) → Entity?`, `GetThrone(merm) → Entity?`.

### `HasKingLocal()`, `HasKingAnywhere()`, `HasKing()`
*   **Description:** Checks whether a Merm King exists. `HasKingLocal()` is local-only. `HasKingAnywhere()` queries shard state. `HasKing()` is a deprecated wrapper.
*   **Parameters:** None.
*   **Returns:** `true` if a king exists in local or shard world (depending on method); `false` otherwise.

### `HasTridentLocal()`, `HasCrownLocal()`, `HasPauldronLocal()`
*   **Description:** Checks if the *local* Merm King possesses a specific quest item (trident, crown, pauldron). Equivalent `*Anywhere()` variants exist for shard-aware queries.
*   **Parameters:** None.
*   **Returns:** `true` if the item is held by the local king; `false` otherwise.

### `OnSave()`
*   **Description:** Serializes key state (king, candidates, thrones) for save/load persistence. Returns entity GUID lists for asset tracking.
*   **Parameters:** None.
*   **Returns:** `data` (`table`), `ents` (`table<number>`) — save data and entity GUIDs.

### `LoadPostPass(newents, savedata)`
*   **Description:** Rebuilds manager state after a world load by resolving GUIDs to entity references.
*   **Parameters:**  
    `newents` (`table<GUID, {entity}>`) — mapping of GUID to loaded entities.  
    `savedata` (`table`) — save data returned by `OnSave()`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `oncandidatekingarrived` (on `self.inst`) — triggers king creation if candidate arrives at throne.  
  - `onthronebuilt` (on `self.inst`) — adds new throne to list and starts candidate search.  
  - `onthronedestroyed` (on `self.inst`) — cleans up throne/candidate state.  
  - `onremove`, `death` (on `king`, `candidates`) — handles king/candidate lifecycle.  
- **Pushes:**  
  - `onmermkingcreated` — fired after a king is successfully created.  
  - `onmermkingdestroyed` — fired after king removal/cleanup.  

