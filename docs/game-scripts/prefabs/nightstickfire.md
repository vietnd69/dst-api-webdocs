---
id: nightstickfire
title: Nightstickfire
description: A simple visual FX prefab that renders a small, warm-toned light for use in the game world.
tags: [fx, lighting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5d2e11bc
system_scope: fx
---

# Nightstickfire

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightstickfire` is a lightweight FX prefab responsible for rendering a small, warm-colored point light in the game world. It is used as a visual effect to simulate a flickering or steady light source, such as a handheld lantern or campfire ember. The prefab includes transform, light, and network components to ensure proper rendering and replication in multiplayer contexts. It is marked as non-persistent, meaning it will not be saved to the world save file.

## Usage example
```lua
-- Example of spawning the light at a specific location
local fire = SpawnPrefab("nightstickfire")
if fire ~= nil then
    fire.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `light`, `network`
**Tags:** Adds `FX` to the entity.

## Properties
No public properties

## Main functions
No public methods

## Events & listeners
None identified.
