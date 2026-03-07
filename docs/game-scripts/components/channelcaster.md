---
id: channelcaster
title: Channelcaster
description: Manages channeling state and item usage for entities performing channel-based actions, such as casting spells or using artifacts.
tags: [combat, channeling, network, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e42d844b
system_scope: entity
---

# Channelcaster

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Channelcaster` handles the logic for entities that are currently channeling an action via an item or ability (e.g., holding down a button to cast a spell). It coordinates with `channelcastable` items to signal when channeling begins or ends, adjusts movement speed during channeling using `locomotor`, and maintains internal state for the channeling item and duration. It also synchronizes channeling status to the player classification UI on the client.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("channelcaster")

-- Begin channeling with an item
inst.components.channelcaster:StartChanneling(some_channelcastable_item)

-- Set callbacks for channel start/stop events
inst.components.channelcaster:SetOnStartChannelingFn(function(inst, item)
    print("Started channeling with", item and item.prefab)
end)
inst.components.channelcaster:SetOnStopChannelingFn(function(inst, item)
    print("Stopped channeling with", item and item.prefab)
end)

-- Stop channeling manually
inst.components.channelcaster:StopChanneling()
```

## Dependencies & tags
**Components used:** `channelcastable`, `locomotor`, `player_classified`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `item` | `Entity?` | `nil` | The item currently being used to channel (if any). |
| `channeling` | boolean | `false` | Whether the entity is currently channeling. |
| `onstartchannelingfn` | `function?` | `nil` | Optional callback executed when channeling starts. |
| `onstopchannelingfn` | `function?` | `nil` | Optional callback executed when channeling stops. |

## Main functions
### `SetOnStartChannelingFn(fn)`
* **Description:** Sets the callback function invoked when channeling begins.
* **Parameters:** `fn` (function) - A function taking `(inst, item)` as arguments.
* **Returns:** Nothing.

### `SetOnStopChannelingFn(fn)`
* **Description:** Sets the callback function invoked when channeling ends.
* **Parameters:** `fn` (function) - A function taking `(inst, item)` as arguments.
* **Returns:** Nothing.

### `StartChanneling(item)`
* **Description:** Begins channeling with the specified item. If a channel is already active, it is stopped first. Adjusts speed and registers state listeners. Returns `true` on success.
* **Parameters:** `item` (`Entity?`) — The item to channel with. Must be valid and have a `channelcastable` component if not `nil`.
* **Returns:** `boolean` — `true` if channeling started successfully, `false` otherwise.
* **Error states:** Returns `false` if `item` is non-`nil` and lacks a `channelcastable` component or is invalid.

### `StopChanneling()`
* **Description:** Ends the current channeling action. Cleans up state, restores speed, and unregisters listeners. Returns `true` if a channel was active.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if channeling was stopped, `false` if no channel was active.

### `IsChannelingItem(item)`
* **Description:** Checks whether the given item is the one currently being used for channeling.
* **Parameters:** `item` (`Entity?`) — The item to compare.
* **Returns:** `boolean` — `true` if `item` matches the current channeling item.

### `IsChanneling()`
* **Description:** Queries whether the entity is currently channeling.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if channeling is active.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing channel state.
* **Parameters:** None.
* **Returns:** `string` — Format: `"channeling=boolean item=Entity|nil"`.

## Events & listeners
- **Listens to:**  
  - `newstate` — Triggers `StopChanneling` if the stategraph no longer has any of `"idle"`, `"running"`, or `"keepchannelcasting"` tags.  
  - `onremove` (via `locomotor`) — Automatically removes speed multiplier when component is removed.

- **Pushes:**  
  - `startchannelcast` — Fired with `{ item = item }` when channeling starts.  
  - `stopchannelcast` — Fired with `{ item = item }` when channeling stops.
