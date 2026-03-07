---
id: quagmire_spiceshrub
title: Quagmire Spiceshrub
description: Defines the prefabs and initial setup for the Quagmire spiceshrub and its harvested components (sprig and ground spice) in DST.
tags: [plant, ingredient, quagmire]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cbfd0741
system_scope: world
---

# Quagmire Spiceshrub

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines three prefabs—`quagmire_spotspice_shrub`, `quagmire_spotspice_sprig`, and `quagmire_spotspice_ground`—used in the Quagmire DLC. The shrub acts as a renewable source of spices; when harvested, it produces sprigs and ground spice prefabs. It sets up basic animation, physics, and network state, then delegates master-side initialization to `event_server_data("quagmire", ...)` functions (e.g., `master_postinit_shrub`). This is not a runtime component but a static prefab definition used during entity instantiation.

## Usage example
This file does not define a component—rather, it returns prefabs. However, if a modder wants to spawn the shrub in the world:
```lua
local shrub = SpawnPrefab("quagmire_spotspice_shrub")
if shrub ~= nil then
    shrub.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `MiniMapEntity`, `Network`  
**Tags:** Adds `plant` and `quagmire_wildplant` to the shrub; adds `quagmire_stewable` to the ground spice.  
**Prefabs referenced:** `quagmire_spotspice_sprig`, `quagmire_burnt_ingredients`

## Properties
No public properties. This file only defines prefab factory functions.

## Main functions
Not applicable—this is a prefab definition file, not a component with functional methods.

## Events & listeners
Not applicable.
