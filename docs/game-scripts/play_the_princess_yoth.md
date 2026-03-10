---
id: play_the_princess_yoth
title: Play The Princess Yoth
description: Defines the cast costumes and script sequences for the Yoth stage play scenes in Don't Starve Together.
tags: [stage, theatre, play, yoth]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8bd2ca01
system_scope: world
---

# Play The Princess Yoth

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`play_the_princess_yoth` is a data definition module that specifies the cast costumes and full script for two Yoth stage play sequences: `PRINCESS_SOLILOQUY` and `KNIGHT_SOLILOQUY`. It imports shared helper functions from `play_commonfn.lua` and structures the play data as reusable configuration tables. This module does not implement runtime logic but serves as static configuration consumed by the stage play system (e.g., via `scripts/stageplaysystem.lua` or similar).

## Usage example
```lua
local play_data = require("play_the_princess_yoth")
-- Access predefined cast costumes
local princess_costume = play_data.costumes.PRINCESS
-- Access play script for runtime execution
local play_script = play_data.scripts.PRINCESS_SOLILOQUY
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
**External dependencies:** `play_commonfn` (via `require("play_commonfn")`) — provides shared action functions (`findpositions`, `marionetteon`, `marionetteoff`, `actorsbow`, `callbirds`, `exitbirds`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `costumes` | table | see source | Maps costume name keys (`"PRINCESS"`, `"KNIGHT"`) to costume definitions containing body mesh, head mesh, and localised name. |
| `scripts` | table | see source | Maps script name keys (`"PRINCESS_SOLILOQUY"`, `"KNIGHT_SOLILOQUY"`) to full play script objects with cast list, metadata, and ordered scene lines. |
| `starting_act` | string | `"PRINCESS_SOLILOQUY"` | The default initial play script identifier used when launching the play. |

## Main functions
This module returns a plain table and does not define any callable functions or methods. All functionality is embedded in the returned data structure.

## Events & listeners
This module does not define event listeners or events. It is a passive data provider used by the stage play system.