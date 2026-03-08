---
id: SGmosquito
title: Sgmosquito
description: Implements the state machine for the mosquito entity, controlling its flight, idle, movement, attack, and splat behaviors.
tags: [ai, combat, flying, insect]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c8b7cb87
system_scope: entity
---

# Sgmosquito

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGmosquito` state graph defines the behavior of the mosquito entity in DST. It handles transitions between flying states (idle, moving), combat actions (attack, splat on death), and status effects (hit, death, sleep, freeze, electrocute). It integrates closely with the `health`, `combat`, and `locomotor` components to manage movement, combat, and life cycle events.

## Usage example
State graphs are not added manually; they are assigned to prefabs via `inst:AddDynamicStateGraph("mosquito")`. The mosquito entity uses this state graph to drive its behavior automatically based on events and component interactions.

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`  
**Tags added/used:** `busy`, `moving`, `canrotate`, `idle`, `attack`, `landed`, `electrocute`, `dead`, `corpse` (from common states)  
**Event-driven tags:** None directly added/removed — tags are managed by state graph transitions.

## Properties
No public properties are defined in this file. Configuration is via `TUNING.MOSQUITO_BURST_RANGE` and `TUNING.MOSQUITO_BURST_DAMAGE`.

## Main functions
State graphs do not expose public methods directly — they define behavior via states and event handlers.

## Events & listeners
- **Listens to:**  
  - `attacked` → triggers `hit` state or electrocute if applicable  
  - `doattack` → triggers `attack` state if not dead/busy  
  - `locomote` → toggles between `moving` and `idle` based on `locomotor:WantsToMoveForward()`  
  - `animover` (in multiple states) → returns to `idle`, removes self (`splat`), or continues death progression (`death`)  
  - All standard death/freezing/sleep/electrocution events (via `CommonHandlers`)  
  - Corpse-related events (`OnCorpseChomped`, `OnDeath`, etc.)

- **Pushes:**  
  None — this state graph does not fire custom events.

`<`!-- YAML block is already closed at top; no extra delimiter here. -->