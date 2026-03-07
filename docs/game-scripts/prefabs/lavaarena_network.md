---
id: lavaarena_network
title: Lavaarena Network
description: Provides the master network entity for the Lava Arena event, managing event state, music, and world-level lifecycle during arena gameplay.
tags: [network, boss, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0aafec4f
system_scope: world
---

# Lavaarena Network

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_network` is a server-authoritative entity that serves as the singleton network object for the Lava Arena event. It is created once per match on the master simulation and attached to `TheWorld.net`. It coordinates high-level event functionality, including persistence overrides (via `autosaver`), lobby and character selection handling (`worldcharacterselectlobby`), event state tracking (`lavaarenaeventstate`), and music management (`lavaarenamusic`). It does not persist and is removed when the match ends.

## Usage example
This prefab is instantiated automatically by the game during Lava Arena world generation and should not be manually spawned by mods:
```lua
-- Example: Check for arena mode on the master
if TheWorld.net and TheWorld.net:HasTag("CLASSIFIED") then
    -- Inside a Lava Arena event
    print("Lava Arena network entity is active.")
end
```

## Dependencies & tags
**Components used:** `autosaver`, `worldcharacterselectlobby`, `lavaarenaeventstate`, `lavaarenamusic`  
**Tags:** Adds `CLASSIFIED`

## Properties
No public properties

## Main functions
This prefab exposes no public methods. All logic resides in internal callbacks and component-based events.

### `fn()`
*   **Description:** Constructor function that initializes the network entity. It creates a non-persistent entity, assigns it to `TheWorld.net`, configures it with required components, marks it as `CLASSIFIED`, and schedules deferred initialization (`DoPostInit`) to run after the world is fully loaded.
*   **Parameters:** None.
*   **Returns:** The initialized `lavaarena_network` entity instance.

### `PostInit(inst)`
*   **Description:** Called once per frame after the entity is fully constructed. Ensures initial update, flushes dirty netvars, and invokes `OnPostInit` on all attached components to finalize their initialization sequence.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup callback triggered when the entity is destroyed. Verifies that `TheWorld.net` points to this entity and clears the reference to prevent stale references.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** Nothing.

### `DoPostInit(inst)`
*   **Description:** Deferred post-init hook run once on the master simulation after world load completes. Ensures `TheWorld:PostInit()` runs only once (and only if not on a dedicated server), and sends a resume request to the server for client-side players (if present). Also starts `PlayerHistory` listening.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** Nothing.
*   **Error states:** Silently exits if called on a non-master simulation while the world is deactivated.

## Events & listeners
This prefab does not directly register or fire game events; it relies on its attached components to handle event flow. No event listeners or pushes are declared in the script itself.