---
id: minimap
title: Minimap
description: Creates the minimap entity used for rendering the local area map on the HUD.
tags: [ui, rendering, map]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6d6732d9
system_scope: ui
---

# Minimap

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `minimap` prefab defines the in-game minimap UI entity. It is a non-networked, client-side-only entity that renders map tiles using the `MiniMap` component. The entity integrates with the map rendering system by loading tile definitions from `worldtiledefs.lua`, applying custom shader effects, and supporting mod-provided minimap atlases via `ModManager:GetPostInitData("MinimapAtlases")`.

## Usage example
```lua
-- The minimap prefab is instantiated internally by the game; modders typically do not create it manually.
-- To customize the minimap, modify world tile definitions or override minimap atlases via ModManager.
-- Example (mod-side) registration of custom atlas paths:
ModManager:RegisterPostInitData("MinimapAtlases", {{"minimap/my_custom_atlas.xml"}})
```

## Dependencies & tags
**Components used:** `MiniMap`, `UITransform`
**Tags:** Adds `minimap`

## Properties
No public properties

## Main functions
Not applicable (this is a prefab definition, not a component with instance methods)

## Events & listeners
Not applicable