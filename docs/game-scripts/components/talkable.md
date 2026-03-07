---
id: talkable
title: Talkable
description: Manages the conversation state for an entity, including tracking the current conversation and dialogue index.
tags: [dialogue, npc, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c22ae7d5
system_scope: entity
---

# Talkable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Talkable` is a simple component that holds state for an entity involved in a conversation. It stores the active `conversation` (a data structure defining dialogue flow) and the current `conv_index`, which tracks the position within that conversation. It is typically added to NPCs or interactive entities that participate in scripted dialogues.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("talkable")
inst.components.talkable.conversation = my_conversation_data
inst.components.talkable.conv_index = 1
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `conversation` | table? | `nil` | The current conversation data structure (e.g., a table of dialogue lines or nodes). |
| `conv_index` | number | `1` | The current index into the conversation, indicating the next dialogue segment to display. |

## Main functions
None identified — this component only stores state and does not expose public methods beyond its constructor.

## Events & listeners
None identified.
