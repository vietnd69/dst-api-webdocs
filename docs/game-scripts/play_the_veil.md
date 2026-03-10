---
id: play_the_veil
title: Play The Veil
description: Defines the cast and script data for the "The Veil" stage play in Don't Starve Together.
tags: [theatre, script, actor]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f879c2d9
system_scope: entity
---

# Play The Veil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`play_the_veil.lua` declares static configuration data for the "The Veil" stage play, including character costume definitions, individual soliloquy scripts (`SAGE_SOLILOQUY`, `HALFWIT_SOLILOQUY`, `TOADY_SOLILOQUY`), and the full main script (`THEVEIL`). This file serves as a script data provider for the stageplay system and does not implement a component; it returns a plain table of costumes and scripts consumed by higher-level stageplay management systems (e.g., `stageplay.lua`). It relies on `play_commonfn.lua` for shared action functions.

## Usage example
This file is not used directly by mods; instead, other scripts require it to access script data:

```lua
local play_the_veil = require("play_the_veil")
local cast = play_the_veil.costumes
local script = play_the_veil.scripts["THEVEIL"]

print("Cast:", play_the_veil.starting_act) -- "THEVEIL"
print("Play title:", script.playbill)
```

## Dependencies & tags
**Components used:** None. This file does not add or manage components; it is data-only.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `costumes` | table | `{}` | Map of costume IDs (`"SAGE"`, `"HALFWIT"`, `"TOADY"`) to costume configs (including `head` mesh and localized `name`). |
| `scripts` | table | `{}` | Map of play script IDs (e.g., `"THEVEIL"`, `"SAGE_SOLILOQUY"`) to script definitions containing `cast`, `lines`, and optional metadata like `playbill` or `next`. |
| `starting_act` | string | `"THEVEIL"` | The default play script ID used to start the stageplay sequence. |

## Main functions
This file contains no functions. It exports only configuration tables.

## Events & listeners
This file contains no event listeners or event pushing logic.