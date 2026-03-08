---
id: SGwagstaff_npc
title: Sgwagstaff Npc
description: Manages the state machine for Wagstaff NPC behavior, including idle animations, talking, experiments, arena interactions, and deprecation/erode-out logic.
tags: [ai, npc, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6f908343
system_scope: ai
---

# Sgwagstaff Npc

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwagstaff_npc` defines the stategraph for the Wagstaff NPC entity, a unique NPC found in the Moonstone Mine and other lunar-related content. It handles animations, sound playback, timed behavior (e.g., experiments, arena setups), talk interaction queues, and proper cleanup during transitions such as deprecation or erode-out. This stategraph integrates with several core components like `locomotor`, `talker`, `npc_talker`, `trader`, `constructionsite`, and `lootdropper`, and reacts to events like `talk`, `doexperiment`, and `tossitem`. It is primarily used for cutscenes, NPC interactions, and the ritual/mechanic involving rift spawning.

## Usage example
This stategraph is automatically applied to the Wagstaff NPC prefab; modders typically do not instantiate or assign it manually. However, to influence Wagstaff behavior, trigger events such as:

```lua
-- To initiate experimental mode
inst:PushEvent("doexperiment")

-- To make Wagstaff speak a line and wait
inst:PushEvent("talk")

-- To make Wagstaff toss held items toward a player
inst:PushEvent("tossitem", { item = item_to_drop })

-- To start a capture/work state targeting a device or point
inst:PushEvent("startwork", target_device)
```

## Dependencies & tags
**Components used:**
- `locomotor` (`:StopMoving()`, `:Stop()`)
- `lootdropper` (`:DropLoot()`, `:SetFlingTarget()`, `:FlingItem()`)
- `talker` (`:Chatter()`)
- `npc_talker` (`:haslines()`, `:donextline()`)
- `trader` (`:Enable()`, `:Disable()`)
- `constructionsite` (`:Enable()`, `:Disable()`)
- `inventory` (`:DropItem()`)

**Tags:**
- States tag the entity with `"idle"`, `"busy"`, `"talking"`, `"canrotate"`, `"doing"` as appropriate.
- No permanent tags added/removed globally; state tags are added/removed dynamically per state via `AddStateTag` / `RemoveStateTag`.

## Properties
No public properties defined in this stategraph. It only defines state handlers and behavior logic via the `State` table structure. `inst` properties used internally (e.g., `inst.rifts_are_open`, `inst.wagstaff_experimenttime`) are set by the owning entity or external scripts.

## Main functions
No functions are exported as public methods. This file returns a `StateGraph` object defined via `StateGraph("wagstaff_npc", states, events, "idle", actionhandlers)`. State behavior is entirely driven by event handlers (`events`) and state lifecycle callbacks (`onenter`, `ontimeout`, `onexit`, `timeline`).

## Events & listeners
**Listens to:**
- `animover`, `animqueueover`, `donetalking`, `ontalk`, `waitfortool`, `doexperiment`, `doneexperiment`, `talk`, `talk_experiment`, `startwork`, `continuework`, `tossitem`, `startled`
- Global common handlers: `OnStep`, `OnLocomote`, `OnAttacked`, `OnDeath`

**Pushes:**
- `locomote` (via `locomotor:Stop()` → `inst:PushEvent("locomote", ...)`)
- `dropitem` (via `inventory:DropItem()`)
- `entity_droploot` (via `lootdropper:DropLoot()`)
- Custom internal events used by other scripts:
  - `orbtaken` — sent to `target` in `capture_appearandwork` timeout
  - `docollect` — sent to `inst._device` in `capture_appearandwork` timeout
  - `doerode` — sent in `capture_emote` and `analyzing_pst` timelines to handle erode-out (with `ERODEOUT_DATA` or modified variant)
