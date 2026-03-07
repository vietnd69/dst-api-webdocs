---
id: lureplantbrain
title: Lureplantbrain
description: Implements the behavior tree for a lureplant entity, primarily delegating minion control and movement through behavior nodes.
tags: [ai, brain, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 896e1eb9
system_scope: brain
---

# Lureplantbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LureplantBrain` is a behavior tree-based AI controller for lureplant entities. It inherits from the base `Brain` class and initializes a behavior tree with a priority node containing the `ControlMinions` behavior as its primary task. The `StandStill` behavior exists in source code but is commented out, indicating it is not currently active.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("lureplant")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("lureplantbrain")
inst.components.brain:Start()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root node. Sets up a priority node with `ControlMinions` as the active behavior and assigns it to `self.bt`. The `StandStill` behavior is included in the code but commented out.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Relies on `ControlMinions` and `BT` classes being correctly defined and instantiated; no error handling is present in this method.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
