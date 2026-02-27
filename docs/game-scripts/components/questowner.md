---
id: questowner
title: Questowner
description: Manages quest state (begin, abandon, complete) for an entity and maintains associated tags and callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 81023053
---

# Questowner

## Overview
The `QuestOwner` component tracks and controls the quest state of an entity (e.g., a player or NPC). It stores whether the entity is currently on a quest (`questing`) or has completed one (`questcomplete`), manages associated game tags (`questing`, `questcomplete`), and invokes custom logic via configurable callbacks for quest actions.

## Dependencies & Tags
- **Adds/Removes Tags:** `questing`, `questcomplete`
- **No components added or required explicitly** in the constructor or logic.
- **Optional callback properties** (`CanBeginFn`, `CanAbandonFn`) are commented out and unused; thus no functional dependencies.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `on_begin_quest` | `function?` | `nil` | Callback invoked when `BeginQuest()` is called; returns `(questing: boolean, message: string?)`. |
| `on_abandon_quest` | `function?` | `nil` | Callback invoked when `AbandonQuest()` is called; returns `(quest_abandoned: boolean, message: string?)`. |
| `on_complete_quest` | `function?` | `nil` | Callback invoked when `CompleteQuest()` is called (no return). |
| `questing` | `boolean` | `false` | Current state indicating if the entity is on an active quest. |
| `questcomplete` | `boolean` | `false` | Current state indicating if the entity has completed a quest. |

## Main Functions

### `SetOnBeginQuest(on_begin_quest)`
* **Description:** Sets the callback function executed when a quest is started.
* **Parameters:**
  - `on_begin_quest`: Function with signature `(self.inst, doer) → (questing: boolean, message: string?)`.

### `SetOnAbandonQuest(on_abandon_quest)`
* **Description:** Sets the callback function executed when a quest is abandoned.
* **Parameters:**
  - `on_abandon_quest`: Function with signature `(self.inst, doer) → (quest_abandoned: boolean, message: string?)`.

### `SetOnCompleteQuest(on_complete_quest)`
* **Description:** Sets the callback function executed when a quest is completed.
* **Parameters:**
  - `on_complete_quest`: Function with signature `(self.inst)` (no return value).

### `OnRemoveFromEntity()`
* **Description:** Removes the `questing` and `questcomplete` tags from the entity when the component is removed.
* **Parameters:** None.

### `CanBeginQuest(doer)`
* **Description:** Checks whether the entity is allowed to begin a quest. Returns `true` if no restriction function (`CanBeginFn`) is defined, or if the restriction function returns `true`.
* **Parameters:**
  - `doer`: The entity attempting to begin the quest.

### `BeginQuest(doer)`
* **Description:** Attempts to begin a quest by invoking the `on_begin_quest` callback (if set). Resets `questcomplete` to `false`. Returns the resulting questing state and an optional message.
* **Parameters:**
  - `doer`: The entity initiating the quest.
* **Returns:** `(questing: boolean, message: string?)`.

### `CanAbandonQuest(doer)`
* **Description:** Checks whether the entity is allowed to abandon the current quest. Returns `true` if no restriction function (`CanAbandonFn`) is defined, or if the restriction function returns `true`.
* **Parameters:**
  - `doer`: The entity attempting to abandon the quest.

### `AbandonQuest(doer)`
* **Description:** Attempts to abandon the current quest. Invokes `on_abandon_quest` callback if set; otherwise, simply sets `questing = false`. Returns abandonment result and message if applicable.
* **Parameters:**
  - `doer`: The entity abandoning the quest.
* **Returns:** `(quest_abandoned: boolean?, message: string?)` — returns `nil` if no quest was in progress.

### `CompleteQuest()`
* **Description:** Marks the quest as completed (`questing = false`, `questcomplete = true`) and invokes the `on_complete_quest` callback (if set).
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the current quest state (`questing`, `questcomplete`) for saving.
* **Parameters:** None.
* **Returns:** `table` with keys `questing` (boolean) and `questcomplete` (boolean).

### `OnLoad(data)`
* **Description:** Restores the quest state from saved data.
* **Parameters:**
  - `data`: Table containing `questing` and/or `questcomplete` fields (defaults to `false` if missing).

## Events & Listeners
- Listens to internal property updates via `Class` meta-table listeners:
  - `questing` property triggers `onquesting(self, questing)` → adds/removes `"questing"` tag.
  - `questcomplete` property triggers `onquestcomplete(self, questcomplete)` → adds/removes `"questcomplete"` tag.
- No external events are listened for or pushed via `inst:ListenForEvent`/`inst:PushEvent`.