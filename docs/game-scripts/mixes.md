---
id: mixes
title: Mixes
description: Registers predefined audio mixing configurations for different game states and contexts.
tags: [audio, state, environment]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 76d71fa3
system_scope: audio
---

# Mixes

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines named audio mixing configurations (called "mixes") used by the game's audio system. Each mix specifies relative volume levels for various audio categories (e.g., ambience, music, SFX, HUD, voice) and is registered with the `TheMixer` singleton via the `AddNewMix` method imported from `mixer.lua`. These mixes are typically activated during transitions between game states (e.g., death, pause, loading screens) to dynamically adjust the audio landscape based on context.

## Usage example
```lua
-- Trigger the "pause" audio mix with a 1-second fade and priority 4
TheMixer:SetMix("pause", 1)
```

## Dependencies & tags
**Components used:** `TheMixer` (from `mixer.lua`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
No public functions defined in this file.

## Events & listeners
This file does not define or register any event listeners or events. Audio state changes triggered by this file are handled internally by the mixer system.
(End of file documentation)