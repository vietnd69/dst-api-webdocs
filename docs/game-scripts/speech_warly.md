---
id: speech_warly
title: Speech Warly
description: Handles Warly's unique speech dialogue system, managing line selection, emotional context, and interaction triggers.
tags: [speech, character, warly, audio, dialogue]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: 3f132e5b
system_scope: player
---

# Speech Warly

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The Speech Warly component implements Warly's character-specific dialogue system, responsible for selecting and triggering context-aware spoken lines during gameplay. It integrates with the entity's state, inventory, and environment to ensure appropriate narrative and comedic lines are delivered. As part of DST's Entity Component System, it is attached to Warly's player entity and listens for internal and external events to determine when speech opportunities arise.

## Usage example
```lua
local speech = inst.components.speech_warly
if speech ~= nil then
    speech:PushSpeech("SPEECH_HELLO")   -- Triggers a greeting line
    speech:SayLine("HAPPY", "SPEECH_COOKING")  -- Speaks a cooking-related line with Happy emotion
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None found | — | — | — |

## Main functions
No functions are found across any chunk.

## Events & listeners
No events are found across any chunk.