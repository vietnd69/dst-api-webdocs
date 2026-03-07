---
id: storyteller
title: Storyteller
description: Manages scripted narrative sequences for entities, controlling story activation, line delivery, and lifecycle callbacks.
tags: [narrative, dialogue, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b03a437e
system_scope: entity
---

# Storyteller

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`StoryTeller` enables an entity to deliver and manage a scripted narrative sequence — a "story" — composed of one or more dialogue lines. It coordinates with the `Talker` component to play the lines and supports custom behavior at story start, tick intervals, and completion via optional callback functions. When attached to an entity, it automatically adds the `"storyteller"` tag.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("storyteller")

inst.components.storyteller:SetStoryToTellFn(function(ent, prop)
    return {
        lines = { "Hello, traveler.", "I have a tale to tell." },
        ontickfn = function(inst, story) print("Story tick") end,
        ticktime = 2
    }
end)

inst.components.storyteller:SetOnStoryBeginFn(function(inst, story) print("Story began") end)
inst.components.storyteller:SetOnStoryOverFn(function(inst, story) print("Story ended") end)

inst.components.storyteller:TellStory({ title = "Welcome Tale" })
```

## Dependencies & tags
**Components used:** `talker` — used to speak story lines and be shut up on abort.
**Tags:** Adds `"storyteller"` on initialization; removes it on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storytelling_dist` | number | `10` | Not used in current implementation; reserved for future distance-based logic. |
| `storytelling_ticktime` | number | `2.5` | Default interval (in seconds) for story tick callbacks if `story.ticktime` is unspecified. |
| `story` | table | `nil` | Stores the currently active story object; `nil` when no story is playing. |
| `onstoryticktask` | Task | `nil` | Periodic task handle for story tick callbacks; `nil` when no story is active. |
| `storyprop_onremove` | function | see constructor | Cleanup handler attached to story properties for early termination on removal. |

## Main functions
### `SetStoryToTellFn(fn)`
*   **Description:** Assigns the function responsible for generating the story object from a property table. This function is invoked when `TellStory()` is called.
*   **Parameters:** `fn` (function) — signature: `function(inst, prop) → story or string`. Must return a story table or an error message string.
*   **Returns:** Nothing.

### `SetOnStoryBeginFn(fn)`
*   **Description:** Sets the callback invoked once when the story starts.
*   **Parameters:** `fn` (function) — signature: `function(inst, story)`.
*   **Returns:** Nothing.

### `SetOnStoryOverFn(fn)`
*   **Description:** Sets the callback invoked once when the story completes or is aborted.
*   **Parameters:** `fn` (function) — signature: `function(inst, story)`.
*   **Returns:** Nothing.

### `IsTellingStory()`
*   **Description:** Checks whether a story is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a story is in progress (`self.story ~= nil`), otherwise `false`.

### `AbortStory(reason)`
*   **Description:** Immediately terminates the current story. Optionally speaks a reason line before shutting up.
*   **Parameters:** `reason` (string?, optional) — if provided, this string is spoken via `talker:Say` before aborting; otherwise, `talker:ShutUp()` is called.
*   **Returns:** Nothing.
*   **Error states:** If no story is active (`self.story == nil`), `OnDone()` runs harmlessly with no side effects.

### `TellStory(storyprop)`
*   **Description:** Initiates a new story using the provided property table and configured callbacks. Validates story generation, queues dialogue, and starts tick tasks.
*   **Parameters:** `storyprop` (table?) — the property data passed to `storytotellfn`.
*   **Returns:** `boolean, string?` — `true` on success; `false, errorMessage` on failure (e.g., missing `storytotellfn`, invalid story object).
*   **Error states:** Returns `false, story` (where `story` is an error string) if `storytotellfn` returns `nil` or a string; story does not begin in these cases.

## Events & listeners
- **Listens to:** `donetalking` — triggers `OnDone()` when all story lines have finished speaking.
- **Listens to:** `onremove` — triggers `AbortStory()` via `storyprop_onremove` callback if the story property is removed.
- **Pushes:** None — this component does not fire custom events.
