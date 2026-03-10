---
id: speech_walter
title: Speech Walter
description: A self-contained speech database for the Walter character that maps interaction events to localized string values, used elsewhere in the codebase.
tags: [speech, audio, character, localization, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: fac6fab6
system_scope: player
---

# Speech Walter

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `speech_walter.lua` file is a data-only component that defines a set of top-level dictionary tables containing localized speech strings for the Walter character. These tables map keys—such as `WINTER_TREE`, `LAVAARENA_PORTAL`, and others—to localized string values and are used by external systems (e.g., stategraphs or interaction handlers) to play appropriate voice lines in response to game events. The file contains no executable logic, no components, no functions, no event handlers, and no dependencies; it serves purely as a static dictionary resource.

## Usage example
The following is an example of how an external system might reference and use entries from this speech database:

```lua
local speech = require "speech_walter"
local key = "WINTER_TREE"
if speech[key] ~= nil then
    inst.SoundEmitter:PlaySound("dontstarve/character/walter/talk_" .. key, nil, nil, true)
end
```

Note: In practice, the actual sound playing is typically handled via the `OnInspect` or `OnInteract` callbacks, which use this dictionary to retrieve the correct localized key for triggering speech.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `WINTER_TREE` | `table<string`, string> | N/A | Dictionary of localized strings keyed by language/region (e.g., `"EN"` → `"The evergreen tree...") for the Winter Tree speech. |
| `LAVAARENA_PORTAL` | ``table<string``, string> | N/A | Dictionary of localized strings for the Lava Arena portal speech. |
| *(Other keys)* | ``table<string``, string> | N/A | Additional speech dictionaries (e.g., for specific events or inspect targets). See source for full list. |

## Main functions
None.

## Events & listeners
None.