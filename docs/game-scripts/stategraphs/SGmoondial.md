---
id: SGmoondial
title: Sgmoondial
description: Manages the state machine and animation/sound behavior for the Moon Dial structure in DST, including phase transitions, glassing effects, and crafting interactions.
tags: [structure, time, sound, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5dfff119
system_scope: world
---

# Sgmoondial

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmoondial` defines the state graph for the Moon Dial structure, a time-related world object that changes appearance and sound based on the current moon phase. It handles animation playback, sound effects, and transitions between states such as idle, placed, hit, and glassed (after being struck during the full moon). The state graph interacts with `TheWorld.state` to determine moon phase and alterna-related flags, and uses `LootDropper` to spawn moonglass upon de-glassing.

## Usage example
This state graph is automatically attached to Moon Dial prefabs by the engine; modders typically do not instantiate it directly. To trigger state transitions, events such as `"worked"` (for hammering) and `"onbuilt"` (for placement) are pushed on the instance, which then drive state changes:
```lua
-- Example of triggering a state change programmatically (modder usage)
inst:PushEvent("worked")   -- transitions to "hit" state
inst:PushEvent("onbuilt")  -- transitions to "placed" state
```

## Dependencies & tags
**Components used:** `lootdropper` — used in the `glassed_pst` state to drop moonglass via `FlingItem`.
**Tags:** Checks `is_glassed` property on `inst`; modifies `inst.is_glassed` in `glassed_pst` state.

## Properties
No public properties initialized in the constructor — state behavior is driven entirely by event handlers and `inst`-level flags like `is_glassed`.

## Main functions
No public functions are defined — the state graph is returned via `StateGraph(...)`, and logic is encapsulated in the `onenter`, `timeline`, and `events` fields of each state.

## Events & listeners
- **Listens to:** `worked` — transitions to `"hit"` state.
- **Listens to:** `onbuilt` — transitions to `"placed"` state.
- **Pushes:** No events — this state graph only responds to external events and internally drives state transitions.
