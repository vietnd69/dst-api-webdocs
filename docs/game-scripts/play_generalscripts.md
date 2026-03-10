---
id: play_generalscripts
title: Play Generalscripts
description: Defines playback-ready script data for stage actor performances in DST, mapping character names, dialogue lines, animations, and action functions to structured timelines.
tags: [stage, actor, dialogue, script]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 1d7552e8
system_scope: entity
---

# Play Generalscripts

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`play_generalscripts.lua` is a data module that exports a table of pre-defined performance scripts for stage actors (e.g., characters appearing in stage plays). Each script contains an ordered list of `lines`, each specifying a role (character), duration, spoken dialogue (via `STRINGS.STAGEACTOR`), optional animation sequences, and/or custom action functions (imported from `play_commonfn.lua`). It is consumed by the stage play system to orchestrate cinematic actor sequences, not by entities at runtime as a traditional component.

## Usage example
```lua
-- Example: Retrieving and using a character’s script in a stage play context
local scripts = require("play_generalscripts")

-- Get Wilson’s default script
local wilson_script = scripts.WILSON1

-- Iterate through lines to execute actions/animations
for _, line in ipairs(wilson_script.lines) do
    if line.actionfn then
        line.actionfn(line)
    end
end
```

## Dependencies & tags
**Components used:** None. This module is pure data and does not interact with the ECS.  
**Tags:** None identified.

## Properties
No public properties. The module exports a single table `general_scripts` containing named script constants (e.g., `WILSON1`, `BAD_COSTUMES`). Each entry is a table with the following structure:

| Key      | Type       | Description |
|----------|------------|-------------|
| `cast`   | table of strings | Required character tags (e.g., `{ "wilson" }` or `{ "ERROR" }`). |
| `lines`  | array of line definitions | Ordered sequence of performance steps, each potentially containing `actionfn`, `duration`, `line`, `anim`, and other optional parameters. |

## Main functions
Not applicable. This file contains no functions; it exports static script data.

## Events & listeners
Not applicable. No events are registered or fired by this module.