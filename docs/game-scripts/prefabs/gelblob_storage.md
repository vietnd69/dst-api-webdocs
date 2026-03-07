---
id: gelblob_storage
title: Gelblob Storage
description: Stores edible food items indefinitely by stopping their decay and preventing pick-up, and releases them with decay resumed upon taking.
tags: [storage, food, decay, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 242c5718
system_scope: inventory
---

# Gelblob Storage

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`gelblob_storage` is a structural entity that stores a single stack of edible food items indefinitely by halting their perishable decay. It accepts food items tagged with one of `edible_GENERIC`, `edible_MEAT`, `edible_VEGGIE`, `edible_SEEDS`, `edible_BERRY`, `edible_RAW`, `edible_GOODIES`, or `edible_MONSTER`. While stored, items become unpickupable, gain the `NOCLICK` tag, and are visually attached to the storage via a follower. When removed, decay resumes and items regain pick-up capability. It also supports hammering for destruction (dropping contents as loot) and provides inspection status (`"FULL"` when holding an item). The component integrates closely with `inventoryitemholder`, `lootdropper`, `workable`, `inspectable`, `perishable`, and `propagator`.

## Usage example
```lua
local inst = SpawnPrefab("gelblob_storage")
-- The gelblob storage is automatically configured and ready to accept food items
-- Items can be added via player interactions (e.g., right-click with food)
-- The storage status can be inspected via GetStatus or used in UI
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitemholder`, `lootdropper`, `workable`, `perishable`, `propagator`  
**Tags added by prefab:** `structure`  
**Accepted food tags (via `SetAllowedTags`):** `edible_GENERIC`, `edible_MEAT`, `edible_VEGGIE`, `edible_SEEDS`, `edible_BERRY`, `edible_RAW`, `edible_GOODIES`, `edible_MONSTER`

## Properties
No public properties are directly exposed or documented in the constructor.

## Main functions
### `GetStatus(inst)`
*   **Description:** Returns the storage status as a string for inspection UI. `"FULL"` if an item is held; otherwise `nil`.
*   **Parameters:** `inst` (Entity) — the storage entity instance.
*   **Returns:** `"FULL"` (string) if holding an item, otherwise `nil`.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `OnBuiltFn` to play placement animation and sound.
- **Pushes:** None directly. However, it uses callbacks from other components:
  - `workable`'s `SetOnWorkCallback` triggers `OnHit` on hammer hit.
  - `workable`'s `SetOnFinishCallback` triggers `OnHammered` on destruction.
  - `inventoryitemholder`'s `SetOnItemGivenFn` triggers `OnFoodGiven` on item addition.
  - `inventoryitemholder`'s `SetOnItemTakenFn` triggers `OnFoodTaken` on item removal.
