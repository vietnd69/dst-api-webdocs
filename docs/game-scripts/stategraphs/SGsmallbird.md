---
id: SGsmallbird
title: Sgsmallbird
description: Manages the state machine for the Small Bird entity, controlling animations, sounds, and behavior transitions such as idle, attack, death, and growth phases.
tags: [ai, animation, sound, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: afa95b41
system_scope: entity
---

# Sgsmallbird

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGsmallbird` defines the complete stategraph for the Small Bird prefab, handling its core lifecycle states including idle behaviors (blinking, peeping), movement preparation, hatching, growing into a Teen Bird, attacking, being hit, eating, and death. It integrates with standard components like `health`, `combat`, `locomotor`, and `follower` to react to game events and coordinate animations and audio feedback.

## Usage example
This stategraph is automatically assigned to the Small Bird entity during prefab instantiation. Modders typically do not interact with it directly. To extend behavior, one would override its `userfunctions` or override the `actionhandlers` or `events` table in a custom stategraph.

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `follower`  
**Tags added by states:** `idle`, `canrotate`, `busy`, `attack`  
**Stategraph tags:** `smallbird` (via `StateGraph("smallbird", ...)`)

## Properties
No public properties are defined in this stategraph — it is a configuration object that returns a `StateGraph` instance.

## Main functions
Not applicable

## Events & listeners
- **Listens to:**  
  `startstarving` — transitions to `idle_peep`.  
  `attacked` — triggers `hit` state unless electrocuted.  
  `doattack` — triggers `attack` state if not dead or busy.  
  `animover` — in various states, returns to `idle` or loops animations based on random chance.  
  `OnStep`, `OnSleep`, `OnLocomote`, `OnFreeze`, `OnElectrocute`, `OnDeath`, `OnCorpseChomped`, `OnCorpseDeathAnimOver` — from `CommonHandlers`.

- **Pushes:**  
  None directly — events are handled internally via `GoToState`.
