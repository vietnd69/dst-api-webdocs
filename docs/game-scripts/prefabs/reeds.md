---
id: reeds
title: Reeds
description: A preconfigured plant prefab that provides cut reeds when harvested and serves as flammable fuel.
tags: [environment, resource, plant]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 31a70c70
system_scope: environment
---

# Reeds

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`reeds` is a prefab factory function that creates a plant entity with harvestable resources and fuel properties. It is used to generate in-game reeds scattered across the world, which players can pick to obtain `cutreeds` (used in crafting). The prefab integrates with multiple core systems: it supports regrowth via `pickable`, burns as fuel using `fuel`, and interacts with environment systems such as regrowth management, propagation, season limits, and hauntability.

## Usage example
```lua
-- Typical usage is internal to the game; external mods rarely instantiate it directly.
-- Example of adding to a custom location via worldgen:
local reeds =require("prefabs/reeds")("custom_reeds", "reeds", "reeds.png")
GlobalPrefabs["custom_reeds"] = reeds
```

## Dependencies & tags
**Components used:** `pickable`, `fuel`, `inspectable`, `smallburnable`, `propagator`, `nogrowinwinter`, `hauntableignite`, `regrowthmanager` (via `Make*` helpers)  
**Tags added:** `plant`, `silviculture`

## Properties
No public properties are defined or exposed. All configuration occurs via internal component initialization and helper functions.

## Main functions
### `MakeReeds(name, build, icon)`
*   **Description:** Factory function returning a `Prefab` instance for reeds. Sets up the entity with animations, sound, minimap icon, and component behavior.
*   **Parameters:**  
    - `name` (string) - Prefab name (e.g., `"reeds"`).  
    - `build` (string) - Animation bank/build name (e.g., `"reeds"`).  
    - `icon` (string) - Minimap icon filename (e.g., `"reeds.png"`).
*   **Returns:** `Prefab` instance (function closure returning an entity instance).
*   **Error states:** None. Returns `nil` on the client in non-master simulation contexts, but this is expected behavior.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None directly; emits events via `pickable` and other systems (e.g., `onpicked`, `onregen`) which may be consumed by listeners attached elsewhere.