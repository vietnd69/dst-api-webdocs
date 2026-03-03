---
id: carnival_hostbrain
title: Carnival Hostbrain
description: Controls the AI behavior of the Carnival Host, managing its interactions with minigames, crowd behavior, and environment navigation.
tags: [ai, minigame, navigation, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: dbe4a681
system_scope: brain
---

# Carnival Hostbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalHostBrain` is the behavior tree controller for the Carnival Host entity. It orchestrates movement, vocalizations, and attention management based on the presence and state of minigames. It integrates with several components—including `minigame_spectator`, `minigame`, `prototyper`, `knownlocations`, and `talker`—to implement dynamic behavior such as cheering on players, wandering near home, and giving out rewards at game conclusion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("minigame_spectator")
inst:AddComponent("prototyper")
inst:AddComponent("knownlocations")
inst:AddComponent("talker")
inst:AddTag("carnival_host")
inst:AddBrain("carnival_hostbrain")
```

## Dependencies & tags
**Components used:** `minigame_spectator`, `minigame`, `prototyper`, `knownlocations`, `talker`, `health`, `sleeper`, `revivablecorpse`, `flight`.  
**Tags:** Uses internal state tags like `flight`; no explicit tags are added/removed by this brain itself.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Carnival Host entity, configuring its response to minigames and environmental state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None—assumes required components are present. Behavior may be incomplete if components like `minigame_spectator` or `prototyper` are missing.

### Helper functions (internal)
The following internal functions support behavior logic but are not exposed publicly:
- `GetFaceTargetFn(inst)` — Returns a target for `FaceEntity` if `prototyper.doers` has entries, else `nil`.
- `KeepFaceTargetFn(inst, target)` — Determines if the target should remain faced (true if in `prototyper.doers`).
- `GetHomePos(inst)` — Retrieves the "home" location from `knownlocations`.
- `GetWanderLines(inst)` — Returns a random generic announcement line from localization strings.
- `WatchingMinigame(inst)` — Returns the active minigame if the host is spectating one.
- `IsWatchingMinigameIntro(inst)` / `IsWatchingMinigameOutro(inst)` — Boolean checks for minigame state.
- `WatchingMinigame_MinDist(inst)`, `WatchingMinigame_TargetDist(inst)`, `WatchingMinigame_MaxDist(inst)` — Retrieve minigame-specific watch distances.
- `DoTossReward(inst)` — Spawns and launches a carnival prize ticket toward the active minigame.
- `OnEndOfGame(inst)` — Handles post-game cheering and reward distribution.
- `GetWatchingMinigameLines(inst)` — Returns line keys for cheering or boredom based on minigame excitement.
- `GetMinigameOutroGameLines(inst)` — Returns line keys for minigame end states.

## Events & listeners
None identified. This brain does not register or emit events directly.
