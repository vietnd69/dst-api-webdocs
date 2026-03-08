---
id: SGcharlie_stage_post
title: Sgcharlie Stage Post
description: Defines the state machine for the Charlie (statue mask) stage post entity, controlling its animation states, sound playback, and transition logic during cutscenes.
tags: [cutscene, entity, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f36084cf
system_scope: entity
---

# Sgcharlie Stage Post

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcharlie_stage_post` is a stategraph that governs the behavioral states of the Charlie (statue mask) stage post entity during in-game events and cutscenes. It manages transitions between closed, open, narrating, and stinger states based on animation completion events, timeouts, and external triggers such as `ontalk`. The stategraph plays associated sound effects and controls animation playback using the `AnimState` and `SoundEmitter` components.

## Usage example
The stategraph is automatically instantiated and managed by the engine when the associated entity (e.g., `charlie_stage_post`) is spawned. Modders typically trigger transitions via events:
```lua
inst:PushEvent("ontalk", { sgparam = "upbeat" }) -- Initiates a narrate state
inst:PushEvent("animover")                        -- May trigger next state depending on current context
```

## Dependencies & tags
**Components used:** `AnimState`, `SoundEmitter`
**Tags:** Adds dynamic state tags including `idle`, `busy`, `open`, `closed`, `on`, and `talking`.

## Properties
No public properties.

## Main functions
### `State { name = "narrate", ... } onenter(inst, data)`
*   **Description:** Enters the narrating state, playing looping animation and sound based on the provided `data.sgparam`. A timeout is scheduled, and the state exits upon timeout or the `donetalking` event.
*   **Parameters:** `inst` (entity instance), `data` (table with optional `sgparam` key: `"upbeat"`, `"mysterious"`, or default).
*   **Returns:** Nothing.

### `State { name = "stinger", ... } onenter(inst, sound)`
*   **Description:** Triggers a stinger animation and plays the specified sound. Expects non-nil `sound` string; otherwise, transitions immediately to `idle_open_on`.
*   **Parameters:** `inst` (entity instance), `sound` (string or `nil`).
*   **Returns:** Nothing.
*   **Error states:** If `sound == nil`, the function returns early and transitions to `idle_open_on` without playing animation or sound.

## Events & listeners
- **Listens to:**
  - `ontalk` – initiates `narrate` state if `talking` tag is absent.
  - `animover` – transitions between idle, open/closed, and narrator states upon animation completion.
  - `animqueueover` – exits `stinger` state when animation queue completes.
  - `donetalking` – signals end of narration and transitions to `idle_open_on`.
- **Pushes:** No events are directly pushed by this stategraph itself.