---
id: lost_toys
title: Lost Toys
description: Generates haunted trinket prefabs that fade in and out based on player proximity using colour tweening and player proximity detection.
tags: [fx, environment, player_interaction]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9a0760c6
system_scope: fx
---

# Lost Toys

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lost_toys.lua` file defines a factory function for generating haunted trinket prefabs used in DST's Lost Toys mechanic. Each trinket is a permanently haunted item that visually fades in when the player approaches and fades out when the player moves away, using `colourtweener` and `playerprox` components. These prefabs are associated with the ghost hunt event and are spawned by the SmallGhost.

## Usage example
```lua
local toy_1, toy_2, _, _, _, _, _, _, _, _ = require "prefabs/lost_toys"

-- toy_1 is Prefab("lost_toy_1", ...)
local inst = toy_1()
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Physics`, `Network`, `inspectable`, `playerprox`, `colourtweener`
**Tags:** Adds `haunted`; checks no tags.

## Properties
No public properties.

## Main functions
### `MakeTrinket(num)`
* **Description:** Creates and returns a Prefab instance for a lost trinket identified by `num`. The function defines the entity, sets up its physics, animation, network sync, and proximity-triggered fading logic.
* **Parameters:** `num` (number) – The trinket animation ID used to select the correct animation (e.g., `"1"`, `"2"`).
* **Returns:** `Prefab` – A prefab definition ready for use in the prefabs registry.
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None (no events registered via `inst:ListenForEvent`).
- **Pushes:** None (no events fired via `inst:PushEvent`).
  *(Note: The component files `colourtweener.lua` and `playerprox.lua` internally push and listen to events, but this prefabs file does not interact with those events directly.)*