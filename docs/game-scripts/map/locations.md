---
id: locations
title: Locations
description: Defines and registers distinct world locations with their configuration overrides for world generation in Don't Starve Together.
tags: [world, generation, location]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 7a2a52d7
---

# Locations

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `map/locations.lua` file defines and registers distinct playable world locations (such as forest, cave, lava arena, and quagmire) using the `AddLocation` function. Each location specifies configuration overrides that control how the world is generated—including default starting points, task sets, layout modes, wormhole behavior, and other world generation properties. This component is not an Entity Component System (ECS) component but rather a configuration module used during world initialization. It operates at a higher level during game setup and does not attach to entities.

## Usage example
Modders typically do not interact with this file directly at runtime. Instead, they extend or override existing locations using `AddLocation` calls in their own mod code (e.g., `main.lua`). Below is an example of registering a custom location:

```lua
AddLocation({
    location = "my_custom_location",
    version = 2,
    overrides = {
        task_set = "my_custom_taskset",
        start_location = "my_start",
        season_start = "default",
        world_size = "medium",
        layout_mode = "RestrictNodesByKey",
        wormhole_prefab = "custom_wormhole",
        roads = "default",
    },
    required_prefabs = {
        "custom_portal",
    },
})
```

## Dependencies & tags
**Components used:** None identified. This file does not access or manage any ECS components.

**Tags:** None identified. This file does not manipulate entity tags.

## Properties
This file does not define a component class or maintain properties in the ECS sense. Instead, it invokes the global `AddLocation` function multiple times with location configuration tables.

## Main functions
### `AddLocation(config)`
* **Description:** Registers a new world location configuration with the specified settings. Called during game initialization to define supported locations and their world generation behavior.
* **Parameters:**
  - `config`: A table containing the following keys:
    - `location` (`string`): Unique identifier for the location (e.g., `"forest"`, `"cave"`).
    - `version` (`number`): Version number of the location configuration (currently fixed at `2` in the base game).
    - `overrides` (`table`): Key-value pairs specifying world generation overrides (see below).
    - `required_prefabs` (`table` of `string`s): List of prefabs required to exist for this location to be valid (e.g., portal prefabs).
* **Returns:** None. Registers the location internally for use by the world generation system.
* **Error states:** No explicit error handling is shown in the source; mismatches between required prefabs and loaded assets may cause runtime errors during world generation.

#### `overrides` table fields:
| Field | Type | Description |
|-------|------|-------------|
| `start_location` | `string` or `"default"` | Identifier for the starting tile prefab or `"default"` to use system default. |
| `season_start` | `string` or `"default"` | Starting season (e.g., `"summer"`) or `"default"`. |
| `world_size` | `string` or `"default"` | World size (`"small"`, `"medium"`, `"large"`, `"default"`). |
| `task_set` | `string` or `"default"` | Task set used for world room assignment (e.g., `"cave_default"`). |
| `layout_mode` | `string` | Layout algorithm (`"LinkNodesByKeys"`, `"RestrictNodesByKey"`, etc.). |
| `wormhole_prefab` | `string` or `nil` | Prefab name for wormholes connecting locations (e.g., `"wormhole"`); `nil` means no wormholes. |
| `roads` | `string` | Road generation policy (`"default"`, `"never"`, `"always"`). |
| `keep_disconnected_tiles` | `boolean` | Whether disconnected tiles (e.g., islands) are allowed. |
| `no_wormholes_to_disconnected_tiles` | `boolean` | If `true`, prevents wormholes from connecting to disconnected tiles. |
| `no_joining_islands` | `boolean` | If `true`, prevents islands from joining via roads or other connections. |
| `has_ocean` | `boolean` | If `true`, the world has ocean boundaries (e.g., forest). |
| `loop_percent` | `number` | Percentage of the world mapped as a loop (e.g., `0` for no loop). |
| `branching` | `string` | Branching behavior (`"random"`, `"none"`, etc.). |

## Events & listeners
This file does not register or fire any events. It is executed once during initialization and does not participate in runtime event handling.