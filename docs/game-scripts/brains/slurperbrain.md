---
id: slurperbrain
title: Slurperbrain
description: Provides AI behavior logic for the Slurper entity, managing panic responses, enemy chasing, and homing wandering using known locations.
tags: [ai, locomotion, combat, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: eb0fb24e
system_scope: brain
---

# Slurperbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SlurperBrain` is the behavior tree brain component for the Slurper entity. It defines high-priority panic responses (for electric fences and general danger), a chase-and-attack sequence for enemies within range, and a wandering behavior that guides the Slurper toward its registered "home" location. It inherits from `Brain` and integrates with the `knownlocations` component to access static world positions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrain("slurperbrain")
```

## Dependencies & tags
**Components used:** `knownlocations`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the Slurper's behavior tree. Constructs a priority-based root node that evaluates panic triggers first, followed by combat and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Requires `inst.components.knownlocations` to be present; calls `GetLocation("home")` during wandering behavior setup.

## Events & listeners
None identified.
