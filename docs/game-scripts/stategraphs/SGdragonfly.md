---
id: SGdragonfly
title: Sgdragonfly
description: Stategraph for the Dragonfly boss that governs its movement, combat states (including attacks and ground pound), transformations, sleep behavior, and special states like knockdown and death.
tags: [combat, ai, boss, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 35643d15
system_scope: ai
---

# Sgdragonfly

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGdragonfly` is the stategraph responsible for controlling the behavior of the Dragonfly boss entity in DST. It manages all major phases of the boss: idle flight, walking (with flight vs. combat physics switching), attacking (including fire damage on hit), ground pounding (a powerful AoE attack), transforming between normal and fire-enraged states, entering/remaining in sleeping states, and death. The stategraph integrates closely with locomotion, combat, health, damage tracking, sleep, timer, and propagator components, and handles special interruptions (freezing, electrocution, stun) via shared state definitions from `CommonStates`.

## Usage example
The stategraph is defined at the top level and returned via `StateGraph(...)`. Modders do not instantiate it directly; instead, they assign it to an entity's `brain` or `stategraph` component during prefab setup:

```lua
local dragonfly = Prefab("dragonfly", function()
    local inst = CreateEntity()
    inst:AddStateGraph("dragonfly", StateGraph("dragonfly", ...))
    -- ... other setup (components, animations, sounds, etc.)
    return inst
end)
```

In practice, this file (`./stategraphs/SGdragonfly.lua`) is consumed by the engine via its module name and returned as a `StateGraph` object, and is not typically extended or modified in mod code beyond standard stategraph overrides.

## Dependencies & tags
**Components used:**  
`combat`, `damagetracker`, `groundpounder`, `health`, `locomotor`, `propagator`, `sleeper`, `timer`

**Tags added/removed:**  
Standard state tags include: `idle`, `moving`, `canrotate`, `grounded`, `busy`, `sleeping`, `waking`, `flight`, `noelectrocute`, `nosleep`, `nowake`, `caninterrupt`, `_stun_finished`, `attack`, `hit`, `frozen`.

**Entity tags:**  
Adds `NOCLICK` during death.

## Properties
No public properties. This is a pure stategraph definition returning a `StateGraph` object — all logic is embedded in `states`, `events`, and `actionhandlers`. Internal state memory (`inst.sg.statemem`) and local function closures are used for state context (e.g., `inst.sg.statemem.knockdown`, `inst.sg.mem.flyoverphysics`).

## Main functions
No public API functions are exported. All functions are internal helpers scoped within the file (e.g., `onattackedfn`, `ChooseAttack`, `transform`) and referenced only by state callbacks or event handlers.

## Events & listeners
**Listens to:**  
`doattack`, `attacked`, `stunned`, `stun_finished`, `spawnlavae`, `transform`, plus all common handlers from `CommonHandlers`:
- `CommonHandlers.OnLocomote(false, true)`
- `CommonHandlers.OnFreeze()`
- `CommonHandlers.OnElectrocute()`
- `CommonHandlers.OnDeath()`
- `CommonHandlers.OnSleepEx()`
- `CommonHandlers.OnWakeEx()`
- `CommonHandlers.OnCorpseChomped()`
- `CommonHandlers.OnCorpseDeathAnimOver()`

**Pushes:**  
Events are not directly pushed by this stategraph itself, but the state transitions and callbacks trigger changes that emit events via component methods (e.g., `health:SetInvincible` fires `invincibletoggle`, `sleeper:WakeUp` fires `onwakeup`), and animations/sounds emit their own internal events.

Note: Event handlers such as `onattackfn` and `onattackedfn` are not part of this stategraph's return; they are referenced directly in the `events` array as `EventHandler(...)` callbacks.
