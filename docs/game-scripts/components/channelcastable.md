---
id: channelcastable
title: Channelcastable
description: Manages the state and callbacks for an item being channel-cast by a user, including tracking the active user and handling startup/shutdown logic.
tags: [combat, channeling, item, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1b843ee7
system_scope: entity
---

# Channelcastable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Channelcastable` is a component that tracks and manages the lifecycle of an item that is currently being channel-cast by a user entity (typically via the `channelcaster` component). It maintains the identity of the active user, supports optional callback hooks for channel start/stop events, and integrates with equipment lifecycle events (e.g., unequipping stops channeling). It is designed exclusively for use with items held by other entities (e.g., wands, staffs) and is not intended for direct use on non-channelable items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("channelcastable")

inst.components.channelcastable:SetOnStartChannelingFn(function(item, user)
    -- Custom logic when channeling begins
end)

inst.components.channelcastable:SetOnStopChannelingFn(function(item, user)
    -- Custom logic when channeling ends
end)
```

## Dependencies & tags
**Components used:** `channelcaster` (via `user.components.channelcaster:StopChanneling()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user` | `Entity` or `nil` | `nil` | The entity currently channel-casting this item. |
| `strafing` | boolean | `true` | Whether the item allows strafing while channeling (set via `SetStrafing`). |
| `onstartchannelingfn` | function or `nil` | `nil` | Optional callback executed when channeling starts (`fn(inst, user)`). |
| `onstopchannelingfn` | function or `nil` | `nil` | Optional callback executed when channeling stops (`fn(inst, user)`). |

## Main functions
### `SetStrafing(enable)`
* **Description:** Sets whether the item supports strafing during channeling (for later use by the `channelcaster` component).
* **Parameters:** `enable` (boolean) — whether strafing is allowed.
* **Returns:** Nothing.

### `SetOnStartChannelingFn(fn)`
* **Description:** Registers a callback function to be invoked when channeling begins on this item.
* **Parameters:** `fn` (function) — a function accepting `(item, user)` arguments.
* **Returns:** Nothing.

### `SetOnStopChannelingFn(fn)`
* **Description:** Registers a callback function to be invoked when channeling ends on this item.
* **Parameters:** `fn` (function) — a function accepting `(item, user)` arguments.
* **Returns:** Nothing.

### `OnStartChanneling(user)`
* **Description:** Internal initializer called by `channelcaster` to begin channeling with a specific user. Stops any prior channeling first and registers the new user.
* **Parameters:** `user` (`Entity`) — the entity beginning to channel through this item.
* **Returns:** Nothing.
* **Error states:** Has no effect if the provided `user` is the same as the currently active user. Does not validate `user` beyond checking it is valid for the `channelcaster` component.

### `OnStopChanneling(user)`
* **Description:** Stops channeling if the given user matches the currently active user. Removes the `unequipped` event listener and runs the stop callback.
* **Parameters:** `user` (`Entity` or `nil`) — the user who should be stopping channeling.
* **Returns:** Nothing.
* **Error states:** Has no effect if `user` does not match the current `self.user`.

### `StopChanneling()`
* **Description:** Initiates stopping of channeling by delegating to the active user's `channelcaster` component.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `self.user` is `nil`.

## Events & listeners
- **Listens to:** `unequipped` — triggers `StopChanneling()` and removal of the `channelcastable` component when the item is unequipped.
- **Pushes:** None identified.
