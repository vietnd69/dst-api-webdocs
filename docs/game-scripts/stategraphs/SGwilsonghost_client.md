---
id: SGwilsonghost_client
title: Sgwilsonghost Client
description: Manages client-side state transitions and movement prediction for Wilson's ghost form, synchronizing animation, locomotion, and action previewing with server confirmation.
tags: [ghost, prediction, locomotion, client]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2d7c4ce3
system_scope: locomotion
---

# Sgwilsonghost Client

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwilsonghost_client` is a client-side state graph that controls Wilson's ghost movement and actions. It implements movement prediction by managing transitions between idle and run states based on locomotor input, while also handling action preview states (`haunt_pre`, `jumpin_pre`, `remoteresurrect`, `migrate`) that synchronize with server confirmation. It integrates tightly with the `locomotor` component to start/stop movement and with the entity's prediction system to adjust behavior when prediction is valid or invalidated.

## Usage example
This state graph is automatically attached by the game engine when Wilson enters ghost form (e.g., via `prefabs/wilsonghost.lua`). Modders typically do not add it manually, but may extend or override its behavior in custom ghost prefabs.

```lua
-- Not intended for direct use in mod code.
-- The state graph is constructed and returned at the bottom of the file:
-- return StateGraph("wilsonghost_client", states, events, "idle", actionhandlers)
```

## Dependencies & tags
**Components used:** `locomotor`, `player_classified` (via `inst.player_classified.currentstate`), `animstate`, `soundemitter`
**Tags:** Adds `idle`, `canrotate`, `moving`, `running`, `doing`, `busy` depending on current state; checks `nopredict` and `pausepredict`.

## Properties
No public properties are exposed by this state graph. All state logic is encapsulated in state handlers and event callbacks.

## Main functions
This state graph is defined via declarative `State` tables and returned as a `StateGraph`. It does not expose public methods. Internal helpers like `ClearCachedServerState` are used internally but are not part of a public API.

## Events & listeners
- **Listens to:**  
  - `sg_cancelmovementprediction` — transitions to `idle` with `"cancel"` to halt prediction.  
  - `locomote` — handles transitions between `idle` and `run` based on locomotor input and prediction validity; updates rotation when movement begins.  
- **Pushes:** None (this is a client-side state graph only; server coordination happens via preview buffering and server-state checks).