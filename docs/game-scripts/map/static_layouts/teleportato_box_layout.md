---
id: teleportato_box_layout
title: Teleportato Box Layout
description: Defines the static layout data for the Teleportato's chamber, including tile layer specifications and object placements used in world generation.
tags: [world, map, layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 8390bbf2
system_scope: world
---

# Teleportato Box Layout

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is not a component, but rather a static layout definition used by the DST world generation system. It specifies the Tiled map format layout for the Teleportato's chamber, including tile placement in the `BG_TILES` layer and object positions (e.g., `teleportato_box`, `flower_evil`, `wall_stone`, `trinket_4`, `spear`) in the `FG_OBJECTS` layer. The file is consumed by the level/room generation system to place these assets deterministically during world initialization.

## Usage example
This file is automatically loaded by the world generation engine and is not directly instantiated or manipulated by modders. It is referenced internally by static layout loading utilities, such as in the `map` and `static_layouts` subsystems.

```lua
-- Not applicable: This file is a data asset, not a moddable component.
-- It is used internally by DST's worldgen system (e.g., by functions like LoadStaticLayout).
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This file is a pure data module returning a table conforming to the Tiled JSON export format (with Lua serialization).

## Main functions
Not applicable — this is a data file, not a script module with callable functions.

## Events & listeners
Not applicable — this file contains no logic and does not interact with the event system.