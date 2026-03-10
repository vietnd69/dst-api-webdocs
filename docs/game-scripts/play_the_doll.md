---
id: play_the_doll
title: Play The Doll
description: Manages the state and animation sequence of a marionette-based theatrical performance, including scene setup, actor control, crowd interaction, and synchronized audio effects.
tags: [performance, actor, audio, animation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ffa37030
system_scope: entity
---

# Play The Doll

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `play_the_doll` component orchestrates a marionette-style stage performance by integrating external scene utilities from `play_commonfn.lua` to handle positioning, actor behavior, environment transitions, crowd feedback, and background music. It serves as the high-level coordinator for dynamic stage scenes, enabling scripted theatrical interactions involving the Doll and associated actors.

## Usage example
```lua
local fn = require("play_commonfn")

inst:AddComponent("play_the_doll")
-- Example activation call (function implementations are defined in play_commonfn)
fn.marionetteon(inst)
fn.findpositions(inst)
fn.stageon(inst)
fn.swapmask(inst, "new_mask_prefab")
fn.crowdcomment(inst, "amazed")
fn.stinger(inst)
fn.startbgmusic(inst)
-- ... perform actions ...
fn.exitbirds(inst)
fn.stageoff(inst)
fn.stopbgmusic(inst)
```

## Dependencies & tags
**Components used:**
- `play_commonfn` (external module required as `fn`)
  - Functions: `findpositions`, `marionetteon`, `actorsbow`, `callbirds`, `exitbirds`, `stageon`, `stageoff`, `stinger`, `startbgmusic`, `stopbgmusic`, `swapmask`, `crowdcomment`

**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | |

## Main functions
All functions are defined externally in `play_commonfn.lua` and invoked via the `fn` table. No local function implementations exist in this component.

## Events & listeners
No event listeners or events are defined in this component.