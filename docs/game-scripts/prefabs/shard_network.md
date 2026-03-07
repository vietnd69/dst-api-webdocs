---
id: shard_network
title: Shard Network
description: Manages the single authoritative shard instance in the master simulation, initializing global systems and components required for world-wide game state.
tags: [network, world, master, systems]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 01ff98cd
system_scope: world
---

# Shard Network

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shard_network` is a singleton prefab instantiated only on the master server in Don't Starve Together. It serves as the central hub for world-scoped systems such as timekeeping, seasons, sinkholes, players, world resets, voting, autosaving, and boss/event spawners. The shard instance is permanently attached to `TheWorld.shard` and does not persist to disk.

## Usage example
```lua
-- This prefab is instantiated automatically by the engine on master sim startup.
-- It is not intended to be manually added to entities.
-- However, other systems may access it via:
if TheWorld.shard ~= nil then
    local shard = TheWorld.shard
    -- e.g. shard.components.shard_clock:GetTime()
end
```

## Dependencies & tags
**Components used:** `shard_clock`, `shard_seasons`, `shard_sinkholes`, `shard_players`, `shard_worldreset`, `shard_worldvoter`, `shard_autosaver`, `shard_daywalkerspawner`, `shard_mermkingwatcher`, `shard_wagbossinfo`  
**Tags:** Adds `CLASSIFIED`  
**Entity flags:** `SetCanSleep(false)`, `SetPristine()`, `persists = false`

## Properties
No public properties

## Main functions
Not applicable — this is a prefab factory function, not a component with instance methods.

## Events & listeners
None identified.