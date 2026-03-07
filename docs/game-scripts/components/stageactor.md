---
id: stageactor
title: Stageactor
description: Manages narrative storytelling and monologue performance for interactive stage actors in the game world.
tags: [npc, narrative, dialogue, stage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 72f929ef
system_scope: entity
---

# Stageactor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stageactor` enables an entity to perform narrative monologues or stage plays, typically for interactive NPCs in environments such as campfires or story settings. It coordinates with the `talker` component to deliver dialogue lines and manages storytelling state, including callbacks for story lifecycle events (begin, tick, end) and persistence across saves.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stageactor")
inst:AddComponent("talker")

inst.components.stageactor:SetOnStoryBeginFn(function(inst, story) 
    print("Story '" .. story.id .. "' began")
end)

inst.components.stageactor:SetOnStoryOverFn(function(inst, story) 
    print("Story '" .. story.id .. "' ended")
end)

inst.components.stageactor:TellStory(some_prop, {
    style = "CAMPFIRE",
    id = "my_story",
    lines = { "Hello world!", { line = "How are you?", duration = 3 } }
})
```

## Dependencies & tags
**Components used:** `talker`  
**Tags:** Adds `stageactor` when initialized; removes `stageactor` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storytelling_dist` | number | `10` | Distance radius used to find listeners when a story finishes. |
| `storytelling_ticktime` | number | `2.5` | Default interval (seconds) for story `ontickfn` callbacks. |
| `story` | table or `nil` | `nil` | Current story being told, or `nil` if not telling a story. |
| `previous_acts` | table or `nil` | `nil` | List of story IDs already performed (used to avoid repeats). |
| `onstorybeginfn` | function or `nil` | `nil` | Callback invoked when a story starts. |
| `onstoryoverfn` | function or `nil` | `nil` | Callback invoked when a story ends. |
| `stage` | any | `nil` | Optional stage context reference. |

## Main functions
### `performplay()`
* **Description:** Selects a random unused story monologue from `STRINGS.STAGEACTOR` for this entity. Updates `previous_acts` and removes previously performed stories from the selection pool.  
* **Parameters:** None.  
* **Returns:** `{ style = string, id = string, lines = table }` — story configuration table — or `nil` if no stories remain available.  
* **Error states:** Returns `nil` when no story lines are defined for the entity or all stories have been exhausted.

### `TellStory(storyprop, story)`
* **Description:** Begins telling a story by delivering lines via `talker:Say`, setting up tick callbacks, and registering event listeners.  
* **Parameters:**  
  - `storyprop` (any) — the story property/trigger object; used to listen for `onremove`.  
  - `story` (table or `nil`) — optional explicit story table; if omitted, `performplay()` is called to generate one.  
* **Returns:** `true` if a story was started; `false` otherwise.  
* **Error states:** Returns `false` immediately if `storyprop` is `nil`, or if story generation (`performplay`) yields `nil` or a string (interpreted as an error).

### `AbortStory(reason)`
* **Description:** Immediately terminates the current story, shuts up talking, and triggers cleanup.  
* **Parameters:**  
  - `reason` (string or `nil`) — optional fallback line to say upon aborting.  
* **Returns:** Nothing.

### `OnDone()`
* **Description:** Performs internal cleanup after a story finishes or is aborted (removes listeners, cancels tick tasks, triggers `onstoryoverfn`).  
* **Parameters:** None.  
* **Returns:** Nothing.

### `SetOnStoryBeginFn(fn)`
* **Description:** Registers a callback invoked when a story begins.  
* **Parameters:**  
  - `fn` (function) — signature: `function(inst, story)`.  
* **Returns:** Nothing.

### `SetOnStoryOverFn(fn)`
* **Description:** Registers a callback invoked when a story ends (either successfully or via `AbortStory`).  
* **Parameters:**  
  - `fn` (function) — signature: `function(inst, story)`.  
* **Returns:** Nothing.

### `IsTellingStory()`
* **Description:** Checks whether a story is currently in progress.  
* **Parameters:** None.  
* **Returns:** `true` if `self.story` is non-`nil`; otherwise `false`.

### `SetStage(stage)`
* **Description:** Sets the `stage` field to an arbitrary context reference (e.g., scene object).  
* **Parameters:**  
  - `stage` (any) — arbitrary reference data.  
* **Returns:** Nothing.

### `GetStage()`
* **Description:** Returns the stored `stage` reference.  
* **Parameters:** None.  
* **Returns:** `self.stage` (any).

### `OnSave()`
* **Description:** Returns serialized state for saving.  
* **Parameters:** None.  
* **Returns:** `{ previous_acts = table or nil }`.

### `OnLoad(data)`
* **Description:** Restores saved state from `OnSave`.  
* **Parameters:**  
  - `data` (table or `nil`) — saved data structure.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `donetalking` — fires `OnDone()` when speech completes.  
  - `onremove` (on `storyprop`) — fires `AbortStory()` if the story property is removed.  
- **Pushes:**  
  - None directly; but `TellStory` causes listener entities (tags `"stage"` or `"stagelistener"`) to receive `play_performed` on story finish.
