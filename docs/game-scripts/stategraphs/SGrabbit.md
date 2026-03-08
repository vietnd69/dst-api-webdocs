---
id: SGrabbit
title: Sgrabbit
description: Manages the state machine for the rabbit prefab, handling movement (idle, hop, run), actions (eating, performing buffered actions), damage states (hit, stunned, trapped), and death transitions.
tags: [locomotion, state-machine, animation, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d16e1613
system_scope: entity
---

# Sgrabbit

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGrabbit` defines the state graph for the rabbit entity, orchestrating its behavior via a state machine that handles locomotion (idle, hopping, running), actions (eating, performing buffered actions), damage responses (hit, stunned, trapped), and death. It integrates with `health`, `inventoryitem`, and `locomotor` components, and imports shared states from `commonstates.lua` (e.g., sleep, freeze, electrocute, sink, void fall, and corpse states). The state graph is registered as `"rabbit"` and includes action handlers for `EAT` and `GOHOME`.

## Usage example
```lua
-- Typically applied automatically to rabbit prefabs via the prefab definition
-- Example of manual usage (rare):
local inst = CreateEntity()
inst:AddStateGraph("rabbit")
-- The state graph is not added directly via AddComponent; it is assigned by the engine when the prefab uses StateGraph("rabbit", ...)
```

## Dependencies & tags
**Components used:** `health`, `inventoryitem`, `locomotor`  
**Tags:**  
- `idle`, `moving`, `canrotate`, `hopping`, `running`, `busy`, `stunned`, `trapped`, `noelectrocute` (state-dependent tags)  
- Tags added on state entry: `idle` (`idle`, `look`), `moving` (`hop`, `run`, `run_loop`), `busy` (`death`, `fall`, `stunned`, `trapped`, `hit`), `stunned` (`fall`, `stunned`), `trapped` (`trapped`), `noelectrocute` (`trapped`)

## Properties
No public properties defined.

## Main functions
Not applicable — this file defines a `StateGraph`, not a component class with methods.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `hit` state (if not dead), or `stunned` via electrocute handler if applicable  
  - `trapped` — triggers `trapped` state  
  - `locomote` — manages transitions among `idle`, `hop`, and `run` states based on `WantsToMoveForward()` and `WantsToRun()`  
  - `animover` — various states use this to advance (e.g., `look`, `action`, `hit`, `run` → `run_loop`)  
  - `stunbomb` — triggers `stunned` state  
  - `ondeath`, `onelectrocute`, `onfreeze`, `onsleep`, `onsink`, `onfallinvoid` — handled via `CommonHandlers`  
  - `oncorpsechomped` — handled via `CommonHandlers`  
  - `ontimeout` — timeouts drive transitions (e.g., `look` → `idle`, `hop` loops)  
- **Pushes:**  
  - None defined directly; relies on `CommonHandlers` for shared event emissions (e.g., `onsleep` may push events like `wake`, `sleep`)

