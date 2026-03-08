---
id: SGmonkeyqueen
title: Sgmonkeyqueen
description: Manages the state machine and behavioral transitions for the Monkey Queen NPC, including item acceptance, curse removal, and mood responses.
tags: [ai, npc, boss, curse]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2ea2dcc1
system_scope: ai
---

# Sgmonkeyqueen

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmonkeyqueen` defines the complete stategraph for the Monkey Queen NPC, governing how she responds to player interactions such as gift-giving and curse removal. It integrates with components like `talker` (for dialogue), `lootdropper` (for item distribution), `inventory`, `cursable`, and `timer` to implement mechanics including right-of-passage granting after successful curse removal. The stategraph transitions between states like `idle`, `getitem`, `happy`, `removecurse`, and `sleep` based on game events and input data.

## Usage example
This stategraph is automatically applied to the Monkey Queen prefab (e.g., `monkeyqueen.lua`) during entity creation. Modders do not typically instantiate or interact with it directly; instead, interactions are triggered by gameplay events (e.g., `inst:PushEvent("stopcursechanneling", {success = true})`).

```lua
-- Not directly usable; automatically attached to the monkeyqueen prefab
-- Example internal event push by other systems (e.g., a custom curse-removal action)
inst:PushEvent("stopcursechanneling", {success = true})
```

## Dependencies & tags
**Components used:** `talker`, `lootdropper`, `inventory`, `cursable`, `builder`, `timer`  
**Tags:** `idle`, `busy`, `channel`, `sleeping`, `waking` (applied via `inst.sg:AddStateTag()` / `:RemoveStateTag()` internally)

## Properties
No public properties are defined directly in this stategraph file. State memory is stored in `inst.sg.statemem`, e.g., `inst.sg.statemem.giver`.

## Main functions
This file exports only the `StateGraph` constructor call; no reusable functions are exposed.

## Events & listeners
- **Listens to:**  
  - `stopcursechanneling` — Triggers transition to `removecurse_success` or `removecurse_fail` based on `data.success`.  
  - `animover` (multiple states) — Advances state after animation completes, e.g., back to `idle` or into `happy`.
- **Pushes:**  
  - None — This stategraph is purely reactive; it does not fire events itself.