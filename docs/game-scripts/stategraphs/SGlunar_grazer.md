---
id: SGlunar_grazer
title: Sglunar Grazer
description: Defines the state machine logic for the Lunar Grazer boss entity, managing transitions between idle, movement, attack, hit, despawn, and capture states.
tags: [ai, boss, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b2b9a8ee
system_scope: entity
---

# Sglunar Grazer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlunar_grazer` is the stategraph for the Lunar Grazer boss entity. It orchestrates the entity's behavior—including patrolling, attacking, taking damage, melting, splatting, and being captured—via a set of named states and event-driven transitions. It leverages several core components (`combat`, `health`, `locomotor`, `gestaltcapturable`) to respond to gameplay events and manage internal state transitions based on timers, animations, and external triggers.

## Usage example
This stategraph is automatically applied to the Lunar Grazer prefab and is not directly instantiated by modders. However, modders can interact with it via events:

```lua
-- Trigger a forced despawn of the Lunar Grazer
inst:PushEvent("lunar_grazer_despawn", { force = true })

-- Force the entity to be captured and removed
inst:PushEvent("captured_despawn")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `gestaltcapturable`  
**Tags:** Uses state tags (`idle`, `busy`, `queueattack`, `caninterrupt`, `debris`, `invisible`, `temp_invincible`, `noattack`, `hit`, `moving`, `canrotate`, `softstop`) and entity tags (`NOCLICK`). Adds/removes tags dynamically during state transitions.

## Properties
No public properties. All state memory is stored internally in `inst.sg.statemem` or `inst.sg.mem`.

## Main functions
This file returns a `StateGraph` definition and defines no standalone public functions. State behavior is implemented via state callbacks (`onenter`, `onupdate`, `ontimeout`, `onexit`) and event handlers.

## Events & listeners
- **Listens to:**
  - `doattack` — Initiates attack if not busy; queues attack if `queueattack` tag is active.
  - `attacked` — Enters `hit` state unless resisting non-planar damage or busy with `nointerrupt`.
  - `minhealth` — Enters `splat` state if not debris.
  - `lunar_grazer_despawn` — Triggers `melt`, `captured_despawn`, or immediate removal.
  - `captured` — Enters `hit` if not debris or invisible.
  - `captured_despawn` — Marks for forced removal, enters `captured_despawn` state.
  - `locomote` — Triggers movement state changes (`walk_start`/`walk`/`walk_stop`) based on `locomotor` input.
  - `gestaltcapturable_targeted` — Prevents rotation and halts forward movement.
  - `animover` — Advances to next state after animation completes (used across many states).
- **Pushes:** None (does not emit events itself).