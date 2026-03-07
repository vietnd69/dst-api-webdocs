---
id: hud
title: Hud
description: Manages asset and prefab loading for the in-game HUD system, ensuring all visual and UI resources are available.
tags: [ui, assets, loading]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 34a3f610
system_scope: ui
---

# Hud

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hud` prefab is a lightweight asset loader that does not instantiate a gameplay entity. Instead, it serves as a container for declaring all assets (images, animations, sounds, etc.) and child prefabs required by the HUD system. It is referenced during game initialization to ensure all visual resources for the user interface—including health, hunger, sanity meters, compass, inventory effects, emotes, and event-specific HUDs—are preloaded and available at runtime.

## Usage example
This prefab is not added to entities. It is used internally by the engine’s asset management system during startup.

```lua
-- Example of how this prefab is referenced during asset loading
Prefab("hud", fn, assets, prefabs)
-- This ensures all listed assets and sub-prefabs are loaded before UI initialization.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
This prefab does not define any functional methods beyond the constructor. It only provides a list of assets and prefabs to the `Prefab` constructor.

## Events & listeners
None identified.