---
id: SGcarnivalgame_herding_chick
title: Sgcarnivalgame Herding Chick
description: Manages the state machine for a herding game chick entity, controlling its idle, launched, arrival, and shutdown animations and behaviors during the summer event herding minigame.
tags: [minigame, animation, locomotion, event, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5f5fae06
system_scope: entity
---

# Sgcarnivalgame Herding Chick

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcarnivalgame_herding_chick` is a state graph that defines the behavior and animation flow for a chick participating in the summer event herding minigame. It governs transitions between idle waiting, launched jumping motion, successful arrival at home, and manual shutdown states. The state graph integrates with the `locomotor` component to halt movement during state transitions and coordinates sound, animation, and entity erasure events.

## Usage example
```lua
-- Typically instantiated automatically for chick prefabs during the herding game:
local chick = SpawnPrefab("carnivalgame_herding_chick")
-- State transitions are triggered externally:
chick.sg:GoToState("launched")  -- when the player launches the chick
chick.sg:GoToState("arived_home") -- when chick reaches destination (via event)
chick.sg:GoToState("turn_off")   -- when game ends or chick goes off-screen
```

## Dependencies & tags
**Components used:** `locomotor` (used to stop movement via `StopMoving()`)
**Tags:** Adds state tags `idle`, `busy`, `jumping`, and `death` depending on the active state.

## Properties
No public properties.

## Main functions
Not applicable. This file defines a `StateGraph`, not a component with callable methods.

## Events & listeners
- **Listens to:**
  - `carnivalgame_herding_arivedhome` — triggers `"arived_home"` state if not busy.
  - `carnivalgame_turnoff` — triggers `"turn_off"` state if not busy.
  - `animover` (per-state) — in `"arived_home"` and `"turn_off"`, calls `ErodeAway` after animation completes.
- **Pushes:**
  - `carnivalgame_herding_gothome` — fired upon entering `"arived_home"` state.

