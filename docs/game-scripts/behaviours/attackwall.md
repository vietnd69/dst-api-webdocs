---
id: attackwall
title: Attackwall
description: An AI behavior node that rotates the entity toward nearby walls within a narrow angular cone and attempts to attack the nearest valid target.
tags: [ai, combat, wall]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 97074dc3
system_scope: ai
---

# Attackwall

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Attackwall` is a behavior node used in the DST AI system to enable entities (typically structures like beefalo or bosses) to detect, rotate toward, and attack wall-type entities within a 60° forward-facing cone (±30° from current facing). It relies on the `combat`, `locomotor`, and `health` components to perform target acquisition, stopping movement, and attack execution. This node integrates into behavior trees as a leaf or decision point, commonly used by non-player characters that need to defend fixed positions or structures.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("locomotor")
inst:AddComponent("health")

-- Add an AI brain with a behavior tree containing AttackWall
inst:AddComponent("brain")
inst:AddBehavior("attackwall", "behaviours/attackwall.lua")
inst.brain:PushBackBehavior("attackwall")
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `health`
**Tags:** Checks for `wall` tag on potential targets (`ATTACKWALL_MUST_TAGS`); uses `softstop` state tag logic via `locomotor:Stop`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | Entity or nil | `nil` | Currently selected wall entity to attack; set in `Visit()` when a valid target is found. |
| `status` | number | `READY` | Internal behavior status (`READY`, `RUNNING`, `SUCCESS`, `FAILED`). Inherited from `BehaviourNode`. |
| `done` | boolean | `false` | Used internally to control behavior progress; initialized to `false` at start of `RUNNING` phase. |

## Main functions
### `Visit()`
* **Description:** Executes the behavior logic once per tick when the node is active in the behavior tree. First, searches for a wall target within a 1.5 radius and ±30° cone in front of the entity. If found, stops movement and transitions to `RUNNING`. In `RUNNING`, performs combat attacks using `combat:TryAttack` and ends with `SUCCESS` (if attack initiated) or `FAILED` (if target invalid or attack fails).Sleeps for 1 second after each attack attempt.
* **Parameters:** None.
* **Returns:** Nothing (behavior status is stored internally in `self.status`).
* **Error states:** May set `status` to `FAILED` if no target is found (`READY` → `FAILED`), or if target becomes invalid or dead (`RUNNING` → `FAILED`). The behavior fails silently if `combat:TryAttack` returns `false` (e.g., on cooldown or out of range).

## Events & listeners
- **Listens to:** None (uses event-driven component calls like `inst:PushEvent("doattack")` internally via `combat:TryAttack`).
- **Pushes:** None directly, but triggers events indirectly via components:  
  - `locomotor:Stop()` → pushes `"locomote"` event.  
  - `combat:TryAttack()` → pushes `"doattack"` event if attack proceeds.
