---
id: play_the_vault
title: Play The Vault
description: Defines the script data for the "The Vault" stage play, including character costumes, soliloquy variations, and full play sequence with actor lines, animations, and timed actions.
tags: [play, stage, cutscene, dialogue, animation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9384142a
system_scope: world
---

# Play The Vault

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`play_the_vault.lua` is a data definition module that specifies the content and structure of the "The Vault" stage play in Don't Starve Together. It declares three playable character costumes (`ARTIFICER`, `VISIONIST`, `ELYTRA`), individual soliloquy scripts for each, and the main `THEVAULT` play script. This data is consumed by the stageplay system to orchestrate cinematic performances involving actor positioning, speech, animations, sound effects, and special道具 (e.g., chalice, dagger). It does not implement an ECS component itself but serves as a runtime configuration source.

## Usage example
```lua
local play_data = require("play_the_vault")
-- Access defined costumes
local artificer_costume = play_data.costumes.ARTIFICER
-- Retrieve the main play script
local vault_script = play_data.scripts.THEVAULT
-- Start the play using the game's stageplay manager
TheMod:PlayScript(vault_script, play_data.starting_act)
```

## Dependencies & tags
**Components used:** None (pure data module)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `costumes` | table | (defined) | Maps costume names (`ARTIFICER`, `VISIONIST`, `ELYTRA`) to costume metadata (e.g., `head` prefab name, display `name`). |
| `scripts` | table | (defined) | Maps script names (`ARTIFICER_SOLILOQUY`, `VISIONIST_SOLILOQUY`, `ELYTRA_SOLILOQUY`, `THEVAULT`) to full script data. |
| `starting_act` | string | `"THEVAULT"` | The initial act name used to start the play sequence. |

## Main functions
*Not applicable.* This module only exports data tables and no executable functions.

## Events & listeners
*Not applicable.* This module is a static data provider and does not register or dispatch events.