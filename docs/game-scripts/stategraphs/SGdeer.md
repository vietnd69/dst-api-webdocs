---
id: SGdeer
title: Sgdeer
description: State graph defining the behavior, animations, and event handling for the Deer creature, including idle, alert, grazing, combat, magic casting, unshackling, and transformation states.
tags: [ai, stategraph, npc, combat, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c3c2f789
system_scope: entity
---

# Sgdeer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGdeer` state graph manages the animation and behavioral logic for the Deer entity in DST. It defines transitions between states such as idle, alert, grazing, walking, running, attacking, casting magic (for Gem Deer variants), unshackling, and responding to damage or death events. It integrates tightly with the `combat`, `health`, `locomotor`, `entitytracker`, `lootdropper`, and `timer` components, and uses common state helpers from `stategraphs/commonstates.lua` to standardize locomotion, combat, sleep, freeze, and electrocution behaviors.

## Usage example
This state graph is automatically applied when the Deer prefab is instantiated and is not added manually by mods. It is referenced internally by the game engine via `StateGraph("deer", states, events, "init")`.

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `entitytracker`, `lootdropper`, `timer`  
**Tags added:** `busy`, `idle`, `canrotate`, `attack`, `casting` (state-specific tags via `inst.sg:HasStateTag` / `inst.sg:AddStateTag`)  
**Tags checked:** `busy`, `casting` (via `inst.sg:HasStateTag`)  
**Tags removed:** `casting`, `busy` (via `inst.sg:RemoveStateTag`)

## Properties
No public properties. State graph logic is encapsulated in state definitions and event handlers.

## Main functions
Not applicable — this is a state graph definition, not a component with standalone functions. State logic is defined via table entries.

## Events & listeners
- **Listens to:**
  - `doattack` — triggers `attack` or `magic_pre` state depending on gem presence and cooldown.
  - `deercast` — queues or executes `magic_pre` if not busy.
  - `growantler` — triggers `growantler` or queues it.
  - `unshackle` — triggers `unshackle` or queues it.
  - `animover` — in multiple states, transitions to next state or loops on animation completion.
  - Timed events (via `TimeEvent`) for synchronized sound playback (bell, chain, footstep, etc.).
  - Common handlers: `OnLocomote`, `OnSink`, `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnDeath`, `OnCorpseChomped`.

- **Pushes:**
  - Internal state transitions (e.g., `GoToState("idle")`) via state machine APIs; no user-facing events are fired by this state graph itself.