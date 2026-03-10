---
id: events
title: Events
description: Provides a lightweight event system for managing and dispatching callbacks to registered handlers.
tags: [event, system, util]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ead728c0
system_scope: entity
---

# Events

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This module implements a minimal, self-contained event dispatch system composed of `EventHandler` and `EventProcessor` classes. It allows entities or systems to register callbacks (`fn`) for specific event names and later invoke all registered callbacks when an event is handled. It is used internally for decoupled event handling where standard DST entity event listeners are not suitable.

## Usage example
```lua
local processor = EventProcessor()
processor:AddEventHandler("score_changed", function(score)
    print("Score updated to:", score)
end)
processor:HandleEvent("score_changed", 100) -- prints: Score updated to: 100
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `event` | string | `nil` | The name of the event this handler is registered for (in `EventHandler`). |
| `fn` | function | `nil` | The callback function invoked when the event is handled (in `EventHandler`). |
| `processor` | EventProcessor | `nil` | Reference to the owning `EventProcessor` instance (in `EventHandler`). |
| `events` | table | `{}` | Map from event name to table of handler objects (in `EventProcessor`). |

## Main functions
### `EventHandler:Remove()`
* **Description:** Removes this handler from its owning `EventProcessor`, effectively unregistering the callback.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if the handler is already removed or `processor` is `nil`.

### `EventProcessor:AddEventHandler(event, fn)`
* **Description:** Registers a new event handler for a given event name.
* **Parameters:**  
  `event` (string) – the event name to listen for.  
  `fn` (function) – the callback function to invoke when the event is handled.  
* **Returns:** `EventHandler` – a handler object that can be used to unregister later via `handler:Remove()`.
* **Error states:** None.

### `EventProcessor:RemoveHandler(handler)`
* **Description:** Unregisters a specific handler from the processor.
* **Parameters:**  
  `handler` (EventHandler or `nil`) – the handler object returned by `AddEventHandler`.  
* **Returns:** Nothing.
* **Error states:** No effect if `handler` is `nil` or not registered.

### `EventProcessor:GetHandlersForEvent(event)`
* **Description:** Returns a table of all handlers registered for a given event.
* **Parameters:**  
  `event` (string) – the event name to query.  
* **Returns:** table – a map of handler objects to `true` (same internal structure as `self.events[event]`); returns `{}` if no handlers exist for the event.
* **Error states:** None.

### `EventProcessor:HandleEvent(event, ...)`
* **Description:** Invokes all callback functions registered for the given event name.
* **Parameters:**  
  `event` (string) – the event name to dispatch.  
  `...` – variadic arguments passed directly to each callback.  
* **Returns:** Nothing.
* **Error states:** Silent no-op if no handlers are registered for the event.

## Events & listeners
- **Listens to:** None (this is the event dispatch system itself)  
- **Pushes:** None (this is the event dispatch system itself)