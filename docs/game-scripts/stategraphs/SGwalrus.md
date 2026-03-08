---
id: SGwalrus
title: Sgwalrus
description: Manages the state machine for the Walrus character, handling movement, combat, animation, and behavioral transitions.
tags: [ai, combat, locomotion, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: bbbf157a
system_scope: entity
---

# Sgwalrus

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGwalrus` stategraph defines the complete behavioral state machine for the Walrus entity in Don't Starve Together. It manages transitions between idle, walk, run, sleep, combat (attack, taunt, hit), death, eating, and special states like `taunt_newtarget` and `funny_idle`. It integrates with the `health`, `combat`, and `locomotor` components to coordinate responses to damage, target acquisition, and movement commands, while triggering appropriate animations and sounds.

## Usage example
```lua
-- The stategraph is automatically applied via the return statement in SGwalrus.lua.
-- To use programmatically (e.g., in a prefab file), ensure the entity is registered with the correct stategraph:
local inst = CreateEntity()
inst:AddStateGraph("walrus", "SGwalrus")
-- No further manual setup required; the stategraph engine handles transitions.
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`  
**Tags:** Adds and removes tags including `idle`, `busy`, `attack`, and `electrocute` via state tags. Also checks `taunt_attack` tag conditionally.

## Properties
No public properties

## Main functions
### `PlayCreatureSound(inst, sound, creature)`
*   **Description:** Plays a creature-specific sound using the SoundEmitter component. Defaults to `inst.soundgroup` or `inst.prefab` if no creature is specified.
*   **Parameters:**
    *   `inst` (Entity) — The entity instance.
    *   `sound` (string) — The filename of the sound to play (e.g., `"death"`).
    *   `creature` (string, optional) — The creature subdirectory name; overrides defaults.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `step`, `locomote`, `sink`, `sleep`, `freeze`, `electrocute`, `newcombattarget`, `attacked`, `doattack`, `death`, `corpsechomped`, `animover`
- **Pushes:** None (only consumes events and triggers state transitions via `GoToState`).