---
id: sisturnregistry
title: Sisturnregistry
description: Manages the presence and state of sisturns associated with an entity, tracking activation and blossom status to broadcast global events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2881f568
---

# Sisturnregistry

## Overview
This component tracks sisturns attached to an entity, maintains their active and blossom states, and emits global events when the collective sisturn state changes—primarily for use by Wendy's gameplay systems.

## Dependencies & Tags
- `TheWorld.ismastersim` (asserted at construction to ensure exclusive server-side instantiation)
- Listens for events:
  - `"ms_updatesisturnstate"` (internal server-side update trigger)
- Listens to callbacks on registered sisturns:
  - `"onremove"`
  - `"onburnt"`
- Emits global event: `"onsisturnstatechanged"` on state changes

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to (public, set via constructor). |
| `_sisturns` | `table` | `{}` | Internal table mapping sisturn entities to boolean state (`true` if active). |
| `_is_active` | `boolean` | `false` | Internal flag indicating whether any sisturn is currently active. |
| `_is_blossom` | `boolean` | `false` | Internal flag indicating whether any active sisturn has feel `"BLOSSOM"`. |
| `init_task` | `Task?` | `nil` | Delayed task to defer initial state update until world population is complete. |

## Main Functions

### `Register(sisturn)`
* **Description:** Registers a sisturn entity with this registry. Adds it to the internal list with initial inactive state (`false`) and sets up removal callbacks (`onremove`, `onburnt`).
* **Parameters:**
  * `sisturn` (`Entity?`): The sisturn entity to register. If `nil` or already registered, the function returns early.

### `IsActive()`
* **Description:** Returns whether any sisturn is currently marked active in the registry.
* **Parameters:** None.
* **Returns:** `boolean`

### `IsBlossom()`
* **Description:** Returns whether any active sisturn is currently in `"BLOSSOM"` feel state.
* **Parameters:** None.
* **Returns:** `boolean`

### `GetDebugString()`
* **Description:** Returns a debug string summarizing the current state for logging.
* **Parameters:** None.
* **Returns:** `string`

## Events & Listeners
- **Listens to:**  
  - `"ms_updatesisturnstate"` → triggers `OnUpdateSisturnState(world, data)`  
- **Emits:**  
  - `"onsisturnstatechanged"` → `{is_active = bool, is_blossom = bool}`  
- **Internally handles removal callbacks on sisturns:**  
  - `"onremove"` and `"onburnt"` → triggers `OnRemoveSisturn(sisturn)`