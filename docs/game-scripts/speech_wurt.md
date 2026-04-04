---
id: speech_wurt
title: Speech Wurt
description: Contains static speech string data for the Wurt character, used for localizing and organizing her dialogue.
tags: [speech, character, localization]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: f7b1b71e
system_scope: player
---

# Speech Wurt

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file provides a centralized table of speech strings specific to the Wurt character. It defines structured dialogue data (e.g., greeting lines, idle chatter, combat quips) as Lua string constants, intended for use by the UI or speech systems to display appropriately localized text during gameplay. As a pure data file with no component logic, it does not define behavior, functions, or event handling.

## Usage example
```lua
local speech = require "speech_wurt"
print(speech.GREETING[1]) -- Outputs: "Wurt greets you"
-- In a UI or networked context, this could be used like:
-- inst.components.talker:Say(speech.COMBAT_ATTACK[random(#speech.COMBAT_ATTACK)])
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No properties are defined — this file only defines table variables containing static speech strings.

## Main functions
No functions are defined — this file contains only constant data.

## Events & listeners
No events are defined — this file does not listen for or push events.