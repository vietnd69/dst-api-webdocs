---
id: SGwaterplant
title: Sgwaterplant
description: Manages the state machine for the water plant creature, handling stage transitions, combat, sleep, freeze/thaw cycles, and state-specific behaviors like spawning clouds or dropping loot.
tags: [stategraph, combat, ai, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 29955bae
system_scope: entity
---

# Sgwaterplant

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwaterplant` is the state graph (state machine) implementation for the water plant entity in DST. It defines how the creature transitions between states such as idle, attacking, sleeping, freezing, and transformation between its three stages (bud, flower, dead). The state graph coordinates interactions with multiple components—`health`, `combat`, `sleeper`, `freezable`, `lootdropper`, `harvestable`, and `burnable`—to ensure correct behavioral responses to external events like attacks, wake-up triggers, freezing, and death.

## Usage example
This state graph is not instantiated directly by modders. It is automatically assigned to the water plant prefab when the game loads:
```lua
-- Internally used in the water plant prefab definition:
inst:AddTag("waterplant")
inst:AddStateGraph("waterplant", "SGwaterplant")
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sleeper`, `freezable`, `lootdropper`, `harvestable`, `burnable`  
**Tags:** The state graph itself defines and uses internal state tags such as `busy`, `idle`, `attack`, `sleeping`, `frozen`, `thawing`, `spraying`, `canrotate`, `noelectrocute`, `nowake`, `waking`, `nosleep`.

## Properties
No public properties are exposed by this state graph. All state logic and transitions are internal.

## Main functions
Not applicable — this file defines a state graph (`StateGraph`) constructor and event handlers, not standalone functions. Functions referenced are internal to state `onenter`, `ontimeout`, `onexit`, and `timeline` callbacks.

## Events & listeners
- **Listens to:**
  - `attacked` → triggers `hit` state, subject to interruption rules and electrocution handling.
  - `newcombattarget` → triggers `switch_to_flower` if stage 2 and healthy.
  - `spray_cloud` → triggers `cloud` state if not sleeping/dead/busy/spraying.
  - `barnacle_grown` → triggers `barnacle_grow` if not dead/busy.
  - Standard events via `CommonHandlers`: `onattack`, `ondeath`, `onsleep`, `onwake`, `onfreeze`, `onelectrocute`.
  - `unfreeze`, `onthaw` → handled in frozen/thaw states.
  - `animover`, `ontimeout` → internal state cleanup and transition logic.

- **Pushes:**
  - None — this file only consumes events; no custom events are pushed.
