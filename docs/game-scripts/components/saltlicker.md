---
id: saltlicker
title: Saltlicker
description: Manages the salt-licking behavior for entities, including detecting nearby saltlicks, applying timed salted states, and consuming uses from the saltlick.
tags: [interaction, state, environment, networking]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9ff74d83
system_scope: environment
---

# Saltlicker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SaltLicker` enables an entity to detect and consume saltlicks in the world. When a valid saltlick is found, it applies a timed "salted" state and decrements the saltlick's finite uses. The component handles seeking, pausing/resuming based on state changes (e.g., sleep, freeze, limbo), and persistent save/load data. It is typically added to entities that can benefit from saltlicks (e.g., Wilson, Walani), and integrates tightly with `timer`, `sleeper`, `freezable`, and `finiteuses`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("timer")
inst:AddComponent("saltlicker")
inst.components.saltlicker:SetUp(1)  -- consumes 1 use per saltlick activation
-- Optional: custom salted duration
inst.components.saltlicker.saltedduration = 60
```

## Dependencies & tags
**Components used:** `timer` (required), `sleeper` (optional), `freezable` (optional), `finiteuses` (optional, only when saltlick is consumed).
**Tags:** Adds `saltlicker` to the entity on construction; checks for `saltlick` tag in nearby entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `salted` | boolean | `false` | Whether the entity is currently in a salted state. |
| `saltedduration` | number | `TUNING.SALTLICK_DURATION` | Duration (in seconds) of the salted state per saltlick. |
| `uses_per_lick` | number? | `nil` | Number of uses consumed from the saltlick upon completion of each salted period. `nil` means inactive. |
| `saltlick` | GameObject? | `nil` | Reference to the current saltlick entity being used, if any. |
| `_task` | Task? | `nil` | Periodic task used to search for saltlicks. |

## Main functions
### `SetUp(uses_per_lick)`
* **Description:** Activates the saltlicker with the given per-lick consumption rate. Registers event listeners and begins attempting to find a saltlick.
* **Parameters:** `uses_per_lick` (number? or `nil`) — number of uses to consume from a saltlick each time the salted timer completes. Set to `nil` to deactivate.
* **Returns:** Nothing.
* **Error states:** If the parent entity lacks a `timer` component, throws an assertion error during construction.

### `Stop()`
* **Description:** Deactivates the saltlicker, cancels all periodic tasks, removes all event listeners, stops the salt timer, and clears the salted state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetSalted(salted)`
* **Description:** Updates the salted state and fires the `saltchange` event if the value changes.
* **Parameters:** `salted` (boolean) — new salted state.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from its entity. Deactivates the component and removes the `saltlicker` tag.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes component state for saving. Returns non-`nil` only if currently salted.
* **Parameters:** None.
* **Returns:** `{ salted = true }` if `salted == true`; `nil` otherwise.

### `LoadPostPass()`
* **Description:** Restores salted state from saved data by checking if the `salt` timer exists. Stops seeking if active.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing current salted timer, seeking state, duration, and uses per lick.
* **Parameters:** None.
* **Returns:** string — formatted debug output.

## Events & listeners
- **Listens to:** `saltlick_placed` — fires when a saltlick is placed nearby, triggers immediate salt acquisition.
- **Listens to:** `timerdone` — fires when the salted timer ends; triggers use consumption and reevaluation of state.
- **Listens to:** `enterlimbo`, `gotosleep`, `freeze` — pausing events; stops salt timer and seeking.
- **Listens to:** `exitlimbo`, `onwakeup`, `unfreeze` — unpausing events; resumes seeking or checks for saltlick.
- **Listens to:** `death` — stops the saltlicker upon entity death.

- **Pushes:** `saltchange` — fired whenever `salted` state changes. Payload: `{ salted = boolean }`.
