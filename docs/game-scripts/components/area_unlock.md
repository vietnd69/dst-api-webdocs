---
id: area_unlock
title: Area Unlock
description: Tracks and updates the unlock status of specific stories associated with an entity.
tags: [progression, event, state]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 440db58a
system_scope: entity
---

# Area Unlock

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `AreaUnlock` component manages the progression state of specific stories or areas tied to an entity. It initializes a storage table for stories and listens for global area change events to update unlock status. This component is typically used to track narrative progress or region access conditions without requiring direct polling from other systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("area_unlock")
inst.components.area_unlock:RegisterStory("chapter_1")
inst.components.area_unlock:RegisterStory("chapter_2")
-- Event "changearea" would typically trigger CheckUnlock internally
local unlocked = inst.components.area_unlock:GetUnlocked()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stories` | table | `{}` | Stores the unlock state of registered stories. |
| `inst` | entity | `nil` | The entity instance that owns this component. |

## Main functions
### `CheckUnlock(area)`
*   **Description:** Internal callback triggered by the `changearea` event. It checks if the story associated with the area is registered and marked as locked, then updates it to unlocked.
*   **Parameters:** `area` (table) - Expected to contain a `story` key matching a registered story name.
*   **Returns:** Nothing.

### `RegisterStory(story)`
*   **Description:** Registers a new story identifier into the component's tracking table. Initializes the state as locked (`false`).
*   **Parameters:** `story` (string) - The unique identifier for the story or area.
*   **Returns:** Nothing.

### `GetUnlocked()`
*   **Description:** Iterates through all registered stories and returns a list of those that are currently unlocked.
*   **Parameters:** None.
*   **Returns:** table - A list of story identifiers where the state is `true`.

## Events & listeners
- **Listens to:** `changearea` - Triggers `CheckUnlock` when the area changes.
- **Pushes:** None identified.