---
id: electricconnector
title: Electricconnector
description: Manages electrical connections between electric fence segments by creating visual beam effects and tracking bidirectional links.
tags: [combat, environment, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fad47dcf
system_scope: environment
---

# Electricconnector

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ElectricConnector` is a component attached to electric fence segments (or similar connectors) to manage the creation, maintenance, and removal of electrical connections. It identifies nearby compatible connectors, spawns visual beam prefabs (`fence_electric_field`) between them, and maintains state about link count and tags. It also supports save/load operations to preserve connections across world sessions. This component is central to the electrical fence system and enforces constraints such as maximum link limits, platform restrictions, and mutual linking logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("electricconnector")

-- Begin linking mode
inst.components.electricconnector:StartLinking()

-- Attempt to connect to a nearby connector
local target = inst.components.electricconnector:FindAndLinkConnector()
if target then
    print("Connected to connector!")
end

-- Set callbacks for connection/disconnection events
inst.components.electricconnector.onlinkedfn = function(self, other, field)
    print("New connection:", other:GetDebugString())
end

inst.components.electricconnector.onunlinkedfn = function(self, other)
    print("Disconnected from:", other:GetDebugString())
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `electric_connector`, `is_electrically_linked`, `fully_electrically_linked`  
**Removed tags:** `is_electrically_linked`, `fully_electrically_linked` (on disconnection or field count drops)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the component is attached to. |
| `fields` | `table` | `{}` | Map of connected entities → spawned beam prefab instances. |
| `field_prefab` | `string` | `"fence_electric_field"` | Prefab name used to spawn visual connection beams. |
| `max_links` | `number` | `TUNING.ELECTRIC_FENCE_MAX_LINKS` | Maximum number of simultaneous connections allowed. |
| `link_range` | `number` | `TUNING.ELECTRIC_FENCE_MAX_DIST` | Search radius (units) for finding other connectors. |
| `onlinkedfn` | `function?` | `nil` | Optional callback: `(self_inst, other_inst, field_prefab)` called when a new link is established. |
| `onunlinkedfn` | `function?` | `nil` | Optional callback: `(self_inst, other_inst)` called when a link is removed. |

## Main functions
### `StartLinking()`
* **Description:** Activates the entity into linking mode, pushing the `"start_linking"` event. Used during placement or editing of electric fences.
* **Parameters:** None.
* **Returns:** `true`.

### `EndLinking()`
* **Description:** Exits linking mode, pushing the `"end_linking"` event.
* **Parameters:** None.
* **Returns:** `true`.

### `IsLinking()`
* **Description:** Checks if the entity's stategraph currently has the `"linking"` state tag.
* **Parameters:** None.
* **Returns:** `boolean` — whether the entity is in linking mode.

### `HasConnection()`
* **Description:** Indicates whether the entity has any active connections.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `#self.fields > 0`.

### `CanLinkTo(guy, on_load)`
* **Description:** Determines whether the entity can link to another entity `guy`.
* **Parameters:**
  * `guy` (`Entity`) — candidate connector entity.
  * `on_load` (`boolean`) — if `true`, bypasses the linking-state check (used during save/load recovery).
* **Returns:** `boolean` — `true` if linking conditions are met (see conditions in source).

### `Disconnect()`
* **Description:** Removes all active connections: destroys all beam prefabs, unregisters fields on both sides, and pushes `"disconnect_links"` events to both entities. Used on entity removal or manual disconnection.
* **Parameters:** None.
* **Returns:** `true`.

### `FindAndLinkConnector()`
* **Description:** Searches for the first eligible connector within `link_range` using `FindEntity`, then attempts to connect to it.
* **Parameters:** None.
* **Returns:** `Entity?` — the connected connector entity, or `nil` if none found or connection failed.

### `ConnectTo(connector)`
* **Description:** Establishes a single connection to `connector`, spawns a beam prefab at the midpoint, and registers the link on both sides.
* **Parameters:**
  * `connector` (`Entity`) — target connector entity.
* **Returns:** `Entity?` — returns `connector` on success; `nil` if maximum link count reached or entity is invalid.

### `RegisterField(other, field)`
* **Description:** Records a connection to `other` with associated `field` (beam prefab), updates tags, and fires `onlinkedfn` if defined.
* **Parameters:**
  * `other` (`Entity`) — connected entity.
  * `field` (`Entity`) — spawned beam prefab instance.
* **Returns:** Nothing.

### `UnregisterField(other)`
* **Description:** Removes the connection to `other`, cleans up tags, and fires `onunlinkedfn` if no fields remain.
* **Parameters:**
  * `other` (`Entity`) — disconnected entity.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes connection information for saving to disk.
* **Parameters:** None.
* **Returns:** `{ connectors: GUID[] }` — table listing GUIDs of all connected entities.

### `LoadPostPass(newents, savedata)`
* **Description:** Recreates connections after the world has loaded using saved GUIDs. Only attempts to reconnect if `CanLinkTo(..., true)` passes.
* **Parameters:**
  * `newents` (`table`) — map of saved GUID → `EntityRef`.
  * `savedata` (`table`) — data from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a static debug string for logging or debugging.
* **Parameters:** None.
* **Returns:** `string` — `"ElectricConnector: "`.

## Events & listeners
- **Listens to:** None identified (no explicit `inst:ListenForEvent` calls).
- **Pushes:** `"start_linking"`, `"end_linking"`, `"disconnect_links"`, `"linked_to"`.  
  The `"linked_to"` event is pushed to the *target* connector after a successful connection.  
  `"disconnect_links"` is pushed to both sides during disconnection.
