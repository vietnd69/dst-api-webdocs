---
id: SGantlion
title: Sgantlion
description: Manages the state machine for the Antlion boss, handling transitions between idle, tribute, combat, and world-entry/exit behaviors.
tags: [ai, boss, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 3eaee037
system_scope: brain
---

# Sgantlion

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGantlion` defines the state graph for the Antlion boss entity in DST. It orchestrates all major behavioral modes—including idle, tribute acceptance/refusal, fight tribute execution, world entry/exit, and sinkhole casting—via a collection of named states and event-driven transitions. The state graph integrates closely with components like `freezable`, `sleeper`, `workable`, `mine`, `pickable`, and `inventoryitem`, and uses shared state helpers (`CommonStates`) for sleep, freeze, and electrocution handling.

## Usage example
This is a state graph definition, not a component. It is instantiated automatically when the Antlion prefab loads, and state transitions are triggered by events such as tribute offers or combat requests. No manual instantiation or method calls are required by modders.

## Dependencies & tags
**Components used:** `freezable`, `sleeper`, `workable`, `mine`, `pickable`, `inventoryitem`
**Tags:** `idle`, `busy`, `nosleep`, `nofreeze`, `noelectrocute`, `caninterrupt`, `attack`, `frozen`, `thawing`

## Properties
No public properties. State memory (`inst.sg.statemem`, `inst.sg.mem`) holds runtime values (e.g., `tributepercent`, `target`, `trigger`, `queueleaveworld`, `causingsinkholes`).

## Main functions
Not applicable. This file defines a `StateGraph`, not a component with callable methods.

## Events & listeners
- **Listens to:**  
  `onacceptfighttribute`, `onaccepttribute`, `onrefusetribute`, `antlion_leaveworld`, `onsinkholesstarted`, `onsinkholesfinished`  
  Also consumes shared events: freeze, electrocute, sleep, wake (via `CommonHandlers`).
- **Pushes:** None directly. Pushes events like `onwakeup` and `unfreeze` indirectly via component interactions.

