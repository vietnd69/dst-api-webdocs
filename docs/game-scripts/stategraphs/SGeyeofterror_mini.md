---
id: SGeyeofterror_mini
title: Sgeyeofterror Mini
description: Manages the state machine for the Mini Eye of Terror enemy, controlling its idle, attack, taunt, eat, death, and other behavioral states.
tags: [ai, combat, boss, stategraph, flying]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2ba155c6
system_scope: entity
---

# Sgeyeofterror Mini

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGeyeofterror_mini` defines the state machine for the Mini Eye of Terror entity, a flying boss-like enemy in DST. It orchestrates behavior such as idle movement, attacking, taunting, eating, and death through a series of named states and transitions. The stategraph integrates with the `locomotor` component to manage movement and the `combat` component for attack execution. Key behaviors include controlling the entity’s flying state (via `flying` tag) during lifecycle events like death and eating.

## Usage example
This stategraph is instantiated automatically for the appropriate prefab (`eyeofterror_mini`) by the engine and does not require manual instantiation. Modders typically interact with it via:
- Calling `inst.sg:GoToState("state_name")` to force state changes.
- Registering custom event handlers in the `events` table.
- Modifying behavior by overriding states or timelines (e.g., `appear_timeline`, `death` timeline) via `CommonStates` extensions.

## Dependencies & tags
**Components used:** `locomotor`, `combat`  
**Tags added/removed:**  
- Adds/removed `flying` tag during states like death and eat (via `lower_flying_creature` / `raise_flying_creature`).  
- States add tags: `idle`, `canrotate`, `busy`, `attack`, `charge`.  
- Stategraph name: `"eyeofterror_mini"`.

## Properties
No public properties.

## Main functions
No custom public functions; state behavior is defined via state table entries (`onenter`, `onexit`, `timeline`, `events`). The module exports a `StateGraph` instance, which is consumed by the engine.

## Events & listeners
- **Listens to:**  
  - `animover` (go to `idle`)  
  - `animqueueover` (transition based on randomness or success flag; to `taunt` or `idle`)  
  - Sleep/wake/freeze/electrocute events (via `CommonHandlers`)  
  - Death-related events (`CommonHandlers.OnCorpseDeathAnimOver`, etc.)  
  - Locomotion events (`CommonHandlers.OnLocomote`)  
  - Attack/attacked/death events (`CommonHandlers.OnAttack`, etc.)  
- **Pushes:**  
  - `on_landed` (when `lower_flying_creature` is called)  
  - `on_no_longer_landed` (when `raise_flying_creature` is called)  
  - Standard combat/locomotion/death events handled via `CommonHandlers`.