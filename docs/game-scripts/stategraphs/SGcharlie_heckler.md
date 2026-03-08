---
id: SGcharlie_heckler
title: Sgcharlie Heckler
description: Defines the state machine for Charlie's heckler entities, handling entrance, idle, exit, and interactive behaviors such as talking and giving playbills during YOTH events.
tags: [ai, behavior, stategraph, stageplay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 33d70393
system_scope: entity
---

# Sgcharlie Heckler

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcharlie_heckler` is a stategraph that governs the behavioral logic of heckler characters (primarily used for YOTH stageplay events) in DST. It defines how hecklers enter, idle, interact (e.g., respond to talk/give events), and leave the stage. The stategraph integrates with the `talker` component for speech, and the `yoth_hecklermanager` world component to coordinate scripted playbill distribution during YOTH events.

## Usage example
This stategraph is attached internally to heckler prefabs and is not manually instantiated. A typical usage pattern involves spawning a heckler prefab (e.g., `heckler_a`) that includes this stategraph as its `stategraph`:

```lua
local inst = SpawnPrefabs("heckler_a")
inst.is_yoth_helper = true  -- Enables YOTH-specific helper lines
inst.sound_set = "a"
```

## Dependencies & tags
**Components used:** `talker` (via `inst.components.talker:Say()`), `yoth_hecklermanager` (via `TheWorld.components.yoth_hecklermanager`)
**Tags:** `idle`, `canrotate`, `busy`, `away`, `talking`, `give`, `NOCLICK`

## Properties
No public properties are defined in this stategraph. State-specific behavior is managed through stategraph memory (`inst.sg.statemem`) and instance flags like `inst.is_yoth_helper`.

## Main functions
This stategraph does not define any standalone functions beyond the helper `SayYOTHHelperLine`. Its structure is entirely composed of state definitions.

### `SayYOTHHelperLine(inst, line)`
*   **Description:** Helper to conditionally play a YOTH-specific line if the entity is flagged as a YOTH helper. It uses `inst.components.talker:Say()` to speak a randomly selected line from `STRINGS.HECKLERS_YOTH[line]`.
*   **Parameters:** 
    * `inst` (EntityInstance) — The heckler entity instance.
    * `line` (string) — Key indexing into `STRINGS.HECKLERS_YOTH`.
*   **Returns:** Nothing.
*   **Error states:** Silent no-op if `inst.is_yoth_helper` is `false` or `yoth_hecklermanager` is missing.

## Events & listeners
- **Listens to:**  
  `ontalk` — Initiates `talkto` state with provided parameters if not already `talking` or `busy`.  
  `arrive` — Triggers entrance (`arrive`) state.  
  `leave` — Triggers exit (`leave`) state, or defers via `inst.exited_stage` if currently `busy`.  
  `give` — Triggers `give` state to distribute playbills or handle interactions.

- **Pushes:**  
  None — this stategraph does not emit events.

