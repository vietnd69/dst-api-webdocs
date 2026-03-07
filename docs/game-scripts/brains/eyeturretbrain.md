---
id: eyeturretbrain
title: Eyeturretbrain
description: Manages the AI behavior for an eye turret entity, determining target acquisition and prioritizing attack and orientation actions.
tags: [ai, combat, stationary]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 51cecaa6
system_scope: brain
---

# Eyeturretbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`EyeTurretBrain` implements behavior tree logic for an eye turret entity. It inherits from `Brain` and configures a priority-based behavior tree that first attempts to execute `StandAndAttack`, and otherwise attempts to orient the entity toward the nearest valid target using `FaceEntity`. Target selection prioritizes players within a proximity range, excluding those with the `notarget` tag.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("eyeturretbrain")
-- The behavior tree is initialized automatically upon add
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `notarget` (on targets); no tags are added or removed by this component.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a priority node. The root node first attempts `StandAndAttack` (which handles targeting and attacking), then falls back to `FaceEntity` (which ensures the entity faces the nearest valid player within range). Runs once when the brain is started.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — relies on `StandAndAttack` and `FaceEntity` to handle target validity internally.

## Events & listeners
None identified
