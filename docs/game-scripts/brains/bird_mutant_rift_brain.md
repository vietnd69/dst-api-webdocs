---
id: bird_mutant_rift_brain
title: Bird Mutant Rift Brain
description: Controls the decision-making behavior of the Mutated Rift Bird, handling flight responses to threats and food/mining actions.
tags: [ai, brain, combat, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 3f579641
system_scope: brain
---

# Bird Mutant Rift Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MutatedBirdBrain` implements the behavior tree for the Mutated Rift Bird, an entity in DST that flies away when threatened or during specific moon phases, and can target edible objects or lunar hail buildups for interaction. It extends the base `Brain` class and integrates with the `health`, `burnable`, `eater`, and `hauntable` components to respond to environmental and entity-based stimuli. The brain uses a priority-based behavior tree to select actions, prioritizing flight (via the `flyaway` event) over food or mining operations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("burnable")
inst:AddComponent("eater")
inst:AddComponent("hauntable")
inst:AddTag("player")
inst.flyawaydistance = TUNING.RIFT_BIRD_FLEE_RANGE
inst:AddBrain("bird_mutant_rift_brain")
```

## Dependencies & tags
**Components used:** `health`, `burnable`, `eater`, `hauntable`  
**Tags:** Checks `notarget`, `INLIMBO`, `lunar_aligned`, `player`, `monster`, `scarytoprey`, `FX`, `NOCLICK`, `DECOR`, `outofreach`, `LunarBuildup`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flyawaydistance` | number | `nil` | Radius around the entity within which living threats are detected. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Mutated Rift Bird. Constructs a priority-based root node that evaluates flight conditions first, then food and lunar hail mining actions.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes required components (`health`, `burnable`, `eater`, `hauntable`) exist; missing components may cause runtime errors during node evaluation.

## Events & listeners
- **Listens to:** `threatnear`, `gohome` — triggers immediate flight response.
- **Pushes:** `flyaway` — fired to signal the entity should begin flight.
