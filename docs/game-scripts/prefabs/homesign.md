---
id: homesign
title: Homesign
description: Creates a durable, hammerable signpost that can be written on and interacts with fire and loot-dropping mechanics.
tags: [structure, writing, fire, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 62bb5394
system_scope: world
---

# Homesign

> Based on game build **7140014** | Last updated: 2026-03-05

## Overview
`homesign` is a prefab that defines a wooden signpost structure. It functions as a placeable in-world object with writeable text, structural resilience, and damage-based interactions. It integrates with multiple core systems: it is workable via the `hammer` action (which extinguishes fire and drops loot), supports burning via `burnable`/`propagator`, and persists its burnt state across saves using `onsave`/`onload` callbacks. It is typically used as a landmark or customizable marker in the world.

## Usage example
```lua
-- Internally used by the game to create the sign prefab
return Prefab("homesign", fn, assets, prefabs),
    MakePlacer("homesign_placer", "sign_home", "sign_home", "idle")
```
No direct modder usage is required; modders may spawn instances via `SpawnPrefab("homesign")` or extend the definition in custom prefabs.

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `workable`, `inspectable`, `writeable`, `propagator`, `fueled`, `hauntable`
**Tags added:** `structure`, `sign`, `_writeable` (temporary, removed on master sim)
**Tags checked:** `burnt`, `burnable`, `debris`

## Properties
No public properties exposed by this prefab itself. Component properties (e.g., `workable.workleft`, `burnable.burning`) are managed internally via component APIs.

## Main functions
The functions below are callbacks used during the sign’s lifecycle, not methods called directly by modders.

### `onhammered(inst, worker)`
* **Description:** Callback fired when the sign is fully hammered (e.g., broken). Extinguishes fire (if burning), drops loot, spawns a `collapse_small` FX, and removes the entity.
* **Parameters:** `inst` (Entity), `worker` (Entity or nil) — the entity performing the hammer action.
* **Returns:** Nothing.
* **Error states:** Safe to call even if `burnable` component is missing; only extinguishes if present and burning.

### `onhit(inst, worker)`
* **Description:** Callback fired during partial hammering (before completion). Triggers a hit animation (if not burnt).
* **Parameters:** `inst` (Entity), `worker` (Entity or nil).
* **Returns:** Nothing.
* **Error states:** No effect if `burnt` tag is present; plays only a single-frame "hit" animation before returning to idle.

### `onsave(inst, data)`
* **Description:** Saves the sign’s burnt state into the save data table.
* **Parameters:** `inst` (Entity), `data` (table) — the save data object to mutate.
* **Returns:** Nothing. Sets `data.burnt = true` if the sign is currently burnt or burning.

### `onload(inst, data)`
* **Description:** Restores burnt state on world load. Invokes `onburnt` callback if `data.burnt` is true.
* **Parameters:** `inst` (Entity), `data` (table or nil) — loaded save data.
* **Returns:** Nothing.
* **Error states:** Safely handles `data == nil` or missing `data.burnt`.

### `onbuilt(inst)`
* **Description:** Event callback triggered when the sign is first built (placed). Plays the "dontstarve/common/sign_craft" sound.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — fires `onbuilt` callback to play build sound.
- **Pushes:** None directly (relies on components for events like `onburnt`, `onextinguish`).

`<`!-- Note: Entity-level events like `onburnt` or `onextinguish` are triggered by attached components and are not defined in this file, so they are omitted. -->