---
id: waxed_plant_common
title: Waxed Plant Common
description: Provides utilities for creating waxed plant prefabs and converting existing plants into waxed variants with configurable appearance and behavior.
tags: [plant, wax, inventory, deployment, animation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4a86113
system_scope: world
---

# Waxed Plant Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This module provides factory functions to create and manage *waxed plant* prefabs—items that preserve a plant's visual and structural state when harvested with beeswax. It supports two distinct prefab types: `waxed` (the in-world plant that decomposes when worked) and `dug_waxed` (the inventory item used for replanting). The module handles animation blending, colour fading effects via `colourtweener`, save/load synchronization, and deploy logic. It relies heavily on `workable`, `lootdropper`, `inspectable`, `deployable`, and `colourtweener` components.

## Usage example
```lua
-- Create a standard waxed plant prefab for "grass"
return Prefab("grass_waxed", CreateWaxedPlant({
    prefab = "grass",
    bank = "grass",
    build = "grass",
    anim = "idle",
    action = "CHOP",
    animset = {
        idle = { anim = "idle" },
        flower = { anim = "flower" },
    },
    getanim_fn = function(parent) return parent:GetCurrentAnimationName() end,
}))
```

## Dependencies & tags
**Components used:** `colourtweener`, `deployable`, `fuel`, `inspectable`, `inventoryitem`, `lootdropper`, `stackable`, `workable`  
**Tags:** Adds `waxedplant` to created entities.

## Properties
No public properties—this is a utility module that returns factory functions, not a component with mutable instance state.

## Main functions
### `CreateWaxedPlant(data)`
*   **Description:** Creates a prefab definition for a *waxed in-world plant* that can be worked (e.g., chopped or dug) to produce a replantable `dug_waxed` item or vanish. Accepts `data` with mandatory fields like `prefab`, `bank`, `build`, `anim`, `action`, `animset`, and `getanim_fn`, plus optional customization hooks.
*   **Parameters:**
    * `data` (table) — Configuration object. See detailed comment block in source for full schema.
*   **Returns:** A `Prefab` constructor function (suitable for return in a `Prefab` definition).
*   **Error states:** None—fails safely if referenced anims are invalid (logs a warning and returns `nil` internally during animation lookup).

### `CreateDugWaxedPlant(data)`
*   **Description:** Creates a prefab definition for the *inventory item* form of a waxed plant (the "dug" variant) intended for replanting via deployable interactions. Supports deployment with original plant state restored.
*   **Parameters:**
    * `data` (table) — Configuration object with `name`, `action`, `animset`, `getanim_fn` required; optional fields include `prefab`, `bank`, `build`, `anim`, `floater`, `deployspacing`.
*   **Returns:** A `Prefab` constructor function.
*   **Error states:** None.

### `WaxPlant(plant, doer, waxitem)`
*   **Description:** Converts an existing plant entity into its waxed counterpart. Captures current animation, colour, scale, position, and build state, spawns a `waxed` prefab, and applies visual fade-out effects.
*   **Parameters:**
    * `plant` (EntityRef) — The original plant entity to wax.
    * `doer` (EntityRef, optional) — The entity performing the waxing action (e.g., player).
    * `waxitem` (EntityRef, optional) — The waxing tool/item.
*   **Returns:** `true` on success, otherwise `false`. On success, returns `{waxed=entity, data=config}` as extra return values.
*   **Error states:** Returns `false` if no `prefab_waxed` version exists, or if `GetParentCurrentAnimation` returns an invalid animation name.

### `Configure(inst, data)`
*   **Description:** Applies saved visual and structural state (position, bank, build, scale, animation frame, colour, minimap icon, stump flags) to a new waxed plant instance. Invoked during instantiation or load.
*   **Parameters:**
    * `inst` (EntityRef) — The waxed plant entity to configure.
    * `data` (table) — State data (e.g., from save or `WaxPlant` result).
*   **Returns:** Nothing.
*   **Error states:** Safely skips optional fields if missing or invalid.

### `SpawnWaxedFx(inst, pos)`
*   **Description:** Spawns the `beeswax_spray_fx` effect at a position and triggers a fade-to-dark animation using `colourtweener`.
*   **Parameters:**
    * `inst` (EntityRef) — The waxed plant entity (used for colour state).
    * `pos` (Vector3) — Spawn position for the effect.
*   **Returns:** The spawned `beeswax_spray_fx` entity (or `nil`), provided for modding extensibility.
*   **Error states:** Returns `nil` if effect prefab fails to spawn.

## Events & listeners
- **Pushes:** `colourtweener_start`, `loot_prefab_spawned`, `on_loot_dropped` (via `lootdropper` and `workable`).  
- **Listens to:** None directly—relies on system-level events (`OnSave`, `OnLoad`) attached to `inst`.