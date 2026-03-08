---
id: SGplayer_hosted
title: Sgplayer Hosted
description: Manages player state transitions for hosted multiplayer sessions, including movement, combat, teleportation, death, and mount-specific behaviors.
tags: [player, locomotion, combat, death, multiplayer]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 88ab6919
system_scope: player
---

# Sgplayer Hosted

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGplayer_hosted` is the primary stategraph for hosted player entities in Don't Starve Together. It orchestrates core gameplay states such as idle, run, attack, death, and teleportation (including abyss/wormhole mechanics), while handling specialized logic for mounted entities and heavy lifting. It integrates closely with player-specific components like `inventory`, `combat`, `locomotor`, `health`, `drownable`, `freezable`, `rider`, `teleporter`, and `playercontroller`, and inherits common state handlers from `commonstates.lua`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("health")
inst:AddComponent("inventory")
inst:AddComponent("combat")
inst:AddComponent("locomotor")
-- ... other required components ...
inst.sg = StateGraph("player_hosted", inst, {
    -- optional overrides
})
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `drownable`, `embarker`, `follower`, `freezable`, `health`, `inventory`, `locomotor`, `petleash`, `pinnable`, `playercontroller`, `rider`, `teleporter`, `sleeper`, `fueled`, `propagator`, `finiteuses`, `stackable`, `container`, `leader`  
**Tags added/removed:** `idle`, `canrotate`, `busy`, `dead`, `nomorph`, `nodangle`, `moving`, `running`, `attack`, `doing`, `frozen`, `thawing`, `falling`, `invisible`, `slowaction`, `pausepredict`, `nopredict`, `nointerrupt`, `noattack`, `overridelocomote`, `keep_pocket_rummage`, `invincible` (via `health:SetInvincible`)  
**Tags checked:** `player`, `mime`, `debuffed` (via `freezable`)

## Properties
No public properties are defined in this stategraph. All state-related data is stored in `inst.sg.statemem`.

## Main functions
This stategraph is defined as a static `StateGraph` via `return StateGraph(...)`. It does not expose public functions. State transitions and behavior are controlled by:
- `inst.sg:GoToState(state_name, ...)` — transitions between states.
- `inst.sg:SetTimeout(seconds)` — schedules `ontimeout` callback.
- `inst.sg:AddStateTag(tag)` / `inst.sg:RemoveStateTag(tag)` — manipulates runtime state tags.

## Events & listeners
- **Listens to:**
  - `animover`, `animqueueover` — triggers state transitions after animation completion.
  - `onthaw`, `unfreeze` — handles thawing states from frozen.
  - `intro`, `attacked` — generic damage/intro triggers.
  - `death` — handled in `death` state logic.
  - `startlongaction`, `starttravelsound` — for teleporation coordination.
- **Pushes:**
  - `ms_closepopups` — during frozen/thaw states.
  - `invincibletoggle` — via `health:SetInvincible`.
  - `locomote` — via `locomotor:Stop`.
  - `onextinguish`, `onunpin`, `onremove` — via component callbacks.