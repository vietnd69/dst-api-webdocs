---
id: corpsepersistmanager
title: Corpsepersistmanager
description: Manages corpse persistence logic by tracking registered corpses and applying persistence sources based on configured callback functions.
tags: [world, entity, lifecycle]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: af20b667
system_scope: world
---

# Corpsepersistmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CorpsePersistManager` is a server-only component responsible for determining which corpses should persist in the world and managing their persistence state. It maintains an internal list of registered corpses and applies persistent behavior based on callback functions registered via `AddPersistSourceFn`. It enforces a global maximum of 200 corpses (`MAX_CORPSES`) and periodically updates corpse persistence states and cleanup.

This component is designed to be attached to the world root entity (`TheWorld`) and is not instantiated on clients, as enforced by an assertion in its constructor.

## Usage example
```lua
-- Typically added to TheWorld in master initialization
TheWorld:AddComponent("corpsepersistmanager")

-- Register a persistence source (e.g., specific creature types)
TheWorld.components.corpsepersistmanager:AddPersistSourceFn("monster", function(creature)
    return creature.prefab == "bearger" or creature.prefab == "deerclops"
end)

-- Example usage to check if a creature should become a corpse
if TheWorld.components.corpsepersistmanager:ShouldRetainCreatureAsCorpse(some_creature) then
    some_creature:SpawnCorpse()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity (typically `TheWorld`). |

## Main functions
### `AddPersistSourceFn(key, fn)`
*   **Description:** Registers a callback function that determines whether a creature or corpse should persist. If this is the first persistence source added, starts component updates.
*   **Parameters:**  
    `key` (string) — Unique identifier for this persistence source.  
    `fn` (function) — A function accepting one argument (`creature` or `corpse`) returning a boolean indicating whether persistence is desired.
*   **Returns:** Nothing.
*   **Error states:** None.

### `RemovePersistSourceFn(key)`
*   **Description:** Removes a previously registered persistence source and updates all tracked corpses to remove that source. Stops updates if no sources remain.
*   **Parameters:**  
    `key` (string) — The key of the persistence source to remove.
*   **Returns:** Nothing.
*   **Error states:** If `key` does not exist, this function has no effect.

### `ShouldRetainCreatureAsCorpse(creature)`
*   **Description:** Determines whether the given creature should be allowed to spawn a persistent corpse. Enforces `MAX_CORPSES` limit first.
*   **Parameters:**  
    `creature` (Entity) — The creature entity being evaluated.
*   **Returns:** `boolean` — `true` if a persistent corpse should be created, `false` otherwise.
*   **Error states:** Returns `false` immediately if `MAX_CORPSES` has been reached.

### `IsMaxReached()`
*   **Description:** Checks if the total number of tracked corpses has reached the world limit.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `_corpses` array length `>= MAX_CORPSES`, otherwise `false`.

### `AnyCorpseExists()`
*   **Description:** Checks if any corpses are currently being tracked.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the `_corpses` array is non-empty, otherwise `false`.

### `OnUpdate(dt)`
*   **Description:** Periodically (based on internal cooldown) iterates through all registered corpses, applying or removing persistence sources based on registered callbacks. Cleans up corpses exceeding `MAX_CORPSES`.
*   **Parameters:**  
    `dt` (number) — Delta time in seconds since the last update.
*   **Returns:** Nothing.
*   **Error states:** Does not run updates if cooldown is active; cooldown resets each run using a random value (`10` to `15` seconds). Only runs on the server (via `TheWorld.ismastersim`).

### `GetDebugString()`
*   **Description:** Returns a debug string summarizing the current number of persisted corpses.
*   **Parameters:** None.
*   **Returns:** `string` — Format: `"Persisting N corpses"`.

## Events & listeners
- **Listens to:** `ms_registercorpse` — Triggered when a new corpse should be tracked (registered via `inst:PushEvent("ms_registercorpse", corpse)`).
- **Pushes:** None.
