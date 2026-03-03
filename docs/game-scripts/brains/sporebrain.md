---
id: sporebrain
title: Sporebrain
description: Manages AI behavior for spore-based entities by prioritizing follow or wander actions using a behavior tree.
tags: [ai, brain, movement]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 306bf42b
system_scope: brain
---

# Sporebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SporeBrain` defines the AI behavior tree for spore-based entities, such as spore moths or spore-related minions. It uses a priority-based behavior tree with two primary actions: following nearby valid targets (players, characters, or monsters) within a specified range, or wandering near a designated "home" location (retrieved via `knownlocations:GetLocation("home")`) when no target is active or in range. This component is typically attached to entities that should loiter near a spawn point while occasionally pursuing targets.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sporebrain")
-- The behavior tree is automatically constructed on first start;
-- no further setup is required from modders.
```

## Dependencies & tags
**Components used:** `knownlocations`
**Tags:** No tags added or removed. Uses internal `inst.followobj` tracking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | BehaviorTree | `nil` (set in `OnStart`) | The compiled behavior tree instance. |
| `followobj` | Entity or `nil` | `nil` | Cached target entity the spore is currently following. |

## Main functions
### `OnStart()`
* **Description:** Initializes and starts the behavior tree. This method is automatically called when the brain component begins executing (typically after the entity enters the world).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — assumes valid `knownlocations` component is present on `inst`.

## Events & listeners
None identified.
