---
id: graveguard_ghostbrain
title: Graveguard Ghostbrain
description: Controls the AI behavior of a ghost entity in DST, including following living targets, playful interaction with other ghosts, and periodic despawning.
tags: [ai, ghost, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 25c82fb7
system_scope: brain
---

# Graveguard Ghostbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GraveGuardBrain` implements the behavior tree for a ghost entity, determining how it moves, searches for targets, and interacts. It extends `Brain` and constructs a behavior tree (`BT`) in `OnStart()` that orchestrates three primary behaviors: following a valid living target, engaging in playful interactions with nearby ghosts, and eventually despawning after a full day cycle. It relies heavily on `knownlocations` (for home position), `health` (to verify target vitality), and `timer` (to prevent overly frequent play behavior).

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("ghost")
inst:AddComponent("brain")
inst.brain = inst:AddBrain("graveguard_ghostbrain")
inst.components.knownlocations:SetLocation("home", Vector3(0,0,0))
inst:ListenForEvent("beattacked", function() inst.sg:GoToState("panic") end)
```

## Dependencies & tags
**Components used:** `knownlocations`, `health`, `timer`, `transform`
**Tags:** Checks and prevents targeting `INLIMBO`, `noauradamage`, `abigail`, `busy`; seeks targets with one of `character`, `hostile`, `monster`, `smallcreature`; seeks playmates with one of `ghost`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `playfultarget` | `Entity` or `nil` | `nil` | The currently selected ghost to play with, or `nil`. |
| `followtarget` | `Entity` or `nil` | `nil` | The current living entity this ghost is pursuing. |

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. This is called once when the brain becomes active and constructs a priority-based behavior tree with the following nodes: (1) follow a living target, (2) despawn if queued, (3) play with a nearby ghost, (4) wander and despawn after a full day.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `"start_playwithghost"` with `{target=<Entity>}` when initiating play with a playmate; internal events from behavior tree nodes (e.g., `SequenceNode`, `Follow`) trigger state transitions in the owner's `stategraph`.
