---
id: lightninggoatbrain
title: Lightninggoatbrain
description: Controls the AI behavior of the Lightning Goat, managing state transitions between wandering, fleeing, facing, and attacking.
tags: [ai, combat, locomotion, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: c55cf3aa
system_scope: brain
---

# Lightninggoatbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LightningGoatBrain` is the behavior tree controller for the Lightning Goat entity. It orchestrates high-priority threat responses (panic, fleeing), directional orientation (face entities), navigation (wandering, anchoring), and combat engagement (target pursuit and wall attacks). It relies on `combat` and `knownlocations` components to determine state and maintain positional memory, and integrates with standardized behaviors like `chaseandattack`, `runaway`, `wander`, and `faceentity`.

## Usage example
This component is automatically added and managed by the game for the Lightning Goat prefab. Manual usage is not intended for mods, but a representative initialization would look like:
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst.brain = LightningGoatBrain(inst)
inst.brain:OnStart()
inst.brain:OnInitializationComplete()
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`  
**Tags:** Checks `notarget`, `character`; does not add or remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the brain controls. Initialized in constructor. |
| `bt` | `BT` (BehaviorTree) | `nil` | The compiled behavior tree. Set during `OnStart`. |

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the root behavior tree node based on priority logic: panic triggers, combat target checks, fleeing, face orientation, salt-lick anchoring, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records the Lightning Goat's starting position as the `"spawnpoint"` location for potential later use by navigation or herd-finding logic.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** None identified.
* **Pushes:** None identified.
