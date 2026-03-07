---
id: pocketdimensioncontainers
title: Pocketdimensioncontainers
description: Creates and registers prefabs for pocket dimension storage containers with networked classified visibility logic.
tags: [inventory, network, container]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a2eca6e
system_scope: network
---

# Pocketdimensioncontainers

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketdimensioncontainers` is a prefabs utility module that dynamically generates prefabs for pocket dimension storage containers (e.g., portable storage used in the Pocket Dimension). It uses definitions from `POCKETDIMENSIONCONTAINER_DEFS` to configure container prefabs with specific UI assets, network behavior, and container component settings. Its main responsibility is to instantiate each container as an entity with classified networking — ensuring only the current user(s) can see/interact with it — and register them globally via `TheWorld:SetPocketDimensionContainer`.

The module leverages the `container` component and custom open/close callbacks to manage visibility based on user count (`opencount` and `openlist`).

## Usage example
```lua
-- This module is loaded automatically by the game during startup.
-- Modders interact with its output by referencing the generated prefabs:
local mycontainer = SpawnPrefab("mypocketcontainer")
mycontainer.Transform:SetPosition(x, y, z)
-- The container prefab includes the container component, pre-configured with:
--   - skipopensnd = true
--   - skipclosesnd = true
--   - skipautoclose = true
--   - onanyopenfn / onanyclosefn set to internal handlers
```

## Dependencies & tags
**Components used:** `container`, `network`, `transform`, `server_non_sleepable`  
**Tags added:** `CLASSIFIED`, `pocketdimension_container`, `irreplaceable`, plus any tags defined per `def.tags` in `POCKETDIMENSIONCONTAINER_DEFS`

## Properties
No public properties; this file is a factory function module and does not define component instances.

## Main functions
### `MakeContainer(def)`
*   **Description:** Constructs and returns a prefab for a pocket dimension container, configured using the provided definition table `def`. Sets up container networking, component configuration, and global registration.
*   **Parameters:** `def` (table) — a container definition with at least keys: `prefab`, `ui`, `widgetname`, `name`, and optionally `tags` (array) and `data_only` (boolean to skip prefab creation).
*   **Returns:** Prefab — a prefabricated entity definition ready for world spawning.
*   **Error states:** If `def.prefab` or `def.ui` is missing, the prefab asset list may be invalid; no explicit error handling is present in this module.

## Events & listeners
This module does not register any event listeners on the entity itself — instead, it assigns callback functions to container component hooks:
- **Listeners (via `container` component):**
  - `onanyopenfn`: `OnAnyOpenStorage` — adjusts classified network target on container open.
  - `onanyclosefn`: `OnAnyCloseStorage` — adjusts classified network target on container close.
- **Pushes:** None directly — relies on `container` component’s internal event handling.

### Event Callbacks
#### `OnAnyOpenStorage(inst, data)`
*   **Description:** Ensures classified visibility is correctly routed when the container is opened.
    - If multiple users are opening the container, sets target to `nil` (global visibility).
    - Otherwise, sets target to the user (`data.doer`).
*   **Parameters:**  
    `inst` (Entity) — the container entity.  
    `data` (table) — event data, must contain `doer` (the player entity opening the container).
*   **Returns:** Nothing.

#### `OnAnyCloseStorage(inst, data)`
*   **Description:** Adjusts classified visibility when users close the container.
    - If no users remain (`opencount == 0`), sets target back to `inst` (only the owner sees it).
    - If one user remains (`opencount == 1`), sets target to that user.
*   **Parameters:**  
    `inst` (Entity) — the container entity.  
    `data` (table) — event data (not used directly).
*   **Returns:** Nothing.