---
id: SGotter
title: Sgotter
description: Defines the state machine for the Otter character, handling movement, eating, combat, actions, and amphibious transitions in Don't Starve Together.
tags: [locomotion, combat, amphibious, animation, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a7fad9d4
system_scope: entity
---

# Sgotter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGotter` is a StateGraph definition for the Otter character that orchestrates behavior via a finite state machine. It handles core mechanics including locomotion (land/water transitions via hop states), eating, combat attacks, item interaction (pickup/drop/steal), sleeping, freezing, electrocution, and corpse handling. It integrates with multiple components—`amphibiouscreature`, `locomotor`, and `combat`—and builds upon reusable common states provided by `commonstates.lua`.

## Usage example
This file is not meant to be used directly by mods; it is a shared stategraph loaded by the Otter prefab. Modders should not instantiate it manually. To modify Otter behavior, extend or override its stategraph via prefab-specific hooks or use mod overrides (e.g., `AddStateGraphPostInit("otter", ...)`).

## Dependencies & tags
**Components used:**  
- `amphibiouscreature` (checks `in_water`, triggers water-specific logic)  
- `locomotor` (stops movement via `StopMoving`, `Stop`)  
- `combat` (triggers `DoAttack`)  

**Tags used:**  
- `busy` (applied during `eat`, `toss_fish`, pickup/drop/steal)  
- `eating` (applied during `eat`)  

## Properties
No public properties are declared in the constructor. Configuration is done via state definitions and dynamic checks.

## Main functions
This file does not expose standalone functions as a component. It defines and returns a `StateGraph` instance using `CommonStates` helpers. Key configuration sections:

### State configuration helpers (internal)
All `CommonStates.*` functions (e.g., `AddCombatStates`, `AddAmphibiousCreatureHopStates`) are imported from `./stategraphs/commonstates.lua`. They accept:
- `states`: the state table to populate  
- Configuration objects defining animation names, timelines (including `FrameEvent` and `SoundFrameEvent`), and callbacks  
- State tags and transition targets  

No additional parameters or behaviors are added beyond what `commonstates.lua` provides. Custom Otter states (`eat`, `toss_fish`, `taunt`) include `onenter`, `timeline`, and `events` handlers.

## Events & listeners
**Listens to (via `CommonHandlers`):**  
- `onlocomote`, `onsleep`, `onwake`, `onattack`, `onattacked`, `ondeath`, `onhop`, `onfreeze`, `onelectrocute`, `onchomped` (corpse interaction)  
- `animover` — triggers `go_to_idle` (for `eat`, `toss_fish`, etc.)  

**Pushes events:**  
- None directly. Relies on `CommonHandlers` and stategraph engine for event propagation.
