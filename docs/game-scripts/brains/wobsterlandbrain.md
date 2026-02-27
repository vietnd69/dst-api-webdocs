---
id: wobsterlandbrain
title: Wobsterlandbrain
description: Controls the AI behavior of a land-dwelling mob that attempts to escape into the ocean when threatened, using hop and wander logic.
tags: [ai, movement, escape, ocean]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: ba9072f4
---

# Wobsterlandbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`Wobsterlandbrain` is a brain component that governs the autonomous behavior of a land-based mob (likely a wobster variant) that seeks to enter the ocean when approached or threatened. It implements a behavior tree that prioritizes escape through hopping into the ocean if a nearby valid ocean tile exists, otherwise falling back to standard wandering. The brain integrates with the `Wander` and `Leash` behavior utilities, and relies on map query functions (`TheWorld.Map:IsOceanAtPoint`, `TheWorld.Map:IsOceanTileAtPoint`) and `FindWalkableOffset` to locate escape routes.

This component is designed for entities that inhabit land but can transition to water — likely during stress or combat — and assumes the presence of a stategraph (`inst.sg`) that handles animation state transitions such as `jumping`.

## Usage example

Add the brain component to an entity instance during prefab initialization:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrain("wobsterlandbrain")
```

No further manual invocation is typically required, as the brain is activated automatically when the stategraph enters an active state.

## Dependencies & tags

**Components used:**  
- `inst.components.brain` — for integration into the behavior tree system (via `self.bt = BT(...)`)  
- `inst.components.transform` — used implicitly via `inst.Transform:GetRotation()`  
- `inst.components.position` — used implicitly via `inst:GetPosition()`  

**Tags:**  
- None explicitly added, removed, or checked.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MAX_WANDER_DISTANCE` | number | `5` | Maximum distance the mob wanders from its current position while on land. |
| `OCEAN_SEARCH_DISTANCE` | number | `10` | Radius used to search for ocean tiles during escape planning. |
| `HOP_DISTANCE` | number | `1.5` | Distance ahead in current facing direction checked for a valid hop entry point. |
| `WANDER_TIMES` | table | `{ minwalktime = 3, randwalktime = 1, minwaittime = 0, randwaittime = 0.1 }` | Timing parameters passed to `Wander` behavior to control walk/wait intervals. |
| `inst._ocean_escape_position` | Vector3 or `nil` | `nil` | Cached target position in the ocean for leashing during escape. |
| `inst._ocean_hop_position` | Vector3 or `nil` | `nil` | Cached position of the first valid tile to hop into from land. |

## Main functions

### `WobsterLandBrain:OnStart()`
* **Description:** Initializes the behavior tree root node with a hierarchy of priority-based actions. It sets up state guards to prevent interference with jumping, checks for nearby hop points, locates ocean targets via `find_ocean_position`, and falls back to wandering if escape isn’t viable.
* **Parameters:** None.
* **Returns:** None (sets `self.bt` internally).
* **Error states:** None documented; assumes valid `inst.sg`, `TheWorld.Map`, and behavior utilities (`BT`, `PriorityNode`, `ActionNode`, `Leash`, `Wander`) are available.

## Events & listeners

**Pushes:**
- `"onhop"` — Fired when the mob successfully finds and executes a hop into the ocean. Data passed: `{ hop_pos = Vector3 }`, where `hop_pos` is the target ocean tile position.

**Listens to:**  
- None explicitly registered within this component. Event `"onhop"` is triggered by internal logic, not listened for locally.

---