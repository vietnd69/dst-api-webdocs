---
id: chattynode
title: Chattynode
description: A behavior node that periodically triggers speech (chatter or spoken lines) from an entity using talker or npc_talker components, based on configurable timing and message sources.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 56e8ed1f
---

# Chattynode

## Overview
`ChattyNode` is a subclass of `BehaviourNode` used in behavior trees to orchestrate timed, conditional speech from an entity. It evaluates its single child node and, while the child is in `RUNNING` status, triggers spoken dialogue or chatter at randomly spaced intervals. It supports three modes of message delivery:
- A table of strings (legacy, host-only),
- A function returning a string (or nil),
- A string key referencing localized strings in `STRINGS`.

It prioritizes `npc_talker:Chatter` (which supports advanced chatter parameters and networked display) over `talker:Say`, depending on component availability.

## Dependencies & Tags
- **Components used:**  
  - `inst.components.talker` (for fallback `Say` calls)
  - `inst.components.npc_talker` (for advanced `Chatter` calls with chatterparams support)
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behavior node controls. |
| `chatlines` | `string | table | function` | — | Source of dialogue: a localization key, array of strings, or a function returning a string. |
| `chatter_time` | `number?` | `nil` | Chatter duration (used only with `npc_talker:Chatter`). |
| `chatter_forcetext` | `string?` | `nil` | Optional forced text override for chatter. |
| `chatter_echotochatpriority` | `0 | 1 | number?` | Controls echoing to chat (0=off, 1=on, or custom numeric priority). |
| `nextchattime` | `number?` | `0` | World time when the next chatter is allowed. Initialized to `0`. |
| `delay` | `number?` | `nil` | Base delay (in seconds) between successive chatters when child is `RUNNING`. |
| `rand_delay` | `number?` | `nil` | Random variance added to delay (scaled by `math.random()`). |
| `enter_delay` | `number?` | `nil` | Optional initial delay when the node first enters `RUNNING` state. |
| `enter_delay_rand` | `number?` | `nil` | Random variance added to the initial delay. |

## Main Functions
### `ChattyNode:Visit()`
* **Description:** Main behavior node entry point. Executes the child node, updates status, and conditionally triggers speech based on timing and child state. Called each tick while the behavior tree is active.
* **Parameters:** None.
* **Returns:** `nil` (side-effect only: updates `self.status`, schedules future chatter, and may call `Say`/`Chatter`).

## Events & Listeners
None identified.