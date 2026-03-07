---
id: bullkelp_beached
title: Bullkelp Beached
description: A grounded bull kelp prefab that transforms into a wet kelp plant and a bullkelp root upon pickup, preserving moisture state.
tags: [environment, item, transformation, moisture]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 79f02ba2
system_scope: environment
---

# Bullkelp Beached

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bullkelp_beached` is a static environmental item prefab (often found as beached bull kelp on shorelines) that implements special pickup behavior. When picked up by an entity, it is removed and replaced by two separate items: `kelp` and `bullkelp_root`. Moisture state (`wetness`) is preserved and inherited by both new items. The prefab is typically used in coastal biome world generation and integrates with DST's moisture, burnable, propagator, and inventory systems.

## Usage example
```lua
-- Automatically instantiated by the worldgen system; not manually spawned by modders.
-- Typical use is as a static world item with special pickup handling.
local kelp = SpawnPrefab("bullkelp_beached")
kelp.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `burnable`, `propagator`, `hauntable`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `ReplaceOnPickup(inst, container, src_pos)`
*   **Description:** Core handler that removes the beached bull kelp entity and spawns `kelp` and `bullkelp_root` prefabs, preserving and inheriting the original moisture state. If a source position is provided, items are placed at that location.
*   **Parameters:** 
    * `inst` (entity) — the current beached bull kelp entity.
    * `container` (Inventory or Container component) — destination inventory/container to receive new items.
    * `src_pos` (Vector3 or nil) — optional position to spawn the new items at.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `container` is `nil`.

### `onpickup(inst, pickupguy, src_pos)`
*   **Description:** Standard pickup callback—invoked when an entity with an `inventory` component picks up this item.
*   **Parameters:** 
    * `inst` (entity) — the beached bull kelp entity.
    * `pickupguy` (entity) — the entity picking up the item.
    * `src_pos` (Vector3) — position where pickup occurred.
*   **Returns:** `true` (indicates the original entity was consumed/removed).
*   **Error states:** Returns `true` unconditionally; `ReplaceOnPickup` handles edge cases internally.

### `onputininventory(inst, owner)`
*   **Description:** Fallback pickup callback—invoked when the item is placed directly into an inventory *without* triggering `onpickup` (e.g., when Woby picks items up, as she lacks an inventory component and uses `container` instead).
*   **Parameters:** 
    * `inst` (entity) — the beached bull kelp entity.
    * `owner` (entity) — the entity that owns the target inventory or container.
*   **Returns:** Nothing.

## Events & listeners
None identified.