---
id: SGstagehand
title: Sgstagehand
description: Manages the state machine for the Stagehand entity, controlling its behavior including hiding, idle, working, extinguishing fires, and giving up when overwhelmed.
tags: [ai, state-machine, npc]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 9a41bdfc
system_scope: ai
---

# Sgstagehand

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGstagehand` is a StateGraph definition for the Stagehand entity. It orchestrates the entity’s behavioral transitions based on player interactions, environmental conditions (e.g., day/night, fire status), and movement intent. It integrates closely with the `workable`, `burnable`, `locomotor`, and `lootdropper` components to respond to gameplay actions such as being worked on, catching fire, or being instructed to hide/move.

## Usage example
This StateGraph is automatically assigned to the Stagehand entity via `Return StateGraph("stagehand", ...)` at the module level. It is not directly instantiated or manipulated by modders; instead, modders interact with the Stagehand by:
- Using `inst.components.workable:SetWorkable(true/false)` to allow/block player work.
- Applying or removing fire via `inst.components.burnable:StartWildfire()` / `:Extinguish()`.
- Triggering movement via `inst.components.locomotor.wantstomoveforward`.

## Dependencies & tags
**Components used:** `burnable`, `locomotor`, `lootdropper`, `workable`
**Tags:** `busy`, `canrotate`, `hiding`, `idle`, `moving`, `givingup` (used via state tags)

## Properties
No public properties are initialized or exposed by this StateGraph itself. State memory (`inst.sg.mem`) and state-specific memory (`inst.sg.statemem`) are used internally to track runtime data (e.g., `hits_left`, `is_hiding`, `hide_delay`).

## Main functions
This file defines a StateGraph via `State` tables and associated event handlers. There are no top-level functions beyond the setup. Each state’s behavior is defined via its `onenter`, `timeline`, and `events` tables.

## Events & listeners
- **Listens to:**
  - `death` – transitions to `"death"` state.
  - `worked` – reduces hit count, triggers `"hit"` or `"giveup"` states.
  - `onignite` – transitions to `"extinguish"` state.
  - `locomote` – reacts to `WantsToMoveForward()` by starting/stopping movement or hiding transitions.
  - `animover`, `animqueueover` – used internally by states to re-trigger animations or advance states.
- **Pushes:** None directly; relies on state transitions and entity events (e.g., `"onextinguish"`) handled by associated components.
