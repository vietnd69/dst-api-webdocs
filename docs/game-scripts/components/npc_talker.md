---
id: npc_talker
title: Npc Talker
description: Manages NPC speech queuing and sequencing, including string resolution, sound playback, and priority-based queue handling.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b68f7eaa
---

# Npc Talker

## Overview
This component handles speech queuing and sequencing for NPCs. It stores spoken lines (as raw strings or localization keys) and associated sounds in an ordered queue, then processes them sequentially—respecting priority and stomp rules—to trigger actual speech via the `talker` component. It supports queuing multiple lines, overriding or stompable priority, and optional sound effects per line.

## Dependencies & Tags
- **Component Dependencies:**
  - `inst.components.talker` (required by `donextline()` to execute speech)
  - `inst.SoundEmitter` (required by `donextline()` to play optional sounds)
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queue` | `table` | `{}` | Queue of lines to speak; each entry is either a string or a table `{ localization_key, index?, chatpriority? }`. |
| `soundqueue` | `table` | `{}` | Parallel queue matching `queue`; holds optional sound string for each line, or `false`. |
| `default_chatpriority` | `number` | `CHATPRIORITIES.NOCHAT` | Default priority used when no explicit priority is specified in `Chatter()`. |
| `stompable` | `boolean` | `false` | Internal flag indicating whether the current/next queued speech can be interrupted/stomped by higher-priority speech. |

*Note: No `_ctor` is explicitly defined; all properties are initialized directly in the constructor function.*

## Main Functions

### `Say(lines, override, stompable, sound)`
* **Description:** Adds raw string(s) to the speech queue. Supports single string or table of strings. Optionally triggers a sound effect for the first line.
* **Parameters:**
  - `lines` (string or table): One or more lines to queue.
  - `override` (boolean): If true, clears existing queue before adding.
  - `stompable` (boolean): If true and queue is non-empty, queue is skipped; sets `stompable = true` if added.
  - `sound` (string? optional): Sound to play alongside the first added line.

### `Chatter(strtbl, index, chatpriority, override, stompable, sound)`
* **Description:** Adds localized string(s) from `STRINGS` to the speech queue. Resolves path (e.g., `"npcs.wilson.greeting"`) via dotted key traversal. Supports single or multiple lines.
* **Parameters:**
  - `strtbl` (string): Dot-separated path to a localization string (e.g., `"dialogue.wilson.hello"`).
  - `index` (number? optional): Specific index to speak if multiple exist; if omitted and `STRINGS[... ]` is an array, all lines are queued.
  - `chatpriority` (number? optional): Priority level for the speech; defaults to `self.default_chatpriority`.
  - `override` (boolean): If true, clears existing queue before adding.
  - `stompable` (boolean): If true and queue is non-empty, queue is skipped; sets `stompable = true` if added.
  - `sound` (string? optional): Sound to play with the first added line.

### `haslines()`
* **Description:** Returns whether the speech queue contains any lines.
* **Returns:** `boolean` — `true` if `#self.queue > 0`, else `false`.

### `resetqueue()`
* **Description:** Empties both the `queue` and `soundqueue` arrays.

### `donextline()`
* **Description:** Plays the next line in the queue using the `talker` component. Also plays the corresponding sound (if any). Removes the processed line from both queues.
* **Parameters:** None.

## Events & Listeners
- **ListenForEvent:** None currently active (an old `done_npc_talk` listener is commented out).  
- **PushEvent:** None identified.