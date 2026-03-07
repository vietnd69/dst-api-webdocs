---
id: searchable
title: Searchable
description: Provides search interaction logic for entities, including tagging, search callbacks, and removal behavior.
tags: [interaction, entity, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e49918d7
system_scope: entity
---

# Searchable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Searchable` enables an entity to respond to player-initiated search actions (e.g., clicking on an object in-world). It manages state flags that determine whether the entity can be searched (`canbesearched`, `caninteractwith`), whether the search is instant (`quicksearch` or `jostlesearch`), and how the entity behaves after being searched (e.g., removal). It integrates with the entity's tag system to signal interactivity to the UI and input systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("searchable")
inst.components.searchable.canbesearched = true
inst.components.searchable.caninteractwith = true
inst.components.searchable.quicksearch = true
inst.components.searchable.remove_when_searched = true
inst.components.searchable.onsearchfn = function(inst, searcher)
    -- Custom logic on search, e.g., spawn loot
    return true
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `searchable`, `quicksearch`, `jostlesearch` based on state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `caninteractwith` | boolean | `true` | Whether the entity can be interacted with (searched). Affects the `searchable` tag. |
| `remove_when_searched` | boolean | `false` | Whether the entity should be automatically removed after a successful search. |
| `quicksearch` | boolean | `false` | Whether the search is instant (e.g., does not require a dwell time). Affects the `quicksearch` tag. |
| `jostlesearch` | boolean | `false` | Whether the search is triggered by jostling (e.g., bumping into it). Affects the `jostlesearch` tag. |
| `canbesearched` | boolean or nil | `nil` | Whether the entity is *allowed* to be searched (e.g., not blocked by inventory, world state). Affects the `searchable` tag. |
| `onsearchfn` | function or nil | `nil` | Optional callback function `(inst, searcher)` that executes on search and returns `(success, reason)`. |

## Main functions
### `Search(searcher)`
* **Description:** Initiates a search on the entity. Checks `canbesearched` and `caninteractwith`; if both pass, executes `onsearchfn` (if present), pushes `"searched"` event, and conditionally removes the entity.
* **Parameters:** `searcher` (entity) — the entity performing the search.
* **Returns:** `true, nil` on success, or `false, reason` (from `onsearchfn`) if search fails.
* **Error states:** Returns `false` early if `canbesearched` or `caninteractwith` is `false`.

### `OnRemoveEntity()`
* **Description:** Cleanup function called when the entity is removed from the world. Removes all search-related tags from the entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns serialized state for network sync or save game.
* **Parameters:** None.
* **Returns:** `{caninteractwith = true}` if `caninteractwith` is `true`, otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores saved state on load.
* **Parameters:** `data` (table) — typically contains `caninteractwith`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current searchable state.
* **Parameters:** None.
* **Returns:** String — e.g., `"can interact with; can be searched;"`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `"searched"` — fired on successful search with `searcher` as the event data.
