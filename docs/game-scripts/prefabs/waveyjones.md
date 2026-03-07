---
id: waveyjones
title: Waveyjones
description: Manages the behavior and lifecycle of Wavey Jones and its associated parts (arms, hands, hand art, and marker) in the Dangerous Sea event.
tags: [combat, boss, event, ai, ocean]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 80bcc917
system_scope: entity
---

# Waveyjones

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waveyjones.lua` defines the core prefabs and initialization logic for Wavey Jones, a boss creature in the Dangerous Sea event. It includes five interdependent prefabs: `waveyjones` (the main entity), `waveyjones_arm`, `waveyjones_hand`, `waveyjones_hand_art`, and `waveyjones_marker`. The component orchestrates the spawning of arms and hands, handles player proximity detection, triggers scare/relocate behavior, manages respawn timers, and coordinates animation and sound events. It relies heavily on `entitytracker`, `updatelooper`, `playerprox`, `sanityaura`, and `timer` components.

## Usage example
```lua
-- Wavey Jones is automatically spawned as part of the Dangerous Sea event via waveyjones_marker
-- The marker is created by the game when the event starts; no direct prefab usage is required.
-- Example manual usage (not part of official flow):
local marker = SpawnPrefab("waveyjones_marker")
marker.Transform:SetPosition(x, y, z)
marker.components.entitytracker:TrackEntity("boat", boat)
```

## Dependencies & tags
**Components used:** `entitytracker`, `updatelooper`, `sanityaura`, `timer`, `playerprox`, `locomotor`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags added:**  
- `waveyjones`: `shadow`  
- `waveyjones_hand`, `waveyjones_hand_art`, `waveyjones_arm`, `waveyjones_marker`: `NOCLICK`  
- `waveyjones_hand_art`: `DECOR`  
- `waveyjones_marker`: `NOBLOCK`  

## Properties
No public properties defined directly on instances; interaction occurs through component methods and event listeners.

## Main functions
Not applicable. This file defines prefabs via factory functions (`fn`, `handfn`, `handartfn`, `armfn`, `markerfn`) and helper functions; it does not expose a central component with callable methods.

## Events & listeners
- **Listens to:**  
  - `onremove` (all prefabs): Triggers cleanup (e.g., removing target,吓走 Jones, respawning logic).  
  - `animover` (`waveyjones`): Removes `waveyjones` after scared animation ends.  
  - `laugh` (`waveyjones`): Triggers laughter behavior.  
  - `timerdone` (`waveyjones_marker`): Handles respawn timer completion.  
  - `STATE_*` events (`waveyjones_hand_art`): Control state transitions.  
  - `onscared` (`waveyjones_hand`, `waveyjones_hand_art`, `waveyjones_arm`): Removes or relocates affected entities.  
- **Pushes:**  
  - `onscared` (all arms/hands when scared): Broadcast when Wavey Jones is scared.  
  - `trapped`, `released` (`waveyjones_hand`): Fired when player enters or exits proximity.