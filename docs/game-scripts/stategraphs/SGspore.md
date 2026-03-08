---
id: SGspore
title: Sgspore
description: Defines the state machine behavior for spore-based entities (e.g., Tall Spore) in DST, managing flight, idle, takeoff, landing, and death states.
tags: [ai, locomotion, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2e644c67
system_scope: locomotion
---

# Sgspore

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGspore` is a `StateGraph` that implements the behavior tree for spore-type entities (e.g., Tall Spore). It controls animation playback, physics state (e.g., stopping physics during land/idle), light/shadow management, and transition logic between flight, idle, land, takeoff, and death states. It relies on the `locomotor` component to determine movement intent and integrates with `CommonStates` via `AddFrozenStates`.

## Usage example
This `StateGraph` is not used directly in mod code. Instead, it is assigned to an entity's `stategraph` property in its prefab definition, e.g.:
```lua
inst.stategraph = SG("spore")
```
The game automatically initializes and manages the state transitions based on entity actions and component events.

## Dependencies & tags
**Components used:** `locomotor`  
**Tags used/added:**  
- States add tags: `"moving"`, `"canrotate"`, `"busy"`, `"landing"`, `"landed"`, `"idle"`  
- State listeners check tags: `inst.sg:HasStateTag("busy")`, `inst.sg:HasStateTag("moving")`

## Properties
Not applicable.

## Main functions
Not applicable. This file defines a `StateGraph` data structure, not a component class with callable functions.

## Events & listeners
- **Listens to:**  
  - `"locomote"` – Triggers movement state transition logic using `locomotor:WantsToMoveForward()`.  
  - `"death"` – Immediately transitions to the `"death"` state.  
  - `"animover"` (state-specific) – Used in `"death"`, `"land"`, and `"takeoff"` states to trigger final transitions after animation completion.
- **Pushes:** None (this `StateGraph` does not fire custom events; it handles internal state transitions only).