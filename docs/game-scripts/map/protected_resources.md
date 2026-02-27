---
id: protected_resources
title: Protected Resources
description: Provides a centralized registry of world-protected static layouts organized by biome and type, used for resource placement and world generation.
tags: [world, generation, resources]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 64029590
---

# Protected Resources

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module defines and organizes collections of protected static layouts—predefined world structures used for resource placement—grouped by biome type and special categories. It acts as a lookup table for world generation systems (e.g., map creation, event triggers) that need to access *safe*, non-overwritable layouts for critical gameplay elements such as beehives, hound rock formations, or seasonal spawns. The module is not an ECS component; it is a utility module returning a table of static layouts keyed by biome and name, intended to be consumed by map/task layout generation logic.

It depends on:
- `constants.lua` for `WORLD_TILES` tile type constants (e.g., `WORLD_TILES.FOREST`, `WORLD_TILES.GRASS`)
- `map/static_layout.lua` via `StaticLayout.Get(...)` to load and resolve static layout definitions

No dynamic component behavior or entity interaction occurs here; it solely provides a ready-made layout cache.

## Usage example

```lua
local ProtectedResources = require("map/protected_resources")
local layouts = ProtectedResources.Layouts
local sandbox = ProtectedResources.Sandbox

-- Access a specific layout by name
local hound_rocks_layout = layouts["hound_rocks"]

-- Access biome-specific group
local forest_layouts = sandbox[ProtectedResources.WORLD_TILES.FOREST or "FOREST"]
local _, forest_layout = pairs(forest_layouts)
```

## Dependencies & tags
**Components used:** None (this is a pure data module; no ECS components are accessed or instantiated)
**Tags:** None identified

## Properties
No public instance properties exist, as this module does not define an ECS component or class. Instead, it exports a module-level table with two fields:

| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| `Sandbox` | `table<string, table<string, table>>` | Populated at load time | Nested table mapping biome category names (e.g., `"Rare"`, `"Any"`, biome tile constants like `"FOREST"`) to layout name → layout definition maps |
| `Layouts` | `table<string, table>` | Populated at load time | Flattened lookup table mapping layout names (e.g., `"hound_rocks"`, `"tenticle_reeds"`) to their fully resolved layout definitions |

## Main functions
No exported functions are defined in this module. All data is statically initialized at module load time.

## Events & listeners
None. This module performs no runtime logic, event registration, or entity interaction.

---