---
id: shadow_rookbrain
title: Shadow Rookbrain
description: Controls the AI behavior of the Shadow Rook chess piece, managing chasing, facing, taunting, and despawning logic.
tags: [ai, boss, combat, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: cf7345f5
system_scope: brain
---

# Shadow Rookbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shadow_RookBrain` is the behavior tree controller for the Shadow Rook entity—a boss-stage chesspiece in DST's Beeffalo/Caves content. It orchestrates movement and actions via a priority-based behavior tree. The brain coordinates chasing the nearest valid player, maintaining orientation toward a target (to simulate facing), periodically taunting when idle, and automatically despawning after a fixed duration. It depends on the `combat` and `health` components for target tracking and state validation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("shadowpiece")
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddBrain("shadow_rookbrain")
inst.components.combat.target = some_player
inst.components.health:SetHealth(100)
```

## Dependencies & tags
**Components used:** `combat`, `health`  
**Tags:** Checks `notarget`, `playerghost` for target filtering; does not add or remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shouldchase` | boolean | `false` | Internal state indicating whether the rook should be chasing. Updated by `ShouldChase`. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Shadow Rook. Constructs a root `PriorityNode` with four main behavioral branches: chasing, facing/taunting, wandering/despawning, and fallback wander.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Behavior tree setup is guaranteed on first activation.

### `ShouldChase(self)`
* **Description:** Evaluates whether the rook should transition into a chase state. Considers current combat target, cooldown status, and distance relative to attack range.
* **Parameters:** `self` (table) — the brain instance.
* **Returns:** `boolean` — `true` if the rook should begin or continue chasing; `false` otherwise.
* **Error states:** None. Uses `combat.target`, `combat:HasTarget()`, `combat:InCooldown()`, `combat.attackrange`, and `inst:IsNear()`.

## Events & listeners
- **Pushes:** `despawn` — fired after `TUNING.SHADOW_CHESSPIECE_DESPAWN_TIME` seconds via the behavior tree. This event triggers the entity’s removal logic.
