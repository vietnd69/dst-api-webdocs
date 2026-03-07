---
id: quagmire_portal_key
title: Quagmire Portal Key
description: Represents the in-game item used to open the Quagmire's portal, serving as a functional quest item with fixed identity and visual representation.
tags: [quest, item, inventory]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1b5d3efb
system_scope: inventory
---

# Quagmire Portal Key

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This prefab defines the Quagmire Portal Key, a unique quest item used to unlock the portal in the Quagmire biome. It is implemented as a standalone entity with a dedicated animation bank and build. The key is marked as `irreplaceable`, meaning it cannot be replaced or duplicated during inventory operations. It is primarily visual and functional within the game’s quest progression, with server-side initialization delegated to an external `master_postinit` callback.

## Usage example
```lua
-- Creating and spawning the key in the world (e.g., via a quest trigger)
local key = SpawnPrefab("quagmire_portal_key")
if key ~= nil then
    key.Transform:SetPosition(x, y, z)
    key:AddTag("playerhaskey")  -- Example: custom tag for logic
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `inventoryitem` (via `MakeInventoryPhysics`)
**Tags:** Adds `irreplaceable`; checks `TheWorld.ismastersim`

## Properties
No public properties.

## Main functions
None identified.

## Events & listeners
None identified.