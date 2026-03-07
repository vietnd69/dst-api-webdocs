---
id: quagmire_plantables
title: Quagmire Plantables
description: Definesprefabs and logic for Quagmire crops, including seeds, planted stages, leaves, soil visuals, raw products, and cooked products.
tags: [quagmire, farming, crops, prefabs]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 790b5b1b
system_scope: world
---

# Quagmire Plantables

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines a suite of prefabs for the Quagmire biome's farming system. It includes seed prefabs, planted crop prefabs (with multiple visual stages), leaf prefabs (decoration), soil prefabs (front/back placements), and raw/cookable crop products. The prefabs use shared animations and naming conventions based on crop type (e.g., `"turnip"`, `"wheat"`), with behavior differences defined in the `PRODUCT_VALUES` table. Prefabs are instantiated in `master_postinit` for server-side logic, and client-side prefabs use replication and animation setup for visual sync.

## Usage example
```lua
-- Example: Creating a raw carrot product
local carrot = Prefab("quagmire_carrot", fn, assets, prefabs)
    -- where fn and prefabs are defined inside MakeRawProduct("carrot")

-- Example: Creating a planted tomato crop
local tomato_planted = MakePlanted("tomato", 2)

-- Example: Creating a seed variant
local seed = MakeSeed(1, {"quagmire_turnip_planted", "quagmire_potato_planted"})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds tags conditionally per prefab: `cookable`, `plantedsoil`, `fertilizable`, `FX`, `DECOR`, `NOCLICK`, `quagmire_stewable`, `show_spoilage`.

## Properties
No public properties. This file is a prefabs generator — it defines functions (`MakeSeed`, `MakePlanted`, etc.) that return `Prefab` instances with internal behavior.

## Main functions
### `MakeSeed(id, planted_prefabs)`
*   **Description:** Creates a seed prefab for planting, with unique animation per `id`. Used as the base item players place into soil.
*   **Parameters:** `id` (string/number) - seed type identifier (used in animation name `"seeds_"..id`); `planted_prefabs` (table) - list of planted crop prefabs this seed can plant.
*   **Returns:** Prefab instance.
*   **Error states:** Returns early on client if `TheWorld.ismastersim` is `false`, skipping server initialization.

### `SetLeafVariation(inst, leafvariation)`
*   **Description:** Hides leaf animation layers that do not match `leafvariation`, enabling visual variation in leaf growth.
*   **Parameters:** `inst` (Entity) - the crop entity; `leafvariation` (number or `nil`) - which leaf layer to show (1–3).
*   **Returns:** Nothing.

### `SetBulbVariation(inst, bulbvariation)`
*   **Description:** Hides bulb animation layers that do not match `bulbvariation`, enabling visual variation in bulb growth.
*   **Parameters:** `inst` (Entity) - the crop entity; `bulbvariation` (number or `nil`) - which bulb layer to show (1–3).
*   **Returns:** Nothing.

### `MakePlanted(product, bulbvariation)`
*   **Description:** Creates the base planted crop prefab (soil + growing visuals) for a given crop type. Handles replication, rotten state (`rottendirty` event), and master/client initialization.
*   **Parameters:** `product` (string) - crop name (e.g., `"turnip"`); `bulbvariation` (number) - bulb visual variant to show.
*   **Returns:** Prefab instance.
*   **Error states:** On client, registers listener for `"rottendirty"` to update visual state.

### `MakeLeaf(product, leafvariation)`
*   **Description:** Creates a visual leaf prefab attached to the planted crop for dynamic visual layering.
*   **Parameters:** `product` (string) - crop name; `leafvariation` (number) - leaf variant to show.
*   **Returns:** Prefab instance.
*   **Error states:** On client, sets `inst.OnEntityReplicated` to update parent highlight; does not persist.

### `MakeSoilFn(front)`
*   **Description:** Returns a closure that creates front/back soil prefabs for the planted crop visuals. Uses layering and `SetLeafVariation`/`SetBulbVariation`.
*   **Parameters:** `front` (boolean) - if `true`, creates the front soil variant.
*   **Returns:** Function that returns a Prefab instance (when invoked).
*   **Error states:** Client-side prefabs are non-persistent (`inst.persists = false`).

### `MakeRawProduct(product)`
*   **Description:** Creates the raw product prefab for harvesting, conditionally adding `cookable`, `quagmire_stewable`, and spoilage visibility.
*   **Parameters:** `product` (string) - crop name (e.g., `"carrot"`).
*   **Returns:** Prefab instance.
*   **Error states:** Skips cooked variantprefab generation if `PRODUCT_VALUES[product].cooked == nil`.

### `MakeCookedProduct(product)`
*   **Description:** Creates the cooked product prefab, inherits raw product type but sets different animation and tags.
*   **Parameters:** `product` (string) - crop name.
*   **Returns:** Prefab instance.

### `OnRottenDirty(inst)`
*   **Description:** Updates the entity's prefab override based on its `rottendirty` state (via net_bool).
*   **Parameters:** `inst` (Entity) - the crop entity.
*   **Returns:** Nothing.

### `OnLeafReplicated(inst)`
*   **Description:** Ensures leaf entity highlights its parent planted crop when replicated on client.
*   **Parameters:** `inst` (Entity) - the leaf entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `rottendirty` - updates visual appearance for rotten crops on client side.