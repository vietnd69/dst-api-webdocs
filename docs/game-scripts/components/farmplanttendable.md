---
id: farmplanttendable
title: Farmplanttendable
description: Controls whether a farm plant entity can be tended to, toggling the "tendable_farmplant" tag and managing tendability state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4e81483c
---

# Farmplanttendable

## Overview
This component determines if a farm plant entity is currently tendable. It manages the `tendable` state and dynamically adds or removes the `"tendable_farmplant"` tag from the entity based on that state. It also supports tend operations via the `TendTo` method, which can mark the plant as no longer tendable upon successful tend.

## Dependencies & Tags
- Adds/removes tag: `"tendable_farmplant"`
- No other components required or added.
- Uses optional function reference `ontendtofn` (not initialized here—expected to be set externally, e.g., by the farm plant entity or its parent logic).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tendable` | `boolean` | `true` | Whether the plant is currently tendable. State is persisted via `OnSave`/`OnLoad`. |

## Main Functions

### `SetTendable(tendable)`
* **Description:** Sets the `tendable` state and updates the `"tendable_farmplant"` tag accordingly.
* **Parameters:**  
  `tendable` (`boolean`) – The desired tendability state.

### `TendTo(doer)`
* **Description:** Attempts to tend to the plant. If `tendable` is `true` *and* the optional `ontendtofn` callback returns `true`, sets `tendable` to `false` and returns `true`. Otherwise, returns `nil`.
* **Parameters:**  
  `doer` (`Entity`) – The entity performing the tend action (e.g., the player).

### `OnSave()`
* **Description:** Returns a serializable table containing the current `tendable` state for save/load persistence.
* **Returns:** `table` – `{ tendable = self.tendable }`.

### `OnLoad(data)`
* **Description:** Restores the `tendable` state from saved data (if provided).
* **Parameters:**  
  `data` (`table?`) – Optional saved data table, expected to contain a `tendable` key.

## Events & Listeners
- Listens to changes in the `tendable` property via the internal `ontendable` function (used as a setter hook in the class metatable), which triggers tag updates when `tendable` is assigned.
- Does *not* actively listen for or push events via `inst:ListenForEvent` or `inst:PushEvent`.