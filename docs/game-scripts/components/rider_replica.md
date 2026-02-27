---
id: rider_replica
title: Rider Replica
description: Manages the rider state and mount-related logic for player entities, including synchronization of mount data, saddle state, and action filtering when mounted.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: bd88f38b
---

# Rider Replica

## Overview
This component handles the representation and synchronization of a player’s mounted state and related properties across the network in *Don’t Starve Together*. It manages client-side prediction and server-side truth for whether the player is riding, tracks the current mount and saddle, and dynamically adjusts the player’s input actions (e.g., pickup and interaction behavior) based on mount state.

## Dependencies & Tags
**Dependencies (Component References):**
- `inst.player_classified` (expected to exist for replication and classification)
- `inst.components.playercontroller`
- `inst.components.playeractionpicker`
- `inst.components.locomotor` (accessed via mount)
- `inst.components.health` (accessed via mount)

**Tags Used:**
- `cancatch`, `catchable`, `heavy`, `fire`, `lighter`, `pickable`, `smolder`, `trapsprung`, `minesprung`, `inactive`, `readyforharvest`, `notreadyforharvest`, `harvestable`, `donecooking`, `dried`, `saddled`, `brushable`, `tapped_harvestable`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `autopredict`

**Tags Added/Removed:** None directly applied by this component.

## Properties
| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity (player). |
| `_isriding` | `net_bool` | `false` | Networked boolean indicating whether the player is currently riding. Used for synchronization across server/client. |
| `classified` | `Classified` or `nil` | `nil` | The player’s `player_classified` component, used for client-side data replication. Set on master or during attach. |
| `_onmounthealthdelta` | `function` | — | Callback used to propagate mount health changes to classification. Set only on master simulation. |
| `_onisriding` | `function` | — | Local client-side listener for `isridingdirty` events. Set only on non-master simulation. |

## Main Functions

### `AttachClassified(classified)`
* **Description:** Attaches and registers the component’s `player_classified` reference. Sets up cleanup on classified removal and applies action filtering if already riding.
* **Parameters:**  
  - `classified`: The `Classified` component instance to attach (typically `inst.player_classified`).

### `DetachClassified()`
* **Description:** Detaches the `classified` reference and cleans up event listeners. Should only be called when the classified is being removed.

### `SetActionFilter(riding)`
* **Description:** Enables or disables custom action filtering for mounted (riding) vs. non-mounted states. When riding, it substitutes the action button override and applies a filter to restrict actions to `mount_valid == true`.
* **Parameters:**  
  - `riding`: `true` to enable mounted action filtering, `false` to restore default behavior.

### `OnIsRiding(riding)`
* **Description:** Handles updates when the riding state changes. Ensures action filtering is properly applied if classified is attached.
* **Parameters:**  
  - `riding`: Boolean indicating the new riding state.

### `SetRiding(riding)`
* **Description:** Sets the rider state on the network (if changed), triggering the `isridingdirty` event on clients.
* **Parameters:**  
  - `riding`: Boolean representing whether the player is now riding.

### `IsRiding()`
* **Description:** Returns the current riding state as tracked by the network variable.
* **Returns:** `boolean` — `true` if riding, `false` otherwise.

### `OnMountHealth(pct)`
* **Description:** Updates the `isridermounthurt` classified property based on mount’s health percentage.
* **Parameters:**  
  - `pct`: Float in `[0.0, 1.0]`, the current health percentage of the mount.

### `IsMountHurt()`
* **Description:** Returns whether the mount is currently considered “hurt” (health < 20%).
* **Returns:** `boolean` — `true` if mount is hurt, `false` or `nil` otherwise.

### `SetMount(mount)`
* **Description:** Sets the mount for the rider, updating classified properties and network relationships. Removes callbacks from the old mount and registers new ones for the new mount.
* **Parameters:**  
  - `mount`: The entity being ridden, or `nil` to dismount.

### `GetMount()`
* **Description:** Returns the current mount, prioritizing the component’s own reference on client, or classification on non-master if component not attached.
* **Returns:** `Entity` or `nil` — the mount entity, or `nil` if not mounted.

### `GetMountRunSpeed()`
* **Description:** Returns the effective run speed of the mount, using live component data when available or falling back to classified values.
* **Returns:** `number` — numeric run speed (0 if no mount or locomotor missing).

### `GetMountFasterOnRoad()`
* **Description:** Returns whether the mount moves faster on roads.
* **Returns:** `boolean` — `true` if mount is road-accelerating, otherwise `false`.

### `SetSaddle(saddle)`
* **Description:** Assigns a saddle to the rider, updating ownership/classified state and handling cleanup of the old saddle.
* **Parameters:**  
  - `saddle`: The saddle entity, or `nil` to remove saddle.

### `GetSaddle()`
* **Description:** Returns the currently assigned saddle.
* **Returns:** `Entity` or `nil` — the saddle entity, or `nil` if none.

## Events & Listeners

- **Listens To:**
  - `isridingdirty` → `self._onisriding` (on non-master only)
  - `onremove` → `self.ondetachclassified` (when classified is attached, to clean up)
  - `healthdelta` → `self._onmounthealthdelta` (on master, when mounted)

- **Triggers (Pushes):**
  - None directly; relies on `net_bool` for network sync (`isridingdirty` is implicitly pushed by the `net_bool` mechanism when `:set()` is called).