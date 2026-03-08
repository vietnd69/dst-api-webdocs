---
id: SGworm_boss_tail
title: Sgworm Boss Tail
description: Manages state transitions and animation control for the tail segment of the Worm Boss entity in Don't Starve Together.
tags: [ai, boss, animation, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5c8c8133
system_scope: entity
---

# Sgworm Boss Tail

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGworm_boss_tail` is a StateGraph component that defines the behavior and animation flow for the tail segment of the Worm Boss. It handles core lifecycle states including idle looping, spitting projectiles, being hit, electrocution, and death. It works in coordination with the `WORMBOSS_UTILS` utility module (via `prefabs/worm_boss_util.lua`) to execute shared boss mechanics such as spitting and destruction. This stategraph is attached to the tail entity instance and drives its visual and behavioral state via state transitions and event handlers.

## Usage example
```lua
-- The stategraph is automatically instantiated by the game engine when the worm boss's tail prefab loads.
-- No direct instantiation or manual registration is required for modders.
-- The component is implicitly managed by the owning worm boss prefab via PrefabPostInit logic.
```

## Dependencies & tags
**Components used:** `AnimState`, `SoundEmitter`, `dirt`  
**Tags:** The stategraph defines tags dynamically per state, including: `idle`, `canrotate`, `busy`, `dead`, `electrocute`, `hit`, `noelectrocute`.

## Properties
No public properties.

## Main functions
This component is defined as a `StateGraph` return, and does not expose standalone functions beyond those inherent to the state machine API (`sg:GoToState`, `sg:HasStateTag`, etc.). All logic is implemented inline as state callbacks and event handlers.

## Events & listeners
- **Listens to:**
  - `"spit"` → transitions to `"spit"` state.
  - `"death"` → transitions to `"death"` state (if not already `dead`).
  - `"attacked"` → transitions to `"hit"` state (if not `busy`).
  - `"sync_electrocute"` → transitions to `"sync_electrocute"` state (with conditional override logic).
  - `"animover"` and `"animqueueover"` (internal animation event callbacks per state).
- **Pushes:** No events are explicitly pushed by this component.