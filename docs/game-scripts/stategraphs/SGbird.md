---
id: SGbird
title: Sgbird
description: Manages the full state machine for bird entities, handling movement, idle behavior, flight states, combat hits, death, and lunar mutation transitions.
tags: [ai, stategraph, bird, flight, mutation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d40725b9
system_scope: entity
---

# Sgbird

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbird` defines the complete state graph for bird prefabs in DST, governing transitions between idle behaviors, flying, pecking, falling, being trapped, and various mutation states (including lunar rift transitions and mutated bird swoop attacks). It integrates closely with the `health`, `locomotor`, `inventoryitem`, `burnable`, `floater`, and `periodicspawner` components to coordinate entity behavior in response to events like death, fire, being trapped, or mutation triggers. The state graph supports both standard and mutated bird variants, including special handling for `bird_mutant_rift` entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("bird")
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:AddComponent("inventoryitem")
inst:AddComponent("burnable")
inst:AddComponent("floater")
inst:AddComponent("periodicspawner")

inst:AddStateGraph("bird")
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `inventoryitem`, `burnable`, `floater`, `periodicspawner`, `combat`  
**Tags added:** `NOCLICK`, `NOBLOCK`, `corpse`, `hopping`  
**Tags checked:** `bird_mutant_rift`, `debris`, `busy`, `idle`, `flight`, `sleeping`, `electrocute`, `moving`, `canrotate`

## Properties
No public properties. State memory is stored in `inst.sg.statemem` (e.g., `gliding`, `vert`, `noescape`, `target`, `velocity`).

## Main functions
No custom methods defined. State behavior is implemented entirely via `onenter`, `onexit`, `onupdate`, and `ontimeout` callbacks in state definitions.

## Events & listeners
- **Listens to:** `gotosleep`, `freezestart`, `freezeend`, `electrocute`, `die`, `attacked`, `flyaway`, `onignite`, `trapped`, `stunbomb`, `swoop_at_target`, `locomote`, `corpsechomped`, `animover`, `stop_honey_ammo_afflicted`, `stop_gelblob_ammo_afflicted`, `onextinguish`, `on_landed`, `on_no_longer_landed`, `oncorpsedeathanimover`, `mutate`, `mutatepst`, `mutatedspawn`.
- **Pushes:** `locomote`, `on_landed`, `on_no_longer_landed`.