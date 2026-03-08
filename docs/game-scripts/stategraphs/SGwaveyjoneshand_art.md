---
id: SGwaveyjoneshand_art
title: Sgwaveyjoneshand Art
description: Manages animation state transitions and sound events for Wavey Jones' art hand entity during various behaviors such as idle, moving, attacking, and reacting to danger.
tags: [animation, sound, actor, art]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: ac0d729e
system_scope: entity
---

# Sgwaveyjoneshand Art

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph (`SGwaveyjoneshand_art`) defines the animation and event flow for the art hand entity associated with the Wavey Jones character. It handles playback of animations (`hand_in`, `crawl_loop`, `attack_pre`, etc.), triggers associated sounds, and coordinates state transitions based on animation events (`animover`, `animqueueover`) or timeline events. It is tightly coupled to its parent entity via `inst.parent`, delegating completion notifications and position resets to it.

## Usage example
The stategraph is applied automatically by the engine when the waveyjoneshand_art entity is spawned. Manual usage is not typical, but the parent entity may control transitions by pushing events:

```lua
-- Inside the parent entity's logic, to trigger an attack animation:
inst.hand_art.sg:GoToState("short_action")

-- To signal animation completion in response to an event:
inst.hand_art:PushEvent("animover")
```

## Dependencies & tags
**Components used:** `AnimState`, `SoundEmitter`
**Tags:** Adds and removes the following tags dynamically per state:
- `idle`, `canrotate` (states: `in`, `idle`)
- `moving`, `canrotate` (states: `premoving`, `moving`)
- `busy`, `canrotate` (states: `short_action`, `loop_action_anchor`, `loop_action_anchor_pst`, `scared`, `trapped`, `trapped_pst`, `scared_relocate`)
- `busy` only (states: `trapped`, `trapped_pst`)

## Properties
No public properties

## Main functions
Not applicable. This file defines a `StateGraph`, not a component with callable methods. State behavior is declared via `State` objects containing `onenter`, `onexit`, `timeline`, and `events`.

## Events & listeners
- **Listens to:**
  - `animover` — handled in multiple states (`in`, `idle`, `premoving`, `moving`, `loop_action_anchor_pst`, `scared_relocate`, `trapped_pst`) to transition to `idle` or next state and notify the parent entity.
  - `animqueueover` — handled in `short_action` to signal animation sequence completion and reset parent position.
  - `TimeEvent` — in `short_action`, fires a sound at frame 11 and emits `"performbufferedaction"` event on parent at frame 18.

- **Pushes:**
  - `animover` — fired on `inst.parent` in `in`, `idle`, `premoving`, `moving`, `loop_action_anchor_pst`, `scared_relocate`, and `trapped_pst`.
  - `animqueueover` — fired on `inst.parent` in `short_action`.
  - `performbufferedaction` — fired on `inst.parent` during `short_action` timeline at frame 18.
  - `resetposition()` — called on `inst.parent` in `short_action`, `loop_action_anchor_pst`, and `scared_relocate`.