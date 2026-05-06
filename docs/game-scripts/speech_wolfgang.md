---
id: speech_wolfgang
title: Speech Wolfgang
description: Initializes and manages Wolfgang-specific dialogue strings for player character speech events.
tags: [speech, player, localization]
sidebar_position: 10

last_updated: 2026-04-18
build_version: 722832
change_status: data_patched
category_type: root
source_hash: 243a867b
system_scope: player
---

# Speech Wolfgang

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines a static dictionary of localized dialogue strings used by the player character Wolfgang during various gameplay events (e.g., using specific food items, encountering certain entities, or reacting to game actions). It contributes to the `speech` system's global dictionary by populating Wolfgang's unique set of response strings, identified by keys such as `"KABOBS"`, `"KILLERBEE"`, `"MANDRAKE"`, and others. The component itself is not an ECS component but a configuration/data module that seeds the broader speech infrastructure.

## Usage example
The file is loaded during game initialization as part of the character speech configuration. An example of how it integrates is shown below (pseudo-code, not from the file itself):
```lua
-- In speech.lua or character init logic
if GLOBAL.Speech ~= nil then
    GLOBAL.Speech.WOLFGANG = require "speech_wolfgang"
end
-- Later, when Wolfgang uses a KABOBS item:
if inst.sg.currentstate.name == "EAT" and inst.components.eater.foodname == "kabobs" then
    inst:PushEvent("speak", { speechkey = "KABOBS" })
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | | | |

## Main functions
No functions are defined in this file. It contains only top-level table assignments initializing a dictionary of speech strings.

## Events & listeners
No events are listened to or pushed by this file.