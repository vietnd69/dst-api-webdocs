---
id: SGknight
title: Sgknight
description: Defines the stategraph for the Yoth Knight boss entity, managing its movement, attacks (including joust mechanics), stuns, and environmental interactions.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 781e6753
system_scope: entity
---

# Sgknight

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGknight` is the stategraph for the Yoth Knight boss entity in DST. It governs all combat, movement, and environmental states including idle, taunting, jousting (high-speed collision-based attacks), hitting, stunning, and death. It integrates with the combat, health, locomotor, and sleeper components to coordinate animations, physics, and AI behavior. The jousting mechanic uses custom hit detection via `DoJoustAoe`, which evaluates lance trajectory and platform boundaries to determine collisions and attacks.

## Usage example
The stategraph is automatically used by the `clockwork_knight` prefab during its initialization. Modders typically do not instantiate this stategraph directly. Instead, they may extend or override its states by:
1. Adding custom states to the `states` array before the final `return` call.
2. Patching event handlers (e.g., for `doattack` or `dojoust`) via `StateGraph:ReplaceState`.
Example for reference:
```lua
-- Not applicable for direct instantiation
-- SGknight is automatically invoked by the Yoth Knight prefab
```

## Dependencies & tags
**Components used:**
- `combat` — for attack scheduling, cooldowns, target tracking, and `DoAttack`
- `health` — for `IsDead` checks
- `locomotor` — for movement control and speed multiplier
- `sleeper` — for sleep/wake transitions

**Tags added/removed:**
- Added states: `idle`, `canrotate`, `busy`, `jousting`, `jumping`, `hit`, `attack`, `stunned`, `nosleep`, `noelectrocute`, `caninterrupt`, `caninterrupt`
- Tags like `busy`, `jousting`, `jumping`, `stunned`, `nosleep`, and `noelectrocute` are dynamically added/removed during state transitions.

## Properties
No public properties are defined in this stategraph. It exclusively defines states and events; data is stored in `inst.sg.statemem`, `inst.sg.mem`, or `inst.sg.lasttags` (e.g., `statemem.dir`, `mem.stunhits`, `lasttags["stunned"]`).

## Main functions
This file is a `StateGraph` definition, not a component class, so it exposes no public methods. It defines:
- A list of `states` with `onenter`, `onupdate`, `ontimeout`, `onexit`, `timeline`, and `events`.
- A list of `events` that respond to global events (e.g., `doattack`, `dojoust`, `despawn`).
It is exported via `return StateGraph("knight", states, events, "idle")`.

## Events & listeners
**Listens to (via `EventHandler`):**
- `animover` — triggers state transitions after animations complete
- `doattack` — transitions to `attack` state (unless `busy` or dead)
- `dojoust` — initiates jousting toward a target
- `despawn` — initiates `despawn` sequence
- `spawned` — initiates `spawned` sequence
- `doattack` (in `hit` state) — buffers or executes attack post-hit
- `dojoust` (in `hit` state) — buffers or executes joust post-hit
- `joust_collide` — transitions to `joust_collide` state on lance impact
- `gotosleep` / `wake` — handled via `CommonHandlers.OnSleepEx()` and `CommonHandlers.OnWakeEx()`
- `OnHop()` — handles boat/platform hopping
- `OnLocomote`, `OnSink`, `OnFallInVoid`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnDeath` — handled via `CommonHandlers.*`

**Pushes (via `inst:PushEvent`):**
- `locomote` — via `LocoMotor:Stop()`
- `gotosleep` — when first entering sleep
- `knockback` — targets knocked back during joust
- `joust_collide` — triggered on joust impact (self or opponent)
