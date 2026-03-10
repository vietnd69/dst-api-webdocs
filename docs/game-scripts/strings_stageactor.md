---
id: strings_stageactor
title: Strings Stageactor
description: Contains hardcoded narrative dialogue strings for theatrical cutscenes and soliloquies in DST’s seasonal events.
tags: [narrative, cutscene, dialogue, seasonal, audio]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 604aff18
system_scope: narrative
---

# Strings Stageactor

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`stageactor` is a data module containing static, prewritten dialogue strings for narrative cutscenes and soliloquies featured in *Don’t Starve Together*’s seasonal events, such as *Return of Them* (The Void) and *Year of the Clockwork Knight*. It is not a component and does not attach to entities; rather, it serves as a lookup table of indexed string arrays used by the UI or script logic to display in-game theater performances.

## Usage example
This module is not intended for direct instantiation. Instead, scripts reference its keys during events (e.g., when a soliloquy triggers):

```lua
local stageactor = require("strings_stageactor")
local lines = stageactor.WILSON1
for _, line in ipairs(lines) do
    print(line)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a plain Lua table (associative array) of string arrays.

## Main functions
Not applicable — this file contains only data, no functions.

## Events & listeners
Not applicable — this file contains no event listeners or event emitters.