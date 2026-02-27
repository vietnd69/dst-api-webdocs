---
id: terrain_marsh
title: Terrain Marsh
description: Registers marsh-themed room templates for procedural map generation with specific prefabs, distribution rules, and visual properties.
tags: [world, procedural, room, terrain]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: eb9fe23a
---

# Terrain Marsh

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines four distinct room templates for marsh terrain using the `AddRoom` function. These templates are used by the world generation system to populate maps with marsh environments, each with unique visual styling, tag assignments, and static layout or prefab distribution configurations. The component itself does not define an Entity Component System (ECS) component but rather registers room configurations that the map generator consumes during level construction.

## Usage example
Typically this file is not invoked directly by modders. Instead, the room definitions are used automatically by the world generation system. To reference a registered room in custom worldgen logic, use its identifier string (e.g., `"Marsh"`, `"SpiderMarsh"`) in room selection logic or overrides.

```lua
-- Example: Accessing a registered room definition internally (for reference only)
-- Note: AddRoom registers rooms in a global table; direct modification is discouraged.
-- local rooms = GetWorldGen()._rooms or {} -- hypothetical internal access
-- if rooms["SpiderMarsh"] then
--     print("SpiderMarsh room found:", rooms["SpiderMarsh"].value)
-- end
```

## Dependencies & tags
**Components used:** None — this file does not interact with ECS components.  
**Tags:** Room definitions assign the following tags:
- `"ExitPiece"` — indicates suitability as an exit room.
- `"Chester_Eyebone"` — enables use in CHESTER mode (Eyebone requirements).
- `"Astral_1"` or `"Astral_2"` — astronomical seasonal phase constraints for room placement.

## Properties
No public instance properties are defined. All data resides in the `room` tables passed to `AddRoom`, which are internal to the world generation system.

## Main functions
### `AddRoom(name, room_def)`
* **Description:** Registers a room template for procedural map generation. Each call defines a room type (e.g., `"Marsh"`) with associated visual, functional, and content rules. The provided `room_def` is stored globally and later used by the map generation system to place rooms during world generation.
* **Parameters:**
  - `name` (`string`) — Unique identifier for the room (e.g., `"BGMarsh"`, `"SpiderMarsh"`).
  - `room_def` (`table`) — Configuration table with the following keys:
    - `colour` (`table` with `r`, `g`, `b`, `a` numeric fields) — RGBA colour used for debugging or tile rendering.
    - `value` (`number`) — Tile type constant (e.g., `WORLD_TILES.MARSH`), used to determine terrain visuals.
    - `tags` (`table` of `string`) — Metadata tags affecting room compatibility.
    - `contents` (`table`) — Content rules for room generation, containing:
      - `countstaticlayouts` (`table`) — Key-value mappings where keys are static layout prefabs and values are functions returning the count of that layout to place (based on probability).
      - `distributepercent` (`number`) — Minimum percentage of the room area that must be covered by prefabs.
      - `distributeprefabs` (`table`) — Prefab placement rules; keys are prefab names, values are weights (higher weight = higher spawn chance) or functions returning counts.
      - `prefabdata` (`table`, optional) — Functions to generate per-prefab custom data (e.g., growth stages).
* **Returns:** `nil`.
* **Error states:** No error handling is defined in this file. Misconfigured data (e.g., invalid prefab names) will likely cause silent generation failures or runtime warnings.

## Events & listeners
No events or event listeners are present. This file contributes configuration data to the world generation system and does not participate in DST’s event-driven architecture.