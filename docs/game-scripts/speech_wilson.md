---
id: speech_wilson
title: Speech Wilson
description: Provides static speech string data for Wilson character events and states in Don't Starve Together.
tags: [audio, localization, speech, player, string]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a9253e81
system_scope: audio

---

# Speech Wilson

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Speech Wilson is a data-only Lua module that defines a flat, associative table of localized speech strings specifically for the Wilson character. It contains no executable logic, no components, no event handlers, and no runtime behavior—it serves purely as a string resource. The table is structured by entity prefabs or event contexts, with keys representing dynamic string identifiers (e.g., `"speech_event"`, `"speech_thunder"`) and values mapping to localized phrases. This data is likely loaded and referenced at runtime by the audio or speech systems to select appropriate voice lines during gameplay.

## Usage example
The module is intended for internal use by the game engine or speech-related systems (e.g., via localization or asset loaders). A typical usage in another module would resemble:

```lua
local speech_strings = require "speech_wilson"
local line = speech_strings["speech_attack"]
inst:PushEvent("speech_play", { line = line, speaker = "wilson" })
```

Note: Direct instantiation or component attachment is not applicable, as this file exposes only a static data table.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No properties are defined in this file.

## Main functions
No functions are defined in this file.

## Events & listeners
No events are defined in this file.