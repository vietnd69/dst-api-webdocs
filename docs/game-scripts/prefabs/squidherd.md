---
id: squidherd
title: Squidherd
description: Manages a migratory herd of squid entities, handling member aggregation, navigation between predefined waypoints, and cleanup when all members are inactive or off-ocean.
tags: [herd, ai, npc, navigation, cleanup]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d14ebf5b
system_scope: world
---

# Squidherd

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`squidherd` defines a prefab that acts as a container and manager for a dynamic group of squid entities. It leverages the `herd` component to aggregate and maintain a collection of `squid` prefabs (tags `squid` or `squid_migratory`). It also uses the `knownlocations` component to store and manage a set of navigation waypoints (`nav1`, `nav2`, ..., `nav6`) and coordinates for member positioning. The herd periodically updates its own position to follow the average position of its members and repositions each member relative to a current navigation waypoint. It includes logic to automatically remove the entire herd (and all members) when all members fall asleep or leave the ocean.

## Usage example
```lua
local herd = SpawnPrefab("squidherd")
herd.Transform:SetPosition(x, y, z)
-- Members (squids) will be automatically gathered and managed
-- Navigation waypoints are auto-generated on first spawn
```

## Dependencies & tags
**Components used:**  
- `herd` — manages the collection of squid members, periodic updates, and movement logic  
- `knownlocations` — stores and retrieves named navigation waypoint positions  

**Tags added to the entity:**  
- `herd` — allows other systems (e.g., `FindEntities`) to locate the herd  
- `NOBLOCK` — prevents the herd from blocking movement  
- `NOCLICK` — prevents UI interaction (e.g., pointer selection)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currentnav` | number | `1` | Index of the current navigation waypoint being followed. Reset to `1` if next waypoint is missing. Set during `setupnavs`. |
| `checkforremoval` | function | (reference to `checkforremoval` below) | Function invoked on `entitysleep` events to determine if the herd and all members should be removed. |

## Main functions
### `setupnavs(inst)`
*   **Description:** Initializes up to six navigation waypoints relative to the herd's initial position, selecting only ocean tiles for placement. Nav points are stored in `knownlocations` as `"nav1"` through `"nav6"`. Only runs if `"nav1"` is not already set. A debug section (commented out) would spawn visual markers for debugging.
*   **Parameters:** `inst` (Entity) — the herd entity instance.
*   **Returns:** Nothing.
*   **Error states:** May produce waypoints with no guarantee of physical accessibility (e.g., over deep ocean or obstacles). Does not check connectivity.

### `updateposfn(inst)`
*   **Description:** Custom position update function used by the `herd` component. Determines the herd’s new position based on current nav waypoint, and assigns each member a randomized offset from that waypoint (stored in `"herd_offset"` via `knownlocations:RememberLocation`). The herd itself moves only if all members are within 20 units; otherwise, it stays in place.
*   **Parameters:** `inst` (Entity) — the herd entity instance.
*   **Returns:** `Vector3` — world position of the current nav waypoint (`currentnav`).
*   **Behavior details:** Increments `currentnav` if all members are within range, wrapping to `1` if the next nav point is missing.

### `AddMember(inst, member)`
*   **Description:** Registers a squid member to the herd and attaches an `entitysleep` event listener. When the member sleeps, `checkforremoval` is triggered to evaluate herd removal.
*   **Parameters:**  
    - `inst` (Entity) — the herd entity  
    - `member` (Entity) — the squid being added  
*   **Returns:** Nothing.
*   **Side effects:** Attaches a closure (`member._squidherd_entitysleep`) as a one-time listener for `entitysleep`.

### `RemoveMember(inst, member)`
*   **Description:** Cleans up the event listener attached in `AddMember`, removing the `entitysleep` callback to avoid memory leaks or stale references.
*   **Parameters:**  
    - `inst` (Entity) — the herd entity  
    - `member` (Entity) — the squid being removed  
*   **Returns:** Nothing.

### `checkforremoval(inst)`
*   **Description:** Evaluates whether all squid members are either asleep or not on the ocean. If true, removes all members and the herd entity itself. Called via `entitysleep` event and in cleanup scenarios.
*   **Parameters:** `inst` (Entity) — the herd entity.
*   **Returns:** Nothing.
*   **Error states:** Calls `k:Remove()` on each member and `inst:Remove()` on the herd — irreversible.

### `OnSave(inst, data)`
*   **Description:** Saves the current navigation index (`currentnav`) to the save data.
*   **Parameters:**  
    - `inst` (Entity) — the herd entity  
    - `data` (table) — the save data table to populate  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the navigation index (`currentnav`) from loaded save data.
*   **Parameters:**  
    - `inst` (Entity) — the herd entity  
    - `data` (table) — the loaded save data  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `entitysleep` — on each member (via `AddMember`), triggers `checkforremoval` to assess herd removal.  
- **Pushes:** None.