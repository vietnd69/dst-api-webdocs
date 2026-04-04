---
id: speech_wortox
title: Speech Wortox
description: Manages speech-related logic for the Wortox character, including speech activation and interaction triggers.
tags: [speech, character, audio, player, interaction]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: 8c658ca4
system_scope: player
---

# Speech Wortox

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `speech_wortox` component implements voice line logic specific to the Wortox character in Don't Starve Together. It handles conditions under which Wortox speaks—such as during combat, consumption, or other actions—and integrates with the game's speech system to trigger appropriate audio feedback. The component is designed as a self-contained entity component with no external dependencies and does not emit or listen for events on its own.

## Usage example
```lua
-- Typically added automatically to the Wortox prefab instance during character initialization
inst:AddComponent("speech_wortox")

-- No direct API interaction is required at runtime
-- Speech behavior is automatically triggered by game events (e.g., combat, eating)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | | | |

## Main functions
(no functions found in component)

## Events & listeners
(no events found)