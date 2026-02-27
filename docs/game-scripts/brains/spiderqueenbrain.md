---
id: spiderqueenbrain
title: Spiderqueenbrain
description: Controls the AI behavior of the Spider Queen entity, including nest placement, spawning followers, panic responses, and combat logic.
tags: [ai, boss, combat, spawner]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: fd5099e1
---

# Spiderqueenbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Spiderqueenbrain` component implements the decision-making logic for the Spider Queen boss. It determines when to spawn followers (spiders), where to plant new spider dens, and how to respond to threats like panic triggers and player attacks. It integrates with core behavior trees (via `Brain` and `BT`) and relies on the `IncrementalProducer` component to govern follower production limits. The component follows DST’s ECS pattern by attaching to an entity (`self.inst`) and overriding `OnStart` to construct the behavior tree.

## Usage example

```lua
-- Attaching the Spider Queen brain to an entity (e.g., in a prefab definition)
inst:AddComponent("brain")
inst.components.brain:SetBrain("spiderqueenbrain")
-- The component automatically initializes its behavior tree when the entity enters the world
```

## Dependencies & tags

**Components used:**
- `incrementalproducer` (accessed via `inst.components.incrementalproducer`)
- `sg` (stategraph, accessed via `inst.sg`)

**Tags checked or required:**
- `blocker` — used to detect nearby obstructions when placing a nest
- `spiderden` — used to enforce minimum spacing between spider dens
- `spiderqueen` — used to enforce minimum spacing between Spider Queens

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this brain controls (inherited from `Brain`). |
| `bt` | `BT` (behavior tree) | `nil` | The behavior tree created in `OnStart`. |
| — | — | — | No additional public properties are explicitly defined in the constructor. |

## Main functions

### `CanSpawnChild()`
* **Description:** Checks whether the Spider Queen is eligible to spawn a new follower spider. Requires sufficient age, non-busy state, and that `IncrementalProducer` reports producible units remain.
* **Parameters:** None.
* **Returns:** `true` if a child can be spawned; otherwise `false`.
* **Error states:** Returns `false` if `self.inst.components.incrementalproducer` is missing or `CanProduce()` returns `false`.

### `CanPlantNest()`
* **Description:** Determines if the Spider Queen can plant a new spider den. Checks minimum age, surrounding clearance from blockers, and minimum spacing from other dens and Spider Queens.
* **Parameters:** None.
* **Returns:** `true` if a nest can be placed; otherwise `false`.
* **Error states:** Returns `false` if the entity is too young or if nearby blockers or dens violate spacing rules.

### `OnStart()`
* **Description:** Initializes the behavior tree for the Spider Queen. Sets up a priority node with states for panic, nest placement, spawning, chasing/attacking, and wandering. This function is called when the entity’s state graph begins.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None — always initializes the behavior tree on call.

## Events & listeners

*Listens to:* Events are handled by the parent `Brain` and behavior tree system (not directly by this component). Specific listeners for panic triggers (`PanicTrigger`, `ElectricFencePanicTrigger`) are embedded in `BrainCommon`, which this component uses.

*Pushes:* Events are fired via the state graph (`inst.sg:GoToState(...)`), not directly through `PushEvent`.