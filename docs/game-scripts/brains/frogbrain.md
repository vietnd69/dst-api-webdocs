---
id: frogbrain
title: Frogbrain
description: Controls the decision-making logic for frog entities, managing behaviors such as wandering, sleeping, chasing targets, and returning home during night or winter.
tags: [ai, locomotion, behavior]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f5d60b0b
system_scope: brain
---

# Frogbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Frogbrain` is a behavior tree–driven AI component for frog entities. It defines how frogs react to environmental conditions (day/night, seasons), interact with targets, and navigate toward their home location. It inherits from `Brain` and uses the `behaviour` system (e.g., `Wander`, `ChaseAndAttack`, `StandStill`) through a priority-based behavior tree root node. The brain integrates with `homeseeker` and `knownlocations` components to locate and return to the frog’s home.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("homeseeker")
inst:AddComponent("knownlocations")
-- Add home location and register frog brain
inst:AddBrain("frob")
inst.components.homeseeker.home = inst.components.knownlocations:GetLocation("home")
```

## Dependencies & tags
**Components used:** `homeseeker`, `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
The component exposes no public methods beyond its constructor and `OnStart()` call made by the `Brain` base class.

### `GoHomeAction(inst)`
*   **Description:** Factory function that constructs a `BufferedAction` to move the frog to its home location, provided the home exists and is valid.
*   **Parameters:** `inst` (Entity) – The frog entity instance.
*   **Returns:** A `BufferedAction` if valid home exists; otherwise `nil`.

### `ShouldGoHome(inst)`
*   **Description:** Predicate function determining whether the frog should attempt to return home. Returns true during night or winter.
*   **Parameters:** `inst` (Entity) – The frog entity instance.
*   **Returns:** `boolean` – `true` if `not TheWorld.state.isday or TheWorld.state.iswinter`, else `false`.

### `FrogBrain:OnStart()`
*   **Description:** Initializes the behavior tree root node with a priority-ordered sequence of behaviors: panic triggers, chasing, going home, wandering (while awake), and idle standing.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None. This brain does not directly register or fire events; it relies on underlying behavior tree nodes for reactive triggers.
