---
id: carnival_decor
title: Carnival Decor
description: Creates interactive carnival-themed decor prefabs with workable, loot-dropping, and physics properties.
tags: [environment, decor, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fc7f57ee
system_scope: environment
---

# Carnival Decor

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnival_decor.lua` defines prefabricated decor objects for the Carnival event in DST. These prefabs (e.g., `carnivaldecor_plant`, `carnivaldecor_banner`) are entities that feature randomized animation states, proper physics obstruction, and integrate with multiple core components: `inspectable`, `lootdropper`, `carnivaldecor`, `workable`, `burnable`, and `propagator`. They are intended to be placed via deployable kits and participate in world interactions such as hammering (destroying them to drop loot) and burning.

The component is not a reusable *component* in the ECS sense, but a *prefab factory* — it defines and returns multiple `Prefab` objects and associated deployable kits/placers using internal helpers (`common_fn`, `make_decor`). Despite the filename, the file itself does not define a new component class; it uses existing components attached during entity creation.

## Usage example
This file is not used directly by modders but defines prefabs used internally. Modders typically interact with its results via `SpawnPrefab("carnivaldecor_plant")` or by placing kits. For example:

```lua
-- Spawn a decor object programmatically
local decor = SpawnPrefab("carnivaldecor_plant")
decor.Transform:SetPosition(entity.Transform:GetWorldPosition())

-- Modify decor properties after spawn (if needed)
if decor.components.carnivaldecor then
    decor.components.carnivaldecor.value = 48  -- Overrides default 24
end
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `carnivaldecor`, `workable`, `burnable`, `propagator`
**Tags added:** `carnivaldecor`, `structure`

## Properties
**No public properties** — this file does not define a reusable component class. Entity-level data (e.g., `inst.data`, `inst.shape`) are internal to entity instances.

## Main functions
Not applicable — this is a prefab definition file, not a component.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt(inst, data)` to play place and idle animations.
- **Pushes:** No events are pushed directly by this file. Events originate from component callbacks (`onhammered`, `onsave`, `onload`) and external systems (`onbuilt`).

### Callback functions
#### `onhammered(inst, worker)`
*   **Description:** Handles entity destruction when hammered. Spawns a small collapse FX, drops loot via `lootdropper`, and removes the entity.
*   **Parameters:** `inst` (Entity), `worker` (Entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

#### `onbuilt(inst, data)`
*   **Description:** Called after placement is complete. Plays the place animation once, then loops the appropriate idle animation, and emits placement sound.
*   **Parameters:** `inst` (Entity), `data` (table) — contains `sound_place` and `shape` info.
*   **Returns:** Nothing.

#### `onsave(inst, data)`
*   **Description:** Saves the decor's `shape` index into the save data.
*   **Parameters:** `inst` (Entity), `data` (table) — the save table to populate.
*   **Returns:** Nothing.

#### `onload(inst, data)`
*   **Description:** Restores the decor's `shape` and animation state from save data if mismatched.
*   **Parameters:** `inst` (Entity), `data` (table) — loaded save data.
*   **Returns:** Nothing.

### Common setup (`common_fn`)
*   **Description:** Shared initialization for all decor prefabs. Configures entity properties, tags, physics, animations, and adds required components.
*   **Parameters:** `data` (table) — contains `bank`, `build`, `physics_radius`, `num_anims`, and optional `common_postinit`/`master_postinit` hooks.
*   **Returns:** `inst` — the fully initialized entity.
*   **Notes:** Sets `inst.shape` randomly to `1..num_anims` on the server, affecting idle animation. On the client, only the base setup (transform, animstate, etc.) runs; server-only logic (`lootdropper`, `workable`, etc.) is skipped.