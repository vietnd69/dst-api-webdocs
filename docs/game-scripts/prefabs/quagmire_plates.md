---
id: quagmire_plates
title: Quagmire Plates
description: Factory prefab generator for Quagmire silver plates and bowls with baked-in visual and network configuration.
tags: [quagmire, food, replica]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f481d9d1
system_scope: entity
---

# Quagmire Plates

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_plates.lua` file defines a reusable factory function `MakePlate` that constructs prefabs for Quagmire-series silver plates and bowls. These prefabs are simple in-game items used as functional replacements for standard plate/bowl items in the Quagmire scenario. The component does not define a reusable component class; instead, it directly returns two prefabs (`quagmire_plate_silver` and `quagmire_bowl_silver`) configured with specific animations, assets, and server-side initialization hooks.

It integrates with the game’s asset system, network replication, and event framework for master-side setup (`event_server_data`), but does not define or depend on any custom components.

## Usage example
```lua
-- This file is used internally by the game to register prefabs.
-- Modders can reference the prefabs directly:
local plate = SpawnPrefab("quagmire_plate_silver")
local bowl = SpawnPrefab("quagmire_bowl_silver")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `quagmire_replater` to each generated prefab instance.

## Properties
No public properties.

## Main functions
### `MakePlate(basedish, dishtype, assets)`
*   **Description:** Constructs and returns a `Prefab` definition for a Quagmire-specific dishware item (e.g., silver plate or bowl). This is a factory function used to avoid duplication across similar prefabs.
*   **Parameters:**
    * `basedish` (string) – Base name for the animation bank and build (e.g., `"plate"` or `"bowl"`).
    * `dishtype` (string) – Subtype identifier used in animation symbol overrides and filenames (e.g., `"silver"`).
    * `assets` (table) – *Unused* in current implementation; local assets table is defined inside the function and shadows the parameter.
*   **Returns:** `Prefab` – A fully configured prefab definition ready for registration.
*   **Error states:** None identified; assumes valid string inputs.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
*(Note: `event_server_data` is a registered hook, not a local event listener.)*