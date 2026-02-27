---
id: saltlicker
title: Saltlicker
description: Manages the state and behavior of salt-lick interactions, including detection, buff application, and resource consumption.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9ff74d83
---

# Saltlicker

## Overview
The `saltlicker` component enables an entity (typically a player) to gain temporary buffs by consuming salt from saltlicks in the environment. It periodically checks for nearby saltlicks, applies a timed "salted" state upon successful detection and consumption, handles pauses/resumes during limbo or sleep states, and tracks saltlick usage (e.g., decrementing finite uses). It also manages persistence across save/load cycles and provides debugging output.

## Dependencies & Tags
- **Required Component:** `timer`
- **Tags Added:** `"saltlicker"`
- **Tags Checked (during search):** `SALTLICK_MUST_TAGS = { "saltlick" }`, `SALTLICK_CANT_TAGS = { "INLIMBO", "fire", "burnt" }`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `salted` | `boolean` | `false` | Whether the entity is currently under the effect of a saltlick. |
| `saltedduration` | `number` | `TUNING.SALTLICK_DURATION` | Total duration (in seconds) of the salted buff. |
| `uses_per_lick` | `number?` | `nil` | Number of uses consumed from the saltlick per successful lick. May be `nil` when inactive. |
| `_task` | `PeriodicTask?` | `nil` | Reference to the periodic task used for searching for saltlicks. |
| `saltlick` | `Entity?` | `nil` | Reference to the currently active saltlick entity, if any. |

## Main Functions

### `SaltLicker:SetUp(uses_per_lick)`
* **Description:** Initializes or re-initializes the component for active use. Registers event listeners for state changes (e.g., death, freeze, sleep) and starts seeking a saltlick if possible.
* **Parameters:**
  * `uses_per_lick` (`number?`) – The number of uses deducted from the saltlick per successful lick. If `nil`, deactivates the component.

### `SaltLicker:Stop()`
* **Description:** Cleans up and disables the component: removes all event listeners, cancels ongoing tasks, stops the salt timer, marks the entity as unsalted, and clears `uses_per_lick`.
* **Parameters:** None.

### `SaltLicker:SetSalted(salted)`
* **Description:** Updates and broadcasts the "salted" state. Triggers the `"saltchange"` event with a payload `{ salted = salted }` only if the state changes.
* **Parameters:**
  * `salted` (`boolean`) – New salted state.

### `SaltLicker:OnRemoveFromEntity()`
* **Description:** Ensures clean removal from the entity by calling `Stop()` and removing the `"saltlicker"` tag.

### `SaltLicker:OnSave()`
* **Description:** Returns save data for persistence: `{ salted = true }` if currently salted, otherwise `nil`.
* **Parameters:** None.

### `SaltLicker:LoadPostPass()`
* **Description:** Restores post-load state based on timer persistence. If the salt timer still exists (indicating a salted state), stops seeking and sets `salted = true`.
* **Parameters:** None.

### `SaltLicker:GetDebugString()`
* **Description:** Returns a formatted debug string containing current salted status, timer remaining, seeking state (with time to next check), duration, and uses per lick.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"timerdone"` → `_ontimerdone`
  - `"enterlimbo"` → `OnPause`
  - `"exitlimbo"` → `TryUnpause`
  - `"gotosleep"` → `OnPause`
  - `"onwakeup"` → `TryUnpause`
  - `"freeze"` → `OnPause`
  - `"unfreeze"` → `TryUnpause`
  - `"death"` → `OnDeath`
  - `"saltlick_placed"` → `_onsaltlickplaced`
- **Triggers:**
  - `"saltchange"` (via `SetSalted`) — payload: `{ salted = boolean }`