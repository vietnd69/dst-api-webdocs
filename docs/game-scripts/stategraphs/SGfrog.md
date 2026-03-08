---
id: SGfrog
title: Sgfrog
description: Manages the state machine behavior for frog characters, including locomotion, idle animation, aggression, attacks, and death responses.
tags: [ai, locomotion, combat, stategraph, npc]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5071af1e
system_scope: ai
---

# Sgfrog

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfrog` is a `StateGraph` that defines the complete behavioral state machine for frog entities in DST. It handles transitions between idle, walking (`hop`), running (`aggressivehop`), attacking, being hit, death, sleep, freeze, electrocution, sinking, and void-fall states. It integrates closely with the `locomotor`, `combat`, and `health` components to drive realistic frog behaviors like jumping, spitting attacks, and survival responses to environmental hazards.

## Usage example
The state graph is used internally by frog prefabs and is not instantiated directly by mods. A typical frog entity (e.g., `frog`) adds this state graph as its primary behavior controller:
```lua
inst:AddStateGraph("frog")
```
No manual function calls are required; the state machine automatically responds to events, locomotion input, and component state changes.

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `health`
**Tags:** Adds `frog` to the global tag list; states may add runtime tags like `idle`, `moving`, `hopping`, `attack`, `busy`, `trapped`, `noelectrocute`.

## Properties
No public properties are exposed. Configuration occurs via internal state definitions, sound names on `inst.sounds`, and animation logic.

## Main functions
State graphs do not expose public functions. All logic resides in state definitions (`State`) and event handlers.

## Events & listeners
- **Listens to:**
  - `doattack`: Triggers `attack` state if not busy/dead.
  - `locomote`: Initiates `hop` or `aggressivehop` if movement is requested.
  - `attacked`: Initiates `hit` state on damage if not already in recovery or busy state.
  - `trapped`: Enters `trapped` state if not busy.
  - `death`: Triggers `death` state.
  - `sleep`, `freeze`, `electrocute`: Standard status-effect states.
  - `corpse_chomped`: Handles corpse interactions.
  - `animover`, `animqueueover`: Transition out of animation states.
- **Pushes:** None (event sources are external or state-driven transitions).