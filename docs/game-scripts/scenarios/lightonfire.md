---
id: lightonfire
title: Lightonfire
description: Triggers fire ignition on an entity upon creation by calling `Burnable:Ignite()` if the burnable component is present.
tags: [fire, scenario, ignition]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 39bb8b39
system_scope: environment
---

# Lightonfire

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Lightonfire` is a scenario-stage script that automatically ignites an entity when it is created. It is typically used in event-driven world generation or scenario logic where certain objects or props should start on fire at spawn time. It relies exclusively on the `burnable` component and invokes its `Ignite` method without parameters, triggering default burning behavior.

## Usage example
```lua
-- Applied via scenario/task when spawning a flammable entity
local inst = CreateEntity()
inst:AddComponent("burnable")
inst:AddComponent("fueled")
inst:AddComponent("propagator")
-- ... other setup ...
inst:AddEventCallback("oncreate", function() ... end)
```
In practice, this script is invoked internally by the scenario system using `OnCreate(inst, scenariorunner)`.

## Dependencies & tags
**Components used:** `burnable`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Checks if the entity has a `burnable` component and, if so, calls `Ignite()` to start burning immediately upon entity creation.
* **Parameters:**  
  `inst` (EntityInstance) — the entity being created; must have a `burnable` component to have an effect.  
  `scenariorunner` (ScenarioRunner?) — the scenario controller instance (unused in current implementation).  
* **Returns:** Nothing.
* **Error states:** No effect occurs if `inst.components.burnable` is absent.

## Events & listeners
None.