---
id: fishingnet
title: Fishingnet
description: Manages the casting of a fishing net by spawning and configuring a visualizer prefab to handle the animation and trajectory.
tags: [fishing, animation, network, fx]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6eadc3b0
system_scope: fx
---

# Fishingnet

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FishingNet` is a lightweight component responsible for initiating the casting animation and logic of a fishing net. When triggered, it spawns the `fishingnetvisualizer` prefab and delegates the visual setup to its `fishingnetvisualizer` component via `BeginCast`. This component itself contains no state or logic beyond spawning and storing the visualizer reference.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fishingnet")
-- Cast the net toward position (10, 0, -5) from the doer entity
inst.components.fishingnet:CastNet(10, -5, doer)
```

## Dependencies & tags
**Components used:** `fishingnetvisualizer` (accessed on spawned prefab)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `CastNet(pos_x, pos_z, doer)`
*   **Description:** Spawns the `fishingnetvisualizer` prefab and calls `BeginCast` on its component to prepare the visual trajectory of the net. Returns immediately after spawning.
*   **Parameters:**
    *   `pos_x` (number) — X-coordinate of the target position on the ground.
    *   `pos_z` (number) — Z-coordinate of the target position on the ground.
    *   `doer` (Entity) — The entity performing the cast (e.g., a player or character); used for animation reference and facing direction.
*   **Returns:** `true`
*   **Error states:** Returns early without side effects if `SpawnPrefab("fishingnetvisualizer")` fails, though no explicit error handling is present.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
