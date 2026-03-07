---
id: marsh_plant
title: Marsh Plant
description: Creates networked prefabs for marsh plants and pond algae, configuring visual state, burnable properties, and world propagation behavior.
tags: [plant, fire, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9709b66f
system_scope: environment
---

# Marsh Plant

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`marsh_plant.lua` defines two prefabs (`marsh_plant` and `pond_algae`) that represent non-interactive environmental vegetation in the game world. It uses a shared factory function (`fn`) to instantiate entities with consistent properties: animated visuals via `ANIM` assets, transform and network support, and post-initialization setup for master simulation (e.g., burnability and inspection). This component is not a traditional ECS component but a Prefab factory — it constructs full entity instances ready for world placement.

## Usage example
```lua
-- Using the marsh_plant prefab (e.g., in a worldgen room or event)
local inst = Prefab("marsh_plant")
inst.Transform:SetPosition(x, y, z)

-- Using the pond_algae prefab
local algae = Prefab("pond_algae")
algae.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None directly — relies on world subsystem functions (`MakeMediumBurnable`, `MakeSmallPropagator`, `MakeHauntableIgnite`) and `AddComponent("inspectable")`.
**Tags:** Adds `plant`.

## Properties
No public properties — this is a Prefab factory returning entity instances, not a long-lived component class.

## Main functions
The factory function `fn(bank, build)` returns a closure that constructs an entity:
### `fn(bank, build)( )`
*   **Description:** Factory closure that creates and configures the entity instance. Accepts `bank` and `build` string parameters to select animation assets.
*   **Parameters:**
    *   `bank` (string) — Name of the animation bank (e.g., `"marsh_plant"`).
    *   `build` (string) — Name of the animation build (e.g., `"marsh_plant"`).
*   **Returns:** `inst` (Entity) — The fully configured entity instance.
*   **Error states:** None identified — always returns a valid instance.

## Events & listeners
None identified.