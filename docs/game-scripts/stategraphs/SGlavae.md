---
id: SGlavae
title: Sglavae
description: Stategraph for the Lavae creature, managing its behaviors, animations, movement, combat, death, and environmental interactions such as freezing.
tags: [ai, stategraph, boss, combat, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5c22c55d
system_scope: ai
---

# Sglavae

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlavae` defines the state machine for the `lavae` entity, a boss creature in DST. It orchestrates behavior by handling state transitions for idle cycles, movement, attack sequences, death, freezing/thawing, and hunger-related actions. The stategraph integrates closely with core components: `health` for death detection, `combat` for attack initiation and execution, `locomotor` for movement control and speed multipliers, and `lootdropper` for loot generation on death. It also hooks into common state handlers for sleep, freeze, and attack events.

## Usage example
This stategraph is used internally by the `lavae` prefab and is not instantiated directly by mods. Standard usage involves the engine automatically loading it for the prefab:
```lua
-- Within the lavae prefab definition (not shown here), the stategraph is assigned:
inst.stategraph = SGlavae()
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `lootdropper`, `hunger`  
**Tags:** The stategraph assigns state tags such as `"idle"`, `"canrotate"`, `"attack"`, `"busy"`, `"moving"`, `"jumping"`, `"frozen"`, `"thawing"`. It also checks for `"smallcreature"` and `"burnt"` via `inst:HasTag()`.

## Properties
No public properties are defined or initialized in the constructor.

## Main functions
The stategraph does not expose standalone functions — all logic resides in state handlers and closures. However, it defines several internal helper functions:

### `onattackedfn(inst, data)`
* **Description:** Event handler triggered when the entity is attacked. Initiates the `"hit"` state if the entity is not dead and not in a state that blocks hit反应 (unless frozen).
* **Parameters:** `inst` (Entity instance), `data` (table, attack event data).
* **Returns:** Nothing.

### `ondeathfn(inst, data)`
* **Description:** Event handler for death events. Routes to `"thaw_break"` if the entity is frozen or thawing, otherwise to `"death"`.
* **Parameters:** `inst` (Entity instance), `data` (table, death event data).
* **Returns:** Nothing.

### `SpawnMoveFx(inst)`
* **Description:** Spawns a randomized move effect (`lavae_move_fx`) while walking, avoiding visual repetition by tracking recent FX in `inst.sg.mem.recentfx`. Applies scale variation and updates the last spawn time.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked`, `death`, `animover`, `animqueueover`, `unfreeze`, `onthaw`  
  Also uses `CommonHandlers.OnLocomote`, `CommonHandlers.OnSleep`, `CommonHandlers.OnFreeze`, `CommonHandlers.OnAttack`.
- **Pushes:**  
  `inevitabledeath` (when entering frozen state to signal death is unavoidable).