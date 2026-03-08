---
id: random_damage
title: Random Damage
description: Applies a random reduction to an entity's health, uses, condition, armor, or fuel based on available components.
tags: [combat, damage, utility, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 6bcdc271
system_scope: entity
---

# Random Damage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`random_damage` is a scenario utility function that applies a random, partial damage effect to an entity depending on which components are present. It is designed to simulate unpredictable damage or degradation for testing or event-based scenarios. The function prioritizes health reduction if `health` is present; otherwise, it falls back to randomly reducing `finiteuses`, `condition`, `armor.condition`, or `fueled.currentfuel` to between 10% and 75% of their respective maximum values.

## Usage example
```lua
local scenariorunner = nil -- typically provided by scenario context
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("finiteuses")
inst:AddComponent("condition")
inst:AddComponent("armor")
inst:AddComponent("fueled")

require("random_damage").OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `health`, `finiteuses`, `condition`, `armor`, `fueled`  
**Tags:** None identified.

## Properties
No public properties

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Applies a random reduction to one of the entity's resource components: health (damage), uses, condition, armor condition, or fuel. It checks for the presence of components in order and modifies only the first one found.
* **Parameters:**
  - `inst` (Entity instance) — The entity to which damage or degradation is applied.
  - `scenariorunner` (any) — Unused placeholder argument (common in scenario hooks).
* **Returns:** Nothing.
* **Error states:** 
  - If `inst` is `nil`, the function exits early with no effect.
  - If none of the targeted components (`health`, `finiteuses`, `condition`, `armor`, `fueled`) are present, no modification occurs.

## Events & listeners
None identified.