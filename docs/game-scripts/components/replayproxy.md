---
id: replayproxy
title: Replayproxy
description: Stores and provides access to the GUID and prefab name of the original entity being replayed in a client-side simulation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 44b469f0
---

# Replayproxy

## Overview
The `ReplayProxy` component serves as a lightweight metadata container attached to entities during replays, preserving key identification information (GUID and prefab name) of the original entity being replayed. It enables clients to reference or verify the source entity during replay playback without requiring active synchronization.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set by constructor) | Reference to the entity this component is attached to. |
| `real_entity_guid` | `number?` | `nil` | GUID of the original (non-replay) entity; may be `nil` if not set. |
| `real_entity_prefab_name` | `string` | `""` | Prefab name of the original entity; defaults to empty string. |

## Main Functions
### `SetRealEntityGUID(guid)`
* **Description:** Sets the GUID of the original entity that this replay proxy represents.
* **Parameters:**  
  `guid` (`number`) — The GUID of the real (non-replay) entity.

### `GetRealEntityGUID()`
* **Description:** Returns the GUID of the original entity.
* **Parameters:** None.

### `SetRealEntityPrefabName(name)`
* **Description:** Sets the prefab name of the original entity.
* **Parameters:**  
  `name` (`string`) — The prefab name (e.g., `"pigman"`, `"wolf"`) of the real entity.

### `GetRealEntityPrefabName()`
* **Description:** Returns a formatted string combining the real entity's GUID and prefab name (e.g., `"12345 - pigman"`).  
* **Parameters:** None.

## Events & Listeners
None.