---
id: wanderingtraderbrain
title: Wanderingtraderbrain
description: Controls the AI behavior of the Wandering Trader, managing movement, face-targeting, stock exhaustion chattering, and route following.
tags: [ai, movement, trader]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f26060ff
system_scope: brain
---

# Wanderingtraderbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WanderingTraderBrain` implements the behavior tree for the Wandering Trader entity. It coordinates movement (wandering, leash-based route following), face-targeting toward nearby players, and chatter logic when out of stock. It relies on the `worldroutefollower` component for path traversal and integrates three core behaviors: `FaceEntity`, `Leash`, and `Wander`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("worldroutefollower")
inst:AddBrain("wanderingtraderbrain")
-- The brain automatically activates when added and manages behavior via its internal stategraph and node tree.
```

## Dependencies & tags
**Components used:** `worldroutefollower` (via `inst.components.worldroutefollower:ShouldIterate()` and `GetRouteDestination()`)  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root node. It creates a priority-ordered tree that prioritizes trading-related actions, then stock-exhaustion chatter, leash-following, and finally wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** None identified.  
- **Listens to:** None identified. (Behavior is purely reactive via the `PriorityNode`-based behavior tree.)

## Behavior tree node summary
The `OnStart()` method builds the following hierarchy:
- `Trading` (high priority):  
  - `WhileNode` condition: `self.inst.sg.mem.trading or self.inst:HasStock()`  
  - Action: `FaceEntity` toward closest nearby player.
- `No stock left`:  
  - Condition: `not self.inst:HasStock() and self.inst:CanChatter()`  
  - Action: Play proximity out-of-stock chatter, then `FaceEntity` for 2 seconds.
- `Leash`:  
  - Enforces staying within leash distance using route destination as anchor.
- `Wander`:  
  - Default movement when no higher-priority actions apply; wanders within `MAX_WANDER_DIST` (`4`) units.
