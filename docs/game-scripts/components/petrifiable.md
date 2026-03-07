---
id: petrifiable
title: Petrifiable
description: Enables an entity to be petrified and chain-petrify nearby petrifiable entities within a radius.
tags: [petrify, chaining, entity_state, network_sync]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f691186b
system_scope: entity
---

# Petrifiable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Petrifiable` allows an entity to enter a petrified state, optionally chaining the effect to other nearby entities with the `petrifiable` component. It supports timed activation (e.g., after waking from sleep) and network-aware save/load via `OnSave`/`OnLoad`. The component automatically adds the `"petrifiable"` tag to the owning entity upon construction and manages associated tasks to avoid overlapping petrification chains.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("petrifiable")

-- Set a callback for when petrification occurs
inst.components.petrifiable:SetPetrifiedFn(function(target)
    print(target.prefab .. " has been petrified!")
end)

-- Petrify the entity immediately (default behavior)
inst.components.petrifiable:Petrify()

-- Or, delay petrification until the entity wakes up (if currently asleep)
inst.components.petrifiable:Petrify(false)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"petrifiable"`; removes `"petrifiable"` upon removal if not already petrified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | The entity instance this component belongs to. |
| `onPetrifiedFn` | function or `nil` | `nil` | Optional callback invoked when petrification completes. |
| `petrified` | boolean | `false` | Whether the entity is currently petrified. |
| `_petrifytask` | `Task` or `nil` | `nil` | Task responsible for triggering petrification. |
| `_waketask` | `Task` or `nil` | `nil` | Task that wakes the entity and triggers petrification if it was asleep when petrified. |

## Main functions
### `Petrify(immediate)`
* **Description:** Initiates the petrification process for the entity. If `immediate` is true or omitted, petrification occurs after a short randomized delay (unless already petrified). If `immediate` is `false` and the entity is asleep, a wake-based delay is scheduled; otherwise, a standard delay is used.
* **Parameters:**  
  `immediate` (boolean or `nil`) — If `nil` or `true`, petrify after shortest delay. If `false`, defer until entity wakes (if currently asleep).
* **Returns:** Nothing.
* **Error states:** No effect if already petrified (`petrified == true`). Internally cancels pending tasks before scheduling new ones.

### `SetPetrifiedFn(fn)`
* **Description:** Sets the optional callback function that is executed when petrification completes (i.e., when `DoPetrify` runs).
* **Parameters:**  
  `fn` (function or `nil`) — Function accepting a single `Entity` argument (the petrified entity).
* **Returns:** Nothing.

### `IsPetrified()`
* **Description:** Returns whether the entity is currently in the petrified state.
* **Parameters:** None.
* **Returns:** `true` if petrified, otherwise `false`.

### `OnRemoveFromEntity()`
* **Description:** Cleanly removes the component by canceling pending tasks, removing the `"petrifiable"` tag (if not already petrified), and unregistering from the world's petrifiable registry.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component state for saving to disk. Returns data only if petrified.
* **Parameters:** None.
* **Returns:** `{ remainingtime = number }` if petrified and a task is active (e.g., `_waketask`), otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores the component state from saved data. Rebuilds pending tasks and schedules petrification or wake events as needed.
* **Parameters:**  
  `data` (table or `nil`) — Save data containing `remainingtime`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for in-game diagnostics, showing petrification status and remaining times of pending tasks.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"petrified: true, waketime: 1.23, petrifytime: 0.00"`.

## Events & listeners
- **Listens to:** `"entitywake"` — To cancel the wake-based petrification delay and reschedule a new petrify delay if not already active.
- **Pushes:** `"ms_registerpetrifiable"` (on construction), `"ms_unregisterpetrifiable"` (on removal if not petrified), and `"entitywake"` (via callback, not pushed).
