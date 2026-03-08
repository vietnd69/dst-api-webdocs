---
id: SGyotb_stage
title: Sgyotb Stage
description: Controls the state machine and animations of the YOTB (Year of the Beginning) stage booth entity, handling transitions between idle, open, talk, and prize-throwing states.
tags: [yotb, stage, animation, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: eae2272c
system_scope: entity
---

# Sgyotb Stage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGyotb_stage` is a `StateGraph` definition that governs the visual and behavioral states of the YOTB stage booth entity. It coordinates animations, sounds, and timing to reflect the booth's operational state (e.g., idle, arriving, speaking, tossing prizes). It integrates with `yotb_stagemanager` to determine global contest status and with `talker` and `yotb_stager` to trigger voice lines and prize distribution, respectively.

## Usage example
This stategraph is automatically assigned to the YOTB stage booth entity via the game's prefabs (e.g., `yotb_stage.lua`). No direct instantiation or configuration is required from modders.

## Dependencies & tags
**Components used:** `talker`, `yotb_stager`, `yotb_stagemanager` (accessed via `TheWorld.components`)
**Tags:** `busy`, `open`, `ready`, `closed` — applied dynamically via state tags.

## Properties
No public properties. State definitions and behaviors are encoded in the `states` and `events` tables.

## Main functions
No public functions. This is a pure `StateGraph` definition file; functionality is realized through state callbacks and event handlers.

## Events & listeners
- **Listens to:**  
  - `trader_arrives` → transitions to `arrive`  
  - `trader_leaves` → transitions to `leave`  
  - `contestdisabled` → transitions to `idle_closed_ready_pst`  
  - `contestenabled` → transitions conditionally to `idle_closed_ready_reset` or `idle_closed_ready_pre`  
  - `ontalk` → transitions to `talk` (if not `busy`)  
  - `onflourishstart` → transitions to `flourish_start`  
  - `onflourishend` → transitions to `flourish_end`  
  - `yotb_throwprizes` → transitions to `throwprizes`

- **Pushes:**  
  - `yotb_advance_queue` → fired from multiple `onexit` handlers to notify the stage manager that this entity is ready for the next action.
