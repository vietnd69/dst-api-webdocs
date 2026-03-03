---
id: lunarthrall_plant_gestalt_brain
title: Lunarthrall Plant Gestalt Brain
description: Controls the AI behavior of a Lunar Thrall Gestalt entity that moves toward and infests specific lunar thrall plants.
tags: [ai, boss, combat, locust]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 00560fd8
system_scope: brain
---

# Lunarthrall Plant Gestalt Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lunarthrall_Plant_Gestalt_Brain` is an AI brain component that governs the movement and targeting behavior of a Lunar Thrall Gestalt entity. It prioritizes moving toward and attaching to valid lunar thrall plants (specifically those managed by `lunarthrall_plantspawner`), and falls back to random movement or repositioning when no valid target exists or the entity is out of player view. The brain delegates movement actions to `MoveToPointAction`, which computes the next position and triggers state transitions such as "infest". It is designed for boss or elite enemies that must physically attach to targets to execute mechanics.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("lunarthrall_plant_gestalt_brain")
-- The brain automatically starts managing behavior on entity spawn.
-- Ensure `inst.plant_target` is set for targeting behavior.
```

## Dependencies & tags
**Components used:** `lunarthrall_plantspawner`, `timer`  
**Tags:** Checks `idle` state tag (via `sg:HasStateTag("idle")`); uses `ACTIONS.WALKTO` internally.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.plant_target` | `entity` or `nil` | `nil` | The target lunar thrall plant the entity is moving toward. Set externally (e.g., by `lunarthrall_plantspawner`). |
| `inst.randomdirection` | number (radians) or `nil` | `nil` | Cached direction for random wandering; initialized on first use if missing. |

## Main functions
### `MoveToPointAction(inst)`
* **Description:** Computes the next movement target for the entity. If a valid `plant_target` exists and is nearby, it moves toward and transitions to the "infest" state; otherwise, it calculates a path toward the plant, moves out of player view, or wanders randomly.
* **Parameters:** `inst` (`entity`) — The entity instance the brain is attached to.
* **Returns:** `action` — A `BufferedAction` to execute the `WALKTO` command, or `nil` if no movement is possible (e.g., invalid target, entity removed).
* **Error states:** Returns `nil` if `inst` is no longer valid after position computation. If `plant_target` is invalid or nil, and `lunarthrall_plantspawner` is missing, the entity is removed via `inst:Remove()`.

### `OnStart()`
* **Description:** Initializes the behavior tree root node. Activates a priority node that repeatedly evaluates `MoveToPointAction` while the state graph has the "idle" tag.
* **Parameters:** None.
* **Returns:** Nothing. Sets `self.bt` to a new `BT` instance.

## Events & listeners
None identified.
