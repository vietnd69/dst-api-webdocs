---
id: mosslingbrain
title: Mosslingbrain
description: AI decision engine for mossling entities, coordinating foraging, stealing, guardian summoning, and panic responses via behavior trees.
tags: [ai, brain, foraging, combat, guardian]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 4fda1c78
system_scope: brain
---

# Mosslingbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MosslingBrain` implements the behavior tree for mossling entities, a herd-based creature that forages for food, steals from structures, and summons a guardian when threatened. It uses `BrainCommon` utilities for panic triggers and composes behavior priorities to balance feeding, threat response, and base cohesion. It integrates with components such as `combat`, `eater`, `inventory`, `herdmember`, `guardian`, `crop`, `stewer`, `dryer`, `pickable`, and `knownlocations`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("combat")
inst:AddComponent("eater")
inst:AddComponent("inventory")
inst:AddComponent("herdmember")
inst:AddComponent("guardian")
inst:AddComponent("knownlocations")
-- ... (setup herd, tags, and other dependencies)
inst.components.brain:SetBrainClass("mosslingbrain")
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `inventory`, `herdmember`, `herd`, `guardian`, `crop`, `stewer`, `dryer`, `pickable`, `knownlocations`.  
**Tags:** Uses internal state tags (`"busy"`, `"wantstoeat"`) via `inst.sg:HasStateTag`; no direct tag modifications observed.

## Properties
No public properties are defined or initialized in the constructor.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root and sub-nodes based on mossling priorities (panic, homing, combat, base-wandering, etc.). Constructs a hierarchical behavior tree using `PriorityNode`, `WhileNode`, `DoAction`, `Wander`, `ChaseAndAttack`, `RunAway`, `Leash`, and `FaceEntity`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes required components (e.g., `combat`, `herdmember`, `guardian`, `knownlocations`) are attached; behavior may fail if missing.

### `OnInitializationComplete()`
* **Description:** Records the spawn position as `"spawnpoint"` in `knownlocations`. This location serves as a reference for homing behavior.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** None identified (uses behavior node conditions and state graph state tags instead of event listeners).
* **Pushes:** None identified.
