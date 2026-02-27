---
id: storyteller
title: Storyteller
description: Manages narrative storytelling for an entity, including dialogue delivery, story lifecycle callbacks, and automatic cleanup on removal.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b03a437e
---

# Storyteller

## Overview
This component enables an entity to deliver storylines through scripted dialogue sequences. It handles story setup, line-by-line speech via the `talker` component, periodic tick callbacks during storytelling, and proper event listening/cleanup. It supports custom story definitions via user-provided functions and ensures robust termination of active stories (e.g., on entity removal or manual abort).

## Dependencies & Tags
- Requires the `talker` component (used to speak story lines).
- Automatically adds the `"storyteller"` tag to the entity on initialization and removes it on removal from entity.
- Listens for `donetalking` and `onremove` events.
- Registers a removal listener on the `story.prop` property if provided.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storytelling_dist` | number | `10` | Not used in current implementation; possibly legacy or reserved for future use. |
| `storytelling_ticktime` | number | `2.5` | Default tick interval (in seconds) between `ontickfn` callbacks if not overridden per story. |
| `storytotellfn` | function? | `nil` | User-defined function `(inst, storyprop) → story|nil|string` that generates the story data. Returning `nil` or a string aborts storytelling (string = error message). |
| `onstorybeginfn` | function? | `nil` | Callback invoked when a story starts: `(inst, story) → nil`. |
| `onstoryoverfn` | function? | `nil` | Callback invoked when a story completes (either finishes or is aborted): `(inst, story) → nil`. |
| `story` | table? | `nil` | Active story data object, populated only while storytelling is in progress. Contains `lines`, `ontickfn`, `ticktime`, and `prop` keys. |
| `storyprop_onremove` | function | `(prop) → self:AbortStory()` | Internal callback used to abort the story if the `story.prop` object is removed from the world. |

## Main Functions

### `SetStoryToTellFn(fn)`
* **Description:** Sets the function responsible for generating the story data when `TellStory` is called.  
* **Parameters:**  
  - `fn`: A function accepting `(inst, storyprop)` and returning either:  
    - A valid story table (with `lines`, optional `ontickfn`, and optional `ticktime`),  
    - `nil`, or  
    - A string error message.

### `SetOnStoryBeginFn(fn)`
* **Description:** Registers a callback to be invoked immediately after story lines begin speaking.  
* **Parameters:**  
  - `fn`: A function `(inst, story) → nil`.

### `SetOnStoryOverFn(fn)`
* **Description:** Registers a callback to be invoked when a story ends (either normally or via abort). The `story` object may be `nil` if aborted before completion.  
* **Parameters:**  
  - `fn`: A function `(inst, story) → nil`.

### `IsTellingStory()`
* **Description:** Returns whether a story is currently in progress.  
* **Returns:** `boolean` — `true` if `self.story ~= nil`, otherwise `false`.

### `AbortStory(reason)`
* **Description:** Immediately terminates the active story, optionally speaking a final line via `talker`. Cleans up state and triggers `onstoryoverfn`.  
* **Parameters:**  
  - `reason`: Optional string — if provided, the storyteller entity will speak it before stopping; otherwise, it stops silently.

### `OnDone()`
* **Description:** Internal cleanup function that cancels pending tasks, removes event listeners, invokes `onstoryoverfn`, and clears `self.story`. Called by `AbortStory` and automatically when the last line finishes speaking.  
* **Parameters:** None.

### `OnStoryTick()`
* **Description:** Invokes the story’s `ontickfn` callback (if defined) at the configured interval (`story.ticktime` or `storytelling_ticktime`).  
* **Parameters:** None.

### `TellStory(storyprop)`
* **Description:** Initiates a storytelling sequence. Validates and processes the story definition, speaks the lines, sets up tick callbacks and event listeners, and triggers `onstorybeginfn`.  
* **Parameters:**  
  - `storyprop`: A prop object passed to `storytotellfn` to generate the story.  
* **Returns:** `boolean, string?` — `true` on success; `false, reason` (string) on failure (e.g., missing `storytotellfn`, story generation returned `nil` or error string).

## Events & Listeners
- Listens to:
  - `"donetalking"` — triggers `on_done_talking`, which calls `OnDone()` to finish the story after all lines have spoken.
  - `"onremove"` — on the entity itself, triggers `self.storyprop_onremove` (i.e., `AbortStory()`).
  - `"onremove"` — on the `story.prop` object (if provided), also triggers `self.storyprop_onremove`.
- Triggers:
  - None directly (events are consumed internally).