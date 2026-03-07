---
id: decor_flowervase
title: Decor Flowervase
description: A decorative container component that holds and displays flowers, providing light, sanity effects, and inventory interactions when properly equipped.
tags: [decoration, light, sanity, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7127129b
system_scope: environment
---

# Decor Flowervase

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `decor_flowervase` prefab implements a decorative vase entity used in the game's environment. It serves as a container for flowers, which can be fresh or wilted, and provides visual decoration, ambient light (when fresh and from a light-producing flower), and minor sanity effects. The component leverages the shared `vase` component for core flower-handling logic and integrates with other systems via components like `inventoryitem`, `lootdropper`, and `burnable`.

The vase displays a dynamic symbol (`swap_flower`) to show the flower type and freshness, updates its inventory image accordingly, and emits light only when a fresh light-source flower is placed in it. It supports deconstruction, burning, and save/load mechanics.

## Usage example
```lua
local inst = SpawnPrefab("decor_flowervase")
inst.components.vase:SetFlower(1, TUNING.ENDTABLE_FLOWER_WILTTIME) -- Sets flower ID 1 (e.g., tulip) with default wilt time
inst.components.vase:WiltFlower() -- Manually wilt the flower
inst.components.lootdropper:SpawnLootPrefab("spoiled_food") -- Drops spoiled food if flower is present
```

## Dependencies & tags
**Components used:** `furnituredecor`, `inspectable`, `inventoryitem`, `lootdropper`, `vase`, `burnable`, `light`, `sound`, `transform`, `follower`, `network`  
**Tags:** `furnituredecor`, `vase`, `small_propagator`

## Properties
No public properties are defined directly in this file. All state is managed by the `vase` and other attached components.

## Main functions
### `DoRefreshImage(inst, hasflower, fresh)`
*   **Description:** Updates the inventory image name based on whether the vase has a flower and whether it is fresh. Triggers an `imagechange` event if the name changes.
*   **Parameters:**  
    `inst` (Entity) - The vase entity instance.  
    `hasflower` (boolean) - Whether a flower is currently placed in the vase.  
    `fresh` (boolean) - Whether the flower is fresh (not wilted).
*   **Returns:** Nothing.
*   **Error states:** Uses skin-aware naming (`_flowers` or `_wilted` suffixes) only if a custom skin is applied.

### `RefreshImage(inst)`
*   **Description:** Convenience wrapper that calls `DoRefreshImage` using the current `vase` component state.
*   **Parameters:**  
    `inst` (Entity) - The vase entity instance.
*   **Returns:** Nothing.

### `OnUpdateFlower(inst, flowerid, fresh)`
*   **Description:** Updates visual animation (shows/hides `swap_flower` symbol, plays particle effect) and refreshes inventory image when a flower is set.
*   **Parameters:**  
    `inst` (Entity) - The vase entity instance.  
    `flowerid` (number or nil) - ID of the flower; if nil, hides the flower symbol.  
    `fresh` (boolean) - Whether the flower is fresh (affects symbol suffix `_wilt`).
*   **Returns:** Nothing.
*   **Error states:** Skips animation unless world is not `POPULATING` and entity is not `IsAsleep()`.

### `flower_vase_lootsetfn(lootdropper)`
*   **Description:** Loot setup function for `lootdropper`. If the vase contains a flower, replaces default loot with `"spoiled_food"`.
*   **Parameters:**  
    `lootdropper` (LootDropper component) - The attached lootdropper component instance.
*   **Returns:** Nothing.

### `flower_vase_getstatus(inst)`
*   **Description:** Status reporter used by the `inspectable` component. Returns one of `"EMPTY"`, `"WILTED"`, `"FRESHLIGHT"`, or `"OLDLIGHT"` based on flower state and time remaining until wilt.
*   **Parameters:**  
    `inst` (Entity) - The vase entity instance.
*   **Returns:** String status code.
*   **Error states:** May return `nil` if `GetTimeToWilt()` fails, though the function guards against this.

### `OnDeconstruct(inst)`
*   **Description:** Handles looting when the vase is deconstructed. Spawns `"spoiled_food"` if a flower is present.
*   **Parameters:**  
    `inst` (Entity) - The vase entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `ondeconstructstructure` - Triggers `OnDeconstruct` to drop spoiled food if flower is present.  
  (Event handlers from `vase` and `burnable` are attached via their own components.)

- **Pushes:**  
  `imagechange` — Triggered via `inventoryitem:ChangeImageName` when the inventory image changes.  
  `sanitydelta` — Indirectly via `giver.components.sanity:DoDelta` in `OnDecorate`.

Note: Many internal callbacks (`OnUpdateFlower`, `OnUpdateLight`, `OnDecorate`) are registered with the `vase` component via `vase:SetOnUpdateFlowerFn`, etc., and invoked internally by that component.
