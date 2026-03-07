---
id: quagmire_network
title: Quagmire Network
description: Serves as the central server-side network entity for the Quagmire world, managing world lifecycle, music, recipe book state, hangriness tracking, and character selection lobby.
tags: [network, world, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b6007af7
system_scope: world
---

# Quagmire Network

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_network` is a special-purpose entity instantiated as `TheWorld.net` that acts as the dedicated server-side anchor for the Quagmire world. It manages Quagmire-specific systems (music, recipe pricing, hangriness), coordinates the character selection lobby, and ensures proper initialization sequencing via `PostInit` callbacks. This entity does not persist and is never simulated by clients — it exists only on the master simulation.

## Usage example
```lua
-- Internal framework usage only; not meant for mod addition to arbitrary entities.
-- The network entity is created automatically by the world loader:
local network_entity = TheWorld.net
assert(network_entity.components.quagmire_recipebook ~= nil)
```

## Dependencies & tags
**Components used:** `autosaver`, `quagmire_music`, `quagmire_recipebook`, `quagmire_recipeprices`, `quagmire_hangriness`, `worldcharacterselectlobby`  
**Tags:** Adds `CLASSIFIED`

## Properties
No public properties

## Main functions
### `PostInit(inst)`
*   **Description:** Runs after the world entity is fully constructed and attached to `TheWorld.net`. It triggers a long update, flushes network dirty variables, and invokes `OnPostInit()` on every attached component.
*   **Parameters:** `inst` (Entity instance) — the network entity itself.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Ensures proper cleanup when the network entity is destroyed. Verifies `TheWorld.net` matches the instance and clears the reference.
*   **Parameters:** `inst` (Entity instance) — the network entity being removed.
*   **Returns:** Nothing.
*   **Error states:** Asserts that `TheWorld.net == inst`; fails hard if this invariant is violated.

### `DoPostInit(inst)`
*   **Description:** Deferred initialization routine executed immediately after world load. On non-master clients, it triggers a client-side `TheWorld:PostInit()` if the world is active. It also sends a resume request to the server (if not dedicated) and starts `PlayerHistory` listening.
*   **Parameters:** `inst` (Entity instance) — the network entity.
*   **Returns:** Nothing.

## Events & listeners
None identified.