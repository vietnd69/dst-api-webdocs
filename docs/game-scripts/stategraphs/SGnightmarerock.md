---
id: SGnightmarerock
title: Sgnightmarerock
description: Manages animation, sound, and visibility states for the nightmare rock entity during raising, lowering, concealing, and revealing operations.
tags: [visual, audio, entity, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e7b76cfc
system_scope: entity
---

# Sgnightmarerock

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGnightmarerock` defines the state machine for the nightmare rock entity (`nightmarerock` prefab), controlling its operational states: idle, raise, lower, conceal, concealed, and reveal. It orchestrates animations, sound effects, and visibility changes in response to state transitions. This stategraph is the core logic for the entity's dynamic appearance behavior.

## Usage example
```lua
-- The stategraph is attached automatically via the prefab definition (e.g., in prefabs/nightmarerock.lua)
-- Typically not added manually; used internally by the nightmare rock entity.
-- Example internal flow:
inst.sg:GoToState("raise")
inst.sg:GoToState("lower")
inst.sg:GoToState("conceal")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** The stategraph assigns tags to states:
- `"idle"` on `idle`, `raise`, `lower`, `concealed`
- `"busy"` on `raise`, `lower`, `conceal`, `reveal`
- `"hidden"` on `conceal`, `concealed`

## Properties
No public properties.

## Main functions
This stategraph is declarative (a list of states) and does not expose standalone functions. All behavior is encapsulated in state definitions (`onenter`, `events`).

### State transitions
- **`"raise"` → `"idle"` or `"conceal"`**: On animation completion, transitions based on `inst.conceal` or `inst.conceal_queued`.
- **`"lower"` → `"idle"` or `"conceal"`**: On animation completion, transitions similarly based on concealment state flags.
- **`"conceal"` → `"concealed"` or `"reveal"`**: On animation completion.
- **`"conceal"` → `"reveal"`**: If `conceal_queued` is `false`.
- **`"reveal"` → `"idle"` or `"conceal"`**: On animation completion.
- **`"concealed"`**: Auto-exits via `onexit` when leaving the state (calls `inst:Show()`), and hides on entry via `inst:Hide()`.

## Events & listeners
- **Listens to:** `animover` — all states except `concealed` listen for this event to trigger the next state transition once the animation completes.
- **Pushes:** None.