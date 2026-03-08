---
id: SGbuzzard
title: Sgbuzzard
description: Defines the complete state graph for buzzard entities, handling flight, idle behavior, attacks, distress animations, and mutated flamethrower mechanics in DST.
tags: [ai, stategraph, combat, locomotion, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 54b073a2
system_scope: ai
---

# Sgbuzzard

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbuzzard` defines the state machine that controls all observable behaviors of buzzard entities, including idle movement (hopping and cawing), flight patterns (`glide`, `flyaway`), attacks (`attack`, `kill`), distress responses (e.g., `distress`, `stun` states), and specialized mutated states like `flamethrower_pre`/`loop`/`pst`. It integrates with core components (`health`, `combat`, `locomotor`, `burnable`, `periodicspawner`, `homeseeker`) and leverages shared state handlers from `commonstates` to maintain consistency across entities.

## Usage example
The state graph is automatically instantiated and assigned when a buzzard prefab (e.g., `buzzard`, `mutated_buzzard`) initializes its stategraph. Modders typically do not invoke it directly but may extend it by:
- Adding custom event handlers via `AddEventHandler`
- Overriding behavior via `actionhandlers`
- Modifying tunable values (e.g., `TUNING.MUTATEDBUZZARD_FLAMETHROWER_DAMAGE`)

```lua
-- Example: Registering a custom event listener for buzzard death
TheWorld:ListenForEvent("ondeath", function(inst)
    if inst.prefab == "buzzard" then
        print("Buzzard", inst:GetName(), "died at", inst:GetPosition())
    end
end, TheWorld)
```

## Dependencies & tags
**Components used:**  
`health`, `combat`, `locomotor`, `burnable`, `periodicspawner`, `homeseeker`, `knownlocations`, `timer`

**Tags added/removed:**  
- Common state tags: `idle`, `moving`, `busy`, `canrotate`, `flight`, `noelectrocute`, `nosleep`, `caninterrupt`, `stunned`, `eating_corpse`, `flamethrowering`, `corpse`, `attack`, `hit`
- Entity tags checked: `buzzard`, `gestaltmutant`, `NOCLICK`, `prey`, `lunar_aligned`, `honey_ammo_afflicted`, `gelblob_ammo_afflicted`

## Properties
No public properties are defined at the stategraph level. State-specific data is stored in `inst.sg.statemem` (e.g., `target`, `targetpos`, `attacking`, `corpse`) or `inst.sg.mem` (e.g., `stun_endtime`).

## Main functions
Not applicable — this is a stategraph definition file. It declares states, events, and action handlers but no callable runtime functions.

## Events & listeners
- **Listens to:**
  - Common events: `attacked`, `doattack`, `flyaway`, `onignite`, `locomote`, `corpse_eat`
  - Conditionally handled via `CommonHandlers.OnSleepEx()`, `OnFreeze()`, `OnElectrocute()`, `OnDeath()`, `OnSink()`, `OnFallInVoid()`, `OnCorpseChomped()`
  - Custom internal events: `stop_honey_ammo_afflicted`, `stop_gelblob_ammo_afflicted`, `onextinguish`, `animover`, `animqueueover`, `animdone`, `nosleep`
- **Pushes:**  
  State-driven events are not pushed by this file. Events are solely consumed to trigger state transitions.

Note: Event handlers are registered at the stategraph level; `inst:PushEvent(...)` calls are made elsewhere (e.g., `combat:DoAttack`, `periodicspawner:TrySpawn`).