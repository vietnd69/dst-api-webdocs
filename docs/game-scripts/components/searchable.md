---
id: searchable
title: Searchable
description: Adds search interaction capabilities to an entity, allowing players or other entities to search it and optionally receive items or trigger custom logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e49918d7
---

# Searchable

## Overview
The `Searchable` component enables an entity to be searched by players or other entities. It manages the conditions under which the entity can be searched (`canbesearched` and `caninteractwith`), supports optional removal after a successful search, and provides hooks for custom search behavior via a user-defined callback function (`onsearchfn`). It also handles associated tags (`searchable`, `quicksearch`, `jostlesearch`) to integrate with the game's interaction and UI systems.

## Dependencies & Tags
**Tags managed by this component:**
- `searchable`: Added when both `canbesearched` and `caninteractwith` are true; removed otherwise.
- `quicksearch`: Added/removed based on the `quicksearch` property.
- `jostlesearch`: Added/removed based on the `jostlesearch` property.

**No other components are required** for this component to function.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `caninteractwith` | `boolean` | `true` | Indicates whether the entity can currently be interacted with (e.g., by a player). Affects `searchable` tag. |
| `remove_when_searched` | `boolean` | `false` | If true, the entity is automatically removed after a successful search. |
| `quicksearch` | `boolean` | `false` | Controls the `quicksearch` tag; used for UI/input handling of quick-search behaviors. |
| `jostlesearch` | `boolean` | `false` | Controls the `jostlesearch` tag; used for jostle-based searching (e.g., in crowns or tight spaces). |
| `canbesearched` | `boolean?` | `nil` | Indicates whether the entity is in a state where it can be searched (e.g., not blocked). Affects `searchable` tag. |
| `onsearchfn` | `function?` | `nil` | Optional callback function called during `Search()`. Takes `(entity, searcher)` and returns `(success: boolean, reason?: string)`. |

## Main Functions
### `Search(searcher)`
* **Description:** Attempts to search the entity. If `canbesearched` and `caninteractwith` are true, executes the optional `onsearchfn` callback, pushes a `"searched"` event, and removes the entity if `remove_when_searched` is true. Returns the result of the search.
* **Parameters:**
  - `searcher`: The entity performing the search (e.g., a player).

### `OnRemoveEntity()`
* **Description:** Removes the `searchable`, `quicksearch`, and `jostlesearch` tags when the entity is removed from the world.

### `OnSave()`
* **Description:** Returns a serializable table containing non-default save data (`{caninteractwith = true}` if true). Returns `nil` otherwise.
* **Returns:** `table?` — Serializable data, or `nil`.

### `OnLoad(data)`
* **Description:** Restores the `caninteractwith` property from saved data.
* **Parameters:**
  - `data`: The saved state table passed by the game’s save system.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing relevant internal state for diagnostics in the debug overlay.
* **Returns:** `string` — A semicolon-separated list of active conditions (e.g., `"can interact with; can be searched;"`).

## Events & Listeners
- **Listens for:** None.
- **Triggers:**
  - `searched` (when a search succeeds): Emitted with `(searcher)` as the event payload.