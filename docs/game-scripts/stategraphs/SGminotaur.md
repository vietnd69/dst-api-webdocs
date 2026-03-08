---
id: SGminotaur
title: Sgminotaur
description: Manages the behavior and state transitions for the Minotaur boss entity using a stategraph-based AI system.
tags: [ai, boss, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: fbfe5e6e
system_scope: ai
---

# Sgminotaur

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGminotaur` defines the stategraph for the Minotaur boss, orchestrating its movement, attacks (bite, stomp, leap), stun recovery, and death sequences. It integrates with the `combat`, `locomotor`, `groundpounder`, `health`, `timer`, and `workable` components to execute combat actions, handle knockback, and manage environmental interactions like pushing objects and destroying destructible terrain nearby.

## Usage example
```lua
-- Typically instantiated automatically by the Minotaur prefab via:
inst:AddStateGraph("SGminotaur")
-- This registers the stategraph and enables state transitions such as:
inst:PushEvent("doattack")
inst:PushEvent("dostomp")
inst:PushEvent("doleapattack", {target = target_entity})
```

## Dependencies & tags
**Components used:** `combat`, `groundpounder`, `health`, `locomotor`, `timer`, `workable`  
**Tags added/checked:** `idle`, `moving`, `running`, `busy`, `attack`, `hit`, `death`, `stunned`, `leapattack`, `noelectrocute`, `canrotate`, `stun_pst`, `stun_loop`, `stun_hit`, `stun_pre`, `stun_jump_pre`, `stun_shock_loop`, `stun_shock_pst`, `NOCLICK`, `INLIMBO`, `mushroomsprout`, `NET_workable`, `_inventoryitem`, `locomotor`, `caninterrupt`, `frozen`

## Properties
No public properties.

## Main functions
This file does not define any public functions outside the stategraph system. It only configures the `StateGraph` instance and returns it. All state-specific behavior is defined inline via `onenter`, `onupdate`, `ontimeout`, `onexit`, `timeline`, and `events` callbacks.

## Events & listeners
- **Listens to:**
  - `animover`, `animqueueover` — triggers state transitions upon animation completion.
  - `attackstart` — triggers attack from `run_start` to `run`.
  - `doattack`, `dostomp`, `doleapattack` — initiates attacks from interruptible states.
  - `collision_stun`, `land_stun` — enters hit/stun states.
  - `attacked` — handles incoming damage with context-aware state transitions (e.g., `hit`, `stun_hit`).
  - `endstun` — exits stun loop or enters post-stun.
  - `OnLocomote`, `OnFallInVoid`, `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnAttack`, `OnDeath`, `OnCorpseChomped` — generic event handlers.
- **Pushes:**
  - `attackstart` — broadcast when entering `run` from `run_start`.
  - `locomote` — via `locomotor:Stop()` when stopping movement.