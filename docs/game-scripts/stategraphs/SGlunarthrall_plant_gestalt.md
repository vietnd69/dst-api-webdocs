---
id: SGlunarthrall_plant_gestalt
title: Sglunarthrall Plant Gestalt
description: Stategraph controlling the animation and behavior states of the lunar thrall plant gestalt entity.
tags: [lunar, gestalt, infestation, ai]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: dca62169
system_scope: entity
---

# Sglunarthrall Plant Gestalt

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`SGlunarthrall_plant_gestalt` defines the state machine for lunar thrall plant gestalt entities. It manages spawning, idle, infestation, and movement states with synchronized animations, sound effects, and physics overrides. The stategraph integrates with the `gestaltcapturable` component to control capture eligibility during specific states and coordinates with world-level spawners for plant generation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("locomotor")
inst:AddComponent("gestaltcapturable")
inst:AddComponent("entitytracker")

inst:SetStateGraph("lunarthrall_plant_gestalt")
inst.sg:GoToState("spawn")
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- provides shared state definitions via `AddWalkStates` and `AddPossessChassisState`

**Components used:**
- `locomotor` -- stopped during state transitions via `Stop()`
- `gestaltcapturable` -- enabled/disabled via `SetEnabled()` during infestation states
- `entitytracker` -- queried via `GetEntity("corpse")` to track corpse targets
- `lunarthrall_plantspawner` (world) -- spawns plants via `SpawnPlant()` during infestation timeline

**Tags:**
- `idle` -- added in idle state
- `canrotate` -- added in idle state
- `busy` -- added in spawn, infest, infest_corpse, spawn_hail states
- `noattack` -- added in spawn, infest, infest_corpse, spawn_hail states
- `infesting` -- added in infest and infest_corpse states
- `moving` -- checked during `gestaltcapturable_targeted` event

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.sg.statemem.corpse` | entity | `nil` | Stores reference to corpse entity during infestation states. |
| `inst.sg.statemem.base_speed` | number | `---` | Base movement speed multiplier for spawn_hail state. |
| `inst.plant_target` | entity | `nil` | Target entity for plant spawning during infestation. |
| `inst.persists` | boolean | `---` | Persistence flag; set to `false` during infestation timeline. |
| `inst._notrail` | boolean | `---` | If true, prevents trail prefab spawning during walk states. |

## Main functions
### `GoToIdle(inst)`
* **Description:** Transitions the entity to the idle state. Called when animation completes in states using `SimpleAnimoverHandler`.
* **Parameters:** `inst` -- entity instance with stategraph
* **Returns:** None
* **Error states:** None

### `Remove(inst)`
* **Description:** Removes the entity from the world. Called on animation completion in `spawn_hail` state or via `RemoveOnAnimoverHandler`.
* **Parameters:** `inst` -- entity instance to remove
* **Returns:** None
* **Error states:** None

### `SpawnTrail(inst)`
* **Description:** Spawns a `gestalt_trail` prefab at the entity's position unless `_notrail` flag is set. Called during walk state timeline.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `gestaltcapturable_targeted` -- transitions to `walk_stop` state if entity has `moving` tag
- **Listens to:** `animover` -- transitions to `idle` state (via `SimpleAnimoverHandler`) or removes entity (via `RemoveOnAnimoverHandler`)
- **Listens to:** `locomote` -- handled via `CommonHandlers.OnLocomote`
- **Listens to:** `possesschassis` -- handled via `CommonHandlers.OnPossessChassis`
- **Pushes:** None identified