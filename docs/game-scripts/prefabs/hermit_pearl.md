---
id: hermit_pearl
title: Hermit Pearl
description: Represents the Hermit Pearl item, an irreplaceable inventory object used in game logic to track the happy state of the Hermit Crab boss encounter.
tags: [item, logic, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8c30e7ab
system_scope: world
---

# Hermit Pearl

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hermit_pearl` defines two prefabs (`hermit_pearl` and `hermit_cracked_pearl`) representing the Hermit Pearl items in DST. These prefabs serve as the core logic trigger for the Hermit Crab boss encounter's happiness state. When placed in the world, they activate the `CRABBY_HERMIT_HAPPY` world state tag via `WORLDSTATETAGS.SetTagEnabled`, which enables Hermit Crab combat logic. The prefabs are designed as non-replaceable, tradable inventory items with floatable physics and visual rendering components.

## Usage example
```lua
-- Example: Spawning a Hermit Pearl in the world
local pearl = SpawnPrefab("hermit_pearl")
pearl.Transform:SetPosition(x, y, z)
pearl:DoTaskInTime(0, function()
    pearl:Remove()
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `tradable`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`, `hauntable`
**Tags:** Adds `irreplaceable`, `hermitpearl`, and (for `hermit_pearl` only) `gem`.

## Properties
No public properties.

## Main functions
Not applicable — this file defines prefabs, not a component class. It returns `Prefab` constructors for `hermit_pearl` and `hermit_cracked_pearl`.

## Events & listeners
Not applicable — this file defines static prefabs; no runtime listeners are registered.