---
id: winonateleportpadmanager
title: Winonateleportpadmanager
description: Manages the collection and lifecycle of Winona teleport pads on the server, registering them when built and removing them when destroyed.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e45cb09b
---

# Winonateleportpadmanager

## Overview
This server-side component maintains an up-to-date registry of all Winona teleport pads present in the world. It listens for registration events when pads are built (or become active), adds them to an internal dictionary, and automatically removes them when they are destroyed. It exists only on the master simulation (server) and is attached to the world entity.

## Dependencies & Tags
- Uses the `TheWorld.ismastersim` assertion to ensure it only runs on the server.
- No additional component dependencies are declared or implied.
- No tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed in)* | The entity (typically `TheWorld`) this component is attached to. |
| `winonateleportpads` | `table` | `{}` | Dictionary mapping each registered teleport pad entity to a metadata table containing its removal callback. |

## Main Functions

### `GetAllWinonaTeleportPads()`
* **Description:** Returns the complete dictionary of currently registered Winona teleport pads.
* **Parameters:** None.

### `OnRegisterWinonaTeleportPad(winonateleportpad)`
* **Description:** Registers a new Winona teleport pad entity for tracking. It ensures the pad is only added to the registry once it has been fully built (or is already built), and sets up a removal callback so it is automatically deregistered when the pad is destroyed. Multiple build-related events (`onbuilt`, `entitywake`, `entitysleep`) are used to guarantee registration occurs reliably regardless of build state transitions.
* **Parameters:**  
  - `winonateleportpad` (`Entity`): The entity representing the Winona teleport pad to register.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from its entity. Removes the primary registration event listener and cleans up all per-pad event listeners and entries in the `winonateleportpads` dictionary.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"ms_registerwinonateleportpad"` → triggers `OnRegisterWinonaTeleportPad_Bridge`, which forwards to `OnRegisterWinonaTeleportPad`.
  - `"onbuilt"` (on each pad) → triggers internal `onbuilt` callback to finalize registration.
  - `"entitywake"` (on each pad) → triggers same `onbuilt` callback.
  - `"entitysleep"` (on each pad) → triggers same `onbuilt` callback.
  - `"onremove"` (on each pad) → triggers `onremove` callback to remove it from the dictionary.

- **No events are pushed/triggers by this component.**