---
id: SGbrightmare_invader
title: Sgbrightmare Invader
description: State graph for the Brightmare Invader entity that manages movement, idle behavior, attacks, and death animations.
tags: [ai, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 3298f0c3
system_scope: entity
---

# Sgbrightmare Invader

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbrightmare_invader` is a state graph for the Brightmare Invader entity, defining its core behaviors: idle detection, emergence animations, movement handling, attacking via physical strikes or projectile launching, and death transitions. It integrates with the `locomotor` and `combat` components for movement and combat logic, and uses the `timer` component for attack cooldown management. It is built using DST's stategraph system and inherits walk-related states via `CommonStates.AddWalkStates`.

## Usage example
State graphs are internal systems and are not directly instantiated by mods. This state graph is used automatically when the associated prefab (`brightmare_invader`) is spawned:

```lua
-- The state graph is registered and used internally by the prefab definition
-- Do not directly call or modify this state graph in mod code.
-- Ensure your mod's stategraph extension properly requires or extends this if needed.
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `timer`  
**Tags:** `idle`, `canrotate`, `busy`, `noattack`, `attack`, `death` (applied via state tags)

## Properties
No public properties. This is a stategraph definition, not a component.

## Main functions
### `SpawnTrail(inst)`
*   **Description:** Spawns a `gestalt_trail` prefab at the invader's current position and rotation, used to visually mark movement.
*   **Parameters:** `inst` (Entity) — the invader instance.
*   **Returns:** Nothing.
*   **Error states:** No trail is spawned if `inst._notrail` is truthy.

## Events & listeners
- **Listens to:**
  - `death` — transitions to the `death` state.
  - `arrive` — transitions to the `emerge` state (typically after pathing completes).
  - `doattack` — triggers the `attack` state if not currently busy.
  - `animover` — in most states, this event loops back to `idle` (or exits to `death` in the death state).
- **Pushes:**
  - No custom events are pushed by this state graph itself.

`<`/br>