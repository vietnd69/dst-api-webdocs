---
id: SGpigelitefighter
title: Sgpigelitefighter
description: Defines the state machine for the Pig Elite Fighter entity, handling movement, combat, idle, spawn-in, and despawn behaviors.
tags: [combat, ai, boss, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 7c605d64
system_scope: entity
---

# Sgpigelitefighter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpigelitefighter` is a stategraph that governs the behavior and animation states of the Pig Elite Fighter entity in DST. It defines state transitions for actions including idle, attack, hit, death, spawn-in (posing), and despawn. The stategraph integrates with core components like `combat`, `health`, `locomotor`, and `talker`, and extends base states (walk, run, sleep, frozen, electrocute, hop) via `CommonStates` helpers. It manages variant-specific visual builds and sound cues using `inst.sg.mem.variation` to determine appearance and timing.

## Usage example
```lua
-- The stategraph is instantiated and used internally by the game engine for the "pigelitefighter" prefab.
-- It is not typically added manually in mod code, but can be referenced or extended via:
local sg = GetStateGraph("pigelitefighter")
-- Modders may override or extend states/events in modmain.lua or via prefabs.
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `talker`, `soundemitter`, `animstate`, `physics`, `transform`  
**Tags added/removed per state:**
- `idle`: `idle`, `canrotate`
- `attack`: `attack`, `busy` (removed on exit)
- `hit`: `busy`
- `death`: `busy`
- `spawnin`: `intropose`, `busy`, `nofreeze`, `nosleep`, `noattack`, `jumping`, `noelectrocute`
- `despawn`: `endpose`, `busy`, `nofreeze`, `nosleep`, `noattack`, `jumping`, `noelectrocute`

## Properties
No public properties defined in constructor. State behavior is configured via `states`, `events`, and `mem`-stored data (e.g., `inst.sg.mem.variation`, `inst.sg.mem.isobstaclepassthrough`).

## Main functions
Stategraph is returned as a `StateGraph` object; no public methods are defined in this file.

## Events & listeners
**Listens to:**
- `attacked` — handled by `CommonHandlers.OnAttacked()` (triggers `hit` state)
- `death` — handled by `CommonHandlers.OnDeath()` (triggers `death` state)
- `despawn` — triggers `despawn` state if idle and not dead
- `onsink` — triggers `despawn` if not dead
- `hop` — handled by `CommonHandlers.OnHop()` (adds hop states)
- `locomote` — handled by `CommonHandlers.OnLocomote(true, true)` (adds walk/run states)
- `freeze`/`electrocute` — handled by `CommonHandlers.OnFreeze()` and `CommonHandlers.OnElectrocute()`
- `sleep_ex`/`wake_ex` — handled by `CommonHandlers.OnSleepEx()` and `CommonHandlers.OnWakeEx()`
- `animover` — transitions out of `idle`, `attack`, `hit` states on animation completion
- `animqueueover` — triggers entity removal on despawn animation completion
- `ontimeout` (`spawnin`) — emits chat chatter for spawn-in
- `onnosleepanimqueueover` — transitions from sleep to `idle` after sleep animation

**Pushes:**
- `locomote` — via `locomotor:Stop()` and stategraph logic
- Custom events via `CommonHandlers` helpers (e.g., `attack`, `attackover`, `corpse_deathanimover`)