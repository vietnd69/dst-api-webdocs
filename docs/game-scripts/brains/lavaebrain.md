---
id: lavaebrain
title: Lavaebrain
description: Controls the behavior tree for the Lavae boss, including combat pursuit, wall breaking, and emergency return to a lava pool on reset.
tags: [ai, boss, combat, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: dda0f5de
system_scope: brain
---

# Lavaebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LavaeBrain` is a behavior tree–driven AI component for the Lavae boss entity. It defines high-level behavioral priorities using nodes from `behaviours/` such as `ChaseAndAttack`, `AttackWall`, and a custom `GoHome` action. It integrates with `BrainCommon.PanicTrigger` for stress responses and contains logic to reset combat and return to a lava pool if no viable target exists.

## Usage example
This brain is automatically attached to the Lavae entity's prefab during world generation. Manual instantiation is not typical for modders.

```lua
-- Not intended for direct usage by modders.
-- The Lavae prefab internally adds this brain via:
--   inst:AddBrain("brains/lavaebrain")
```

## Dependencies & tags
**Components used:** None explicitly accessed via `inst.components.X` in this file. Relies on standard game infrastructure (`Transform`, `TheSim`, `ACTIONS`, `BufferedAction`, `BT`, `PriorityNode`, `WhileNode`, `DoAction`, `ChaseAndAttack`, `AttackWall`, `StandStill`, `GetRandomItem`).  
**Tags:** Checks for tag `"lava"` (used internally in `FindHome`).

## Properties
No public properties are defined in this brain. All internal logic is encapsulated in methods and behavior tree structures.

## Main functions
### `OnStart()`
* **Description:** Initializes and activates the behavior tree root for Lavae. The tree prioritizes resetting combat (returning to lava), then handles panic, wall attacks, chasing/attacking enemies, and finally standing still if idle.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

## Events & listeners
None identified — `LavaeBrain` does not register or fire events directly. It interacts with the behavior tree system and behaviors, which may internally emit or respond to events.
