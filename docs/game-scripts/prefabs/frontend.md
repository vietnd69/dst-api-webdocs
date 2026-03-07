---
id: frontend
title: Frontend
description: Defines and manages asset and prefab dependencies for the game's frontend UI, ensuring required media resources are preloaded.
tags: [ui, assets, loading]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2923bc3e
system_scope: ui
---

# Frontend

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `frontend` prefab is not instantiated as a game entity. Instead, it serves as a metadata container used by the asset loading system to declare and preload all frontend-related assets (images, animations, sounds, atlases, etc.) and referenced prefabs. It aggregates assets required by the main menu, character selection, world settings, trade UI, mini-games, and platform-specific UI elements, including console-specific controller layouts and MOTD (Message of the Day) popups.

## Usage example
This prefab is loaded by the engine during initialization and does not require manual instantiation or interaction. Modders typically reference it indirectly when extending UI functionality:

```lua
-- No direct usage needed; the engine loads this prefab during frontend initialization
-- To extend assets, modify or extend the `assets` table before `return Prefab(...)`
```

## Dependencies & tags
**Components used:** None. This is a non-instantiable Prefab.
**Tags:** None identified.

## Properties
No public properties are defined or used by this prefab.

## Main functions
Not applicable. This file only defines a `fn` function used internally by `Prefab()` to return a dummy entity. No public methods or logic are exposed.

## Events & listeners
Not applicable.