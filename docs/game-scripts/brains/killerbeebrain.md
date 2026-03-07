---
id: killerbeebrain
title: Killerbeebrain
description: Manages the AI behavior of the killer bee entity using a behavior tree to handle attacking, retreating, homing, and wandering.
tags: [ai, combat, navigation, bee]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: aa3f8047
system_scope: brain
---

# Killerbeebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KillerBeeBrain` implements the behavior tree for the killer bee entity. It inherits from `Brain` and defines a priority-based sequence of behaviors: panic triggers, attacking when able, dodging during attack cooldowns, returning home, and wandering. It relies on the `combat` and `knownlocations` components to coordinate movement and combat logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("killerbee")
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst:AddComponent("brain")
inst.components.brain:SetBrain("killerbeebrain")
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`
**Tags:** Adds `killerbee` (via entity definition, not directly in this script); checks no tags in this component.

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root node with a priority-ordered list of behaviors. Includes panic responses, attack windows (with chase-and-attack), dodge windows (with run-away), homing action, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnInitializationComplete()`
*   **Description:** Records the killer bee’s current world position as its “home” location using `knownlocations:RememberLocation`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

## Events & listeners
None identified.
