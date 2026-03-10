---
id: worldtiledefs
title: Worldtiledefs
description: Defines ground and wall tile properties and footstep sound logic for entities moving across the world.
tags: [world, audio, terrain, locomotion]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: da4d5fc3
system_scope: world
---

# Worldtiledefs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`worldtiledefs` defines static tile property configurations for ground and wall types, along with utilities for tile lookup and footstep sound playback. It serves as a central registry for world tile metadata (e.g., walk sounds, snow/mud compatibility) used by the `locomotor` and `rider` components during entity movement. Tile info is cached at startup for efficient runtime access via `GetTileInfo`, and the module exposes the `PlayFootstep` function to trigger platform-specific or surface-specific audio.

## Usage example
```lua
-- Ensure tile info is cached before use (typically done once at startup)
TheWorld:StartThread(function() require "worldtiledefs" end)

-- Retrieve tile properties
local tileinfo = GetTileInfo(WORLD_TILES.DIRT)
if tileinfo and tileinfo.walksound then
    print("Default walk sound for dirt:", tileinfo.walksound)
end

-- Play footstep for an entity
local player = TheWorld.entities["player"]
PlayFootstep(player, 1.0, false)
```

## Dependencies & tags
**Components used:** `locomotor`, `rider`
**Tags:** Checks `"gelblobbed"`, `"player"`, `"smallcreature"`, `"largecreature"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{}` | List of required asset declarations (IMAGE and FILE) for tile textures and atlases. |
| `ground` | table | `{}` | Alias for internal `GROUND_PROPERTIES` (deprecated; use `Initialize` instead). |
| `wall` | table | `{}` | Deprecated wall property definitions. |
| `underground` | table | `{}` | Deprecated underground layer definitions. |
| `minimap`, `turf`, `falloff`, `creep`, `minimapassets` | table | `{}` | Reserved placeholders; currently unused. |

## Main functions
### `GetTileInfo(tile)`
*   **Description:** Returns cached tile property data for a given tile type after `Initialize` has been called. Fast O(1) lookup.
*   **Parameters:** `tile` (number) – A `WORLD_TILES.*` constant.
*   **Returns:** `table` – Tile properties (e.g., `walksound`, `snowsound`, `nogroundoverlays`) or `nil` if no info exists.
*   **Error states:** Returns `nil` if called before `Initialize()`.

### `LookupTileInfo(tile)`
*   **Description:** Legacy fallback performing a linear search over `GROUND_PROPERTIES`. Slower than `GetTileInfo`; use only for debugging or tooling.
*   **Parameters:** `tile` (number) – A `WORLD_TILES.*` constant.
*   **Returns:** `table` – Tile properties or `nil`.
*   **Error states:** O(n) complexity; not recommended for runtime use.

### `PlayFootstep(inst, volume, ispredicted)`
*   **Description:** Triggers platform-specific or surface-specific footstep sounds for an entity, accounting for special states (e.g., riding, snow/mud, webbing, size).
*   **Parameters:**  
    `inst` (Entity) – The entity producing the footstep.  
    `volume` (number) – Optional volume multiplier (default: `1`).  
    `ispredicted` (boolean) – Whether the sound is client-predicted (for networking).
*   **Returns:** Nothing.
*   **Error states:** Silently does nothing if `inst` lacks a `SoundEmitter` component.

## Events & listeners
None identified.