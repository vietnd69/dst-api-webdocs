---
id: event_deps
title: Event Deps
description: Provides prefab definitions and asset lists required for loading special and festival event content.
tags: [event, asset, loading, frontend]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eb65b77c
system_scope: environment
---

# Event Deps

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`event_deps.lua` is not a runtime component but a configuration file that defines prefabs responsible for managing event-specific asset loading. It declares `SPECIAL_EVENT_DEPS` and `FESTIVAL_EVENT_DEPS` tables, each mapping event types to frontend, backend, and global asset requirements. Prefabs are generated dynamically for each event type and returned as a list for use by the asset loader (e.g., `loadingwidget.lua`). This ensures only the assets needed for active events are loaded, avoiding unnecessary overhead.

## Usage example
This file is automatically executed during game startup and does not require manual instantiation. However, to reference its output in related systems:
```lua
-- In loadingwidget.lua or similar asset loader:
local event_deps = require("prefabs/event_deps")
-- event_deps now contains prefabs like "hallowed_nights_event_frontend"
-- These prefabs include the required assets for the corresponding event.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a module script that returns prefabs, not an ECS component.

## Main functions
### `AddLoadingAssets(deps, special_event)`
*   **Description:** Populates the `global.assets` array of the provided `deps` table with dynamic atlas and image assets for the event’s loading screen backgrounds.
*   **Parameters:**  
  `deps` (table) — The dependency table to modify.  
  `special_event` (`SPECIAL_EVENTS` enum value) — The event type, used to select the appropriate background images from `LOADING_IMAGES`.
*   **Returns:** Nothing.
*   **Error states:** Raises `assert` failure if an atlas filename does not end in `.xml`.

### `AddDependencyPrefab(name, env)`
*   **Description:** Constructs and appends a `Prefab` definition to the returned `ret` table for the given event environment (frontend, backend, or global).
*   **Parameters:**  
  `name` (string) — The name of the prefab to create (e.g., `"hallowed_nights_event_frontend"`).  
  `env` (table) — A table with optional `assets` and `prefabs` arrays.
*   **Returns:** Nothing — result is side effect on `ret`.

### `fn()`
*   **Description:** The shared factory function used to instantiate event dependency prefabs. It simply returns an empty entity via `CreateEntity()`. No logic is performed at runtime, as these prefabs exist solely to bundle assets.
*   **Parameters:** None.
*   **Returns:** `Entity` — an empty instance with no components.

## Events & listeners
None identified

## Notes
- The `SPECIAL_EVENTS.NONE` entry defines default, non-event loading assets.
- Event prefabs are generated as `"[event_name]_event_[scope]"`, where `scope` is `frontend`, `backend`, or `global`. Festival prefabs use `_fest_` instead of `_event_`.
- No components or runtime logic are attached; prefabs serve only as asset containers.