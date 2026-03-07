---
id: npc_talker
title: Npc Talker
description: Manages a queue of NPC dialogue lines and associated sounds for sequential, non-blocking speech.
tags: [dialogue, queue, npc, audio]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b68f7eaa
system_scope: entity
---

# Npc Talker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Npc_talker` implements a dialogue queue system for non-player characters (NPCs), allowing multiple lines of speech to be scheduled and played in order. It works in conjunction with the `talker` component to execute lines sequentially, using `Talker:Say` or `Talker:Chatter` internally. It supports both raw string lines and structured `CHATTER` entries (using `strtbl` keys), and optionally plays distinct sounds per line. Queuing behavior can be overridden or stompable (new high-priority lines cancel the existing queue).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("npc_talker")
inst:AddComponent("talker")

-- Queue multiple lines with optional sound
inst.components.npc_talker:Say({"Hello there.", "How are you?"}, false, false, "sfx NPC hello")
inst.components.npc_talker:Chatter("NPC.GREETING", 1, CHATPRIORITIES.LOW, false, false, "sfx npc greet")

-- Start playback (typically called externally, e.g., on an event)
inst:ListenForEvent("start_npc_speak", function() inst.components.npc_talker:donextline() end)
```

## Dependencies & tags
**Components used:** `talker` (via `self.inst.components.talker`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queue` | table | `{}` | List of lines to be spoken, each either a string or `{strtbl, index, chatpriority}`. |
| `soundqueue` | table | `{}` | Parallel list of sound strings (or `false`) corresponding to each queued line. |
| `default_chatpriority` | number | `CHATPRIORITIES.NOCHAT` | Fallback priority for `Chatter` calls when none is specified. |
| `stompable` | boolean | `false` | Flag indicating if a stompable line was last added and should be overridden by subsequent stompable lines. |

## Main functions
### `Say(lines, override, stompable, sound)`
*   **Description:** Adds one or more dialogue lines to the queue. Supports raw strings or tables of strings. A single optional sound can be associated with the first line; subsequent lines default to no sound unless specified in bulk.
*   **Parameters:**
    *   `lines` (string or table of strings) – Line(s) to add to the queue.
    *   `override` (boolean) – If `true`, clears the current queue before adding new lines.
    *   `stompable` (boolean) – If `true` and queue is non-empty, ignores the new lines; if lines are added, marks the queue as stompable.
    *   `sound` (string or `nil`) – Optional sound effect name to play with the *first* line.
*   **Returns:** Nothing.
*   **Error states:** Returns early without adding lines if `stompable` is `true` and the queue is non-empty.

### `Chatter(strtbl, index, chatpriority, override, stompable, sound)`
*   **Description:** Adds one or more localized `CHATTER` entries to the queue by resolving `strtbl` (e.g., `"NPC.GREETING"`) against `STRINGS`. If `index` is omitted and the resolved entry is an array, all entries are queued.
*   **Parameters:**
    *   `strtbl` (string or `nil`) – Dot-separated key path into `STRINGS` (e.g., `"NPC.GREETING"`).
    *   `index` (number or `nil`) – Specific index to use from the resolved string table; if omitted and multiple lines exist, all are queued.
    *   `chatpriority` (number or `nil`) – Chat priority (e.g., `CHATPRIORITIES.LOW`); defaults to `default_chatpriority`.
    *   `override` (boolean) – If `true`, clears the current queue before adding new lines.
    *   `stompable` (boolean) – If `true` and queue is non-empty, ignores new lines; if added, marks the queue as stompable.
    *   `sound` (string or `nil`) – Optional sound effect name for the first line; subsequent queued lines default to no sound.
*   **Returns:** Nothing.
*   **Error states:** Returns early without adding lines if `strtbl` resolves to `nil`, or if `stompable` is `true` and the queue is non-empty.

### `haslines()`
*   **Description:** Checks whether the queue contains any lines waiting to be spoken.
*   **Parameters:** None.
*   **Returns:** `true` if `#queue > 0`; otherwise `false`.

### `resetqueue()`
*   **Description:** Empties both the `queue` and `soundqueue`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `donextline()`
*   **Description:** Plays the next line in the queue, removing it from the front after execution. Plays associated sound if present, and delegates to `talker:Say` or `talker:Chatter` depending on line format.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `queue` is empty. Does not automatically trigger the next line after completion; external event handling (e.g., `"done_npc_talk"`) is expected to call this method again.

## Events & listeners
- **Listens to:** None (explicit listener for `"done_npc_talk"` is commented out in source).
- **Pushes:** None.
