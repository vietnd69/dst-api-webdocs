---
id: SGspider
title: Sgspider
description: Manages the state machine behavior for spider-type entities, handling movement, combat, mutations, and special attack types.
tags: [ai, stategraph, combat, mutation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 17b7e714
system_scope: entity
---

# Sgspider

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGspider` stategraph defines the behavior logic for all spider entities in DST, including variants such as `spider_warrior`, `spider_spitter`, `spider_healer`, `spider_moon`, and `spider_hider`. It orchestrates transitions between states for idle, movement, attacking, hitting, dying, mutating, and special abilities like jumping, shield defense, healing, and leaping attacks. The stategraph integrates tightly with the `combat`, `locomotor`, `health`, `inventory`, `follower`, and `shadowparasitemanager` components, and depends heavily on `commonstates` for shared mechanics like sleep, freeze, electrocution, and corpse handling.

## Usage example
```lua
-- Typically attached automatically by the prefab definition (e.g., prefabs/spider.lua):
local inst = Entity()
inst:AddTag("spider")
inst:AddStateGraph("spider", "SGspider")
-- No manual initialization needed — the stategraph is loaded via inst.sg:GoToState("init").
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `inventory`, `follower`, `shadowparasitemanager`, `spidermutator`  
**Tags added via stategraph states:** `busy`, `moving`, `idle`, `attack`, `canrotate`, `shield`, `mutating`, `trapped`, `noelectrocute`, `spitting`, `jumping`  
**Entity tags checked:** `spider_warrior`, `spider_spitter`, `spider_healer`, `spider_moon`, `spider_hider`, `spidermutator`

## Properties
No public properties — this is a `StateGraph` definition, not a component with instance properties.

## Main functions
Not applicable — this file defines a `StateGraph`, not a component with callable methods.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers hit reaction states (`hit` or `hit_stunlock`), depending on variant and current state.
  - `doattack` — initiates attack state or variant-specific attack states (e.g., `warrior_attack`, `spitter_attack`, `heal`).
  - `locomote` — transitions to `premoving`/`moving` or back to `idle` based on movement intent.
  - `trapped` — transitions to `trapped` state.
  - `mutate` — transitions to `mutate` state if not already mutating.
  - `entershield` / `exitshield` — enters `shield` or `shield_end` states.
  - Generic death/corpse events via `CommonHandlers`.
- **Pushes:** No direct event pushes; it forwards events internally via `inst.sg:GoToState()`.
