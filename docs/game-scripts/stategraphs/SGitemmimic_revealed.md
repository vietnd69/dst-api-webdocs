---
id: SGitemmimic_revealed
title: Sgitemmimic Revealed
description: Manages the revealed-item-mimic entity's behavior states including idle, walking, jumping, and mimic-copying mechanics.
tags: [ai, stategraph, boss, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a10a4a3e
system_scope: entity
---

# Sgitemmimic Revealed

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGitemmimic_revealed` defines the complete state machine for a revealed item mimic (a revealed Shadowthrall mimic variant). It handles movement (idle, walking), jumping animations, and the core mimicry action—where the entity attempts to copy and replace a nearby target upon landing. It uses the `locomotor` component for motion control and integrates with the `shadowthrall_mimics` world component to spawn a copy of a successfully targeted entity. The stategraph overrides default death and jump behaviors, and supports action-based mimic targeting via the `NUZZLE` action.

## Usage example
```lua
local inst = SpawnPrefab("itemmimic_revealed")
inst.Transform:SetPosition(x, y, z)
inst:AddTag("itemmimic")
inst.sg:GoToState("idle")
-- Later, trigger mimic attempt via buffered action
inst:SetBufferedAction(action)
inst.sg:GoToState("try_mimic_pre")
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** Adds/Removes state tags including `idle`, `canrotate`, `busy`, `jumping`, `noattack`, `moving`, and checks `busy` before responding to jump events.

## Properties
No public properties.

## Main functions
This stategraph file is a stategraph definition, not a class with methods; it defines reusable `State` tables and returns a `StateGraph` instance. There are no callable functions exposed on a per-entity basis beyond the state machine's internal handlers.

## Events & listeners
- **Listens to:** 
  - `locomote` (via `CommonHandlers.OnLocomote(false, true)`)
  - `jump` (manually handled, transitions to `"jump_pre"` only if `"busy"` tag is absent)
  - `death` (via `CommonHandlers.OnDeath()`, triggers `"death"` state)
  - `animover` (multiple states — ends animations and transitions or resolves mimic logic)
  - `death` (also listened explicitly in `"walk_start"` and `"walk"` states to stop walk loops)
- **Pushes:** None directly. Uses `inst:PushEvent()` only via imported `CommonHandlers` (e.g., `OnDeath`), and custom events like `"toggle_tail_event"` (via `inst._toggle_tail_event:push()`) are internal callbacks, not standard `PushEvent` calls.
