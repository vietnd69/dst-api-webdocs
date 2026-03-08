---
id: SGmole
title: Sgmole
description: Defines the state machine and behavior logic for the mole creature, handling movement, burrowing, stealing items, and reacting to threats.
tags: [ai, locomotion, entity, combat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 023a198f
system_scope: entity
---

# Sgmole

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmole` defines the state graph for the mole prefab in DST. It orchestrates the mole's animation-driven behaviors—such as peeking above ground, stealing items, burrowing, and retreating into tunnels—in response to player actions and environmental events. It integrates closely with the `health`, `inventory`, `locomotor`, and `sleeper` components to ensure proper physics, animation, and reaction handling.

## Usage example
The `SGmole` state graph is automatically applied to mole entities by the game engine and should not be instantiated directly by modders. To modify mole behavior, override or extend this state graph via prefab overrides:
```lua
 -- Example: Add custom event handler via prefab override
inst:AddTag("mole")
inst.sg = StateGraph("mole", GetStateGraph("mole").states, new_events, "init", actionhandlers)
```

## Dependencies & tags
**Components used:** `health`, `inventory`, `inventoryitem`, `locomotor`, `sleeper`  
**Tags added/checked:** `busy`, `idle`, `moving`, `canrotate`, `noattack`, `noelectrocute`, `canelectrocute`, `canwxscan`, `sleeping`, `waking`

## Properties
No public properties are exposed by this stategraph itself. State-specific data is stored in `inst` or `inst.sg.statemem` (e.g., `peek_interval`, `last_above_time`, `playtask`, `killtask`).

## Main functions
This file does not define any public functions callable from outside the stategraph context.

## Events & listeners
- **Listens to:**
  - `animover`, `animqueueover` — Triggers state transitions after animations complete.
  - `attacked` — Initiates flee/stun behavior, drops inventory on hammer hit, triggers hit animation.
  - `trapped` — Sets flee flag for ~3–6 seconds.
  - `locomote` — Responds to movement intent by transitioning between `idle`, `walk_pre`, `walk`, `walk_pst`, and `exit` states.
  - `stunbomb` — Immediately stuns the mole.
  - Common state handlers: `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnDeath`, `OnCorpseChomped`, `OnCorpseDeathAnimOver`.
  - `onwakeup` — Causes transition from `sleep`/`sleeping` to `wake` state.
- **Pushes:** None — the mole itself does not push custom events.

