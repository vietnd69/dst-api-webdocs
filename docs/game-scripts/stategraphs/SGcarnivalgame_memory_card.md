---
id: SGcarnivalgame_memory_card
title: Sgcarnivalgame Memory Card
description: Manages state transitions and visual/audio feedback for a memory card minigame prop during carnival events.
tags: [event, minigame, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c7fab703
system_scope: entity
---

# Sgcarnivalgame Memory Card

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This state graph (`SGcarnivalgame_memory_card`) controls the behavior of a memory card prop used in a carnival minigame. It defines a set of states that govern animation playback, sound effects, and state transitions triggered by external game events (e.g., round start, card reveal, turn-on/off). It interfaces with the `inspectable` component for entity inspection capabilities and responds to events like `carnivalgame_turnon`, `carnivalgame_memory_cardstartround`, and `carnivalgame_memory_revealcard`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("memory_card")
inst:AddComponent("inspectable")
inst.sg = StateGraph("carnivalgame_memory_card", inst, states, events, "idle_off")
-- After setup, trigger states via:
inst:PushEvent("carnivalgame_turnon")
inst:PushEvent("carnivalgame_memory_cardstartround", { isgood = true })
```

## Dependencies & tags
**Components used:** `inspectable` (added conditionally on entering `idle_off` state if not present)  
**Tags:** `off` (applied to `idle_off` and `turn_off` states)

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
- **Listens to:**
  - `carnivalgame_turnon`: Transitions to `turn_on` state.
  - `carnivalgame_memory_cardstartround`: Evaluates `data.isgood`; transitions to `hint_good` or `hint_bad`, unless `_shouldturnoff` is true.
  - `carnivalgame_memory_revealcard`: Transitions to `reveal_good` or `reveal_bad` depending on `inst.sg.mem.isgood`, unless `_shouldturnoff` is true.
  - `animover`: Used internally in multiple states to transition to next state after animation completes.
  - `carnivalgame_endofround`: Triggers post-reveal state transition in reveal states.
  - `carnivalgame_turnoff`: Triggers `turn_off` or post-reveal state in multiple states.

- **Pushes:**
  - `carnivalgame_memory_cardrevealed`: Fired during `reveal_good` (after 10 frames) and `reveal_bad` (after 20 frames) states to signal card reveal completion.