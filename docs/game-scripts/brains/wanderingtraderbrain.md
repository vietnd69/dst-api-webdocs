---
id: wanderingtraderbrain
title: Wanderingtraderbrain
description: Controls the AI behavior of the Wandering Trader, handling trading interactions, stock depletion chatter, path following, and wander movement.
tags: [ai, entity, movement, trading]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f26060ff
---

# Wanderingtraderbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `WanderingTraderBrain` component defines the behavior tree logic for the Wandering Trader entity in Don't Starve Together. It orchestrates high-priority actions such as trading with players and reacting to stock depletion, while also managing movement via leashed route following and random wandering. It extends `Brain` and uses `PriorityNode`-based behavior trees to prioritize state-dependent actions. The component relies on `FaceEntity`, `Leash`, and `Wander` behavior tasks, and reads destination data from the `worldroutefollower` component to constrain movement.

## Usage example

```lua
local trader = SpawnPrefab("wanderingtrader")
trader:AddComponent("worldroutefollower")
trader:AddComponent("inventory")
trader:AddBrain("wanderingtraderbrain")
```

## Dependencies & tags
**Components used:** `worldroutefollower` (calls `GetRouteDestination`, `ShouldIterate`), `inventory` (implicitly via `HasStock`/`CanChatter` checks), `inventorymaster` or equivalent (for stock logic), and others accessed via `FindClosestPlayerToInst`, `IsNear`, `GetPosition`, `DoChatter`, `sg.mem.trading`, `HasStock`, `CanChatter`.

**Tags:** None explicitly added or removed by this component. It relies on runtime checks (e.g., `self.inst.sg.mem.trading`, `HasStock()`), not tag-based state management.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | `BT` or `nil` | `nil` (set in `OnStart`) | Behavior tree instance, initialized during `OnStart()` with the root node. |

Note: No properties are initialized directly in the constructor. The `root` behavior tree is constructed inside `OnStart()` and assigned to `self.bt`.

## Main functions
### `WanderingTraderBrain:OnStart()`
* **Description:** Initializes and starts the behavior tree for the Wandering Trader. It constructs a `PriorityNode` with sub-trees that handle trading, out-of-stock chatter, leash-following, and wandering. The behavior tree is assigned to `self.bt` and begins executing immediately.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented. Behavior tree construction assumes required functions and components (e.g., `worldroutefollower`, `GetRoutePos`) are present and functional.

## Events & listeners
No events are explicitly listened to or pushed by this component. It uses a continuous behavior tree execution model rather than event-driven state transitions.

---