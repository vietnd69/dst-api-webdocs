---
id: vents
title: Vents
description: Generates cave map content with vent-themed terrain, lootable rocks, and associated flora using procedural room definitions.
tags: [world, generation, environment]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: cade3e9a
---
# Vents

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file defines procedural room templates for generating vent-themed cave areas in Don't Starve Together. It uses `AddRoom` calls to specify room layouts containing vent-specific prefabs such as `cave_vent_rock`, `tree_rock1`, `tree_rock2`, and withered flora. The file also includes helper functions (`RandomVentRockState` and `RandomRockTreeState`) to assign randomized states to prefabs—such as mineability and loot tables—during world generation.

This file is part of the world generation system and contributes to dynamic map layout creation by populating cave sections with thematic content and loot distribution patterns.

## Usage example

The file itself is not directly instantiated as a component; it is evaluated at game startup to register room templates. To use these rooms, the world generator references them via the `AddRoom` calls shown.

Example (conceptual) integration in a worldgen taskset:

```lua
-- Inside a taskset or worldgen configuration file
task:AddStaticLayout("BGVentsRoom")
task:AddStaticLayout("VentsRoom")
-- ... then at runtime, the generator uses these registered rooms to populate cave maps
```

## Dependencies & tags
**Components used:** None (this file operates at the room generation layer; no runtime components are accessed via `inst.components.X`).

**Tags:** The rooms created include the tag `"fumarolearea"` for categorization in world generation logic.

## Properties
No properties are defined. This is a script that registers static room definitions, not an entity component.

## Main functions
The following helper functions are defined for use during room generation:

### `RandomRockTreeState()`
* **Description:** Returns a table describing the state of a `tree_rock1` or `tree_rock2` instance—including whether it is a boulder and if it is mineable with initial work remaining—based on configured probabilities. Used as a `prefabdata` callback during room generation.
* **Parameters:** None.
* **Returns:** `table` or `nil` — a table with optional keys `boulder` and `workable` (containing `workleft`), or `nil` if the rock is generated as a full-state boulder without additional properties.
* **Error states:** May return `nil` if the random roll falls below the threshold for minimal state.

### `RandomVentRockState()`
* **Description:** Returns a table describing the state of a `cave_vent_rock` instance—including mineability and a loot table to use when worked—based on weighted probabilities. Used as a `prefabdata` callback during room generation.
* **Parameters:** None.
* **Returns:** `table` or `nil` — a table with keys `workable` (containing `workleft`) and/or `set_loot_table`, or `nil` if no specific state is required.
* **Error states:** Returns `nil` with probability 1/3, indicating full/default state.

## Events & listeners
None. This is a world generation script and does not register event listeners or push events during runtime.

