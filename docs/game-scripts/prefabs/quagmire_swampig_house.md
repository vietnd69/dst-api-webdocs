---
id: quagmire_swampig_house
title: Quagmire Swampig House
description: Creates the visual and physical representation of a Quagmire swamp pig house, including normal and rubble states with appropriate animations and physics.
tags: [environment, structure, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ba9e5626
system_scope: environment
---

# Quagmire Swampig House

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_swampig_house` prefab defines two variants of a structural element in the Quagmire biome: a standing house and its rubble state. It is a static environmental asset that provides visual identity and collision for the swamp pig village areas. The prefab sets up transform, animation state, and network capabilities, applies obstacle physics, configures snow coverage (via `MakeSnowCoveredPristine`, `MakeSnowCovered`), and adds inspectability and hauntability support. It does not contain any custom components — it relies entirely on standard DST prefab utilities.

## Usage example
This prefab is instantiated by the world generation system and should not be manually created by modders. To reference or modify behavior, extend it via overrides or use it as a base for custom prefabs:

```lua
-- Example: Registering a custom variant (not recommended unless modifying game code directly)
local quagmire_swampig_house = require "prefabs/quagmire_swampig_house"
-- Note: Prefabs are returned as tables from this file; direct construction is internal to DST's prefab system.
```

## Dependencies & tags
**Components used:** None (uses only shared utility functions: `MakeObstaclePhysics`, `MakeSnowCoveredPristine`, `MakeSnowCovered`, `MakeHauntableWork`, `inst:AddComponent("inspectable")`).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable (this is a Prefab definition, not a component).

## Events & listeners
None identified.