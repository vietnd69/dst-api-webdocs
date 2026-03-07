---
id: crabking_mobbrain
title: Crabking Mobbrain
description: Controls the behavior tree logic for Crab King mobs, handling platform abandonment, panic responses, combat pursuit, and homing to their known home location.
tags: [ai, boss, combat, platform]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 9f160765
system_scope: brain
---

# Crabking Mobbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CrabkingMobBrain` is a brain component that defines the behavior tree for Crab King–associated mob entities (e.g., Crabkin guards or minions). It implements a priority-based behavior tree using common behaviors like `ChaseAndAttack`, `Wander`, and a custom `DoAction` handler for abandoning a dying platform. It integrates with the `health` and `knownlocations` components to respond to platform degradation and remember the mob’s home position.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("crabking_mobbrain")
-- The brain is automatically initialized and runs when the entity spawns,
-- using logic defined in OnStart and OnInitializationComplete
```

## Dependencies & tags
**Components used:** `health`, `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree with a priority node containing sequential behavior options: panic triggers, platform abandonment, combat pursuit, and wandering. This is called once when the brain starts.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnInitializationComplete()`
*   **Description:** Records the mob's current position as the `"home"` location for later use during wandering behavior.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

## Notes
- Uses `GetWanderPoint`, which retrieves `"home"` from the `knownlocations` component.
- The `DoAbandonPlatform` action is only triggered if the mob’s current platform’s health is `<= ABANDON_PLATFORM_HEALTH_THRESHOLD` (i.e., `2`).
- The abandonment logic calculates escape vectors around the platform in 16 discrete angular steps and returns a `BufferedAction` targeting the first valid empty tile.
- This brain inherits from `Brain` via `Class(Brain, ...)` and uses the common DST brain infrastructure (`BT`, `PriorityNode`, `ChaseAndAttack`, `Wander`, `DoAction`, `BrainCommon`).
