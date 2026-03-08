---
id: SGgingerdeadpig
title: Sggingerdeadpig
description: Defines the state machine for the Gingerbread Pig character, controlling movement, idle, and death animations and behaviors.
tags: [ai, animation, locomotion, death]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1848e663
system_scope: entity
---

# Sggingerdeadpig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGgingerdeadpig` is a `StateGraph` that defines the behavioral states and transitions for the Gingerbread Pig entity. It handles three primary states: `idle`, `walk_start`, `walk`, and `walk_stop`, along with a terminal `death` state. The state graph uses the `CommonHandlers` module for common event handling and integrates with the `locomotor` component for movement control and sound playback via the `SoundEmitter` component.

## Usage example
This state graph is registered automatically when the Gingerbread Pig prefab is created and does not require manual instantiation by modders. It is referenced internally by the entity's `StateGraph` component, which manages state transitions based on animation events and timeouts.

## Dependencies & tags
**Components used:** `locomotor`, `soundemitter`, `animstate`, `physics`
**Tags:** `idle`, `busy`, `moving`, `canrotate`

## Properties
No public properties — this is a `StateGraph` definition, not a component class.

## Main functions
Not applicable — this file exports a `StateGraph` constructor call, not a component class. No instance methods are defined.

## Events & listeners
- **Listens to:**  
  - `death` — triggers transition to the `death` state.  
  - `animover` (in `idle`, `walk`, `walk_stop` states) — triggers state transitions based on animation completion.  
  - `animqueueover` (in `walk_stop`) — returns to `walk_start`.  
  - Timeout (in `walk` state) — triggers transition to `death`.  
- **Pushes:**  
  - None — this state graph does not fire custom events.  

