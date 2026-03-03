---
id: questowner
title: Questowner
description: Manages quest state and lifecycle events for an entity, including tracking whether a quest is active or completed, and invoking custom callbacks for begin, abandon, and complete operations.
tags: [quest, state, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 81023053
system_scope: entity
---
# Questowner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`QuestOwner` is a state-tracking component that enables an entity to participate in quest logic. It maintains boolean flags (`questing` and `questcomplete`), manages associated tags (via `inst:AddTag`/`inst:RemoveTag`), and provides hooks for custom behavior during quest start, abandon, and completion through optional callback functions. It also supports saving and loading quest state across sessions via `OnSave` and `OnLoad`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("questowner")

inst.components.questowner:SetOnBeginQuest(function(inst, doer)
    print("Quest started for", inst.prefab)
    return true, "Quest begun!"
end)

inst.components.questowner:SetOnAbandonQuest(function(inst, doer)
    print("Quest abandoned by", doer and doer.prefab or "unknown")
    return true
end)

inst.components.questowner:SetOnCompleteQuest(function(inst)
    print("Quest completed for", inst.prefab)
end)

local success, msg = inst.components.questowner:BeginQuest(player)
if success then
    inst.components.questowner:CompleteQuest()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `questing` and `questcomplete` based on state; removes both on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `on_begin_quest` | function or `nil` | `nil` | Callback invoked when `BeginQuest` is called; should return `(questing: boolean, message: string?)`. |
| `on_abandon_quest` | function or `nil` | `nil` | Callback invoked when `AbandonQuest` is called; should return `(quest_abandoned: boolean, message: string?)`. |
| `on_complete_quest` | function or `nil` | `nil` | Callback invoked when `CompleteQuest` is called; takes `(inst)` as argument. |
| `questing` | boolean | `false` | Whether the entity is currently on an active quest. |
| `questcomplete` | boolean | `false` | Whether the quest has been successfully completed. |

## Main functions
### `SetOnBeginQuest(callback)`
* **Description:** Sets the callback to execute when a quest begins. This callback is invoked from `BeginQuest`.
* **Parameters:** `callback` (function) - a function taking `(inst, doer)` and returning `(questing: boolean, message: string?)`.
* **Returns:** Nothing.

### `SetOnAbandonQuest(callback)`
* **Description:** Sets the callback to execute when a quest is abandoned. This callback is invoked from `AbandonQuest`.
* **Parameters:** `callback` (function) - a function taking `(inst, doer)` and returning `(quest_abandoned: boolean, message: string?)`.
* **Returns:** Nothing.

### `SetOnCompleteQuest(callback)`
* **Description:** Sets the callback to execute when a quest is completed. This callback is invoked from `CompleteQuest`.
* **Parameters:** `callback` (function) - a function taking `(inst)`.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleans up tags when the component is removed from an entity. Removes both `questing` and `questcomplete` tags.
* **Parameters:** None.
* **Returns:** Nothing.

### `CanBeginQuest(doer)`
* **Description:** Checks whether the quest can be started by the specified doer. Uses `CanBeginFn` if set (commented out in the current source); otherwise defaults to `true`.
* **Parameters:** `doer` (entity) - the entity attempting to begin the quest.
* **Returns:** `boolean` - `true` if allowed, `false` otherwise. (Note: `CanBeginFn` is currently unused/commented out, so this always returns `true`.)
* **Error states:** None identified.

### `BeginQuest(doer)`
* **Description:** Attempts to begin the quest. Sets `questcomplete` to `false`, calls `on_begin_quest` if set, and updates internal `questing` state and tags accordingly.
* **Parameters:** `doer` (entity) - the entity triggering the quest start.
* **Returns:** `(boolean, string?)` — `questing` state (`true` if quest started), and optionally a message string.
* **Error states:** If `on_begin_quest` returns a falsy `questing` value, `self.questing` remains `false`.

### `CanAbandonQuest(doer)`
* **Description:** Checks whether the quest can be abandoned. Uses `CanAbandonFn` if set (commented out in the current source); otherwise defaults to `true`.
* **Parameters:** `doer` (entity) - the entity attempting to abandon the quest.
* **Returns:** `boolean` — `true` if allowed, `false` otherwise. (Note: `CanAbandonFn` is currently unused, so this always returns `true`.)
* **Error states:** None identified.

### `AbandonQuest(doer)`
* **Description:** Attempts to abandon the current quest. Invokes the `on_abandon_quest` callback if defined; otherwise sets `questing` to `false` directly.
* **Parameters:** `doer` (entity) - the entity triggering the abandonment.
* **Returns:** `(boolean?, string?)` — `quest_abandoned` status and optional message. Returns `nil` if no quest was active.
* **Error states:** If `on_abandon_quest` is set and returns `quest_abandoned = false`, `self.questing` is not changed.

### `CompleteQuest()`
* **Description:** Marks the quest as completed. Sets `questing` to `false`, `questcomplete` to `true`, and invokes `on_complete_quest` if defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component's quest state for saving to disk.
* **Parameters:** None.
* **Returns:** `{ questing: boolean, questcomplete: boolean }` — a table containing current state values.

### `OnLoad(data)`
* **Description:** Loads previously saved quest state from disk. Updates `questing` and `questcomplete` accordingly and updates tags via `onquesting`/`onquestcomplete`.
* **Parameters:** `data` (table or `nil`) — a previously returned table from `OnSave`, or `nil` if no saved data exists.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** Internal setters `questing` and `questcomplete` (via metatable setters `onquesting`, `onquestcomplete`), which update tags automatically.
- **Pushes:** No events are directly fired by this component.
