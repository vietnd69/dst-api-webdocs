---
id: walrus
title: Walrus
description: Registers three room variants for walrus camps in forest worlds, each with distinct tile types, spawn configurations, and weighted prefab distributions.
tags: [room, spawn, distribution, worldgen, forest]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 2eab94d4
---

# Walrus

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines three room templates for walrus camps using `AddRoom`, each tailored to a specific terrain type in the forest world: `SAVANNA` (plains), `GRASS`, and `ROCKY`. These rooms are configured to always contain exactly one `walrus_camp` prefab and specify per-room probability distributions for additional flora and terrain features. The component is part of the world generation system and ensures variety in walrus camp appearances across different biomes.

## Usage example
This file is not used directly by modders during runtime — it contributes static room definitions to the world generator. However, modders may replicate this pattern to add custom rooms. Example of defining a custom variant (not part of this file):

```lua
AddRoom("MyCustomWalrusHut", {
    colour = { r = 0.3, g = 0.2, b = 0.5, a = 0.5 },
    value = WORLD_TILES.GRASS,
    contents = {
        countprefabs = { walrus_camp = 1 },
        distributepercent = 0.2,
        distributeprefabs = {
            flower = 0.05,
            grass = 0.1,
        },
    },
})
```

## Dependencies & tags
**Components used:** None — this file does not use or reference any entity components directly.  
**Tags:** None identified — no tags are added, removed, or checked here.

## Properties
No component-level properties exist. This file solely invokes the global function `AddRoom` multiple times to register room templates.

## Main functions
### `AddRoom(name, roomdefinition)`
* **Description:** Registers a new room template with the world generation system. The room can be spawned during world generation based on priority and distribution rules defined elsewhere (e.g., `tasksets` and `tasksets/forest.lua`).
* **Parameters:**
  - `name` (string): Unique identifier for the room (e.g., `"WalrusHut_Grassy"`).
  - `roomdefinition` (table): Configuration table with keys:
    - `colour` (table `{r, g, b, a}`): Visual tint used for preview/debug overlays.
    - `value` (integer, enum `WORLD_TILES`): Tile type this room is compatible with (e.g., `WORLD_TILES.GRASS`).
    - `contents.countprefabs` (table): Number of specific prefabs to place *exactly once* inside the room (e.g., `{ walrus_camp = 1 }`).
    - `contents.distributepercent` (number): Probability (0–1) that this room will be selected if the current tile matches `value`.
    - `contents.distributeprefabs` (table): Map of prefab names to relative weights for random placement within the room area.
* **Returns:** None.
* **Error states:** Fails silently if `name` duplicates an existing room ID. Requires valid `value` and `distributeprefabs` weights (non-negative numbers) to behave predictably.

## Events & listeners
None — this file performs registration-only logic and does not register or emit any events.

---