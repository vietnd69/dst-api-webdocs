---
id: monkeyisland_center
title: Monkeyisland Center
description: Creates temporary, non-persistent placeholder entities used during Monkey Island world generation for anchoring safety areas and directional markers.
tags: [worldgen, placeholder]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 95c80be9
system_scope: world
---

# Monkeyisland Center

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines three prefabs (`monkeyisland_center`, `monkeyisland_direction`, and `monkeyisland_dockgen_safeareacenter`) that serve as transient, non-persistent placeholders during world generation for the Monkey Island map. These entities exist only during map construction and are automatically removed shortly after creation. They do not persist to disk or function during normal gameplay.

## Usage example
```lua
-- Not intended for direct use in mods — these prefabs are created internally during world generation.
-- Example of internal usage (from the source):
return Prefab("monkeyisland_center", fn),
       Prefab("monkeyisland_direction", fn),
       Prefab("monkeyisland_dockgen_safeareacenter", safetyareafn)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### Constructor functions (`fn` and `safetyareafn`)
*   **Description:** Instantiates and configures a transient entity for use in world generation. Entities are created with transforms, marked as non-persistent (`persists = false`), and scheduled for immediate removal via `DoTaskInTime`. The `safetyareafn` variant initializes `width` and `height` properties and registers an `OnLoad` callback.
*   **Parameters:** None (these are factory functions, not methods called on an instance).
*   **Returns:** `inst` — a configured entity instance.
*   **Error states:** If `TheWorld.ismastersim` is `false`, returns the minimal entity without adding persist/scheduling logic (client-side inert placeholder).

## Events & listeners
- **Listens to:** `OnLoad` — only in `safetyareafn`, to restore `width` and `height` from saved data if present (used during world generation loading).

