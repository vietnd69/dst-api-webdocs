---
id: deergemmedbrain
title: Deergemmedbrain
description: AI brain controlling deer gemmed behavior, managing responses to keeper status, combat, panic, and positioning relative to the keeper.
tags: [ai, combat, movement, boss, leash]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 89438802
system_scope: brain
---

# Deergemmedbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DeerGemmedBrain` implements the behavior tree for the Deer Gemmed entity, orchestrating its movement, combat, and responsiveness to the presence or state of its assigned keeper. It relies heavily on the `combat`, `entitytracker`, and `knownlocations` components to track the keeper and adjust behavior accordingly—such as entering a "break formation" chase mode, unshackling when the keeper dies, or panicking in response to magic threats. The brain enforces leash-based positional constraints and uses the `behaviours` module to define state-specific actions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("entitytracker")
inst:AddComponent("knownlocations")
inst:AddComponent("combat")
-- Attach brain to entity (typically done via prefab def or Init)
inst.brain = DeerGemmedBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `health`, `knownlocations`  
**Tags:** None explicitly added/removed by this brain.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_farfromkeeper` | boolean | `false` | Internal flag indicating if the entity is outside the keeper's acceptable proximity. |
| `_lostkeepertime` | number \| nil | `nil` | Timestamp when the entity should unshackle after the keeper’s death; set only when keeper is lost. |

## Main functions
### `OnStart()`
* **Description:** Initializes and installs the behavior tree root node. Sets up prioritized condition-based node branches for panic, fence avoidance, wall attacks, combat, movement, and unshackling logic.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Assumes all required components are present.

## Events & listeners
- **Pushes:** `unshackle` — fired when the keeper has been lost long enough and the entity breaks free of leash control.
