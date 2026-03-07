---
id: nightmaremonkeybrain
title: Nightmaremonkeybrain
description: Implements the AI decision tree for the Nightmare Monkey boss, prioritizing panic responses, weapon equipping, chasing and attacking, and wandering behavior.
tags: [ai, boss, combat]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: b7a031bd
---

# Nightmaremonkeybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree for the Nightmare Monkey boss entity. It orchestrates high-priority panic responses to threats like electric fences and damage triggers, followed by weapon equipping and combat engagement. When not engaging, it defaults to wandering within a limited radius of its designated "home" location. The brain integrates with DST’s behavior system (`behaviours/wander`, `behaviours/chaseandattack`) and `braincommon` utilities to manage prioritized logic.

## Usage example

This brain is typically attached to the Nightmare Monkey entity during prefab instantiation and activated automatically via the `AddBrain` function in DST’s entity system. Manual usage is unnecessary in most cases.

```lua
-- Example of attaching this brain to a custom boss entity (rare, usually handled in prefab)
inst:AddBrain("nightmaremonkeybrain")
-- The brain’s behavior tree is initialized automatically upon first activation
```

## Dependencies & tags

**Components used:**
- `equippable`: checked via `IsEquipped()` to avoid redundant equipping.
- `inventory`: used via `Equip(weapon)` to equip combat tools.
- `knownlocations`: used via `GetLocation("home")` to fetch the wander target location.

**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MAX_WANDER_DIST` | `number` | `10` | Maximum distance (in world units) the entity will wander from its home location. |
| `MAX_CHASE_TIME` | `number` | `60` | Maximum duration (in seconds) the entity will continue chasing a target. |
| `MAX_CHASE_DIST` | `number` | `40` | Maximum distance (in world units) at which the entity will still engage chasing a target. |

## Main functions

### `OnStart()`
* **Description:** Initializes the behavior tree root node with prioritized behaviors: panic response (highest priority), weapon equipping and attack sequence, and finally wandering. Called once when the entity’s brain is started (e.g., on first spawn or state change).
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented; assumes required components (`inventory`, `knownlocations`, `equippable`) are present on `self.inst`. Behavior tree construction may fail if required behavior classes (e.g., `Wander`, `ChaseAndAttack`) are missing or misconfigured.

## Events & listeners

None identified.