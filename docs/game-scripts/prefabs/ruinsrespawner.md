---
id: ruinsrespawner
title: Ruinsrespawner
description: Creates a non-networked entity that manages respawning of a specified prefab after its ruin is destroyed, typically used for ruins that reset after being cleared.
tags: [ruins, world, entity, respawn]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 82bd6e92
system_scope: world
---

# Ruinsrespawner

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`ruinsrespawner.lua` provides utility functions (`MakeFn`, `MakeRuinsRespawnerInst`, `MakeRuinsRespawnerWorldGen`) to create specialized respawner entities for ruins in the game world. These entities monitor the destruction of ruins (e.g., via `workable:Destroy`) and automatically respawn the original ruin prefab after a randomized delay once all spawned objects have been removed. The respawner is a *non-networked*, non-physical helper entity used in world generation and runtime logic—not an in-game object players interact with directly.

It relies on the `objectspawner` component to manage spawned instances and uses `onremove` event listeners to track object lifecycle. It integrates with the save/load system via `OnSave`, `OnLoad`, and `OnLoadPostPass` callbacks.

## Usage example
```lua
-- Respawn a "ruin_wall" after it is destroyed, with custom callback on respawn
local inst = MakeRuinsRespawnerWorldGen("ruin_wall", function(ruin_obj, respawner)
    ruin_obj.Transform:SetScale(1.2, 1.2, 1.2)
end, { listenforprefabsawp = true })

-- Add the spawner to the world (typically done in worldgen)
TheWorld:PushEvent("spawn", inst)
```

## Dependencies & tags
**Components used:** `objectspawner`
**Tags:** Adds `CLASSIFIED` to the respawner entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnprefab` | string | `nil` | Name of the prefab to respawn (e.g., `"ruin_wall"`). Set in the closure by `MakeFn`. |
| `onrespawnfn` | function \| `nil` | `nil` | Optional callback invoked when a new object is spawned. Signature: `(respawned_obj, respawner_inst)`. |
| `resetruins` | boolean \| `nil` | `nil` | Internal flag indicating a respawn is pending; set via `"resetruins"` event or save data. |
| `listenforprefabsawp` | boolean \| `nil` | `nil` | Flag indicating whether to listen for `"onprefabswaped"` events. Populated from `data.listenforprefabsawp`. |

## Main functions
### `MakeFn(obj, onrespawnfn, data)`
*   **Description:** Returns a factory function that creates and configures a new respawner entity instance. This is the core internal helper used by both `MakeRuinsRespawnerInst` and `MakeRuinsRespawnerWorldGen`.
*   **Parameters:**
    *   `obj` (string) — Name of the prefab to spawn and respawn.
    *   `onrespawnfn` (function \| `nil`) — Optional callback invoked after spawning.
    *   `data` (table \| `nil`) — Additional options; if `data.listenforprefabsawp` is truthy, `"onprefabswaped"` is monitored.
*   **Returns:** A function `() → Entity` that constructs and returns the respawner entity.
*   **Error states:** None.

### `MakeRuinsRespawnerInst(obj, onrespawnfn, data)`
*   **Description:** Convenience wrapper to create a respawnable inst prefab (e.g., `ruin_wall_ruiinsrespawner_inst`) for direct use in code or as a nested inst. The instance is *not* automatically added to the world.
*   **Parameters:** Same as `MakeFn`.
*   **Returns:** A `Prefab` definition string (e.g., `"ruin_wall_ruiinsrespawner_inst"`).
*   **Error states:** None.

### `MakeRuinsRespawnerWorldGen(obj, onrespawnfn, data)`
*   **Description:** Creates a world-generation spawner prefab (e.g., `ruin_wall_spawner`) that spawns and immediately triggers `tryspawn` on world load. Intended for use in worldgen tasksets or static layouts.
*   **Parameters:** Same as `MakeFn`.
*   **Returns:** A `Prefab` definition string (e.g., `"ruin_wall_spawner"`).
*   **Error states:** None.

### `tryspawn(inst)`
*   **Description:** Internal function to spawn the configured `spawnprefab`. Clears nearby structures (e.g., `workable` entities that aren't `ACTIONS.NET`) before spawning. Only runs if `resetruins` is `true` and no objects remain managed by `objectspawner`.
*   **Parameters:**
    *   `inst` (Entity) — The respawner entity.
*   **Returns:** Nothing.
*   **Error states:** Skips spawning if `resetruins` is `nil` or if `objectspawner.objects` is non-empty.

### `onnewobjectfn(inst, obj)`
*   **Description:** Callback attached to `objectspawner.onnewobjectfn`. Sets up an `onremove` listener on each spawned object to automatically remove it from `objectspawner.objects`. Optionally listens for `"onprefabswaped"` if `listenforprefabsawp` is enabled.
*   **Parameters:**
    *   `inst` (Entity) — The respawner entity.
    *   `obj` (Entity) — The spawned object.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Save callback that stores the `resetruins` flag.
*   **Parameters:**
    *   `inst` (Entity) — The respawner entity.
    *   `data` (table) — Save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Load callback that restores the `resetruins` flag from saved data.
*   **Parameters:**
    *   `inst` (Entity) — The respawner entity.
    *   `data` (table) — Loaded save data (may be `nil`).
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Post-load callback that triggers `tryspawn` if `resetruins` was set (e.g., a previous spawn was in progress when the world was saved).
*   **Parameters:**
    *   `inst` (Entity) — The respawner entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    *   `"onremove"` (on spawned object) — Removes the object from `inst.components.objectspawner.objects`.
    *   `"onprefabswaped"` (if `listenforprefabsawp`) — Takes ownership of the new object.
    *   `"resetruins"` (on `TheWorld`) — Sets `resetruins = true` and schedules `tryspawn` with a random 0–0.75 second delay.
- **Pushes:** None (the respawner entity is non-networked and passive).