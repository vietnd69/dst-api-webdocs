---
id: quagmire_salt_rack
title: Quagmire Salt Rack
description: A static decorative and functional object used to store and dry salt in the Quagmire biome; serves as both an interactive buildable item and a placed entity.
tags: [environment, interactive, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 49711797
system_scope: environment
---

# Quagmire Salt Rack

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_salt_rack` is a static environment prefab that functions as a storage and drying rack for salt in the Quagmire biome. It is defined as two related prefabs: the placed entity (`quagmire_salt_rack`) and its item form (`quagmire_salt_rack_item`). The component implements visual representation via `AnimState`, physics via `MakeObstaclePhysics`, and integration with the Quagmire world system through server-side `master_postinit` hooks. It does not provide gameplay logic directly but acts as a visual anchor in the world with collision and placement constraints.

## Usage example
This prefab is created and registered by the engine and should not be instantiated manually. Typical usage occurs during world generation or when placing via the build menu:

```lua
-- The engine internally calls fn() and itemfn() for the prefabs:
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()
-- (Initialization handled by Prefab() system)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** None identified.

## Properties
No public properties are initialized in the constructor. All setup is performed via function calls.

## Main functions
This file returns two `Prefab` definitions (`fn` and `itemfn`) and is not a component in the ECS sense — it defines the prefab structure rather than implementing logic. Therefore, no reusable component methods are exposed.

## Events & listeners
None identified.