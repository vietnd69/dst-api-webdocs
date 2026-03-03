---
id: carratbrain
title: Carratbrain
description: Manages the AI behavior tree for the Carrat character, including racing logic, panic responses, and food foraging.
tags: [ai, locomotion, racing, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f66527f5
system_scope: brain
---

# Carratbrain

> Based on game build **714004** | Last updated: 2026-03-03

## Overview
`CarratBrain` implements the behavior tree for the Carrat entity in DST, handling its navigation, foraging, panic, and race-specific behaviors. It integrates with components like `yotc_racecompetitor`, `yotc_racestats`, `eater`, `burnable`, `hauntable`, and `health` to dynamically select appropriate actions based on state and environment. The brain prioritizes survival behaviors (e.g., fleeing fire or predators) and adapts behavior during race events (e.g., pre-race waiting, pacing, or post-race pauses).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrain("carratbrain")
-- The brain automatically initializes when OnStart() is called
```

## Dependencies & tags
**Components used:** `health`, `burnable`, `hauntable`, `eater`, `inventoryitem`, `entitytracker`, `yotc_racecompetitor`, `yotc_racestats`, `beefalo`, `bait`, `burnable`.  
**Tags:** Checks `scarytoprey`, `character`, `beefalo`, `baby`, `HasCarrat`, `planted`, `INLIMBO`, `outofreach`.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Constructs and assigns the root behavior tree (`self.bt`) for the Carrat. Initializes behavior hierarchies based on racing state (`racing`, `postrace`, `raceover`, `prerace`), fire, electric fences, hauntable panic, predator avoidance, food foraging, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not return early on missing components; safe defaults are provided (e.g., `nil` component checks).

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** `carrat_error_walking` — fired when `GetSpeedModifier() == 0` and `walkspeechdone` was not yet set; used to trigger speech/audio cues.
