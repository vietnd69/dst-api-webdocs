---
id: townportal
title: Townportal
description: Manages the town portal structure, including channeling activation, inter-portal linking, teleportation, and dismantling behavior.
tags: [structure, teleportation, channeling]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 62b3a895
system_scope: world
---

# Townportal

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `townportal` prefab implements the Town Portal structure used for long-distance travel. It coordinates with the `channelable`, `teleporter`, `workable`, `lootdropper`, and `inspectable` components to handle player channeling, inter-portal linking, activation/deactivation, teleportation events, and hammering. It also manages visual and audio feedback, including minimap icons and sound loops.

## Usage example
```lua
local portal = SpawnPrefab("townportal")
portal.Transform:SetPosition(x, y, z)
if TheWorld.ismastersim then
    -- Link to another portal
    portal:PushEvent("linktownportals", { other = other_portal })
    -- Trigger teleport on player
    portal.components.teleporter:Activate(player)
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `channelable`, `teleporter`, `inspectable`  
**Tags added:** `structure`, `townportal`, `NOCLICK` (only on FX variant), `FX` (only on FX variant)  
**Tags checked:** `player`, `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `playingsound` | boolean or nil | `nil` | Tracks whether the active sound loop is playing. |
| `channeler` | entity or nil | `nil` | Reference to the player currently channeling this portal. |
| `icon` | entity or nil | `nil` | Map icon entity linked to this portal. |
| `killtask` | task or nil | `nil` | Task reference for FX entity self-removal. |
| `persists` | boolean | `true` (default) or `false` for FX | Controls whether the entity is saved in world data. |

## Main functions
### `GetStatus(inst)`
* **Description:** Returns the activation status string for inspection UI.
* **Parameters:** `inst` (entity) — the town portal instance.
* **Returns:** `"ACTIVE"` if the portal is currently channeling or linked; `nil` otherwise.

### `OnStartChanneling(inst, channeler)`
* **Description:** Handles logic when a player begins channeling the portal (e.g., activating it). Sets animation, sound, minimap icon, sanity cost, and fires a world event.
* **Parameters:**  
  `inst` (entity) — the portal instance.  
  `channeler` (entity) — the player beginning channeling.  
* **Returns:** Nothing.

### `OnStopChanneling(inst, aborted)`
* **Description:** Handles deactivation logic when channeling ends (e.g., player stops, is interrupted, or portal is destroyed). Restores minimap icon, cleans sanity modifiers, and fires a world event.
* **Parameters:**  
  `inst` (entity) — the portal instance.  
  `aborted` (boolean) — whether channeling was interrupted.  
* **Returns:** Nothing.

### `OnLinkTownPortals(inst, other)`
* **Description:** Links this portal to another (`other`) or clears the link (`other == nil`). Updates animation, sound, and channelable state accordingly.
* **Parameters:**  
  `inst` (entity) — the portal instance.  
  `other` (entity or nil) — the destination portal, or `nil` to unlink.  
* **Returns:** Nothing.

### `OnStartTeleporting(inst, doer)`
* **Description:** Handles behavior at the start of teleportation (e.g., silencing talkers and applying sanity damage).
* **Parameters:**  
  `inst` (entity) — the portal instance.  
  `doer` (entity) — the player initiating teleportation.  
* **Returns:** Nothing.

### `OnExitingTeleporter(inst, obj)`
* **Description:** Fires a `"townportalteleport"` event on the player after teleport completes, used for event hooks like Wisecracker.
* **Parameters:**  
  `inst` (entity) — the portal instance.  
  `obj` (entity) — the player exiting the teleport.  
* **Returns:** Nothing.

### `onhammered(inst)`
* **Description:** Callback for when the portal is fully hammered. Drops loot, spawns a collapse FX, and removes the portal.
* **Parameters:** `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `onhit(inst)`
* **Description:** Handles partial hits on the portal. Stops channeling (if active), deactivates (if linked), and plays an impact animation.
* **Parameters:** `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `onbuilt(inst)`
* **Description:** Callback on portal construction. Plays craft sound and builds animation sequence. Activates visuals if the portal is already linked.
* **Parameters:** `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `init(inst)`
* **Description:** Creates and attaches a map icon to track this portal's position.
* **Parameters:** `inst` (entity) — the portal instance.  
* **Returns:** Nothing.

### `KillFX(inst)`
* **Description:** (FX-only) Triggers a particle exit animation, plays exit sound, and removes the FX entity.
* **Parameters:** `inst` (entity) — the FX instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` — triggers `onbuilt`.  
  - `"linktownportals"` — triggers `OnLinkTownPortals`.  
  - `"doneteleporting"` — triggers `OnExitingTeleporter`.  
- **Pushes:**  
  - `"townportalactivated"` — fired when the portal starts channeling (via `OnStartChanneling`).  
  - `"townportaldeactivated"` — fired when the portal stops channeling or is unlinked (via `OnStopChanneling` or `OnLinkTownPortals`).  
  - `"ms_registertownportal"` — server-only registration event fired at construction.  
  - `"entity_droploot"` — emitted by `lootdropper:DropLoot`.  
  - `"sanitydelta"` — emitted when sanity is modified on the channeler.