---
id: speech_wendy
title: Speech Wendy
description: A data-only module containing Wendy-specific speech strings for items, structures, and entities across Don't Starve Together.
tags: [speech, character, data, wendy, localization]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: 0d370568
system_scope: player
---

# Speech Wendy

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`speech_wendy.lua` is a data-only Lua module that defines character-specific speech strings for Wendy in Don't Starve Together. It does not implement any functional logic, components, event handlers, or runtime behaviors. Instead, it serves as a static lookup table (likely part of a larger `_G.SpeechStrings` structure) mapping game asset names (e.g., items, entities, structures) to dialogue lines that Wendy says when interacting with or observing them. The file contains only string literals grouped by category across various content packs, including Quagmire, Winona, Wormwood, Walter, Wigfrid, Webber, Wortox, and YOTB content.

## Usage example
Typical usage involves referencing this data via the global speech system, not direct calls:

```lua
-- The speech system internally retrieves lines like this:
local line = _G.SpeechStrings[ "wendy" ][ asset_name ]
if line then
    inst.components.speech:Say(line)
end
```

This file itself is not instantiated or called directly; it is `require`d by the speech system at startup to populate the global speech dictionary.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No properties defined.

## Main functions
No functions defined.

## Events & listeners
No events defined.