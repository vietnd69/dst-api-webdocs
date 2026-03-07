---
id: stash_map
title: Stash Map
description: A consumable map item that reveals the current stash location when used, and destroys itself after revealing.
tags: [consumable, navigation, world, item, map]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5f085c90
system_scope: world
---

# Stash Map

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `stash_map` prefab represents a consumable item that reveals the current stash location on the map. It integrates with the `piratespawner` component to locate the active stash, uses the `mapspotrevealer` component to trigger map revelation, and self-destructs via `stackable:Get()` after successful revelation. It functions as a paper-like consumable item with typical inventory, burnable, and stackable properties.

## Usage example
```lua
-- Typically spawned and equipped by the game logic (e.g., Pirate quest rewards)
local stash_map = SpawnPrefab("stash_map")
if stash_map and stash_map.components then
    stash_map.components.stackable:SetStackSize(1)
    stash_map.components.inventoryitem:OnPutInInventory(player)
end
-- When used, the map calls mapspotrevealer and auto-removes itself
```

## Dependencies & tags
**Components used:** `erasablepaper`, `inspectable`, `inventoryitem`, `tradable`, `mapspotrevealer`, `stackable`, `fuel`, `burnable`, `propagator`, `hauntable`
**Tags:** Adds `cattoy`; checks via `TheWorld.components.piratespawner`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animstate.bank` | string | `"stash_map"` | Animation bank used for rendering. |
| `animstate.build` | string | `"stash_map"` | Animation build used for rendering. |
| `pickupsound` | string | `"paper"` | Sound played when the item is picked up. |
| `fuelvalue` | number | `TUNING.SMALL_FUEL` | Fuel value assigned by the `fuel` component. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size allowed for this item. |

## Main functions
### `getrevealtargetpos(inst, doer)`
*   **Description:** Retrieves the world position of the current stash location. Used by `mapspotrevealer` to determine where to reveal on the map.
*   **Parameters:** 
    * `inst` (Entity) — the stash_map instance.
    * `doer` (Entity) — the entity triggering the reveal (unused in implementation).
*   **Returns:** 
    * `false` and `"STASH_MAP_NOT_FOUND"` if no stash is currently active.
    * `Vector3` of the stash position if available.
*   **Error states:** Returns `false` if `TheWorld.components.piratespawner` is missing or has no active stash.

### `prereveal(inst, doer)`
*   **Description:** Placeholder function for pre-reveal checks (not used in this implementation).
*   **Parameters:** Same as `getrevealtargetpos`.
*   **Returns:** Always `true`, indicating the reveal may proceed.

### `inst.components.mapspotrevealer.postreveal`
*   **Description:** Function assigned to the `mapspotrevealer` post-reveal callback.
*   **Parameters:** None explicitly passed; called internally by `mapspotrevealer`.
*   **Returns:** Nothing.
*   **Behavior:** Destroys the stash_map by calling `stackable:Get()` to split/return the instance and then removing it from the world.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.