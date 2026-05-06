---
id: event_deps
title: Event Deps
description: Defines asset dependencies and loading screen images for seasonal and festival events, registering prefabs that control asset preloading.
tags: [events, assets, prefabs]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 1b76aa56
system_scope: environment
---

# Event Deps

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`event_deps.lua` is a data configuration file that defines asset dependencies for Don't Starve Together seasonal and festival events. It contains three primary static tables: `LOADING_IMAGES` maps event types to loading screen image atlas/texture pairs, `SPECIAL_EVENT_DEPS` maps special event types to frontend/backend asset dependencies, and `FESTIVAL_EVENT_DEPS` maps festival event types to frontend/backend asset dependencies. Only `LOADING_IMAGES` is a true global table accessible by other systems; `SPECIAL_EVENT_DEPS` and `FESTIVAL_EVENT_DEPS` are file-local tables used internally for prefab registration.

## Usage example
```lua
-- This file is automatically required by the game's prefab system
require('prefabs/event_deps')
-- It returns multiple prefab instances via unpack(ret), not a table
-- Only LOADING_IMAGES is a global table accessible externally.
-- SPECIAL_EVENT_DEPS and FESTIVAL_EVENT_DEPS are file-local tables
-- used internally for prefab registration.

-- Access loading images for a specific event (as global)
local hallowed_images = LOADING_IMAGES[SPECIAL_EVENTS.HALLOWED_NIGHTS]

-- The prefabs registered by this file (returned as multiple values):
-- - [event]_event_global, [event]_event_frontend, [event]_event_backend
-- - [festival]_fest_global, [festival]_fest_frontend, [festival]_fest_backend
```

## Dependencies & tags
**External dependencies:**
- `SPECIAL_EVENTS` -- event type enumeration for seasonal events
- `FESTIVAL_EVENTS` -- event type enumeration for festival events
- `Asset()` -- global function for defining asset dependencies
- `Prefab()` -- global function for registering prefabs
- `CreateEntity()` -- global function for entity creation

**Components used:**
None identified

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LOADING_IMAGES` | table | --- | Maps event types to loading screen image atlas/texture pairs. |
| `LOADING_IMAGES[SPECIAL_EVENTS.HALLOWED_NIGHTS]` | table | --- | Hallowed Nights loading images (2). |
| `LOADING_IMAGES[SPECIAL_EVENTS.WINTERS_FEAST]` | table | --- | Winter's Feast loading images (3). |
| `LOADING_IMAGES[SPECIAL_EVENTS.YOTG]` | table | --- | Year of the Gobbler loading images (2). |
| `LOADING_IMAGES[SPECIAL_EVENTS.YOTV]` | table | --- | Year of the Varg loading images (1). |
| `LOADING_IMAGES[SPECIAL_EVENTS.YOTC]` | table | --- | Year of the Carrat loading images (1). |
| `LOADING_IMAGES[SPECIAL_EVENTS.YOT_CATCOON]` | table | --- | Year of the Catcoon loading images (1). |
| `LOADING_IMAGES[SPECIAL_EVENTS.NONE]` | table | --- | Default loading images (8, with spiral flag). |
| `LOADING_IMAGES[n].atlas` | string | --- | Image atlas XML path (e.g., "images/bg_spiral_fill1.xml"). |
| `LOADING_IMAGES[n].tex` | string | --- | Image texture path (e.g., "bg_image1.tex"). |
| `LOADING_IMAGES[n].spiral` | boolean | --- | Optional flag indicating spiral animation (present on NONE event images). |
| `SPECIAL_EVENT_DEPS` | table | --- | File-local table mapping special event types to frontend/backend asset dependencies. Structure: `[event] = { frontend = { assets = {...} }, backend = { assets = {...}, prefabs = {...} } }`. |
| `FESTIVAL_EVENT_DEPS` | table | --- | File-local table mapping festival event types to frontend/backend asset dependencies. Structure: `[festival] = { frontend = { assets = {...} } }`. |


## Main functions
### `fn()`
* **Description:** Local prefab function that creates an empty entity. This prefab is never instantiated at runtime — it exists solely to carry asset dependencies for the loading system.
* **Parameters:** None
* **Returns:** Entity instance created via `CreateEntity()`
* **Error states:** None

### `AddLoadingAssets(deps, special_event)`
* **Description:** Adds loading screen image assets to the deps table for a given event. Iterates through `LOADING_IMAGES` for the event type (or falls back to `NONE`) and inserts `DYNAMIC_ATLAS` and `PKGREF` assets.
* **Parameters:**
  - `deps` -- dependency table to modify (must have `global.assets` or be initialized)
  - `special_event` -- event type constant from `SPECIAL_EVENTS`
* **Returns:** None
* **Error states:** Errors if any atlas path in `LOADING_IMAGES` does not end with ".xml" (assert failure on `v.atlas:sub(-4)` check).

### `AddDependencyPrefab(name, env)`
* **Description:** Creates and registers a prefab with the given name and environment (assets/prefabs). Appends to the `ret` table for final return.
* **Parameters:**
  - `name` -- string prefab name
  - `env` -- table containing `assets` and/or `prefabs` arrays
* **Returns:** None
* **Error states:** None

## Events & listeners
None identified