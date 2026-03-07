---
id: carnivalevent
title: Carnivalevent
description: Manages the lifecycle and world presence of the Carnival Host during the Carnival event, including spawning, plaza tracking, and summoning logic.
tags: [event, world, host, spawn]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8e8f2f7b
system_scope: world
---

# Carnivalevent

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `carnivalevent` component manages the spawning and state of the Carnival Host during the Carnival seasonal event. It tracks registered carnival plazas, handles the portal location logic for the host’s spawn, and coordinates with `playerspawner` and `knownlocations` to initialize the host correctly. This component is strictly server-side and must only be added to the world instance.

## Usage example
```lua
-- Typically added automatically to TheWorld when the Carnival event is active
TheWorld:AddComponent("carnivalevent")
TheWorld.components.carnivalevent:RegisterPlaza(plaza_prefab)
TheWorld.components.carnivalevent:SummonHost(plaza_prefab)
```

## Dependencies & tags
**Components used:** `playerspawner`, `knownlocations`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | — | Reference to the entity (typically `TheWorld`) that owns this component. |

## Main functions
### `RegisterPlaza(plaza)`
*   **Description:** Registers a plaza entity as an active carnival plaza and fires the `ms_carnivalplazabuilt` event world-wide.
*   **Parameters:** `plaza` (Entity or GUID-like identifier) — the plaza to register.
*   **Returns:** Nothing.

### `UnregisterPlaza(plaza)`
*   **Description:** Removes a plaza from the list of active plazas. Note: The corresponding destroy event (`ms_carnivalplazadestroyed`) is commented out and currently not fired.
*   **Parameters:** `plaza` (Entity or GUID-like identifier) — the plaza to unregister.
*   **Returns:** Nothing.

### `DoesAnyPlazaExist()`
*   **Description:** Checks whether at least one plaza is currently registered.
*   **Parameters:** None.
*   **Returns:** `true` if at least one plaza is registered; `false` otherwise.

### `GetRandomPlaza()`
*   **Description:** Returns a randomly selected registered plaza, or `nil` if none exist.
*   **Parameters:** None.
*   **Returns:** Entity or GUID-like identifier, or `nil`.

### `SummonHost(plaza)`
*   **Description:** Attempts to summon the Carnival Host to the specified plaza. Requires the Carnival Host to already be spawned.
*   **Parameters:** `plaza` (Entity or GUID-like identifier) — the plaza to summon the host to.
*   **Returns:** Boolean — the result of the host’s `SummonedToPlaza(plaza)` call; `false` if no host is present.

### `OnPostInit()`
*   **Description:** Ensures the Carnival Host is spawned after world initialization if it hasn’t been already.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Prepares serialization data for the Carnival Host GUID for saving.
*   **Parameters:** None.
*   **Returns:** Two values:  
    1. `data` (table) — contains `{ carnival_host = GUID or nil }`.  
    2. `ents` (array) — list of entity GUIDs to persist (currently only the host, if present).

### `OnLoad(data)`
*   **Description:** Stub for loading saved state. Currently unused.
*   **Parameters:** `data` (table) — saved component data.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** Restores the Carnival Host after deserialization using saved GUIDs.
*   **Parameters:**  
    - `newents` (table) — mapping of GUIDs to loaded entity objects.  
    - `savedata` (table) — data returned from `OnSave()`.  
*   **Returns:** Nothing.
*   **Error states:** If the saved GUID is missing or the entity is not in `newents`, no host is spawned.

## Events & listeners
- **Listens to:**  
  - `onremove` on the Carnival Host entity — triggers internal cleanup and respawn logic.
- **Pushes:**  
  - `ms_carnivalplazabuilt` — fired when a plaza is registered via `RegisterPlaza`.  
  - *(Note: `ms_carnivalplazadestroyed` is commented out and not actively fired.)*
