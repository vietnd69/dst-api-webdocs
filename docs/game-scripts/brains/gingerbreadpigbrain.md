---
id: gingerbreadpigbrain
title: Gingerbreadpigbrain
description: Controls the behavioral AI of the Gingerbread Pig entity, managing panic responses, leash-following, and orientation behavior toward targets.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e8a4141d
---

# Gingerbreadpigbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`GingerBreadPigBrain` is a behavior tree-based AI component assigned to the Gingerbread Pig entity. It implements a high-priority priority node-based behavior tree (`BT`) that orchestrates fleeing from threats, following a leash target when present, and orienting the pig toward its target. This brain emphasizes reactive responses over complex decision-making, incorporating standard behavior utilities (`RunAway`, `Leash`, `FaceEntity`) and common triggers from `BrainCommon`. The brain is initialized in `OnStart`, which constructs the behavior tree root node but does not execute any logic until activated.

## Dependencies & Tags
- **Components used:** None explicitly accessed via `inst.components.X` in this file. All external interactions are through behavior modules and functions.
- **Tags:** None added, removed, or checked directly by this brain. It relies on tag checks performed in helper functions like `KeepFaceTargetFn`.
- **Behavior modules used:** `behaviours/wander`, `behaviours/leash`, `behaviours/standstill`, `behaviours/runaway`, `behaviours/doaction`, `brains/braincommon`.

## Properties
No properties are defined as public instance variables in the constructor.

## Main Functions
No custom methods beyond the overridden `OnStart()` are defined in this brain. The behavior tree is constructed in `OnStart`, but no additional public methods exist beyond the base `Brain` class.

### `GingerBreadPigBrain:OnStart()`
* **Description:** Initializes the behavior tree root node by constructing a priority node with three major sub-behaviors: panic response (via `BrainCommon.PanicTrigger`), fleeing via `RunAway` if chased, leash-following via `Leash` if a target is assigned and not chased, and orientation via `FaceEntity`. This method is called once when the brain is attached and activated.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
No event listeners or event pushes are defined in this file. The brain does not register any `inst:ListenForEvent` calls or fire `inst:PushEvent` calls.

---