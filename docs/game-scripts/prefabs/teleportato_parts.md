---
id: teleportato_parts
title: Teleportato Parts
description: Defines prefabs for Teleportato components used in adventure mode to construct the Teleportato device.
tags: [adventure, crafting, inventory, collection]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: deec6609
system_scope: inventory
---

# Teleportato Parts

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`teleportato_parts.lua` defines four inventory prefabs representing parts of the Teleportato: `teleportato_ring`, `teleportato_box`, `teleportato_crank`, and `teleportato_potato`. Each part is a non-stackable, tradable item with unique animation frames, tagged as both `irreplaceable` and `teleportato_part`. These prefabs are intended for use in adventure mode and are assembled to build the Teleportato device. The component uses `inventoryitem` with sinking enabled and supports hauntable behavior.

## Usage example
```lua
-- Create and add a Teleportato Ring part to an entity
local ring = Prefab("teleportato_ring", "teleportato_parts")
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("inventory")
inst.components.inventory:Equip(ring, "HANDS")
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `tradable`  
**Tags:** Adds `irreplaceable` and `teleportato_part`.

## Properties
No public properties.

## Main functions
### `makefn(name, frame)`
* **Description:** Returns a factory function that creates an instance of a Teleportato part prefab. Configures animation, tags, components, and sinking behavior. This is used internally to construct the four part prefabs.
* **Parameters:**  
  `name` (string) — the unique prefab name (e.g., `"teleportato_ring"`).  
  `frame` (string) — the animation frame bank to use (e.g., `"ring"`).
* **Returns:** (function) A function that, when called, constructs and returns the entity instance.
* **Error states:** Not applicable — returns a valid entity factory.

### `TeleportatoPart(name, frame)`
* **Description:** Wrapper function that constructs and returns a Prefab object using `makefn` and the shared asset list.
* **Parameters:**  
  `name` (string) — the unique prefab name.  
  `frame` (string) — the animation frame to play.
* **Returns:** (Prefab) A ready-to-use Prefab instance.

## Events & listeners
None.