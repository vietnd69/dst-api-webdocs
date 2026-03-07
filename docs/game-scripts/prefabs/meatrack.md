---
id: meatrack
title: Meatrack
description: A structure that dries meat items when exposed to air and sunlight, and burns when ignited, destroying the dried food and producing ash instead.
tags: [crafting, food, drying, burnable, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4c64b6c
system_scope: world
---

# Meatrack

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `meatrack` is a structure prefab that serves as a food preservation device, drying raw meat items over time. It integrates with the `dryer`, `burnable`, `workable`, `lootdropper`, `inspectable`, and `rainimmunity` components to manage its state and interactions. It can be placed in the world, accepts raw meat via `dryer`, dries it into preserved food, and can be destroyed (hammered) or burned—either producing ash or preserving ingredients depending on its burning state.

## Usage example
The `meatrack` prefab is instantiated internally by the game and not typically added manually by modders. However, modders can extend it via `common_postinit` and `master_postinit` callbacks:

```lua
local inst = MakeMeatrack("custom_meatrack", custom_common_postinit, custom_master_postinit)()
inst.components.dryer.foodtype = FOODTYPE.MEAT
inst.components.dryer.protectedfromrain = true
```

## Dependencies & tags
**Components used:**  
`dryer`, `inspectable`, `lootdropper`, `workable`, `burnable`, `rainimmunity`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`

**Tags:**  
Adds: `structure`, `antlion_sinkhole_blocker` (for `meatrack_hermit` variant)

## Properties
No public properties exposed on the component class itself. State is managed internally via callbacks and component properties (`dryer.foodtype`, `burnable.burning`, etc.).

## Main functions
### `MakeMeatrack(name, common_postinit, master_postinit)`
* **Description:** Factory function that returns a prefab for a meatrack entity. Accepts optional post-initialization hooks for customization.
* **Parameters:**  
  `name` (string) — prefab name (e.g., `"meatrack"`, `"meatrack_hermit"`)  
  `common_postinit` (function? or nil) — function called on both client and server  
  `master_postinit` (function? or nil) — function called only on server (master mode)
* **Returns:** `Prefab` — a fully configured prefab definition.

### `onstartdrying(inst, ingredient, buildfile)`
* **Description:** Animation and audio callback triggered when drying begins (ingredient placed). Plays the drying animation and overrides the dried-meat symbol.
* **Parameters:**  
  `inst` (Entity) — the meatrack entity  
  `ingredient` (string) — prefab name of raw item being dried  
  `buildfile` (string?) — optional override build asset for symbol replacement
* **Returns:** Nothing.
* **Error states:** If `POPULATING` is true (e.g., loading world), it plays loop directly; otherwise plays pre-loop sequence.

### `ondonedrying(inst, product, buildfile)`
* **Description:** Callback executed when drying completes. Updates animation and symbol to reflect dried product.
* **Parameters:**  
  `inst` (Entity)  
  `product` (string) — prefab name of dried item  
  `buildfile` (string?)
* **Returns:** Nothing.

### `onharvested(inst)`
* **Description:** Triggered after the dried item is removed (e.g., harvested by player). Resets animation to `idle_empty`.
* **Parameters:**  
  `inst` (Entity)
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Callback for when the meatrack is hammered. Extinguishes fires, drops loot (including ash or cooked variants if burnt), and destroys the meatrack.
* **Parameters:**  
  `inst` (Entity)  
  `worker` (Entity?) — the entity performing the hammering action
* **Returns:** Nothing.
* **Error states:** Drops loot regardless of burning state; if burning, loot may be altered to cooked/ash variants via `lootdropper` logic.

### `onhit(inst, worker)`
* **Description:** Animation callback triggered when the meatrack is hit (but not destroyed) during drying/dried phases.
* **Parameters:**  
  `inst` (Entity)  
  `worker` (Entity?)
* **Returns:** Nothing.
* **Error states:** Skips animation updates if `burnt` tag is present.

### `getstatus(inst)`
* **Description:** Provides a human-readable status string used in inspection UI (`inspectable` component).
* **Parameters:**  
  `inst` (Entity)
* **Returns:** `string?` — one of `"BURNT"`, `"DONE"`/`"DONE_NOTMEAT"`, `"DRYING"`/`"DRYINGINRAIN"`/`"DRYING_NOTMEAT"`/`"DRYINGINRAIN_NOTMEAT"`, or `nil`.
* **Error states:** Returns `nil` if not in drying or done state.

### `onsave(inst, data)`
* **Description:** Serialization callback to record burning state.
* **Parameters:**  
  `inst` (Entity)  
  `data` (table) — save data table
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Deserialization callback to restore burnt state upon world load.
* **Parameters:**  
  `inst` (Entity)  
  `data` (table?) — loaded save data
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onbuilt` — triggers `onbuilt()` callback (plays place animation + sound)

- **Pushes:**  
  `ms_register_pearl_entity` (via `meatrack_hermit` master postinit) — registers the entity for pearl-based gameplay (e.g., Hermit mode).