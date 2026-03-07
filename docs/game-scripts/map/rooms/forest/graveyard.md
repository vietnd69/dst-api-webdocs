---
id: graveyard
title: Graveyard
description: Defines the Graveyard map room template with forest-level tile properties, mist visuals, and procedural prefab generation for graves and natural elements.
tags: [room, map, generation]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 294f6e8d
---

# Graveyard

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The Graveyard component is a map room template registered via `AddRoom`, used to procedurally generate graveyard-themed areas in forest-level worlds. It specifies visual rendering properties (coloured mist overlay), tile classification (`WORLD_TILES.FOREST`), and logical room tags (`Town`, `Mist`) to influence worldgen behavior and gameplay context. It does not implement a formal ECS component class — instead, it is a configuration block that instructs the world generator on room composition and decoration rules.

## Usage example
This room template is automatically invoked by the world generator during map construction and is not directly instantiated by modders. To reference it in room selection logic or overrides, use the registered name `"Graveyard"`.

```lua
-- Example: Override or extend Graveyard room behavior in a mod
local original_graveyard = CopyTable(GetRoom("Graveyard"))
original_graveyard.contents.countprefabs.evergreen = 5
AddRoom("Graveyard", original_graveyard)
```

## Dependencies & tags
**Components used:** None (this is a declarative room definition, not a runtime component).
**Tags:** `Town`, `Mist`, `FOREST` (tile type).

## Properties
No public instance properties — this is a static configuration block passed to `AddRoom`. Internally, the following keys are defined:

| Key     | Type     | Default Value | Description |
|---------|----------|---------------|-------------|
| `colour` | `table` | `{r=0.01, g=0.01, b=0.10, a=0.50}` | RGBA values for the ambient mist overlay color during room rendering. |
| `value` | `int` | `WORLD_TILES.FOREST` | Tile type constant indicating the underlying ground tile class. |
| `tags` | `table` | `{"Town", "Mist"}` | String tags used by worldgen and gameplay systems to identify room type. |
| `contents.countprefabs` | `table` | See source | Map of prefab names to either integer counts or functions returning counts for procedural placement. |

## Main functions
No methods — this is a configuration block, not a class with methods.

## Events & listeners
No events are handled; this is a static worldgen definition.