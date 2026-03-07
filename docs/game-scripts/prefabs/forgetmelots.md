---
id: forgetmelots
title: Forgetmelots
description: A consumable vegetarian item that provides minimal sanity restoration, spoils quickly, and can be dried; also serves as a cat toy and vase decoration.
tags: [consumable, sanity, perishable, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 73c7e585
system_scope: inventory
---

# Forgetmelots

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Forgetmelots` is an item prefab representing a dish served in a vased decoration. It functions as an edible item with very small sanity restoration, a short shelf life, and drying capability. It also adds tags `cattoy` and `vasedecoration`, enabling specific interactions in the game (e.g., with bees or vase placement). The file defines three prefabs: the main item, a debuff buff for temporary effects, and a respawner for weed variants. It integrates with multiple core components including `edible`, `perishable`, `dryable`, `fuel`, `stackable`, and `vasedecoration`.

## Usage example
```lua
local inst = SpawnPrefab("forgetmelots")
inst.components.edible.sanityvalue = TUNING.SANITY_SUPERTINY
inst.components.perishable:SetPerishTime(TUNING.PERISH_SUPERFAST)
inst.components.dryable:SetProduct("forgetmelots_dried")
```

## Dependencies & tags
**Components used:** `stackable`, `tradable`, `inspectable`, `inventoryitem`, `vasedecoration`, `edible`, `perishable`, `dryable`, `fuel`, `timer`, `debuff`, `health`, `sanity`  
**Tags:** Adds `cattoy`, `vasedecoration`, `NOBLOCK`, `CLASSIFIED`, `weed_forgetmelots_respawner`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `healthvalue` | number | `0` | Health restored per consumption. |
| `hungervalue` | number | `0` | Hunger restored per consumption. |
| `sanityvalue` | number | `TUNING.SANITY_SUPERTINY` | Sanity restored per consumption. |
| `foodtype` | FOODTYPE enum | `FOODTYPE.VEGGIE` | Categorizes item for compatibility (e.g., cooking). |
| `fuelvalue` | number | `TUNING.TINY_FUEL` | Fuel value when burned in a campfire or furnace. |
| `product` | string | `"forgetmelots_dried"` | Prefab name produced when dried. |
| `drytime` | number | `TUNING.DRY_FAST` | Time required to dry the item on a meat rack. |
| `buildfile` / `dried_buildfile` | string | `"meat_rack_food_petals"` | Animation/build file used when displayed on a meat rack. |

## Main functions
### `respawner_test_point(pt)`
*   **Description:** Helper function to validate placement location for weed respawner: ensures the point is not near a hole and soil can be tilled there.
*   **Parameters:** `pt` (Vector3) - World position to test.
*   **Returns:** boolean — `true` if location is valid, otherwise `false`.

### `respawner_OnTimerDone(inst, data)`
*   **Description:** Handles timer expiration for the respawner; collapses the soil and spawns a `weed_forgetmelots` plant at a valid nearby location.
*   **Parameters:**  
    `inst` (Entity) — The respawner entity.  
    `data` (table) — Timer data, must contain `{ name = "regenover" }`.
*   **Returns:** Nothing.
*   **Error states:** If no valid location is found, the respawner removes itself.

### `OnTick(inst, target)`
*   **Description:** Periodic tick during debuff application; restores sanity to the attached target if they are alive and not a ghost.
*   **Parameters:**  
    `inst` (Entity) — The debuff entity.  
    `target` (Entity) — The entity currently affected by the debuff.
*   **Returns:** Nothing.
*   **Error states:** If target is dead, ghost, or lacks required components, the debuff stops.

### `OnAttached(inst, target)`
*   **Description:** Called when the debuff is applied; attaches the debuff entity to the target and starts the periodic tick.
*   **Parameters:**  
    `inst` (Entity) — The debuff entity.  
    `target` (Entity) — The affected entity.
*   **Returns:** Nothing.
*   **Error states:** None explicitly; assumes `target` is valid.

### `OnExtended(inst, target)`
*   **Description:** Extends the debuff duration and resets the periodic tick when the debuff is reapplied.
*   **Parameters:**  
    `inst` (Entity) — The debuff entity.  
    `target` (Entity) — The affected entity.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Terminates the debuff when the `regenover` timer expires.
*   **Parameters:**  
    `inst` (Entity) — The debuff entity.  
    `data` (table) — Timer data; must contain `{ name = "regenover" }` to trigger action.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `timerdone` — Triggers `respawner_OnTimerDone` or `OnTimerDone` depending on instance.  
  - `death` — Attached to target entity to stop the debuff if the target dies.
- **Pushes:** None (this prefab does not emit custom events directly).
