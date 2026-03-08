---
id: damagewalls
title: Damagewalls
description: Applies mass damage to all wall entities within range of an entity upon scenario creation.
tags: [world, environment, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: a820afb6
system_scope: environment
---

# Damagewalls

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Damagewalls` is a scenario helper module that locates and damages all wall entities within a 1000-unit radius of a given entity. It is intended to be used during scenario initialization (via `OnCreate`) to modify the world state—for example, to simulate environmental decay or deliberate destruction—by weakening or destroying walls. It relies on the `health` component of wall entities and applies random fractional damage up to 75% of their maximum health.

## Usage example
```lua
-- Typically invoked by the scenario runner during world initialization:
local Damagewalls = require("scenarios/damagewalls")
local inst = CreateEntity()
inst.Transform:SetPosition(x, y, z)
Damagewalls.OnCreate(inst, scenario_runner)
```

## Dependencies & tags
**Components used:** `health`  
**Tags:** Checks `wall` tag on entities.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Finds all entities tagged `wall` within a 1000-unit radius of `inst` and damages them. Called once during scenario setup.
* **Parameters:**  
  - `inst` (Entity) — The reference entity whose position is used as the search origin.  
  - `scenariorunner` (Entity/any) — Unused in the current implementation; included for API compatibility with other scenario hooks.  
* **Returns:** Nothing.

## Events & listeners
None.