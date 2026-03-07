---
id: chattynode
title: Chattynode
description: A behavior node that periodically triggers speech or chatter from an entity during AI behavior execution.
tags: [ai, dialogue, behavior]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 56e8ed1f
system_scope: brain
---

# Chattynode

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Chattynode` is a behavior tree node that integrates speech or chatter logic into AI behavior execution. It is used to make non-player characters speak at timed intervals while the behavior tree is running. The node supports multiple input formats for chat content (static strings, functions returning strings, or tables of strings) and adapts to either `npc_talker` or `talker` components depending on availability. It manages timing for initial entry delays and repeated chatter intervals, and uses the behavior tree's sleep mechanism to avoid re-checking until the next scheduled chatter time.

## Usage example
```lua
-- Attach to an entity with npc_talker or talker component
local inst = CreateEntity()
inst:AddComponent("npc_talker")

-- Create a chatty node that speaks every 8–12 seconds after an initial 2-second delay
local chatty_node = ChattyNode(
    inst,
    "CHARACTER.DIALOGUE_GREETING", -- string table path
    nil, -- child node (optional)
    8,   -- delay between chats
    4    -- random delay variation
)
```

## Dependencies & tags
**Components used:** `npc_talker` (preferred), `talker` (fallback)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this node is attached to. |
| `chatlines` | string, table, or function | — | Chat content source: string table path, table of strings, or a function returning a string. |
| `chatter_time` | number | `nil` | Time (in seconds) for the chatter (only set if `chatlines.chatterparams` exists). |
| `chatter_forcetext` | boolean | `nil` | Whether to force display of text (only set if `chatlines.chatterparams` exists). |
| `chatter_echotochatpriority` | boolean or number | `nil` | Chat priority override (only set if `chatlines.chatterparams` exists). |
| `nextchattime` | number | `0` | Timestamp for next allowed chatter; updated after each chatter. |
| `delay` | number | `10` (default in Visit) | Base delay in seconds between successive chatters. |
| `rand_delay` | number | `10` (default in Visit) | Maximum random additional delay in seconds added to `delay`. |
| `enter_delay` | number | `0` | Delay applied only the first time the node enters the RUNNING state. |
| `enter_delay_rand` | number | `0` | Random variation (seconds) added to `enter_delay`. |

## Main functions
### `Visit()`
*   **Description:** Executes the behavior node logic. Visits the child node, tracks running state, and triggers speech or chatter at scheduled intervals based on `delay` and `rand_delay`. Uses `Sleep()` when waiting until the next chatter time.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May fail to speak if no `npc_talker` or `talker` component exists; no error is raised, but the speech call is silently skipped. If `chatlines` is a table with zero entries, `dumptable()` is called to aid debugging.

## Events & listeners
None identified.
