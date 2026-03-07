---
id: daywalkerbrain
title: Daywalkerbrain
description: Controls the AI behavior of the Daywalker boss, coordinating combat targeting, dodging, stalk-in, and home-leash mechanics via a behavior tree.
tags: [ai, combat, boss, locomotion, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 1f1ec2e6
system_scope: brain
---

# Daywalkerbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DaywalkerBrain` implements the behavior tree for the Daywalker boss entity in DST. It orchestrates state-dependent combat behavior—including kiting (dodging), stalking, chasing, and returning to its prison home—by evaluating conditions via the `combat`, `knownlocations`, and `timer` components. The brain uses custom utility functions to decide when to switch between states and leverages built-in behaviors (`ChaseAndAttack`, `RunAway`, `Leash`, `Wander`, `FaceEntity`) within a hierarchical priority structure.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst:AddComponent("timer")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("DaywalkerBrain")
inst.components.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`, `timer`, `brain`
**Tags:** Checks `INLIMBO`, `playerghost`, `invisible`, `hidden`, `flight`, `shadowcreature`, `character`, `monster`, `largecreature`, `shadowminion`; also relies on `self.inst.canstalk`, state tags `jumping`, `tired`.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree root for the Daywalker entity. The behavior tree defines high-priority state guards (e.g., not jumping or tired) and priority-nested conditions for kiting, stalking, chasing, leash-return, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Requires `self.inst.components.combat`, `self.inst.components.knownlocations`, and `self.inst.components.timer` to be present; otherwise, runtime errors may occur during tree evaluation.

## Events & listeners
None identified.
