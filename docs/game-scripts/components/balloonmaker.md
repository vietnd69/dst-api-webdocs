---
id: balloonmaker
title: Balloonmaker
description: Spawns a balloon entity at a specified world position.
tags: [spawn, world, prop]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 63d03a91
system_scope: world
---

# Balloonmaker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `balloonmaker` component provides a simple utility for spawning `balloon` prefabs at given world coordinates. It is designed to be attached to entities (e.g., NPCs or objects) that need to produce balloons during gameplay, such as during events or scripted sequences. It does not manage timers internally or enforce spawn limits—instead, it relies on external tuning or world-level caps.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("balloonmaker")
inst.components.balloonmaker:MakeBalloon(10, 0, -5)
```

## Dependencies & tags
**Components used:** `timer` (commented out usage — not actively used)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `MakeBalloon(x, y, z)`
*   **Description:** Spawns a `balloon` prefab at the specified world position `(x, y, z)`. Does not attach a fly-off timer (see source comments).
*   **Parameters:**
    *   `x` (number) — X coordinate in the world.
    *   `y` (number) — Y coordinate (vertical position) in the world.
    *   `z` (number) — Z coordinate in the world.
*   **Returns:** Nothing.
*   **Error states:** If `SpawnPrefab("balloon")` fails (e.g., due to world caps or missing prefabs), the function silently exits without error. No further action is taken if the balloon entity is `nil`.

## Events & listeners
None identified.
