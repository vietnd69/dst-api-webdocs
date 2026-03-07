---
id: quagmire_mushrooms
title: Quagmire Mushrooms
description: Defines the raw and cooked quagmire mushroom prefabs, including their visual, physics, and game-state properties.
tags: [world, item, cooking]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e8e962a9
system_scope: entity
---

# Quagmire Mushrooms

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines two prefabs: the raw `quagmire_mushrooms` and its cooked variant `quagmire_mushrooms_cooked`. These are consumable inventory items used in Quagmire gameplay, primarily as ingredients for stewing. The prefabs handle basic entity setup (transform, animation, network, physics), animation state initialization, and server-side post-initialization via external `event_server_data`. Client-side instances are finalized early for optimization, while master instances delegate to separate server-side handlers.

## Usage example
```lua
-- Create a raw quagmire mushroom
local raw_mushroom = Prefab("quagmire_mushrooms")
local inst = raw_mushroom()

-- Add it to an inventory
some_inventory:AddItem(inst)

-- The cooked version is created similarly
local cooked_mushroom = Prefab("quagmire_mushrooms_cooked")
local cooked_inst = cooked_mushroom()
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryphysics`
**Tags:** `cookable`, `quagmire_stewable`

## Properties
No public properties

## Main functions
This file only defines prefab constructors (`fn` and `cookedfn`) and returns `Prefab` instances; no standalone functions are documented.

## Events & listeners
None identified.