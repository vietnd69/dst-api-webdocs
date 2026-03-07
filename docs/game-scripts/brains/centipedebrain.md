---
id: centipedebrain
title: Centipedebrain
description: Implements AI behavior for centipede enemies, managing combat tracking, charging, face-targeting, and autonomous movement.
tags: [ai, combat, movement]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d53b060b
system_scope: brain
---

# Centipedebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CentipedeBrain` defines the behavior tree for centipede-type entities, orchestrating combat engagement (including charge attacks), evasion, navigation home, and orientation toward targets. It depends on the `combat`, `follower`, and `knownlocations` components to make runtime decisions and construct actionable behaviors. This brain uses the standard DST `Brain` class and installs a `PriorityNode`-based behavior tree in `OnStart`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("centipede")
inst:AddComponent("combat")
inst:AddComponent("follower")
inst:AddComponent("knownlocations")
inst:AddBrain("centipedebrain")
inst.components.knownlocations:SetLocation("home", inst:GetPosition())
inst.components.follower:SetLeader(someLeader)
inst.components.combat:Setup(100)
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `knownlocations`  
**Tags:** No tags are added or removed by this brain.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree used for all AI decisions. It constructs a `PriorityNode` hierarchy that prioritizes panic, roll attacks, combat, dodging, returning home, following, and orientation, with `StandStill` as the fallback.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `rollattack` - fired when a centipede triggers a charge attack during combat.

The brain itself does not register event listeners. Event listeners and handlers (e.g., for `"rollattack"`) are typically implemented in the stategraph (`SGcentipede` or similar), not within this brain file.
