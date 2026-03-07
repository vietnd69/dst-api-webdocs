---
id: marbleshrub
title: Marbleshrub
description: Manages the growth, mining, and loot generation of marble shrubs, which are mutable ground structures that progress through growth stages and yield marble resources when mined.
tags: [growth, harvesting, loot, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8e30924d
system_scope: environment
---

# Marbleshrub

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `marbleshrub` prefab defines a renewable ground structure that grows through three distinct stages (short → normal → tall) using the `growable` component. It supports iterative mining via the `workable` component and drops randomized loot via the `lootdropper` component. Its behavior is determined by stage-specific data stored in `statedata`, including animations, work requirements, and loot generation logic. The prefab supports multiple visual variants (`buildnum`) and handles save/load serialization to preserve shape and tint.

## Usage example
This prefab is typically instantiated by the game engine for world generation or planting, but modders may reference its grow mechanics when creating similar renewable resources:
```lua
-- Example: Create a marbleshrub at stage 2 (normal) with randomized build
local shrub = Prefab("marbleshrub", nil, assets, prefabs)()
shrub.components.growable:SetStage(2)
shrub.components.growable:StartGrowing()
```

## Dependencies & tags
**Components used:** `growable`, `lootdropper`, `workable`, `inspectable`, `burnable` (via `MakeSnowCovered`), `hauntable`, `waxable` (via `MakeWaxablePlant`)
**Tags:** `boulder`, `NOCLICK` (added after full destruction)

## Properties
No public properties are defined in the constructor. Internal state is stored via component fields (`inst.components.growable.stage`) and per-instance variables (`inst.shapenumber`, `inst.statedata`).

## Main functions
### `SetGrowth(inst)`
*   **Description:** Updates the entity's visual and gameplay state to match its current growth stage (1–3), applying stage-specific animations, work requirements, and loot definitions.
*   **Parameters:** `inst` (entity) — the marble shrub instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `DoGrow(inst)`
*   **Description:** Plays a growth animation and sound when the shrub advances a growth stage.
*   **Parameters:** `inst` (entity) — the marble shrub instance.
*   **Returns:** Nothing.

### `SetupShrubShape(inst, buildnum)`
*   **Description:** Applies one of three visual variants (`buildnum` = 1, 2, or 3) to the shrub, updating the animation symbol and minimap icon for variants >1.
*   **Parameters:** `inst` (entity), `buildnum` (number) — 1-indexed variant ID.
*   **Returns:** Nothing.

### `GrowFromSeed(inst)`
*   **Description:** Initializes a newly planted shrub: sets a random build variant, applies random tint, and triggers growth from seed to stage 1.
*   **Parameters:** `inst` (entity) — the newly created shrub instance.
*   **Returns:** Nothing.

### `lootsetfn(lootdropper)`
*   **Description:** Custom loot setup function that calls `TryLuckRoll` based on worker’s luck to determine marble vs. marblebean drops depending on growth stage.
*   **Parameters:** `lootdropper` (LootDropper component) — used to retrieve lucky worker and set final loot table.
*   **Returns:** Nothing.

### `onworked(inst, worker, workleft)`
*   **Description:** Callback triggered on mining; plays hit/break animations, spawns FX, drops loot, and removes the entity upon full destruction.
*   **Parameters:** `inst` (entity), `worker` (entity, optional), `workleft` (number) — remaining work required before destruction.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes `shapenumber` (if non-default) and color tint for world persistence.
*   **Parameters:** `inst` (entity), `data` (table) — output table for save data.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores `shapenumber` and color tint from saved data during load.
*   **Parameters:** `inst` (entity), `data` (table, optional) — loaded save data.
*   **Returns:** Nothing.

### `onloadpostpass(inst)`
*   **Description:** Re-applies `statedata` after loading, ensuring post-pass stage consistency.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — fires `inst.Remove` to delete the entity after break animation completes.
- **Pushes:** None (events are handled via component callbacks, not custom events).