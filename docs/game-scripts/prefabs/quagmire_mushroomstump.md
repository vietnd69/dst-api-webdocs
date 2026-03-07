---
id: quagmire_mushroomstump
title: Quagmire Mushroomstump
description: A static, passive quagmire world structure that serves as a visual and thematic landmark in the Quagmire biome, with no gameplay functionality beyond appearance and identification.
tags: [structure, world, static]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4db71554
system_scope: world
---

# Quagmire Mushroomstump

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_mushroomstump` prefab is a decorative, non-interactive structure used in the Quagmire biome. It provides ambient environmental detail and is tagged for identification (`quagmire_wildplant`). It has no components for interaction, combat, or gameplay logic beyond basic rendering, physics, sound, and network synchronization. Its behavior is entirely defined at instantiation and does not respond to events or game-state changes.

## Usage example
This prefab is not intended for dynamic modder use. It is created and registered as a static world element by the game's worldgen system. Typical usage involves no direct code interaction:

```lua
-- Game internally uses this as a registered prefab; no manual instantiation required
-- Example (internal usage only — not recommended for mods):
-- local stump = SpawnPrefab("quagmire_mushroomstump")
-- stump.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None.  
**Tags:** Adds `quagmire_wildplant`.

## Properties
No public properties are initialized or exposed.

## Main functions
No public functions are defined or used.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.

The prefab registers a `master_postinit` callback via `event_server_data`, but this is internal infrastructure and not a functional method defined on the prefab itself.