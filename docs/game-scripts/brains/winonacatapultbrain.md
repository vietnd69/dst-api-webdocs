---
id: winonacatapultbrain
title: WinonaCatapultbrain
description: AI brain that controls Winona's catapult entity to stand and attack the nearest valid target.
tags: [ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: e88c42d0
system_scope: brain
---

# WinonaCatapultbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WinonaCatapultbrain` is a behavioral AI brain component that governs the actions of Winona's catapult entity. It inherits from the base `Brain` class and constructs a behavior tree (BT) using a single high-priority node: `StandAndAttack`. This ensures the catapult remains stationary while automatically targeting and attacking the nearest valid enemy within range.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("winona_catapult")
inst:AddComponent("brain")
inst.components.brain:SetBrain("WinonaCatapultBrain")
```

## Dependencies & tags
**Components used:** None identified (relies on core `Brain` infrastructure and `BT`/`PriorityNode` utilities).
**Tags:** None identified (tags such as `winona_catapult` or `combat` are expected to be set externally on the entity).

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a root `PriorityNode` containing one child: `StandAndAttack`. This defines the primary behavior loop for the catapult.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
