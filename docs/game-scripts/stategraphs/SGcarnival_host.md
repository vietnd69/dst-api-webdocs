---
id: SGcarnival_host
title: Sgcarnival Host
description: Defines the state graph for the carnival host entity, managing idle, flight, landing, talking, and announcement behaviors.
tags: [ai, stategraph, flight, dialogue, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 251a3f68
system_scope: entity
---

# Sgcarnival Host

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcarnival_host` is a `StateGraph` that controls the behavioral logic for the carnival host entity (a non-player character in the Summer Event). It orchestrates transitions between idle, flying, gliding, landing, talking, and announcement states using animation playback, sound effects, physics motor velocity overrides, and conditional dialogue triggers. The state graph integrates closely with the `locomotor`, `knownlocations`, `minigame`, and `minigame_spectator` components to respond to game context such as minigame intros.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knownlocations")
inst:AddComponent("locomotor")
inst:AddComponent("minigame_spectator")
-- ... attach required components ...
inst:AddStateGraph("carnival_host", GetStateGraph("carnival_host"))
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:**  
- `locomotor` – controls movement speed and stops movement during states  
- `knownlocations` – retrieves the `"home"` location for gliding pathfinding  
- `minigame` – checked via `minigame_spectator.minigame.components.minigame:GetIsIntro()` to determine dialogue type  
- `minigame_spectator` – provides access to the active minigame for intro-state detection  

**Tags added by states:**  
- `idle`, `canrotate` – in `"idle"`  
- `flight`, `busy`, `nosleep`, `nofreeze` – in `"flyaway"`  
- `flight`, `busy` – in `"glide"`, `"land"`  
- `canrotate`, `talking` – in `"talk"`, `"announce"`  

**Action handlers:**  
- `"gohome"` – mapped to `ACTIONS.GOHOME`

## Properties
No public properties are defined or exposed by this state graph.

## Main functions
This is a `StateGraph` definition file; it does not define custom functions beyond `State` callbacks. No standalone functions exist outside of `State` `onenter`, `onupdate`, `ontimeout`, `onexit`, and `events`.

## Events & listeners
- **Listens to:**  
  - `animover` – triggers return to `"idle"` after talking/announcement/landing animations complete  
  - `ontalk` – triggers either `"announce"` (if no minigame intro) or `"talk"` (with randomness), unless `"busy"`; plays sound if minigame is in intro state  
  - `locomote` – via `CommonHandlers.OnLocomote(false, true)` – ensures motor velocity overrides are cleared appropriately  

- **Pushes:**  
  - None directly (events are handled internally via state transitions)
