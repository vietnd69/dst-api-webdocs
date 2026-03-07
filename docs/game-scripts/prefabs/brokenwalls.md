---
id: brokenwalls
title: Brokenwalls
description: Generates prefabs for broken walls of various materials (stone, wood, hay, moonrock, etc.) with workable states, loot drops, and visualfx.
tags: [world, environment, wall, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 050a7fe5
system_scope: environment
---

# Brokenwalls

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`brokenwalls.lua` is a prefab generator script that produces broken wall prefabs for multiple wall types (stone, wood, hay, ruins, moonrock, dreadstone, and scrap). Each prefab represents a destructible wall segment that cannot be used directly but serves as a source of raw materials after being worked on (e.g., hammered). The prefabs are created using the `MakeWallType` factory function, which configures visual, audio, and gameplay behavior via component injection.

The script does not define a standalone component itself — rather, it produces prefabs with several components attached (inspectable, lootdropper, named, workable) in the master sim context.

## Usage example
This file is not meant to be used directly in code — it is automatically loaded by the game to register broken wall prefabs. However, modders can extend it by adding new entries to `walldata`:

```lua
-- Example extension in a mod (outside this file):
walldata = require("prefabs/brokenwalls").walldata -- Not possible — this file returns prefabs directly
-- Instead, define a new broken wall by replicating the pattern:
local my_broken_wall = MakeWallType({
    name = "custom_broken",
    material = "stone",
    tags = { "stone", "custom" },
    loot = "custom_scrap",
    maxloots = 3
})
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `named`, `workable`, `animstate`, `transform`, `soundemitter`, `network`

**Tags added:** `wall`, and any additional tags specified in `data.tags` (e.g., `stone`, `wood`, `grass`, `ruins`, `moonrock`, `dreadstone`, `scrap`). Internally, it temporarily uses `_named` before replicating.

## Properties
No public properties. All configuration is passed through the `data` table to `MakeWallType`.

## Main functions
### `MakeWallType(data)`
* **Description:** Factory function that creates and returns a Prefab for a specific broken wall type. It builds the entity, attaches required components, and configures behavior (e.g., hammer callback, sound, loot, animation). Only instantiated on the master server (`TheWorld.ismastersim`).
* **Parameters:**  
  `data` (table) — Contains:
  - `name` (string) — Unique identifier suffix (e.g., `"stone"`, `"ruins_2"`).
  - `material` (string, optional) — Material name for sound FX (e.g., `"stone"`, `"wood"`).  
  - `tags` (table) — Additional tags to assign to the entity.  
  - `loot` (string, optional) — Prefab name of item to drop on destruction.  
  - `maxloots` (number, optional) — Number of loot items to drop (hardcoded to 1 per iteration but only runs if both loot and maxloots are present).  
  - `maxhealth` (number, optional) — Not used directly in this file; may be used elsewhere (e.g., by wall builders).
* **Returns:** `Prefab` — The fully configured prefab instance (e.g., `brokenwall_stone`).
* **Error states:**  
  - If `data.loot` or `data.maxloots` is missing, no loot is spawned (the loop is skipped).  
  - `data.material` being `nil` disables the sound effect callback.

## Events & listeners
- **Listens to:** None (events like `onhammered` are not registered via `ListenForEvent`; instead, `workable` calls the provided callback function directly).
- **Pushes:** None directly — though the `workable` component and `lootdropper` may push internal events.
