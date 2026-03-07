---
id: fruitdragonbrain
title: Fruitdragonbrain
description: Implements the behavior tree for the Fruit Dragon boss, handling combat, home tracking, wandering, and panic responses.
tags: [ai, boss, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 94e2e450
system_scope: brain
---

# Fruitdragonbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FruitDragonBrain` defines the behavior tree for the Fruit Dragon boss entity. It orchestrates core AI behaviors including chasing and attacking targets, fleeing when the "LostChallenge" timer is active, homing in on its tracked home entity, and wandering when the home is stationary or no home exists. It relies heavily on the `entitytracker` component to locate the home entity and uses logic to adjust movement and facing behavior based on whether the home is mobile (e.g., carried by a player). This brain is typically attached to a boss prefab to enable dynamic, context-sensitive responses to gameplay events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("entitytracker")
inst:AddComponent("locomotor")
inst:AddComponent("timer")
inst:AddBrain("fruitdragonbrain")
```

## Dependencies & tags
**Components used:** `entitytracker`, `locomotor`, `timer`, `inventoryitem` (via `GetGrandOwner` on the home entity)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the Fruit Dragon. The tree begins with high-priority panic and combat nodes, followed by home-following and home-based wandering logic, and finally falls back to generic wandering.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** None explicitly registered in this file; event-driven state changes (e.g., `panicing` timer) are evaluated via inline function nodes within the behavior tree (e.g., `WhileNode`).
* **Pushes:** None explicitly in this file.
