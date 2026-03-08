---
id: SGslurper
title: Sgslurper
description: Manages the state machine for the Slurper creature, handling behaviors like idle, rumble, taunt, burp, jumping attacks, headslurping equipment, and death with loot dropping.
tags: [ai, combat, stategraph, boss, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 911148da
system_scope: entity
---

# Sgslurper

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGslurper` defines the full state machine for the Slurper entity, a boss creature in DST. It orchestrates animation playback, sound effects, physics overrides, and interaction with the `combat`, `inventory`, and `lootdropper` components during behaviors such as attacking, headslurping (equipping player helmets), rumbling, taunting, and dying. The state graph integrates with `commonstates` for standardized actions like sleep, freeze, and electrocute.

## Usage example
The state graph is automatically instantiated for the Slurper prefab. Modders do not typically interact with it directly. For custom Slurper variants, extend its behavior by overriding or prepending states in a custom stategraph that uses the same `slurper` base.

## Dependencies & tags
**Components used:** `combat`, `inventory`, `locomotor`, `lootdropper`  
**Tags:** Defines states with dynamic tags including `idle`, `canrotate`, `busy`, `attack`, `jumping`, `hit`, `moving`, `death`, `noelectrocute`. Common handler states (sleep, frozen, electrocute) add their own tags.

## Properties
No public properties. This is a stategraph definition, not a component; all state-specific data is stored in `inst` or `inst.sg.statemem`.

## Main functions
No standalone functions are defined. This file returns a configured `StateGraph` instance.

## Events & listeners
- **Listens to (via `CommonHandlers` and state event handlers):**  
  `animover`, `onlocomote`, `onfreeze`, `onelectrocute`, `onattacked`, `ondeath`, `onsleep`, `onattack`  
- **Pushes:** No direct event pushes; state transitions are driven by `inst.sg:GoToState()` and timeline callbacks.  
