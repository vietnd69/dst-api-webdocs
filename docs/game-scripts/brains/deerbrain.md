---
id: deerbrain
title: Deerbrain
description: Manages the behavior tree for deer entities, coordinating solo and herd-based AI including fleeing, wandering, grazing, and alert responses.
tags: [ai, animal, herd, combat, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 8454f523
system_scope: brain
---

# Deerbrain

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`Deerbrain` implements the decision-making logic for deer entities in Don't Starve Together. It uses a behavior tree (`BT`) to orchestrate actions based on the deer's current context: whether it is part of a herd or solitary. The brain coordinates movement, alert awareness, and panic responses by integrating with several components, including `combat`, `deerherding`, `hauntable`, and `knownlocations`. When active in a herd, the deer follows herd-wide directives (e.g., staying near the herd location, grazing together), while solitary deer rely on solo logic like fleeing from players and wandering.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("deer")
inst:AddComponent("deerherding")
inst:AddComponent("combat")
inst:AddComponent("hauntable")
inst:AddComponent("knownlocations")

inst.brain = DeerBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:**  
- `combat` (via `:HasTarget()`, `target`)  
- `deerherding` (via `:GetClosestHerdAlertTarget()`, `:HerdHasAlertTarget()`, `:IsActiveInHerd()`, `:IsGrazing()`, `:SetHerdAlertTarget()`, `herdlocation`)  
- `hauntable` (via `panic`)  
- `knownlocations` (via `:GetLocation()`)

**Tags:** Checks `deer` and `notarget`; no tags added or removed by this brain itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Actor` | *(inherited)* | The entity instance this brain controls. |
| `bt` | `BT` | `nil` (set on `OnStart`) | The behavior tree instance managing the deer's decision logic. |

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree for the deer. Constructs two distinct sub-trees—`solomentality` for solitary deer and `herdmentality` for herd members—and combines them in a `PriorityNode` that selects the appropriate behavior based on herd participation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes required components and tuning values (`TUNING.DEER_HERD_MOVE_DIST`, etc.) are available.

## Events & listeners
* **None identified.**  
This brain does not directly register or fire events; it relies on state-based checks and component callbacks within the behavior tree nodes.
