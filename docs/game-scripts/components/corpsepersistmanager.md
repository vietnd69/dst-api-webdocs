---
id: corpsepersistmanager
title: Corpsepersistmanager
description: This component manages the persistence of creature corpses in the world, limiting their total count and applying persistence rules to prevent them from despawning.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Corpsepersistmanager

## Overview
This component is responsible for managing the persistence of creature corpses throughout the master simulation. It maintains a global list of all active corpses, enforces a maximum limit to prevent performance issues, and applies various user-defined persistence functions to determine which corpses should remain in the world and which should eventually despawn. It constantly updates the persistence status of managed corpses.

## Dependencies & Tags
None identified. This component primarily manages entity references and relies on those entities (corpses) having methods like `RemovePersistSource` and `SetPersistSource`.

## Properties
No public properties were clearly identified from the source's `_ctor` equivalent block, other than the standard `self.inst` reference to the parent entity.

## Main Functions
### `AddPersistSourceFn(key, fn)`
*   **Description:** Adds a new function that will be used to determine if a corpse should persist. If this is the first persistence function added, the component will start updating.
*   **Parameters:**
    *   `key` (string): A unique identifier for this persistence source (e.g., "player_nearby").
    *   `fn` (function): A function that takes a `creature` entity as an argument and returns `true` if the creature should persist, `false` otherwise.

### `RemovePersistSourceFn(key)`
*   **Description:** Removes a previously registered persistence function. When a function is removed, it also removes that specific persistence source from all currently managed corpses. If no persistence functions remain, the component will stop updating.
*   **Parameters:**
    *   `key` (string): The unique identifier of the persistence source to remove.

### `ShouldRetainCreatureAsCorpse(creature)`
*   **Description:** Checks if a given creature entity should be retained as a corpse, considering both the global maximum corpse limit and all currently active persistence functions. This function is typically called *before* a creature fully dies to decide if it should generate a persistent corpse.
*   **Parameters:**
    *   `creature` (entity): The creature entity to check.

### `IsMaxReached()`
*   **Description:** Returns `true` if the total number of managed corpses has reached the `MAX_CORPSES` limit, `false` otherwise.

### `AnyCorpseExists()`
*   **Description:** Returns `true` if there is at least one corpse currently managed by this component, `false` otherwise.

### `OnUpdate(dt)`
*   **Description:** The main update loop for the component. This function periodically iterates through all managed corpses. For each corpse, it applies all registered persistence functions to determine if the corpse should be marked as persistent or not. If the `MAX_CORPSES` limit is exceeded, any excess corpses beyond the limit are forced to unpersist, essentially scheduling them for despawning.
*   **Parameters:**
    *   `dt` (number): The time elapsed since the last update frame.

### `GetDebugString()`
*   **Description:** Returns a formatted string indicating the current number of corpses being persisted. Useful for debugging purposes.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("ms_registercorpse", RegisterCorpse)`: Listens for `ms_registercorpse` events pushed by other components (e.g., `corpses` component on a creature) to add a new corpse to its management list.
*   `inst:ListenForEvent("onremove", OnRemoveCorpse, corpse)`: Listens for the `onremove` event on individual corpses it manages to automatically remove them from its internal list when they are destroyed or despawn.