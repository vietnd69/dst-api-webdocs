---
id: bats
title: Bats
description: Defines cave room templates used to generate bat-infested underground areas in the world.
tags: [cave, room, generation]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: cdcadacb
---

# Bats

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines a set of pre-configured cave room templates for use in world generation. These rooms contain specific prefabs (notably `batcave` entities) and natural cave features like stalagmites, guano, and fissures. The room templates are registered using `AddRoom`, and one template (`BGBatCave`) is further processed with `Roomify` to produce a fully connected room layout.

Although named `bats.lua` and containing bat-related rooms, this file itself does not implement a component or entity logic—it is a world generation script that contributes room definitions to the map-building system.

## Usage example
Typical usage involves referencing these room templates during world generation. For example, a worldgen task or taskset may include one of these rooms probabilistically:

```lua
-- Example of how these rooms might be used in a taskset
roomsets =
{
    cave =
    {
        rooms =
        {
            "BatCave",
            "BGBatCaveRoom",
        },
        weights = { 3, 1 },
    },
},
```

The actual registration of rooms is handled automatically when this file is loaded via `require`.

## Dependencies & tags
**Components used:** None identified. This script uses functions from `map/room_functions.lua` (`AddRoom`, `Roomify`) but does not interact with any runtime entity components.

**Tags:** All rooms include the tag `Hutch_Fishbowl`, which restricts room placement and likely prevents placement inside the Hutch biome (also known as Fishbowl mode).

## Properties
No component-level properties are defined in this file. It defines static configuration tables for room templates.

## Main functions
This file does not define any functions itself—it only constructs configuration tables and passes them to `AddRoom`. The `AddRoom` and `Roomify` functions are imported from `map/room_functions` and are documented elsewhere.

## Events & listeners
No event listeners or event pushes are present in this file.

---