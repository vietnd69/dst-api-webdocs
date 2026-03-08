---
id: SGrocky
title: Sgrocky
description: Defines the state machine for the Rocky character, handling movement, combat, idle, shield, and death states.
tags: [combat, ai, boss, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5a4f94cb
system_scope: ai
---

# Sgrocky

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGrocky` is a stategraph that implements the behavior logic for the Rocky character (a boss enemy in DST). It defines states for idle animations (including tendril movement), eating, taunting, rock licking (loot collection), shield mode (regeneration with absorption), attack, hit reaction, death, and corpse handling. The stategraph integrates with core components including `combat`, `health`, `locomotor`, `scaler`, and `shadowparasitemanager`, and leverages common state handlers from `commonstates.lua`.

## Usage example
```lua
-- Typically used internally by the Rocky prefab definition.
-- The stategraph is registered and assigned to the entity via:
inst.sg = StateGraph("rocky", states, events, "init", actionhandlers)
inst:AddStateGraph("rocky", inst.sg)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `scaler`, `shadowparasitemanager`
**Tags:** Adds dynamic tags such as `idle`, `busy`, `hiding`, `attack`, `hit`, `corpse` depending on the state. States `shield_start`, `shield`, and `shield_end` use `hiding`. Action `rocklick` uses `busy`.

## Properties
No public properties. All logic is state-driven.

## Main functions
### `GetScalePercent(inst)`
*   **Description:** Calculates a normalized percentage (0.0 to 1.0) representing the current scale of the entity relative to `TUNING.ROCKY_MIN_SCALE` and `TUNING.ROCKY_MAX_SCALE`.
*   **Parameters:** `inst` (Entity) - the entity instance.
*   **Returns:** number - scale percentage.
*   **Error states:** No explicit error handling; assumes valid `TUNING` values and `inst.components.scaler.scale`.

### `PlayLobSound(inst, sound)`
*   **Description:** Plays a sound with volume/size modulation based on the entity's current scale.
*   **Parameters:** 
    * `inst` (Entity) - the entity instance.
    * `sound` (string) - sound filepath.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover`, `animqueueover` - to transition between states after animations complete.  
  - `gotosleep`, `entershield`, `exitshield` - custom events triggering shield transitions.  
  - Common handlers: `OnLocomote`, `OnFreeze`, `OnAttack`, `OnAttacked`, `OnDeath`, `OnSleep`, `OnCorpseChomped`.  
  - `timeout` (from `shield` state) - re-applies shield regen and sets a new timeout.  
- **Pushes:** None (the stategraph does not push custom events).