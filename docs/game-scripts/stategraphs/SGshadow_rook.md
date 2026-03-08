---
id: SGshadow_rook
title: Sgshadow Rook
description: Implements the state machine for the Shadow Rook, a boss entity in DST's Shadow Chess minigame, handling its attack sequence (teleport and area attack), movement, and lifecycle states.
tags: [combat, boss, ai, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 52c6fdcd
system_scope: entity
---

# Sgshadow Rook

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadow_rook` defines the state graph for the Shadow Rook boss entity in DST's Shadow Chess minigame. It extends shared chess piece states (idle, hit, death, etc.) from `SGshadow_chesspieces.lua` and implements a specialized two-stage attack sequence: a teleport approach followed by a localized area-of-effect attack. The state graph coordinates combat, health invincibility windows, animation timelines, and event-driven transitions to manage boss behavior during encounters.

## Usage example
This state graph is automatically assigned as the `StateGraph` for the Shadow Rook prefab (e.g., via `inst:AddStateGraph("shadow_rook")`). Modders typically do not instantiate or interact with it directly. The behavior is triggered internally when the boss transitions to its `attack` state with a valid target.

## Dependencies & tags
**Components used:** `combat`, `health`, `physics`, `animstate`  
**Tags:**  
- Added: `attack`, `busy`, `noattack` (applied and removed during attack sequences)  
- Referenced exclusions: `INLIMBO`, `notarget`, `invisible`, `noattack`, `flight`, `playerghost`, `shadow`, `shadowchesspiece`, `shadowcreature`  

## Properties
No public properties. All state-specific behavior is handled via stategraph internals (`inst.sg.statemem`, timelines, and event handlers).

## Main functions
No top-level functions. Behavior is defined entirely by state handlers in the `states` table. Key internal behaviors are realized via component method calls during state transitions and timelines.

## Events & listeners
- **Listens to:**  
  - `animqueueover` (state-specific): Triggers state transitions upon animation completion (e.g., `attack` → `attack_teleport`).  
- **Pushes:**  
  - `invincibletoggle` (via `health:SetInvincible()`): Fired when invincibility is toggled (set to `true` during teleport/attack and `false` afterward).  
  - `onareaattackother` (via `combat:DoAreaAttack()`): Fired for each entity hit during the area attack.  
  - Standard Shadow Chess events (e.g., `taunt`, `transform`) are inherited from `ShadowChess.CommonEventList`.