---
id: winonacatapultbrain
title: WinonaCatapultbrain
description: Implements the decision-making logic for Winona's catapult NPC, using a behavior tree to execute a single standby-and-attack sequence.
tags: [ai, combat, npc]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e88c42d0
---

# WinonaCatapultbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`WinonaCatapultBrain` is a brain component that governs the behavior of Winona's summoned catapult entity. It extends the base `Brain` class and constructs a behavior tree (`BT`) during `OnStart`. The behavior tree contains a single `StandAndAttack` behavior as its root node, meaning the entity will continuously assess its environment and engage in standing-and-attacking logic when activated.

This component is part of the Entity Component System (ECS), attached to an entity instance via `inst:AddComponent("brain")` (typically with the name `"winonacatapultbrain"`). It interacts with the `StandAndAttack` behavior to determine combat actions such as target selection and attack execution.

## Usage example
The component is typically added and initialized automatically by the game when spawning the catapult entity. For modding reference, the typical pattern is:

```lua
local inst = Entity("winonacatapult")
inst:AddComponent("brain")
inst.components.brain:SetBrain("winonacatapultbrain")
inst.components.brain:Start() -- implicitly calls OnStart() if not already set
```

Note: Direct usage of this component is uncommon; it is normally instantiated internally by the game engine using `inst:PushEvent("onstart")` after the brain is assigned.

## Dependencies & tags
**Components used:** None explicitly accessed via `inst.components.X` in the provided code.

**Tags:** None identified.

## Properties
No public properties are initialized in the constructor or documented in the source code. The class relies solely on inherited `Brain` behavior (e.g., `self.bt`, `self.inst`) which are not redeclared.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the entity. Creates a `PriorityNode` containing a single `StandAndAttack` behavior as its root, then constructs a `BT` (behavior tree) instance and assigns it to `self.bt`. This is called when the brain component begins execution—typically triggered by the `onstart` event.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** If `StandAndAttack` or `BT` fails to construct (e.g., due to missing behavior definitions), the behavior tree will not execute as intended, but no explicit error handling is present in this snippet.

## Events & listeners
**Listens to:** None explicitly registered in the provided code.

**Pushes:** None explicitly fired in the provided code.

The base `Brain` class likely listens to internal events (e.g., `onstart`, `onfinish`) to manage behavior tree execution, but these are not visible in this subclass.

---