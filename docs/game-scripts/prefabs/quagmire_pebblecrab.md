---
id: quagmire_pebblecrab
title: Quagmire Pebblecrab
description: A small, non-hostile crab prefab found in the Quagmire region that serves as a collectible animal with basic creature physics and animation states.
tags: [entity, animal, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2bc30d30
system_scope: entity
---

# Quagmire Pebblecrab

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_pebblecrab` prefab defines a small, non-interactive animal entity for the Quagmire DLC. It is instantiated with transform, animation, sound, dynamic shadow, and network components, then configured as a physical entity with `MakeCharacterPhysics`. It is tagged for gameplay categorization (e.g., `prey`, `smallcreature`) and enhanced with feedable livestock properties via `MakeFeedableSmallLivestockPristine`. The prefab does not implement any custom logic beyond standard entity setup and is marked as pristine on the client to prevent remote modification.

## Usage example
```lua
-- Example of spawning a Quagmire Pebblecrab in the world
local crab = SpawnPrefab("quagmire_pebblecrab")
crab.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `physics`, `feedable` (via `MakeFeedableSmallLivestockPristine`)  
**Tags:** `animal`, `prey`, `smallcreature`, `canbetrapped`, `cattoy`, `crab`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable
