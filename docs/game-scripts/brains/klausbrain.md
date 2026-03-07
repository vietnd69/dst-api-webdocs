---
id: klausbrain
title: Klausbrain
description: AI brain component that controls Klaus's behavior, including rage states, combat, wandering, and chomp attacks.
tags: [ai, boss, combat, behavior_tree]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 31f4d457
system_scope: brain
---

# Klausbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Klausbrain` is the AI behavior tree component for the boss entity Klaus. It orchestrates Klaus's core behavioral patterns—namely rage triggering when soldier count is low, chomp attacks when unchained and targeting an enemy, combat engagement via `ChaseAndAttack`, periodic reset of combat state, and wandering near his spawn point. It relies heavily on external components for target detection (`combat`), soldier count monitoring (`commander`), location tracking (`knownlocations`), and timing (`timer`).

## Usage example
```lua
-- The component is automatically added and used by the Klaus prefab (prefabs/klaus.lua).
-- It is not intended for direct manual instantiation in mod code.
-- Standard usage is via the prefab definition, e.g.:
-- inst:AddComponent("brain")
-- inst.components.brain:SetBrainClass("klausbrain")
```

## Dependencies & tags
**Components used:** `combat`, `commander`, `knownlocations`, `timer`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes Klaus's behavior tree. Sets up priority-based behavior nodes for enraging (when soldier count < 2), chomping (when unchained and has a target), chasing/attacking, resetting combat engagement after 10 seconds, and wandering within 5 units of the home position.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records Klaus's current ground-level position (with `y` clamped to `0`) as `"spawnpoint"` in `knownlocations`. The `dont_overwrite` flag prevents overwriting if already set.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** 
  - `enrage` — fired when `ShouldEnrage` condition is met.
  - `chomp` — fired when `ShouldChomp` condition is met.
  - (Internally, `ChaseAndAttack` and `Wander` may push further events, but these are defined externally.)
