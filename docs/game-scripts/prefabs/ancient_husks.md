---
id: ancient_husks
title: Ancient Husks
description: Defines the prefab data and initialization logic for ancient husk statues, including identity-specific animations and physics properties.
tags: [entity, animation, physics, save]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cfb9abda
system_scope: entity
---

# Ancient Husks

> Based on game build **7140114** | Last updated: 2026-03-04

## Overview
The `ancient_husks` prefab defines a group of decorative/statuary entities used in the world. Each husk represents a specific in-game identity (e.g., `handmaid`, `architect`, `mason`), with associated animation states and optionally different physical collision properties. It is initialized with default animations and tags appropriate for static structures.

## Usage example
```lua
-- Create an instance of an ancient husk and change its identity
local inst = SpawnPrefab("ancient_husk")
if inst ~= nil then
    inst:SetId("architect")
end
```

## Dependencies & tags
**Components used:** `inspectable`, `transform`, `animstate`, `network`, `physics` (via `MakeObstaclePhysics`)
**Tags:** Adds `structure` and `statue` on initialization.

## Properties
No public properties.

## Main functions
### `SetId(inst, id)`
* **Description:** Updates the husk's identity and changes its animation and physics accordingly. Only non-`handmaid` husks use capsule-shaped physics.
* **Parameters:** 
  - `inst` (entity instance) – The husk entity.
  - `id` (string) – One of `"handmaid"`, `"architect"`, or `"mason"`.
* **Returns:** `inst` – The modified entity instance.
* **Error states:** If `id` equals the current `inst.id`, the function returns early without changes.

### `OnSave(inst, data)`
* **Description:** Serializes the husk's identity for saving, omitting `handmaid` as the default.
* **Parameters:** 
  - `inst` (entity instance) – The husk entity.
  - `data` (table) – Save data table to populate.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the husk's identity from saved data if present.
* **Parameters:** 
  - `inst` (entity instance) – The husk entity.
  - `data` (table, optional) – Saved data containing `id`.
* **Returns:** Nothing.

## Events & listeners
None identified.