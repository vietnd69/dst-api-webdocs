---
id: SGpigelite
title: Sgpigelite
description: Defines the full state machine and behavior logic for Pig Elites, including movement, combat, minigame interactions, and match-end sequences.
tags: [ai, combat, minigame, locomotion, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 57098b83
system_scope: brain
---

# Sgpigelite

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpigelite` is the stategraph responsible for controlling Pig Elite behavior in Don't Starve Together. It manages movement states (idle, walk, run, dive), combat responses (hit, attack, knockback), minigame-related interactions (picking up props, diving for items), and match-end sequences (poses, chatters, and exit animations). It integrates closely with the `combat`, `health`, `inventory`, `locomotor`, `sleeper`, `talker`, and `entitytracker` components. This stategraph is specifically used by Pig King and Pig Elite variants.

## Usage example
This stategraph is automatically assigned to Pig Elite prefabs during entity creation via `StateGraph("pigelite", ...)` and is not manually instantiated. A typical usage scenario involves interaction through component events, e.g.:
```lua
-- When a Pig Elite receives a knockback event:
inst:PushEvent("knockback", { knocker = attacker, radius = 3, strengthmult = 1 })

-- When a match ends and the Pig Elite should pose:
inst:PushEvent("matchover")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `inventory`, `locomotor`, `sleeper`, `talker`, `entitytracker`  
**Tags added by stategraph states:** `idle`, `moving`, `running`, `canrotate`, `busy`, `frozen`, `sleep`, `knockback`, `propattack`, `attack`, `caninterrupt`, `nodive`, `nosleep`, `nofreeze`, `noelectrocute`, `jumping`, `intropose`, `endpose`, `noattack`  
**Tags checked (not added/removed):** `pigelite`, `minigameitem`, `flying`, `shadow`, `ghost`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `playerghost`, `propweapon`

## Properties
No public properties are defined in the stategraph itself. Internal state is stored in `inst.sg.mem` (for persistent data like `variation`, `sleeping`) and `inst.sg.statemem` (for transient per-state data like `diveitem`, `speedmult`, `smashed`).

## Main functions
The stategraph file does not define standalone functions callable by modders. All functions are internal callbacks for states and events:
- `DoAOEAttack(inst, dist, radius)`: Performs area-of-effect attack logic; sets `ignorehitrange`, locates targets, and returns smash data.  
- `CanTakeItem(inst, item, range)`: Checks validity and proximity for item pickup (e.g., during dive or prop pick).
- `IsMinigameItem(inst)`: Helper function identifying minigame items via `HasTag("minigameitem")`.

## Events & listeners
- **Listens to:**  
  - `locomote`: Handles transitions between idle, walk, and run states based on `WantsToMoveForward`/`WantsToRun`.  
  - `attacked`: Initiates hit state if not dead and recovery window is open; also handles electrocution/freeze.  
  - `knockback`: Enters knockback state, drops items, computes velocity based on attacker position.  
  - `pickprop`: Picks up a prop weapon if valid and not busy.  
  - `diveitem`: Initiates dive state for gold/objects if within range.  
  - `matchover`: Triggers `endpose_pre` after match completion.  
  - Standard handlers from `commonstates.lua`: `OnAttack`, `OnFreeze`, `OnElectrocute`, `OnSleepEx`, `OnWakeEx`, `animover`, `animqueueover`, `introover`, `onwakeup`.
- **Pushes:**  
  - `knockbackdropped`: Fired on item drop during knockback with custom delay values.  
  - `propsmashed`: Fired on items involved in `DoAOEAttack` (used for visual feedback).  
  - `onwakeup`: Fired during sleep state exit.  
  - `locomote`: Fired on locomotion state changes (by `LocoMotor:Stop`).  
  - `attacked`, `knockback`: Used internally to redirect or pass knockback impact data.
