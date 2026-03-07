---
id: alterguardian_phase1brain
title: Alterguardian Phase1Brain
description: Controls the AI behavior of the Alterguardian in its first combat phase, coordinating shield usage, targeted attacks, and wandering behavior.
tags: [ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2a39a9ec
system_scope: brain
---

# Alterguardian Phase1Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Alterguardian_Phase1Brain` defines the behavior tree logic for the Alterguardian boss during its initial phase. It manages combat decision-making—including shield deployment, attack readiness, and movement—by prioritizing behavior nodes. It relies on the `combat` component for target validity and cooldown checks, and the `knownlocations` component to remember its spawn point as a wander home.

## Usage example
This brain is typically assigned internally by the Alterguardian prefab and does not require direct instantiation. However, a minimal usage example for reference would be:
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst.brain = Alterguardian_Phase1Brain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree for the Alterguardian phase 1. Constructs a priority-based behavior tree with shield use, conditionally triggered attacks, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None; assumes required components (`combat`, `knownlocations`) are present.

### `OnInitializationComplete()`
* **Description:** Records the entity's current position as `"spawnpoint"` in `knownlocations`, used as the wander home location.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.
