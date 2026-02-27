---
id: stagehandbrain
title: Stagehandbrain
description: Implements AI behavior for the Stagehand entity, prioritizing panic responses at night while seeking nearby light sources.
tags: [ai, brain, npc, light, panic]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 6ea76aa0
---

# Stagehandbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `StagehandBrain` component provides behavior-tree-based AI logic for the Stagehand entity (a non-player character in DST). Its primary responsibility is to manage movement and action selection under different environmental and temporal conditions. At night, it prioritizes moving toward nearby light sources (e.g., campfires, lanterns) while respecting a safe minimum distance. During the day or when standing is impossible, the entity remains idle. Panic behavior (triggered externally) takes highest priority.

The component depends on `BrainCommon` (for `PanicTrigger`) and `inventoryitem` (to identify players via grand ownership), and leverages shared behavior definitions (`FindClosest`, `StandStill`, `WhileNode`, `PriorityNode`) to construct its behavior tree.

## Usage example

```lua
local StagehandBrain = require("brains/stagehandbrain")
local inst = CreateEntity()
inst:AddComponent("stagehandbrain")
inst.stagehandbrain = StagehandBrain(inst)
-- The component's OnStart method should be called explicitly if the brain is not auto-initialized by the entity framework.
inst.stagehandbrain:OnStart()
```

## Dependencies & tags

**Components used:**
- `inventoryitem` — accessed via `target.components.inventoryitem:GetGrandOwner()`.
- `light` — accessed via `target.Light:GetCalculatedRadius()`.
- `brain` — base class (`Brain._ctor`).
- `behaviours/findclosest`, `behaviours/standstill` — used via standalone functions.

**Tags:** None added or removed by this component. However, it evaluates tags `player`, `playerlight`, `fire`, `campfire`, and `lighter` when resolving targets or distances.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the brain controls. Inherited from `Brain`. |
| `bt` | `BT` (Behavior Tree) | `nil` | The active behavior tree instance, initialized during `OnStart`. |

No additional properties are explicitly defined in the constructor beyond the inherited `inst` from `Brain`.

## Main functions

### `OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the Stagehand entity. Constructs a behavior tree root with priority-ordered nodes: panic response first, followed by night-time light-seeking behavior, then standing idle.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented. Assumes required behaviors (`FindClosest`, `StandStill`, `WhileNode`, `PriorityNode`) and `BrainCommon.PanicTrigger` are correctly loaded.

### `SafeLightDist(inst, target)`
* **Description:** A local utility function that returns the minimum safe distance the Stagehand should maintain from a given target. It overrides the base `FindClosest` distance depending on target type and ownership.
* **Parameters:**
  - `inst` (`Entity`) — the Stagehand entity (unused, present for signature compatibility).
  - `target` (`Entity`) — the candidate light target.
* **Returns:** `number` — safe distance in world units (e.g., `4` for players/light sources, `target.Light:GetCalculatedRadius()` otherwise).
* **Error states:** Defaults to `4` if target lacks light component, `player` tag, or grand owner with `player` tag.

## Events & listeners

None identified. This component does not register or push any events.