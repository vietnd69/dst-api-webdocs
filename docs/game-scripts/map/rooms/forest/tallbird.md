---
id: tallbird
title: Tallbird
description: Defines a room template named TallbirdNests used in the forest level to procedurally generate nest clusters containing tallbird nests, rocks, and other sparse environmental objects.
tags: [world, procedural, room, generation]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 29669c12
---

# Tallbird

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `TallbirdNests` room template is a procedural map room definition used in the Forest level to generate clusters of tallbird-related environmental content. It specifies visual, tile, and tag properties for the room, as well as a weighted distribution of prefabs to populate the room during world generation. This component does not define an ECS component class; instead, it is a one-time procedural registration call that registers the room type with the world generation system.

The room uses a semi-transparent bluish (`colour={r=0.55,g=0.75,b=0.75,a=0.50}`) overlay and is built on `WORLD_TILES.ROCKY` terrain. It includes metadata tags (`ExitPiece`, `Chester_Eyebone`, `Astral_1`) that indicate special generation roles—e.g., it may serve as an exit point or be used in specific scenarios or events.

## Usage example
This room template is registered during world initialization and used internally by the world generation system. Typical usage occurs during map generation; modders may reference or extend it as follows:

```lua
AddRoom("TallbirdNests", {
    colour = {r = 0.55, g = 0.75, b = 0.75, a = 0.50},
    value = WORLD_TILES.ROCKY,
    tags = {"ExitPiece", "Chester_Eyebone", "Astral_1"},
    contents = {
        distributepercent = 0.1,
        distributeprefabs = {
            rock1 = 2,
            rock2 = 2,
            rock_ice = 0.5,
            tallbirdnest = 1.8,
            spiderden = 0.01,
            blue_mushroom = 0.02,
        },
    }
})
```

## Dependencies & tags
**Components used:** None — this is a procedural room definition, not an ECS component.  
**Tags:** The room itself carries the following tags: `ExitPiece`, `Chester_Eyebone`, `Astral_1`. These are metadata tags used by the world generation system and modding API, not entity tags.

## Properties
The `AddRoom` call defines the following public configuration properties for the room template:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colour` | `table` (`{r,g,b,a}`) | `{r=0.55,g=0.75,b=0.75,a=0.50}` | RGBA overlay color applied to the room during rendering (used for debugging or visual cues). |
| `value` | `WORLD_TILES` constant | `WORLD_TILES.ROCKY` | Specifies the tile type the room requires or overrides on the map. |
| `tags` | `table` (array of strings) | `{"ExitPiece", "Chester_Eyebone", "Astral_1"}` | Metadata tags associated with the room, influencing generation conditions or modding hooks. |
| `contents.distributepercent` | `number` | `0.1` | Probability (10%) that this room will be selected during room generation steps. |
| `contents.distributeprefabs` | `table` (prefab -> weight) | `{rock1=2, rock2=2, rock_ice=0.5, tallbirdnest=1.8, spiderden=0.01, blue_mushroom=0.02}` | Weighted distribution table of prefabs to spawn inside the room. Higher weights increase spawn likelihood. |

## Main functions
This is a procedural registration call, not a component class with methods. There are no callable functions on this definition beyond the `AddRoom` registration itself (which is internal to the world generation system).

## Events & listeners
This definition does not register any event listeners or push any events.