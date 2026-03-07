---
id: portablecookpot
title: Portablecookpot
description: Manages the cooked pot's cooking state, container interaction, deployable behavior, and visual/sound feedback during cooking, burning, and dismantling.
tags: [crafting, cooking, container, deployable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a732eac
system_scope: crafting
---

# Portablecookpot

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`portablecookpot` defines the logic and behavior for the Portable Cook Pot entity in DST. It implements a multi-state structure that supports cooking food via the `stewer` component, holds ingredients via the `container` component, and reacts to hammering, burning, and dismantling. It serves as both a placed structure and a deployable item, with dedicated logic for each form. Event callbacks manage animations, sounds, and state transitions (e.g., cooking loop, finish, spoil). It integrates tightly with `burnable`, `hauntable`, `lootdropper`, `workable`, and `portablestructure` components.

## Usage example
```lua
local pot = SpawnPrefab("portablecookpot")
if pot ~= nil and pot.components.stewer ~= nil then
    -- Add ingredients
    pot.components.stewer:AddIngredient("berries")
    pot.components.stewer:AddIngredient("meat")
    -- Start cooking
    pot.components.stewer:StartCooking(10)
end
```

## Dependencies & tags
**Components used:** `portablestructure`, `stewer`, `container`, `inspectable`, `lootdropper`, `workable`, `hauntable`, `burnable`, `propagator`, `light`, `dynamicshadow`, `animstate`, `soundemitter`, `inventoryitem`, `deployable`, `transform`, `miniMapEntity`, `network`.

**Tags:** `structure`, `mastercookware`, `stewer`, `FX`, `NOCLICK`, `portableitem`, `masterchef`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cooktimemult` | number | `TUNING.PORTABLE_COOK_POT_TIME_MULTIPLIER` | Time multiplier applied to cooking duration. |
| `spoiledproduct` | string | `"spoiled_food"` | Prefab name to use when cooking spoils. |
| `product` | string or nil | `nil` | Prefab name of the cooked product (set when done). |
| `skipclosesnd`, `skipopensnd` | boolean | `true` | Controls whether close/open UI sounds are played. |

## Main functions
### `SetProductSymbol(inst, product, overridebuild)`
*   **Description:** Updates the cookpot's visual symbol (overlay) to reflect the currently cooked or spoiled item, and adjusts pot-level indicator layers based on recipe `potlevel`.
*   **Parameters:** `product` (string), `overridebuild` (string or nil) — used for mod-added products.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a string status indicating the current state of the cookpot, used for UI tooltip display.
*   **Parameters:** `inst` (entity) — the cookpot instance.
*   **Returns:** One of `"BURNT"`, `"DONE"`, `"EMPTY"`, `"COOKING_LONG"`, `"COOKING_SHORT"`.

### `ChangeToItem(inst)`
*   **Description:** Transforms a placed cookpot into its item form (`portablecookpot_item`) when dismantled or destroyed, dropping any product or ingredients first.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles transformation to the burnt state: removes collision, spawns ash, erodes away with animation, and strips workable/portablestructure components.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Called when the cookpot is hammered: extinguishes fire if burning; transforms to item or ash based on burnt state.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Handles player clicking on the cookpot while it’s cooking, full, or empty—triggers appropriate animations and sounds without closing a container if already open.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `startcookfn`, `continuecookfn`, `donecookfn`, `continuedonefn`, `spoilfn`, `harvestfn`
*   **Description:** Callbacks invoked by the `stewer` component during cooking lifecycle stages. Each updates animation state, sound, light, and visual symbol (via `SetProductSymbol` or `ShowProduct`).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onopen(inst)` and `onclose(inst)`
*   **Description:** UI-related callbacks executed when the cookpot container is opened or closed. Play UI sounds and handle animation states for open/closed/idle.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (in burnt state) — triggers `ErodeAway` to fully remove the entity.
- **Pushes:** `onclose`, `onopen`, `onextinguish`, `loot_prefab_spawned` (via `lootdropper`), and `learncookbookrecipe` (if recipe and chef match).
- **Callbacks registered:** `onsave` and `onload` — persists `burnt` state across saves.