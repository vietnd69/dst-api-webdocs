---
id: SGbigshadowtentacle
title: Sgbigshadowtentacle
description: Manages the animation and combat-driven state transitions for the Big Shadow Tentacle entity during its appearance, idle surveillance, and attack cycles.
tags: [combat, animation, boss, enemy, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 673305b1
system_scope: entity
---

# Sgbigshadowtentacle

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbigshadowtentacle` defines the state graph for the Big Shadow Tentacle, a boss-like enemy that emerges from the ground to attack. It orchestrates transitions between `arrive`, `idle`, `attack_pre`, `attack`, `attack_post`, and `leave` states. The graph relies on the `combat` component to manage target locking, attack readiness, and actual damage execution. It uses animation events (`animover`, `animqueueover`) and timeline events (sound and script triggers) to synchronize visual effects and combat actions.

## Usage example
This state graph is attached automatically to the `bigshadowtentacle` prefab during entity creation; modders typically do not instantiate or interact with it directly. However, to extend or override behavior (e.g., custom attack logic), one would register a new `StateGraph` with similar structure, or patch the states/events via mod overrides.

## Dependencies & tags
**Components used:** `combat` — used to check `target`, invoke `StartAttack`, `TryAttack`, and `DoAttack`.
**Tags added/removed:** `busy` (on `arrive`/`leave`), `idle` (on `idle`), `invisible` (on `idle`), `attack` (on `attack_pre`/`attack`, removed on `attack` via timeline).
**State tags handled:** `busy`, `idle`, `invisible`, `attack`.

## Properties
No public properties are defined in this file. The state graph is a static definition returned by `StateGraph(...)`.

## Main functions
Not applicable — this is a declarative state graph definition, not an imperative class with functional methods.

## Events & listeners
- **Listens to:**
  - `arrive` — triggers transition to `arrive` state.
  - `leave` — triggers transition to `leave` state.
  - `animover` (per-state listeners):  
    - In `arrive`: transitions to `idle`.  
    - In `leave`: removes the entity.  
    - In `attack_pre`: transitions to `attack`.  
    - In `attack_post`: removes the entity.  
  - `animqueueover` (in `attack`): transitions to `attack` (if a target exists) or `attack_post`.
- **Pushes:** None — this file does not fire custom events; it responds to external events and internal animation/timeline triggers.
- **Timeline events used (internal):**
  - Sound triggers at frame 20 (`atk_pre`) and frame 2/15/17 (`atk_loop`).
  - Script functions (e.g., `combat:DoAttack()`) at frames 7 and 17.
  - State tag removal at frame 18.