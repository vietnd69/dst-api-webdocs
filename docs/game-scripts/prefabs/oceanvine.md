---
id: oceanvine
title: Oceanvine
description: Manages the behavior, harvesting, burning, and dynamic spawing of ocean vines in the game world.
tags: [environment, resource, fire, spawning]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 04252e7e
system_scope: environment
---

# Oceanvine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`oceanvine` is a Prefab script defining two entities: the hanging vine itself (`oceanvine`) and its associated patch spawner (`oceanvine_patch`). The `oceanvine` prefab is a harvestable resource that grows figs, can be extinguished or burnt, and interacts with nearby webbed cocoons when harvested. It uses components like `inspectable`, `pickable`, and `burnable` to handle player interaction, regeneration cycles, and fire behavior. The `oceanvine_patch` prefab acts as a persistent spawner that initializes and manages child vine instances upon world load and during gameplay.

## Usage example
```lua
-- Typically instantiated via Prefab("oceanvine", commonfn, ...)
-- Main customization points in modding include overriding:
-- - TUNING.OCEANVINE_REGROW_TIME for regrowth duration
-- - TUNING.OCEANVINE_COCOON_SPIDER_RADIUS for cocoon alert range
-- - The `onpickedfn` logic to change cocoon alert behavior
-- To spawn a vine programmatically:
local vine = SpawnPrefab("oceanvine")
vine.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `burnable`, `distancefade` (client-only, commented out), `inspectable`, `pickable`, `dynamicshadow`, `minimapentity`, `network`, `soundemitter`, `animstate`, `transform`, `entity`
**Tags:** Adds `hangingvine`, `flying`, `NOBLOCK`, and `oceanvine`. Check for `webbed` (for cocoon interactions).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnedchildren` | boolean | `false` | Tracks whether vines have already been spawned from this patch (saved to world). |
| `spawntasks` | table | `nil` | Stores active pending vine spawn tasks for persistence; keyed by task reference. |
| `spawnpatch` | entity | `nil` | Reference to the parent `oceanvine_patch` entity. |
| `fall_down_fn` | function | `falldown` | Callback invoked when the vine falls; handles animations and fruit drop. |
| `burn_anim_task` | task reference | `nil` | Task handle for the delayed burn animation trigger after ignition. |

## Main functions
### `placegoffgrids(inst, radiusMax, prefab, tags)`
* **Description:** Attempts to find a valid off-grid position (not aligned with existing vines) and spawns the specified prefab there if the tile is deep rainforest. Used to avoid overlapping spawn positions.
* **Parameters:** 
  - `inst` (entity) — the parent patch entity; position used as reference.
  - `radiusMax` (number, optional) — max radial distance for random placement; defaults to 12 if `nil`.
  - `prefab` (string) — prefab name to spawn.
  - `tags` (table of strings) — tags used in `TheSim:FindEntities` to avoid existing objects.
* **Returns:** `true` if a vine spawned successfully; `false` otherwise.

### `spawnitem(inst, prefab)`
* **Description:** Calls `placegoffgrids` with tuned radius (`14` for most vines, `12` for `grabbing_vine`) and predefined `hangingvine` tag.
* **Parameters:** `inst` (entity), `prefab` (string).
* **Returns:** Result of `placegoffgrids`.

### `spawnvines(inst)`
* **Description:** Spawns a random number (`8–16`) of `hanging_vine` and `6–9` `grabbing_vine` instances by calling `spawnitem`. Marks `inst.spawnedchildren = true` after spawning.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `spawnNewVine(inst, prefab)`
* **Description:** Adds a new delayed vine spawn task to `inst.spawntasks` with randomized timing (~2–3 days). The task removes itself from the table upon completion.
* **Parameters:** `inst` (entity), `prefab` (string) — the vine prefab to spawn later.
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Saves `spawnedchildren` state and serializes active tasks in `spawntasks`, including remaining time, into the world save data.
* **Parameters:** `inst` (entity), `data` (table) — the save table to populate.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores `spawnedchildren` and resumes pending vine spawn tasks from saved data.
* **Parameters:** `inst` (entity), `data` (table or nil) — loaded save data.
* **Returns:** Nothing.

### `patchfn(Sim)`
* **Description:** Constructor for the `oceanvine_patch` prefab. Creates an invisible entity used to seed vines. Triggers `spawnvines` once if not already done, and registers save/load hooks.
* **Parameters:** `Sim` (simulation context, unused directly).
* **Returns:** `inst` — the newly created patch entity with `spawnNewVine` method attached.

### `commonfn(Sim)`
* **Description:** Constructor for the `oceanvine` prefab. Sets up transform, animation, sound, shadow, minimap, and network. Initializes `inspectable`, `pickable`, and `burnable` components. Assigns sound, callbacks, and regrowth parameters. Attaches spawner methods (`placegoffgrids`, `fall`).
* **Parameters:** `Sim` (simulation context, unused directly).
* **Returns:** `inst` — the fully configured hanging vine entity.
* **Error states:** Returns early with minimal setup on client (non-mastersim) to avoid entity duplication.

### `OnStartBurnAnim(inst)`
* **Description:** Triggers after burn duration; stops persistence, removes inspectable and pickable components, sets up fire extinction removal, plays burn animation, and spawns ash FX.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnExtinguishNotFinishedBurning(inst)`
* **Description:** Called if vine is extinguished before full burn completes; cancels the pending burn animation task.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnIgnite(inst, source, doer)`
* **Description:** Called when vine is ignited; schedules `OnStartBurnAnim` after `BURN_DURATION` and updates extinguish handler.
* **Parameters:** `inst` (entity), `source` (entity), `doer` (entity).
* **Returns:** Nothing.

### `onpicked(inst, picker, loot)`
* **Description:** Called on harvest: alerts nearby cocoons, plays harvest animation, transitions to `idle_nofruit`, and removes inspectable if present.
* **Parameters:** `inst` (entity), `picker` (entity), `loot` (table).
* **Returns:** Nothing.

### `makeempty(inst)`
* **Description:** Hides the `fig` mesh, plays `idle_nofruit`, and removes inspectable component.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `makefull(inst)`
* **Description:** Shows the `fig` mesh, plays fruit growth animation or loops `idle_fruit`, and adds `inspectable` component if missing.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `falldown(inst)`
* **Description:** Plays `spawn` followed by `idle_fruit` animation when spawned via patch.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `fall(inst)`
* **Description:** Handles falling logic (land or ocean), drops fig if unpicked, and schedules final cleanup. Sets `persists = false`.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `alert_nearby_cocoons(inst, picker, loot)`
* **Description:** Finds nearby entities with `webbed` tag and pushes `"activated"` event to them.
* **Parameters:** `inst` (entity), `picker` (entity), `loot` (table).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers entity removal or `ErodeAway` upon animation completion in burn and fall states.
- **Pushes:** `activated` — pushes on nearby webbed cocoons when this vine is harvested.
