---
id: stageactor
title: Stageactor
description: Handles narrative storytelling behavior for entities by managing story playback, line delivery, and event coordination with listeners and talker components.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 72f929ef
---

# Stageactor

## Overview
This component enables an entity to perform staged narrative acts (e.g., campfire stories) by managing story selection, dialogue delivery via a talker component, periodic tick callbacks, and coordination with nearby listeners. It tracks previously performed acts to avoid repetition and supports custom storyBegin/storyOver callbacks.

## Dependencies & Tags
- **Component Tags Added:** `"stageactor"` is added on construction and removed when the entity is destroyed.
- **Component Dependencies:** Assumes the entity has a `talker` component (used for dialogue delivery and shutdown).
- **Event Callbacks Used:** Listens for `"donetalking"` and `"onremove"` events on the host entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (assigned in constructor) | Reference to the host entity. |
| `storytelling_dist` | `number` | `10` | Radius (in units) used to find stage listeners when a story finishes. |
| `storytelling_ticktime` | `number` | `2.5` | Default interval (in seconds) for periodic story tick updates. |
| `stage` | `?` | `nil` | Optional stage context (set/get via `SetStage`/`GetStage`). |
| `story` | `?` | `nil` | Currently active story object (readable via `IsTellingStory`). |
| `story.prop` | `?` | `nil` | Reference to the story property object that triggered playback. |
| `previous_acts` | `table` | `nil` | List of previously performed story IDs; used to avoid re-delivering identical acts. |
| `storyprop_onremove` | `function` | (assigned in constructor) | Cleanup callback triggered if the story property is removed. |
| `onstorybeginfn` | `function` | `nil` | Optional callback invoked when a story begins. |
| `onstoryoverfn` | `function` | `nil` | Optional callback invoked when a story completes or is aborted. |
| `onstoryticktask` | `Task` | `nil` | Periodic task for story tick updates; cancelled on story end/abort. |

## Main Functions

### `performplay()`
* **Description:** Selects and prepares a new story (monologue) to be performed, respecting previously performed acts to avoid repetition. Falls back to generic lines if no prefab-specific monologues exist.
* **Parameters:** None.
* **Returns:** A story object containing `style`, `id`, and `lines`, or `nil` if no available story lines remain.

### `TellStory(storyprop, story)`
* **Description:** Initiates playback of a story. Constructs a list of formatted lines, triggers talker speech, schedules periodic tick updates, registers listeners for story-finished events, and invokes the `onstorybeginfn` callback if defined.
* **Parameters:**
  - `storyprop` (`?`): The property object associated with the story (e.g., a campfire); must be non-nil to proceed.
  - `story` (`table|string?`): Optional pre-defined story object; if omitted, `performplay()` is called to generate one.
* **Returns:** `true` on successful start; `false` or an error message string otherwise.

### `AbortStory(reason)`
* **Description:** Immediately terminates the current story playback. Stops the talker, cancels pending tasks, removes event listeners, and invokes the `onstoryoverfn` callback. Optionally speaks a `reason` before shutting up.
* **Parameters:**
  - `reason` (`string?`): Optional message to speak before stopping.

### `OnDone()`
* **Description:** Internal cleanup routine called after story completion or abort. Removes remaining event listeners, cancels tick tasks, invokes `onstoryoverfn`, and clears the `story` reference.
* **Parameters:** None.

### `OnStoryTick()`
* **Description:** Invoked periodically during story playback to execute the story’s `ontickfn` callback (if present).
* **Parameters:** None.

### `performedplay(story_id)`
* **Description:** Records that a story with the given ID has been performed by appending it to `previous_acts`.
* **Parameters:**
  - `story_id` (`string`): The unique identifier of the performed story.

### `IsTellingStory()`
* **Description:** Checks whether a story is currently active.
* **Parameters:** None.
* **Returns:** `true` if `self.story ~= nil`, otherwise `false`.

### `SetOnStoryBeginFn(fn)`
* **Description:** Sets a custom callback to be invoked when a story begins.
* **Parameters:**
  - `fn` (`function`): A function of the form `fn(inst, story)`.

### `SetOnStoryOverFn(fn)`
* **Description:** Sets a custom callback to be invoked when a story completes or is aborted.
* **Parameters:**
  - `fn` (`function`): A function of the form `fn(inst, story)`.

### `SetStage(stage)`
* **Description:** Sets the optional `stage` context for this actor.
* **Parameters:**
  - `stage` (`?`): Any user-defined stage data (type-agnostic).

### `GetStage()`
* **Description:** Returns the optional `stage` context previously set.
* **Parameters:** None.
* **Returns:** The stored `stage` value.

### `OnSave()`
* **Description:** Serialization helper; captures `previous_acts` for savegame persistence.
* **Parameters:** None.
* **Returns:** A table: `{ previous_acts = self.previous_acts }`.

### `OnLoad(data)`
* **Description:** Deserialization helper; restores `previous_acts` from saved data.
* **Parameters:**
  - `data` (`table?`): Saved component data, expected to include `previous_acts`.

## Events & Listeners
- **Events Listened To:**
  - `"donetalking"` → triggers `on_done_talking` → calls `self:OnDone()`.
  - `"onremove"` on the story property (`storyprop`) → triggers `self.storyprop_onremove` → calls `self:AbortStory()`.
- **Events Pushed:**
  - `"play_performed"` → pushed to all entities within `storytelling_dist` that have either `"stage"` or `"stagelistener"` tag, upon story speech completion.
  - `"donetalking"` → pushed via talker component at end of speech (handled indirectly via listener).