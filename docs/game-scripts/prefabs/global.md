---
id: global
title: Global
description: Defines global assets required for the game's frontend, UI, animations, shaders, fonts, and sound packages—serving as a shared dependency container for the entire game and modding system.
tags: [asset, frontend, ui, sound, animation]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8a7e84a5
system_scope: world
---

# Global

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`global.lua` defines the `global` prefab, a shared asset container used across the game's frontend (FE), in-game UI, character systems, and runtime rendering. It does *not* define an entity component—it is a *prefab factory* used exclusively to preload and register a massive list of assets (images, animations, shaders, fonts, sound packages, dynamic atlases, etc.). These assets are referenced by nearly all UI widgets, screens, prefabs, and rendering systems. The prefab itself has no constructor logic or functionality beyond asset registration and returns a minimal `Prefab` instance.

## Usage example
This prefab is not instantiated or used directly in gameplay logic. Instead, it is loaded at startup by the engine to populate the global asset pool. Modders may reference its assets by name (e.g., `"images/global.xml"`) but should avoid redefining it.

```lua
-- Not intended for direct use. Example of asset referencing in a mod:
local mywidget = Widget("my_custom_image")
mywidget.texture = "images/global.tex"
mywidget.atlas = "images/global.xml"
```

## Dependencies & tags
**Components used:** None  
**Tags:** None  

## Properties
No public properties exist. This is not a component or entity—it is a static asset manifest.

## Main functions
This file defines only a single top-level expression and no functions accessible to modders.

## Events & listeners
No events or listeners.

