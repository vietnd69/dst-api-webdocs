---
id: SGsmallghost
title: Sgsmallghost
description: Defines the state graph for the SmallGhost entity, governing its behavior, animations, and interactions such as idle states, quest progression, and toy-related actions.
tags: [ai, ghost, quest, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f3ae7c8a
system_scope: ai
---

# Sgsmallghost

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGsmallghost` defines the state machine for the SmallGhost entity, controlling its movement, animations, sound playback, and reaction to gameplay events like picking up toys, starting/finishing quests, and ghostly presence cues. It extends `CommonStates` to reuse walk/run logic and integrates with the `Talker` component for speech and sound effects via `SoundEmitter`. The state graph transitions between states like `idle`, `appear`, `play`, `pickup`, and `dissipate` based on actions and internal flags.

## Usage example
```lua
-- This stategraph is used internally when a SmallGhost prefab is created.
-- It is not instantiated directly by modders but serves as the SG for the ghost entity.
-- Typical usage happens when the ghost is spawned, e.g., via a player action or quest trigger.
local ghost = Prefab("smallghost")
ghost.components.talker = Talker("smallghost")
ghost:AddStateGraph("ghost", "SGsmallghost")
```

## Dependencies & tags
**Components used:** `talker` (via `inst.components.talker:Say`), `soundemitter` (for playing sounds)
**Tags:** Checks `questing`, `ignoretalking`; adds temporary state tags like `busy`, `idle`, `canrotate`, `canslide`, `nointerrupt`, `noattack`, `playful`.

## Properties
No public properties are defined or used directly in the state graph. All state-specific data is stored in `inst.sg.mem` (memory) and `inst.sg.statemem`.

## Main functions
### `get_idle_anim(inst)`
*   **Description:** Returns the animation string to use for the idle state, depending on whether the ghost is currently questing.
*   **Parameters:** `inst` (Entity) - the ghost instance.
*   **Returns:** `"idle"` if `inst:HasTag("questing")` is true; otherwise `"idle_sad"`.
*   **Error states:** None.

### `return_to_idle(inst)`
*   **Description:** Callback used after animations (e.g., `sad`, `small_happy`) to transition back to `idle`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Only transitions if the animation is done (`AnimDone()` returns true).

### `play_howl(inst)`
*   **Description:** Plays the ghost howl sound effect.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `play_joy(inst)`
*   **Description:** Plays the ghost joy sound effect.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `death` — triggers transition to `dissipate` state.
  - `ghostplaywithme` — queues a play action with a target if the ghost has toys available.
  - `animover` — handled per-state to continue logic after animation completes.
- **Pushes:**
  - `detachchild` — fired before removing the entity in `dissipate` and `quest_finished` states.