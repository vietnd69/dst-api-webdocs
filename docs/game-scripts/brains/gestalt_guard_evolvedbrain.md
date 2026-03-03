---
id: gestalt_guard_evolvedbrain
title: Gestalt Guard Evolvedbrain
description: Implements the decision-making logic for an evolved Gestalt guard enemy, handling combat targeting, movement, and ranged/telporting attacks via behavior trees.
tags: [ai, combat, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: b0158237
system_scope: brain
---

# Gestalt Guard Evolvedbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GestaltGuardEvolvedBrain` is a brain component that defines the behavior tree for an evolved Gestalt guard enemy. It inherits from `Brain` and constructs a priority-based behavior tree in `OnStart`, which evaluates combat state, range to target, and special abilities like teleportation to decide the appropriate action (e.g., closing range, evading, or attacking at close/mid/far ranges). It depends on the `combat` component to identify and validate the current target.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat") -- Required for targeting
inst:AddBrain("gestalt_guard_evolvedbrain")
inst.components.combat:SetTarget(some_entity)
inst.sg:GoToState("idle") -- Triggers brain execution via OnStart if not already active
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and sets the root behavior tree for the entity. It constructs a priority-based tree that checks for busy states, calculates distance to the current target, and selects attack or movement actions based on that distance and special teleportation logic.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Expects `self.inst.components.combat` to be present and valid. Behavior tree execution will stall or misfire if the target is invalid or missing.

## Events & listeners
None identified.
