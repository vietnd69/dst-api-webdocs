---
id: boatrace_primematebrain
title: Boatrace Primematebrain
description: Implements the AI behavior for the prime mate in boat races, prioritizing buoy tossing, leak repair, fire suppression, and rowing to keep the boat functional and competitive.
tags: [ai, boat, race, crew, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f6b87fcb
system_scope: brain
---

# Boatrace Primematebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Boatrace_PrimemateBrain` defines the decision-making logic for the prime mate during boat races in DST's boat race event. It uses a behavior tree to prioritize actionable tasks—tossing buoys to boost the boat, patching leaks, extinguishing fires, and rowing—while maintaining proximity to the boat. The brain relies heavily on the `crewmember`, `inventory`, `timer`, and `walkableplatform` components to evaluate and execute high-priority interventions dynamically.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("crewmember")
inst:AddComponent("inventory")
inst:AddComponent("timer")
inst:AddComponent("walkableplatform")
inst:AddComponent("knownlocations")
inst:AddTag("prime")

inst:AddBrain("boatrace_primematebrain")
-- The brain automatically activates when the entity's stategraph begins
```

## Dependencies & tags
**Components used:** `crewmember`, `inventory`, `timer`, `walkableplatform`, `knownlocations`, `burnable`, `boatleak`, `boatpatch`, `wateryprotection`, `complexprojectile`, `buoy`, `bufferedaction`  
**Tags:** The brain does not directly add/remove tags; it expects the entity to already have the `prime` tag (as per convention).

## Properties
No public properties are initialized in the constructor. All state is stored on `self.inst` (e.g., `_row_cooldown`, `_last_row_position`, `_on_row_success`).

## Main functions
The brain exports no public methods beyond the constructor and `OnStart`, which is called automatically when the brain is assigned to an entity.

### `OnStart()`
* **Description:** Initializes the behavior tree with a prioritized list of actions (toss buoy → patch boat → put out fire → row → follow boat → wander) and sets the initial rowing cooldown.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified; assumes required components and tags are present.

## Events & listeners
- **Listens to:** `OnStart` (implicit, via stategraph transition to `run` or equivalent) — triggers `OnStart()` and starts the behavior tree.
- **Pushes:** This component itself does not push events; however, the `BufferedAction`s it creates (e.g., `ACTIONS.ROW`, `ACTIONS.REPAIR_LEAK`) may fire success/failure events upon completion.
