---
id: alterguardian_phase3brain
title: Alterguardian Phase3Brain
description: Controls the AI behavior of the Alter Guardian in phase 3, managing combat prioritization, home-finding, and dodging via behavior trees.
tags: [ai, combat, boss, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 44a2d8e3
system_scope: brain
---

# Alterguardian Phase3Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AlterGuardian_Phase3Brain` is the AI behavior controller for the Alter Guardian during its third phase. It implements a behavior tree (`BT`) that prioritizes attacking, returning to its spawn point, dodging, facing the nearest valid target, and remaining idle. It relies on the `combat`, `knownlocations`, and `timer` components to make decisions and execute actions, and integrates with several custom `behaviours` modules (`doaction`, `standandattack`, `standstill`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("alterguardian_phase3brain")
-- The brain automatically initializes and starts the behavior tree on game start.
-- Key dependencies (`combat`, `knownlocations`, `timer`) must be added separately.
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`, `timer`  
**Tags:** Checks `notarget`, `_combat`, `INLIMBO`, `playerghost`, `character`, `monster`, `shadowminion`

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree with a priority-based node hierarchy. The tree first attempts attacking (if conditions met), then navigates home if too far, then dodges (if `runaway_blocker` timer is absent), then faces target, and finally defaults to standing still.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnInitializationComplete()`
*   **Description:** Records the entity's current position as `"spawnpoint"` in the `knownlocations` component for later home-finding logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
