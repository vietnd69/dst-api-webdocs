---
id: graveyard_ghosts
title: Graveyard Ghosts
description: Manages grave-related gameplay logic for spawning ghosts when graves are dug up, typically triggered during the Graveyard scenario.
tags: [scenario, ghost, grave]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: e897e721
system_scope: world
---

# Graveyard Ghosts

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`graveyard_ghosts` is a scenario controller script that monitors grave mounds in the world and spawns ghost entities when all graves have been dug up. It coordinates with grave entities and the scenario runner to trigger ghost spawning behavior upon completion of all grave digging tasks. This script does not define a reusable component; instead, it exposes lifecycle hooks (`OnCreate`, `OnLoad`, `OnDestroy`) used by the scenario system.

## Usage example
This script is not added directly to an entity. It is referenced internally by the scenario runner when the Graveyard scenario loads:

```lua
-- Typically invoked by the scenario system, e.g.:
local graveyard_logic = require("scenarios/graveyard_ghosts")
graveyard_logic.OnLoad(inst, scenariorunner) -- Called when scenario loads
```

## Dependencies & tags
**Components used:** `workable` (via `v.components.workable`)
**Tags:** None added or checked by this script; relies on existing `"grave"` tag on mound entities.

## Properties
No public properties — this script only uses local variables inside functions (`moundlist`, `settarget`, etc.).

## Main functions
### `FindGraves(inst)`
* **Description:** Searches for all grave mounds within a 20-unit radius of the entity `inst` and returns a table of unique grave mound entities.
* **Parameters:** `inst` (entity) — the reference entity whose position is used for area search.
* **Returns:** `grave_mounds` (table) — a sparse table keyed by grave mound entities (each key maps to itself).

### `SpawnGhostsOnGraves(graves, scenariorunner, player)`
* **Description:** Spawns a `ghost` prefab at each grave's position and sets the ghost's brain target to the given player. Clears the scenario after spawning ghosts.
* **Parameters:** 
  * `graves` (table) — table of grave mound entities as keys.
  * `scenariorunner` (object) — the scenario runner instance used to clear the scenario.
  * `player` (entity) — the player to be targeted by the spawned ghosts.
* **Returns:** Nothing.
* **Error states:** Ghosts are spawned unconditionally if `graves` contains entries; no error handling for invalid mounds or player.

### `OnGraveDug(inst, mound, scenariorunner, data)`
* **Description:** Removes a grave from the watched list (`moundlist`), cleans up its event listener, and triggers ghost spawning if no graves remain.
* **Parameters:** 
  * `inst` (entity) — the entity hosting this controller (typically a scenario runner anchor).
  * `mound` (entity) — the dug grave mound entity.
  * `scenariorunner` (object) — the scenario runner instance.
  * `data` (table) — event data, optionally containing `data.worker` (player who dug the grave).
* **Returns:** Nothing.
* **Error states:** Safely ignores graves without a `workable` component or invalid `mound` entries.

### `OnLoad(inst, scenariorunner)`
* **Description:** Initializes the grave watching state by populating `moundlist` and registering `workfinished` event listeners on each grave.
* **Parameters:** 
  * `inst` (entity) — the host entity.
  * `scenariorunner` (object) — the scenario runner instance.
* **Returns:** Nothing.
* **Error states:** Graves without `workable` component are silently removed from `moundlist`.

### `OnCreate(inst)`
* **Description:** Placeholder hook for scenario initialization — currently empty.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnDestroy(inst)`
* **Description:** Placeholder hook for cleanup — currently empty.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"workfinished"` — triggered on grave entities when digging completes; fires `OnGraveDug`.
- **Pushes:** None.