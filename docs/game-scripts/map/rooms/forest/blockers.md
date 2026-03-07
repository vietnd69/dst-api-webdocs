---
id: blockers
title: Blockers
description: Registers forest biome-specific room templates that act as visual and gameplay blockers, containing fixed or randomly distributed prefabs to shape the world layout.
tags: [world, map, room, blocker, environment]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: a5e2093a
---

# Blockers

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines and registers a series of static and setpiece-based room templates used in the forest world type to serve as **blockers**—areas that visually and functionally obstruct or emphasize parts of the world layout. These rooms are not components in the ECS sense; rather, they are room definitions registered via `AddRoom()` for use in world generation. They contain decorative and gameplay-relevant prefabs (e.g., enemies, structures, terrain features), and are typically used to separate biomes or create natural barriers (e.g., dense forests, hound mounds, spider dens).

Blocker rooms share common properties:
- They have `tags = {"ForceConnected", "RoadPoison"}` to enforce connectivity constraints while marking areas that disrupt pathing.
- Their `value` field specifies the underlying tile type (e.g., `WORLD_TILES.FOREST`, `WORLD_TILES.MARSH`).
- Some are simple placeholder rooms (`type = "blank"`) used to block wormholes or create disconnected zones.

The file imports `map/room_functions`, which provides helper functions like `MakeSetpieceBlockerRoom()` used to instantiate setpiece-based blocker rooms.

## Usage example
This file is executed during world generation setup and is not instantiated as a component. However, a typical usage pattern (outside this file) to reference a registered blocker room in worldgen logic would be:

```lua
-- In a worldgen task or roomset definition:
-- Example: ensure a SpiderBlockerA room exists between two zones
local room_name = "SpiderfieldA"
local pos = {x = 0, y = 0}
world:AddRoom(room_name, pos.x, pos.y)
```

## Dependencies & tags
**Components used:** None. This file interacts only with the world generation system (`AddRoom`, `MakeSetpieceBlockerRoom`), not ECS components.

**Tags (applied to registered rooms):**
- `"ForceConnected"` — Ensures room is connected to adjacent regions.
- `"RoadPoison"` — Marks room as disruptive to road/pathing logic.
- `"OneshotWormhole"` — Applied only to `SanityWormholeBlocker`.
- `"ForceDisconnected"` — Applied only to `SanityWormholeBlocker` and `ForceDisconnectedRoom`.

## Properties
No properties are defined in a component-like structure. Room definitions are static configuration data registered via `AddRoom`.

| Field | Type | Description |
|-------|------|-------------|
| `room_name` (string) | Key to `AddRoom()` | Unique identifier for the room (e.g., `"Deerclopsfield"`, `"SpiderfieldA"`). |
| `room_def` (table) | Argument to `AddRoom()` | Table containing room configuration (see below). |

**`room_def` contents (common structure):**
| Subfield | Type | Description |
|----------|------|-------------|
| `colour` | `{r, g, b, a}` | RGBA values used for debug/display of room boundaries. |
| `value` | `WORLD_TILES.*` | Base tile type for the room (e.g., `WORLD_TILES.FOREST`, `WORLD_TILES.ROCKY`). |
| `tags` | `string[]` | Tags that affect room placement logic (e.g., connectivity, pathing). |
| `contents` | `table` | Room content specification (see below). |

**`contents` subfields:**
| Subfield | Type | Description |
|----------|------|-------------|
| `countprefabs` | `table<string, number\|function>` | Prefabs to spawn *exactly* N times, optionally with dynamic count (e.g., `deerclops = 1`, `pighead = function() return math.random(6) end`). |
| `countstaticlayouts` | `table<string, function>` | Named static layouts to spawn, with counts returned by function (e.g., `["ChessSpot1"] = function() return math.random(2,3) end`). |
| `distributepercent` | `number` | Approximate probability (0–1) that a given tile will be used to distribute distributed prefabs. |
| `distributeprefabs` | `table<string, number>` | Prefabs to distribute probabilistically across the room, with weights (higher = more likely). |
| `prefabdata` | `table<string, table>` | Optional override data to pass to spawned prefabs (e.g., `spiderden={growable={stage=3}}`). |

## Main functions
This file does not define any reusable functions or methods. It performs one-time registration of room definitions at load time.

- `AddRoom(name, room_def)`  
  Registers a new room definition with the world generation system. `room_def` must be a table with keys as described above.

- `MakeSetpieceBlockerRoom(name)`  
  Returns a room definition configured as a setpiece-based blocker for the given setpiece name (`name`). Used for standardized rooms like `"SpiderBlocker"` or `"ChessBlocker"`.

## Events & listeners
No events are registered or pushed in this file. Room definitions are declarative and do not run logic at runtime.