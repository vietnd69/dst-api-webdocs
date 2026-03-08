---
id: SGcattoy_mouse
title: Sgcattoy Mouse
description: Defines the state graph for the cat toy mouse entity, handling idle movement and running animation/audio states.
tags: [locomotion, audio, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1413d259
system_scope: entity
---

# Sgcattoy Mouse

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcattoy_mouse` defines the state graph for the cat toy mouse entity (typically used as a pet or interactive object). It manages two core behaviors: an idle state with no motion or looping sound, and a running state that triggers a specific looping sound effect ("summerevent/carnival_games/herding_station/chicks/LP") and likely activates locomotion logic via `CommonHandlers.OnLocomote`.

## Usage example
```lua
local inst = SpawnPrefabs["cattoy_mouse"]
-- The state graph is applied automatically when the entity is instantiated
-- No manual setup is required beyond spawning the prefab
```

## Dependencies & tags
**Components used:** `soundemitter`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This file defines only the state graph structure and does not expose custom functions beyond the return value.

## Events & listeners
- **Listens to:** `CommonHandlers.OnLocomote(true, false)` — enables locomotion handling (motion-based state transitions) without directional constraints.
- **Pushes:** None identified.