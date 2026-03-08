---
id: SGchest_mimic
title: Sgchest Mimic
description: Manages the state machine behavior for a chest mimic entity, including idle, attack, taunt, death, and spawn sequences.
tags: [ai, combat, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: ed5a8468
system_scope: entity
---

# Sgchest Mimic

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGchest_mimic` is the state graph for the chest mimic entity, defining its behavioral transitions between idle, attack, taunt, spawn, death, and action states (e.g., pickup, eat). It integrates with multiple components—`combat`, `health`, `locomotor`, `lootdropper`, and `inventory`—to coordinate attacks, movement, sound playback, loot dropping, and animation sequencing. The state graph uses common states (e.g., `hit`, `eat`, `walk`) extended by custom timelines and sound events specific to the mimic's theme.

## Usage example
```lua
-- The state graph is automatically assigned to the mimic prefab via its definition.
-- It is not added manually but referenced internally as the entity's SG.
-- Example internal trigger:
inst.sg:GoToState("spawn", true)  -- Start mimic with chest opened
inst.sg:GoToState("attack", target)  -- Initiate attack on a given target
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `inventory`  
**Tags:** `idle`, `canrotate`, `attack`, `busy`, `jumping`, `hit`, `debris`

## Properties
No public properties. State memory is stored in `inst.sg.statemem` and `inst.sg.mem` internally.

## Main functions
This file defines a state graph via `StateGraph(...)`, not individual public functions. However, it configures behavior through state definitions and event handlers.

## Events & listeners
- **Listens to:**  
  - `attacked` — transitions to `hit` state if not dead and not in attack  
  - `death` — transitions to `death` state using `statemem.dead` flag  
  - `doattack` — initiates `attack` state if not dead and not busy/hit  
  - `animqueueover`, `animover`, frame events (via timelines)  
  - Standard common handlers: `OnSleep()`, `OnLocomote(false, true)`, `OnFreeze()`
- **Pushes:**  
  - `entity_droploot` (via `LootDropper:DropLoot()`)