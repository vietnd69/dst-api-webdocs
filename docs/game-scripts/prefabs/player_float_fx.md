---
id: player_float_fx
title: Player Float Fx
description: Creates visual effect prefabs for player immersion during water-related animations, such as hopping out of water or floating in hot springs.
tags: [fx, visual, immersion]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ef36671
system_scope: fx
---

# Player Float Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`player_float_fx` is a utility module that defines reusable prefab generators for visual effects associated with player water interactions. It uses the `MakeFx` helper function to construct simple FX prefabs with minimal components (`Transform`, `AnimState`, `Network`), appropriate animation states, and automatic cleanup via an `animover` event listener. These prefabs are not persistent and are intended for transient visual feedback on the client.

## Usage example
```lua
local player_float_hop_fx = Prefab("player_float_hop_water_fx")
local player_hotspring_fx = Prefab("player_hotspring_water_fx")

-- Both prefabs are automatically tagged with `FX` and `NOCLICK`
-- and remove themselves when their animation completes.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK` to each generated entity.

## Properties
No public properties.

## Main functions
### `MakeFx(name, build, bankfile, anim, facings)`
*   **Description:** Constructs and returns a `Prefab` for an FX entity with specified animation parameters. Used internally to generate two specific FX prefabs: `player_float_hop_water_fx` and `player_hotspring_water_fx`.
*   **Parameters:**
    *   `name` (string) – The name of the resulting prefab.
    *   `build` (string) – The build name (used for `SetBank` and `SetBuild`).
    *   `bankfile` (string or `nil`) – Optional alternate animation bank file; if different from `build`, an additional asset is added.
    *   `anim` (string) – The animation name to play on startup.
    *   `facings` (number) – Either `4` or `6`, determining whether the entity uses four- or six-faced orientation.
*   **Returns:** A `Prefab` instance configured for instantiation of the FX entity.
*   **Error states:** Returns early on clients (when `not TheWorld.ismastersim`) after setting up basic entity data — no logic beyond networking setup runs on clients.

## Events & listeners
- **Listens to:** `animover` – triggers `inst.Remove` to automatically clean up the entity once animation finishes.
- **Pushes:** None.