---
id: SGspider_water
title: Sgspider Water
description: Manages the state machine for the Water Spider, handling swimming, walking, attacking, eating, and mutation transitions in both water and land environments.
tags: [ai, locomotion, combat, mutation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c8365044
system_scope: ai
---

# Sgspider Water

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGspider_water` is the stategraph implementation for the Water Spider entity, defining its behavior across movement states (walking on land vs swimming/dashing in water), combat (attacking, being hit), feeding (eating), death, and mutation. It integrates closely with the `locomotor`, `amphibiouscreature`, `combat`, `health`, `inventory`, `follower`, `timer`, and `spidermutator` components to adapt movement speed and actions based on environment (water vs land) and game state (e.g., trapped, mutating). The stategraph dynamically handles animations, sounds, and timing for both standard and specialized behaviors like ocean dashing and land-based walking.

## Usage example
This stategraph is automatically assigned to Water Spider entities via the `StateGraph("spider_water", ...)` call at the end of the file. Modders typically do not instantiate or manipulate it directly; instead, they reference or extend it when creating new spider variants or modifying water spider behavior. Example extension pattern:
```lua
local orig_states = require("stategraphs/SGspider_water")
-- Modify or add states as needed for custom behavior
```

## Dependencies & tags
**Components used:** `amphibiouscreature`, `combat`, `follower`, `health`, `inventory`, `locomotor`, `oceanfishable`, `oceanfishingrod`, `spidermutator`, `timer`  
**Tags:** `idle`, `canrotate`, `busy`, `moving`, `attack`, `mutating`, `noelectrocute`, `trapped`

## Properties
No public properties defined — this is a `StateGraph` definition, not a component with instance-scoped state.

## Main functions
### `do_mutate(inst)`
*   **Description:** Executes the mutation sequence after the `mutate` state's animation completes. Drops all inventory items, spawns a new spider of `inst.mutation_target` prefab type, preserves the leader and combat target, then removes the original instance.
*   **Parameters:** `inst` (Entity) — The spider instance undergoing mutation.
*   **Returns:** Nothing.
*   **Error states:** If `inst.mutation_target` is invalid or `SpawnPrefab` fails, no spider is spawned, and the original instance is still removed.

## Events & listeners
- **Listens to:** `attacked`, `doattack`, `locomote`, `trapped`, `mutate`, and all common events from `CommonHandlers` (e.g., `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnHop`, `OnDeath`, `OnCorpseChomped`, `OnCorpseDeathAnimOver`).  
- **Pushes:** `leaderchanged` (indirectly via `follower:SetLeader` logic), `attacked` (when eating an ocean-fishable entity), and custom events `buff_expired` (if applicable through common handlers).
