---
id: butterflybrain
title: Butterflybrain
description: Controls the AI behavior of butterfly entities, managing idle wandering, flower collection, and escape responses.
tags: [ai, pollination, flee]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: e1711b66
system_scope: brain
---

# Butterflybrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ButterflyBrain` implements the behavior tree for butterfly entities in DST. It handles natural behaviors such as wandering in search of flowers, pollinating them, and returning home (to the nearest flower) when pollen collection is complete or when nighttime begins. It also integrates panic and flee responses when nearby threats are detected. This component relies heavily on `BrainCommon` utilities and external behaviors for execution.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pollinator")
inst:AddComponent("skilltreeupdater")
inst:AddBrain("butterflybrain")
-- The brain automatically starts on entity spawn; no manual activation required.
```

## Dependencies & tags
**Components used:** `pollinator`, `skilltreeupdater`  
**Tags:** `flower` (used to locate targets), `scarytoprey` (used to identify fleeing targets)  
**Behaviors referenced:** `runaway`, `wander`, `doaction`, `findflower`  

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree root for the butterfly. This method is called automatically when the brain becomes active (typically on entity spawn). It constructs a priority-based behavior tree to handle panic, home-returning, and flower-finding actions.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
This component does not register custom event listeners or push events directly. It delegates state transitions and actions to the underlying behavior tree.
