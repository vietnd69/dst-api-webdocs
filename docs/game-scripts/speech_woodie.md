---
id: speech_woodie
title: Speech Woodie
description: Provides speech functionality specific to the Woodie character, handling werewolf transformation-related dialogue triggers and voice lines.
tags: [speech, character, werewolf]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 34367b73
system_scope: player
---

# Speech Woodie

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This component adds character-specific speech behavior for Woodie, enabling contextual voice lines and dialogue triggers related to his werewolf transformation state. It integrates with the base speech system but does not implement any standalone logic or event handling on its own — the component acts as a structural placeholder or extension point, likely defining character-specific overrides or hooks that are referenced elsewhere in the game's speech system.

## Usage example
```lua
-- Typically instantiated automatically for the Woodie character prefab
local speech_woodie = inst:AddComponent("speech_woodie")

-- The component itself does not expose public methods; usage is internal
-- It relies on external systems (e.g., stategraph, speech manager) to trigger dialogue
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
None

## Events & listeners
None
