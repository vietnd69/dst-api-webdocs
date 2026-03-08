---
id: SGrabbitking_bunnyman
title: Sgrabbitking Bunnyman
description: Defines the state machine logic for the Rabbit King's Bunnyman minions, handling movement, combat, burrowing, and death animations.
tags: [ai, combat, stategraph, boss, creature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: fe011e4b
system_scope: entity
---

# Sgrabbitking Bunnyman

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGrabbitking_bunnyman` is a `StateGraph` that governs the behavior and animations of the Rabbit King's Bunnyman minions. It integrates with multiple core components (`health`, `combat`, `locomotor`, `burnable`, `lootdropper`) to manage transitions between states such as idle, walk, run, attack, hit, burrow, and death. The state graph uses `CommonHandlers` and `CommonStates` helpers to include standard creature behaviors (freezing, electrocution, sinking, void fall), and implements custom burrow logic for underground movement and re-emergence.

## Usage example
This state graph is instantiated automatically by the game for each Rabbit King Bunnyman prefab and is not typically added manually by modders. It is referenced as a dependency by the Rabbit King's boss state machine and other related prefabs.

## Dependencies & tags
**Components used:**  
- `health` (via `IsDead`)
- `combat` (via `StartAttack`, `DoAttack`)
- `locomotor` (via `WalkForward`, `RunForward`, `StopMoving`)
- `burnable` (via `Extinguish`)
- `lootdropper` (via `DropLoot`)

**Tags:**  
- State-specific tags: `busy`, `noelectrocute`, `noattack`, `nointerrupt`, `invisible`, `temp_invincible`, `idle`, `canrotate`, `attack`, `death`
- Added/removed dynamically during state entry/exit (e.g., `invisible`, `temp_invincible`, `noattack`, `nointerrupt`)
- Used to gate animation states, input handling, and damage immunity.

## Properties
No public properties. This is a `StateGraph` definition file and does not declare or expose instance properties.

## Main functions
None. This file does not define standalone functions. It constructs and returns a `StateGraph` object via `StateGraph("rabbitking_bunnyman", states, events, "init")`.

## Events & listeners
- **Listens to:**
  - `animover` — triggers state transitions after animations complete (e.g., `burrowaway` → entity removal, `idle`, `hit`, `attack`, `burrowto`, `burrowarrive_pst`)
  - `burrowaway` — initiates `burrowaway` state (entity despawn animation)
  - `burrowto` — queues or triggers `burrowto` state (subsurface movement)
  - `burrowarrive` — triggers `burrowarrive` state (re-emergence animation)
  - `death` — handled by `CommonHandlers.OnDeath()` → `death` state
  - `corpsechomped` — handled by `CommonHandlers.OnCorpseChomped()`
  - `step`, `locomote`, `sleep`, `freeze`, `electrocute`, `attack`, `attacked`, `sink`, `fallinvoid` — via `CommonHandlers.*` helpers
  - `corpse_death_animoVER` — handled by `CommonHandlers.OnCorpseDeathAnimOver()`

- **Pushes:**  
  None — this `StateGraph` does not directly fire custom events; it processes incoming events and manages state transitions.
