---
id: petals_evil
title: Petals Evil
description: A perishable, dryable, and consumable item that grants sanity loss; used as a crafting component or food source with negative effects.
tags: [inventory, consumable, crafting, decay, sanity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7cfdd279
system_scope: inventory
---

# Petals Evil

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`petals_evil` is a consumable item prefab in DST representing corrupted flower petals. It functions as a low-value food source that reduces sanity and provides no health or hunger restoration. It supports drying (to produce `petals_evil_dried`), perishable decay (replacing with `spoiled_food`), and acts as a lightweight fuel. It integrates with DST's ECS via multiple components: `stackable`, `tradable`, `inspectable`, `fuel`, `inventoryitem`, `edible`, `perishable`, `dryable`, and `snowmandecor`. It is tagged `dryable` for runtime optimization and integrates with the hauntable system to be launched when spawned from a haunt event.

## Usage example
```lua
local inst = Prefab("petals_evil", fn, assets, prefabs)
-- To spawn an instance (e.g., in the world):
local entity = SpawnPrefab("petals_evil")
entity.Transform:SetPosition(x, y, z)
-- To pick it up and consume:
local player = ThePlayer
player:PushInventoryItem(entity)
if entity.components.edible ~= nil then
    player.components.eater:Eat(entity)
end
```

## Dependencies & tags
**Components used:** `stackable`, `tradable`, `inspectable`, `fuel`, `inventoryitem`, `edible`, `perishable`, `snowmandecor`, `dryable`  
**Tags:** `dryable` — added to pristine state to enable drying; no other tags are explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"vegetation_grassy"` | Sound played when the item is picked up. |
| `fuelvalue` | number | `TUNING.TINY_FUEL` | Fuel value used by the `fuel` component. |
| `healthvalue` | number | `0` | Health restored by consumption (none for this item). |
| `hungervalue` | number | `0` | Hunger restored by consumption (none for this item). |
| `sanityvalue` | number | `-TUNING.SANITY_TINY` | Sanity penalty from consumption. |
| `foodtype` | FOODTYPE | `FOODTYPE.VEGGIE` | Food classification for cooking/combining. |
| `perishtime` | number | `TUNING.PERISH_FAST` | Time in seconds before item spoils. |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn upon spoilage. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `drytime` | number | `TUNING.DRY_FAST` | Time in seconds required to dry the item. |
| `buildfile` | string | `"meat_rack_food_petals"` | Build name used for the wet (pre-dry) state. |
| `dried_buildfile` | string | `"meat_rack_food_petals"` | Build name used for the dried state. |
| `product` | string | `"petals_evil_dried"` | Prefab name of the dried result. |

## Main functions
No custom methods are defined in this prefab's `fn()` function. All behavior is handled through component interactions (e.g., `inst.components.perishable:StartPerishing()`). Only component member functions are invoked.

## Events & listeners
- **Listens to:** `spawnedfromhaunt` — triggers `OnSpawnedFromHaunt(inst, data)` to launch the entity when spawned from a haunt.
- **Pushes:** No events are explicitly pushed by this prefab; it relies on components (e.g., `perishable`, `dryable`) to emit events internally.
