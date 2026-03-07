---
id: portablespicer
title: Portablespicer
description: Manages the logic for a portable cooking device that can be deployed, used to cook stews, and transitions to an item form when dismantled or destroyed.
tags: [crafting, inventory, structure]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: be2c3835
system_scope: crafting
---

# Portablespicer

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `portablespicer` prefab implements a portable cooking device used in DST for preparing stews and similar dishes. It functions both as a deployable structure (placed in the world) and as an inventory item. As a structure, it integrates with the `stewer`, `container`, `workable`, and `burnable` components to support cooking, loot dropping, hammer interaction, and burning behaviors. As an item, it integrates with `deployable` and `inventoryitem` to allow placement and inventory management. It is tied closely to the cooking system (`cooking.lua`) for recipe lookup and rendering.

## Usage example
```lua
-- To place a portable spicer in the world
local spicer = SpawnPrefab("portablespicer")
spicer.Transform:SetPosition(world_x, 0, world_z)

-- To harvest and retrieve the result after cooking
if spicer.components.stewer:IsDone() then
    spicer.components.stewer:Harvest()
end

-- To dismantle the item while holding it
player.components.inventory:GiveItem(spicer)
spicer.components.portablestructure:SetOnDismantleFn(function(inst)
    -- custom dismantling logic
end)
```

## Dependencies & tags
**Components used:** `portablestructure`, `stewer`, `container`, `inspectable`, `lootdropper`, `workable`, `hauntable`, `burnable`, `deployable`, `inventoryitem`, `propagator`
**Tags:** Adds `structure`, `mastercookware`, `spicer`, `stewer`, `burnt`, `FX`, `NOCLICK` on burnt state, `portableitem` for the item form.

## Properties
No public properties are exposed directly beyond those provided by its component delegates.

## Main functions
### `ChangeToItem(inst)`
*   **Description:** Converts the placed structure back into a portable spicer item. If a product is cooked, it harvests first; empties the container; spawns `portablespicer_item` and collapses the structure.
*   **Parameters:** `inst` (entity) - the portable spicer instance to convert.
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Handles hammer interaction. Extinguishes burning, or converts to item unless burnt, in which case it spawns ash and a collapse effect.
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Handles hit interaction (e.g., from mobs or player swing). Plays appropriate animation and sound based on state (cooking, done, empty).
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** Nothing.

### `startcookfn(inst)`, `continuedonefn(inst)`, `continuecookfn(inst)`, `donecookfn(inst)`, `harvestfn(inst)`, `spoilfn(inst)`
*   **Description:** These are callback functions assigned to `stewer` component hooks. They manage animations, sounds, and visual overrides (e.g., overlaying the cooked product or garnish symbols) during cooking phases.
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** Nothing.

### `ShowProduct(inst)`
*   **Description:** Applies visual overrides based on the current cooked product recipe, including override build names and spice garnish.
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a string status for the `inspectable` component, describing the current state: `"BURNT"`, `"DONE"`, `"EMPTY"`, `"COOKING_LONG"`, or `"COOKING_SHORT"`.
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** `string` - one of the status keys above.

### `OnDismantle(inst)`
*   **Description:** Called when the structure is dismantled. Converts to item and removes the instance.
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles transition to burnt state. Calls default burnt logic, removes obstacle physics and workable/portablestructure components, and schedules erosion via `animover` event.
*   **Parameters:** `inst` (entity) - the portable spicer instance.
*   **Returns:** Nothing.

### `onsave(inst, data)` and `onload(inst, data)`
*   **Description:** Custom save/load handlers. Records if the spicer is burnt (including burning state) on save, and restores the burnt state on load.
*   **Parameters:** `inst` (entity), `data` (table) - save data.
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** Called when the portable spicer item is deployed. Spawns the placed `portablespicer` structure at the target location, plays placement animation/sound, and removes the item.
*   **Parameters:** `inst` (entity) - the item, `pt` (vector3) - deployment position, `deployer` (entity) - the player.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (on burnt structure) - triggers `ErodeAway` to fully remove the burnt entity.
- **Pushes:** `onextinguish` (via burnable), `onclose`, `loot_prefab_spawned` (via lootdropper).