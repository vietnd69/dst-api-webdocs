---
id: gingerbreadpigbrain
title: Gingerbreadpigbrain
description: Implements AI behavior for the Gingerbread Pig entity, handling panic, fleeing, leashing, and orientation logic.
tags: [ai, brain, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: e8a4141d
system_scope: brain
---

# Gingerbreadpigbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GingerBreadPigBrain` defines the behavior tree for the Gingerbread Pig entity in Don't Starve Together. It orchestrates core AI behaviors including panic/flee responses, leashing to a target, and face-orientation logic. The brain uses the `Brain` base class and composes behaviors from `behaviours/wander`, `behaviours/leash`, `behaviours/runaway`, and `behaviours/standstill`. It also integrates helper functions from `BrainCommon`.

The behavior tree prioritizes panic/flee responses over leashing and orientation, ensuring the pig flees from predators before attempting other behaviors.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("gingerbreadpigbrain")
-- The brain is automatically initialized on entity creation.
-- No additional setup is required; the component reacts to game state via events.
```

## Dependencies & tags
**Components used:** None identified (uses only global functions and behavior modules).
**Tags:** Checks `scarytoprey`, `notarget`, `playerghost`, `chased_by_player`; conditionally uses `leash_target`.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree (`self.bt`) for the Gingerbread Pig. Called when the brain is attached to an entity. Constructs a priority-based behavior tree root node that prioritizes panic/flee, leashing, and face-orientation logic.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

## Events & listeners
None identified.
