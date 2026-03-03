---
id: boatrace_spectator_dragonlingbrain
title: Boatrace Spectator Dragonlingbrain
description: Controls the behavior of a spectator dragonling that follows a boat race indicator entity during boat races.
tags: [ai, locomotion, event, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 3d5713c5
system_scope: brain
---

# Boatrace Spectator Dragonlingbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatraceSpectatorDragonlingBrain` defines the behavior tree for a dragonling entity acting as a spectator during a boat race. It is attached to a brain component and orchestrates movement and orientation toward a designated "indicator" entity (representing the race's current goal) while avoiding conflict with flight-based states. The brain uses the `EntityTracker` component to locate the target and applies behavior tree logic to maintain a moderate follow distance and face the target continuously.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("dragonling")
inst:AddComponent("brain")
inst:AddComponent("entitytracker")
inst.components.brain:SetBrain("boatrace_spectator_dragonlingbrain")
```

## Dependencies & tags
**Components used:** `entitytracker`, `behaviourtree`, `brain`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree for the dragonling. It sets up a priority node that blocks movement while flying and otherwise executes two concurrent behaviors: following the race indicator and facing it.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.inst.sg:HasStateTag("flight")` is true during the first evaluation, due to the `FailIfSuccessDecorator` wrapping the `ConditionWaitNode`. This prevents updates while the entity is in flight state.

## Events & listeners
None identified.
