---
id: notetable_dsmaintheme
title: Notetable Dsmaintheme
description: Defines the musical note sequence for the "DS Main Theme" by specifying pitch and timestamp data.
tags: [audio, music]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 219b00c0
system_scope: audio
---

# Notetable Dsmaintheme

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This script defines a static array of musical notes representing the "DS Main Theme", used for procedural music playback within the game. Each entry contains a MIDI note number and a timestamp (in seconds), forming a timeline-based sequence suitable for synchronized audio rendering. It is intended for use by music-related systems (e.g., `soundscript` or custom audio components) rather than direct entity component attachment.

## Usage example
```lua
local ds_main_theme = require("notetable_dsmaintheme")
for i, note in ipairs(ds_main_theme) do
    print(("Note %d: pitch %d at t=%.3fs"):format(i, note[1], note.t))
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable