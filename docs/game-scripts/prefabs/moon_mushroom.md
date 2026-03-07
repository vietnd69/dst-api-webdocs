---
id: moon_mushroom
title: Moon Mushroom
description: Defines theprefab definitions and behaviors for raw and cooked Moon Mushroom items, including eating effects, cooking compatibility, perishability, and fuel use.
tags: [inventory, food, cooking, sleep, perishing]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2f8326f3
system_scope: inventory
---

# Moon Mushroom

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moon_mushroom.lua` file defines two prefabs: `moon_cap` (raw) and `moon_cap_cooked` (cooked Moon Mushroom). These are food items used in crafting, consumption, and cooking. The raw mushroom grants sleepiness or grogginess when eaten, depending on the eater’s components, and can trigger a Lunar Sleep Cloud if the Wormwood skill is active. The cooked version counteracts grogginess but reduces stats. Both prefabs are perishable, stackable, tradable, burnable, and supporthauntable behaviors.

## Usage example
```lua
-- Spawn raw Moon Mushroom
local raw = SpawnPrefab("moon_cap")

-- Spawn cooked Moon Mushroom
local cooked = SpawnPrefab("moon_cap_cooked")

-- Check properties
local is_stackable = raw.components.stackable ~= nil
local fuel_value = cooked.components.fuel and cooked.components.fuel.fuelvalue
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `tradable`, `inspectable`, `fuel`, `cookable`, `inventoryitem`, `freezable`, `pinnable`, `fossilizable`, `rider`, `skilltreeupdater`, `sleeper`, `grogginess`.  
**Tags added:** `moonmushroom`, `mushroom`, `cookable` (raw only).  
**Tags checked:** `frozen`, `stuck`, `fossilized`, `debuffed`, `groggy` (via component checks).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.cookable.product` | string | `"moon_cap_cooked"` | Prefab name to produce when the raw mushroom is cooked. |
| `components.edible.healthvalue` | number | `0` (raw), `0` (cooked) | Health change on consumption. |
| `components.edible.hungervalue` | number | `TUNING.CALORIES_SMALL` (raw), `-TUNING.CALORIES_SMALL` (cooked) | Hunger change on consumption. |
| `components.edible.sanityvalue` | number | `TUNING.SANITY_SMALL` (raw), `-TUNING.SANITY_SMALL` (cooked) | Sanity change on consumption. |
| `components.edible.foodtype` | FOODTYPE enum | `FOODTYPE.VEGGIE` | Category for cooking and nutrition logic. |
| `components.perishable.perishtime` | number | `TUNING.PERISH_MED` | Perish time in seconds. |
| `components.perishable.onperishreplacement` | string | `"spoiled_food"` | Prefab to spawn upon spoilage. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `components.fuel.fuelvalue` | number | `TUNING.TINY_FUEL` | Fuel value for campfires/lanterns (cooked only). |

## Main functions
### `mooncap_oneaten(inst, eater)`
*   **Description:** Handles the effect when a raw Moon Mushroom is consumed. Applies sleep or grogginess based on eater components, or triggers a knock-out event. If Wormwood's "moon_cap_eating" skill is active, spawns a Lunar Sleep Cloud.
*   **Parameters:**  
    - `inst` (Entity) — the Moon Mushroom instance being eaten.  
    - `eater` (Entity) — the entity consuming the mushroom.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if the eater is frozen, stuck, or fossilized.

### `mooncap_cooked_oneaten(inst, eater)`
*   **Description:** Handles the effect when a cooked Moon Mushroom is consumed. Cancels (resets) any current grogginess on the eater.
*   **Parameters:**  
    - `inst` (Entity) — the cooked Moon Mushroom instance being eaten.  
    - `eater` (Entity) — the entity consuming the mushroom.  
*   **Returns:** Nothing.  
*   **Error states:** Effect only occurs if eater is valid and has the `grogginess` component.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:**  
  - `"ridersleep"` — pushed to the eater's mount if present.  
  - `"knockedout"` — pushed to the eater if no sleeper, grogginess, or skilltreeupdater components are active.