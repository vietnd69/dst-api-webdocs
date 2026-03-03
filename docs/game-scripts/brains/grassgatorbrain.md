---
id: grassgatorbrain
title: Grassgatorbrain
description: AI brain that governs the movement and combat behavior of the grass gator creature, handling panic, chasing, fleeing, orientation toward players, and land-based wandering.
tags: [ai, combat, locomotion, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 1875b88e
system_scope: brain
---

# Grassgatorbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GrassgatorBrain` defines the behavior tree for the grass gator entity (e.g., a boss or hostile mob). It orchestrates high-level decision-making by evaluating states such as diving, panic triggers, proximity to players, and terrain conditions. It leverages reusable behavior nodes from `behaviours/` and integrates with `BrainCommon` utilities and external components like `knownlocations` and `timer` to control navigation, aggression, and evasion. The brain prioritizes panic responses over standard combat or wandering, and adjusts targeting based on player distance and salt-seeking behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("grassgatorbrain")
-- The brain automatically initializes via OnStart during entity spawn
-- No further manual setup required for basic operation
```

## Dependencies & tags
**Components used:** `knownlocations`, `timer`
**Tags:** Checks `notarget` and `character`; internally relies on `diving` state tag.

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes and installs the behavior tree for the grass gator. Builds a priority-based node structure where panic responses take precedence over combat, fleeing, orientation, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May fail silently if required behavior modules (e.g., `ChaseAndAttack`, `RunAway`) are not registered or misconfigured externally.

## Events & listeners
None identified. The brain does not register event listeners directly; it relies on state graph state tags (e.g., `diving`) and periodic node evaluation.
