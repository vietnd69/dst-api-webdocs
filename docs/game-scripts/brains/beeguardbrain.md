---
id: beeguardbrain
title: Beeguardbrain
description: Implements the AI behavior tree for the Bee Guard entity, which patrols near the Bee Queen and engages threats while maintaining formation.
tags: [ai, combat, boss, formation, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 97e7938a
system_scope: brain
---

# Beeguardbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BeeGuardBrain` defines the behavior tree for the Bee Guard entity in DST. It coordinates movement, combat, and formation-keeping behaviors to protect the Bee Queen. The brain prioritizes panic and hazard avoidance over combat, then alternates between breaking formation to chase targets and holding station near the queen. It interacts with the `combat`, `health`, and `knownlocations` components to determine valid targets, target status, and queen-relative positioning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knownlocations")
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddBrain("beeguardbrain")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `knownlocations`  
**Tags:** Checks tags `bee`, `player`, `playerghost`, `INLIMBO`, `_combat`, `_health` (via `RunAway` parameters); does not modify tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shouldchase` | boolean | `false` | Internal state flag indicating whether the guard should transition to chasing mode. |

## Main functions
### `OnStart()`
* **Description:** Constructs and assigns the behavior tree root node. Initializes the `bt` property with a priority-based behavior tree that evaluates conditions in order: panic, electric fence avoidance, combat/chase, formation-holding, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error handling — tree construction fails silently if dependencies (e.g., `GetQueen()`, `knownlocations:GetLocation("queenoffset")`) return `nil`.

## Events & listeners
* **Listens to:** None — uses continuous behavior tree evaluation instead of event-driven state changes.
* **Pushes:** None — this brain does not fire custom events.
