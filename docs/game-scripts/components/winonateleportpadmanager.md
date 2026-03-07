---
id: winonateleportpadmanager
title: Winonateleportpadmanager
description: Tracks and manages all registered Winona teleport pads on the map for network synchronization and world-wide navigation.
tags: [teleport, map, network, winona]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e45cb09b
system_scope: world
---

# Winonateleportpadmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WinonaTeleportPadManager` is a master-only component that maintains a registry of all active Winona teleport pads in the world. It listens for pad registration events, tracks their lifecycle (including removal), and exposes the full set of pads via a public accessor. This component ensures the world knows which pads are available for inter-pad teleportation and prevents memory leaks by cleaning up callbacks when pads are removed.

## Usage example
```lua
-- Typically added automatically to TheWorld on the master
-- No direct modder interaction required
-- To retrieve all registered pads:
local pads = TheWorld.components.winonateleportpadmanager:GetAllWinonaTeleportPads()
for pad, _ in pairs(pads) do
    print("Registered pad:", pad.prefab)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `winonateleportpads` | table | `{}` | Dictionary mapping each registered `WinonaTeleportPad` entity instance to internal tracking data (currently only `onremove` callback). |

## Main functions
### `GetAllWinonaTeleportPads()`
* **Description:** Returns the complete table of registered teleport pads.
* **Parameters:** None.
* **Returns:** `table` — Keyed by entity instance; values are internal tables (for implementation use only).
* **Error states:** None.

### `OnRegisterWinonaTeleportPad(winonateleportpad)`
* **Description:** Registers a newly built or awakened `WinonaTeleportPad` entity, setting up lifecycle callbacks to track its presence.
* **Parameters:** `winonateleportpad` (Entity) — The entity instance of the teleport pad being registered.
* **Returns:** Nothing.
* **Error states:** If the pad is already registered, this call has no additional effect (idempotent). The internal `onremove` callback ensures cleanup only occurs once.

### `OnRemoveFromEntity()`
* **Description:** Cleans up all event listeners and callback references when the component is removed from the entity (rare in practice).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `ms_registerwinonateleportpad` — Bridge event (received from other systems) to trigger registration of a pad.
  - `onbuilt`, `entitywake`, `entitysleep` — Internal flags used to determine when a pad becomes active/ready (non-critical for initial registration).
  - `onremove` — Registered per-pad to auto-deregister it from the manager when removed.
- **Pushes:** None.
