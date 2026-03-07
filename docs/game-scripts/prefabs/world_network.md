---
id: world_network
title: World Network
description: Creates and configures the master network entity for the game world, initializing core systems such as time, seasons, autosave, and client-server synchronization.
tags: [network, world, server]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c74eaa18
system_scope: network
---

# World Network

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`world_network.lua` defines the `MakeWorldNetwork` factory function, which constructs the authoritative network entity (`TheWorld.net`) — the central hub for server-side world state in Don't Starve Together. This entity represents the world on the server and handles synchronization with clients, time progression, seasonal cycles, world resets, and voting. It is instantiated once per game session and is never persisted to disk. It integrates multiple essential components (`shardstate`, `autosaver`, `clock`, `worldtemperature`, `seasons`, `worldreset`, `worldvoter`) and triggers post-initialization logic for both master and client simulations.

## Usage example
```lua
local MakeWorldNetwork = require "prefabs/world_network"

-- Typically used internally by the game to spawn the world network entity
local world_network_prefab = MakeWorldNetwork("world_network", nil, nil, nil)
local world_entity = world_network_prefab()
```

## Dependencies & tags
**Components used:**  
`shardstate`, `autosaver`, `clock`, `worldtemperature`, `seasons`, `worldreset`, `worldvoter`  
**Tags:** Adds `CLASSIFIED` tag to the instance.

## Properties
No public properties. The factory returns a `Prefab` function; the resulting entity (`inst`) has no user-facing writable properties.

## Main functions
The file exports only one function:

### `MakeWorldNetwork(name, customprefabs, customassets, custom_postinit)`
* **Description:** Factory function that returns a `Prefab` for the world network entity. When invoked, it creates and initializes a non-persistent entity that acts as the server’s authoritative representation of the world.
* **Parameters:**  
  `name` (string) – Name of the prefab.  
  `customprefabs` (table or nil) – Optional table of additional prefabs to load.  
  `customassets` (table or nil) – Optional table of additional assets to load.  
  `custom_postinit` (function or nil) – Optional callback to run after the entity is created but before `DoPostInit`.  
* **Returns:** A `Prefab` constructor function (compatible with DST's prefab system) that produces the configured world network entity when called.
* **Error states:** Asserts if `TheWorld` or `TheWorld.net` is already in an inconsistent state (`TheWorld.net ~= nil`).

### Helper Functions (internal)
The following functions are defined but not exposed externally — they are called internally by the factory and attached to the instance:

#### `PostInit(inst)`
* **Description:** Performs late-stage initialization on the world entity: flushes network dirty vars, runs `OnPostInit()` on all attached components, and triggers an immediate long update.
* **Parameters:** `inst` (entity instance) – the world network entity.
* **Returns:** Nothing.

#### `OnRemoveEntity(inst)`
* **Description:** Ensures cleanup on entity removal by clearing the `TheWorld.net` reference.
* **Parameters:** `inst` (entity instance) – the world network entity.
* **Returns:** Nothing.

#### `DoPostInit(inst)`
* **Description:** Triggers master or client-specific initialization logic. On non-master-sim (clients), it calls `TheWorld:PostInit()` if the world is not deactivated. On non-dedicated servers, it sends a resume request and starts listening for player history events.
* **Parameters:** `inst` (entity instance) – the world network entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `TheWorld.net` entity fires no events directly via `inst:PushEvent`. The component does not define event handlers or event emissions.
