---
id: netvars
title: Netvars
description: Provides network variable types and helper utilities for syncing data between server and clients in multiplayer sessions.
tags: [network, sync, serialization]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: b1c25d7c
system_scope: network
---

# Netvars

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`netvars.lua` defines network variable types and helper functions used to efficiently synchronize state between server and clients in Don't Starve Together. It supports various bit-width representations (e.g., 1-bit, 3-bit, 8-bit, 16-bit, 32-bit) for integers and floats, as well as strings, entities, and arrays. The file also provides `net_event`, a lightweight wrapper over `net_bool` for triggering one-shot networked events (e.g., playing sound effects), and `GetIdealUnsignedNetVarForCount`, a utility to select the smallest integer net type that fits a given maximum value—minimizing bandwidth usage.

This module is foundational for mod developers implementing multiplayer-compatible prefabs and must be kept consistent across server and all clients.

## Usage example
```lua
-- Define a network variable to sync a small count (max 63)
local count_net = net_smallbyte("my_prefab", "count")

-- On the server, set the synced value
count_net:set(10)

-- On client or server, read the current value
local current = count_net:value()

-- Define and push a one-shot event (e.g., for FX)
local fx_event = net_event("my_prefab", "play_sfx")
fx_event:push()
```

## Dependencies & tags
**Components used:** None (uses core network types such as `net_bool`, `net_smallbyte`, etc., which are provided by the engine)
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetIdealUnsignedNetVarForCount(count)`
* **Description:** Returns the most bandwidth-efficient unsigned integer net variable type capable of storing values up to `count`. Used to select the optimal net type when defining networked integer state.
* **Parameters:** `count` (number) – the maximum integer value that needs to be synced.
* **Returns:** A net variable constructor function (e.g., `net_tinybyte`, `net_smallbyte`, ..., `net_uint`) or `nil` if `count` exceeds the maximum supported range.
* **Error states:** Returns `nil` for `count > 4294967295` (i.e., exceeds 32-bit unsigned range).

### `net_event:push()`
* **Description:** Triggers a one-shot networked event. Sets the underlying `net_bool` to `true` locally and then broadcasts the value to clients. Intended for triggers like sound effects, visual FX, or stateless actions—not persistent state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified. (Note: `net_event` triggers network sync via `set_local` + `set`, but does not push Lua events via `inst:PushEvent`.)