---
id: rider_replica
title: Rider Replica
description: Manages networked state and replicated data for a rider entity, synchronizing mount, saddle, and riding status between server and client.
tags: [network, player, mount, controller, replication]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bd88f38b
system_scope: network
---

# Rider Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RiderReplica` is a client-side replica component that synchronizes rider state — including riding status, mount identity, saddle identity, and derived properties like mount run speed — from the server to the client. It works in tandem with the `rider` component on the server to ensure that actions like mounted movement, UI updates, and action filtering behave consistently across networked sessions. This component is typically attached to player entities and is responsible for updating `player_classified` with dynamic mount-related data during replication.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("rider_replica")
-- The component is automatically activated when the player is mounted via server-side `rider:SetRiding(true)`
-- and receives updates via the `isridingdirty` event and `player_classified` bindings.
```

## Dependencies & tags
**Components used:** `player_classified`, `playercontroller`, `playeractionpicker`, `rider`, `health`, `inventoryitem`, `equippable`, `locomotor`  
**Tags:** None added, removed, or checked directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component belongs to. |
| `_isriding` | `net_bool` | `nil` | Networked boolean indicating whether the entity is currently riding. |
| `classified` | `PlayerClassified?` | `nil` | Reference to the entity's `player_classified` component (used for networked data updates). |
| `_onmounthealthdelta` | `function?` | `nil` | Local callback for mount health delta events on the server. |
| `_onisriding` | `function?` | `nil` | Client-side event handler for `isridingdirty`. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches a `player_classified` component for networked updates and sets up a cleanup listener for entity removal. If the rider is currently active (`_isriding` is true), it applies action filtering.
* **Parameters:** `classified` (`PlayerClassified`) — the classification component to bind.
* **Returns:** Nothing.

### `DetachClassified()`
* **Description:** Removes the `player_classified` reference and cleans up the on-remove event listener.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetActionFilter(riding)`
* **Description:** Enables or disables mounted-specific action overrides and filters based on `riding` status. When `riding` is true, it registers `ActionButtonOverride` and pushes `MountedActionFilter` to the action picker. When false, it clears both.
* **Parameters:** `riding` (`boolean`) — whether the entity is currently riding.
* **Returns:** Nothing.

### `OnIsRiding(riding)`
* **Description:** Responds to changes in riding state. If `classified` is attached, it triggers `SetActionFilter` to toggle action overrides.
* **Parameters:** `riding` (`boolean`) — new riding state.
* **Returns:** Nothing.

### `SetRiding(riding)`
* **Description:** Sets the networked riding state (`_isriding`) and triggers `OnIsRiding`. Only updates if the value changes.
* **Parameters:** `riding` (`boolean`) — new riding state.
* **Returns:** Nothing.

### `IsRiding()`
* **Description:** Returns the current riding state from the networked boolean.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if riding, otherwise `false`.

### `OnMountHealth(pct)`
* **Description:** Updates `player_classified.isridermounthurt` when mount health drops below 20%. Used to show visual or gameplay feedback (e.g., urgency).
* **Parameters:** `pct` (`number`) — current mount health as a percentage (`0.0` to `1.0`).
* **Returns:** Nothing.

### `IsMountHurt()`
* **Description:** Checks if the mount’s health is critically low.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if mount is hurt (health < 20%) and `classified` is attached, otherwise `false`.

### `SetMount(mount)`
* **Description:** Updates the server-verified mount reference and synchronizes properties (`runspeed`, `fasteronroad`) to `player_classified`. Also manages old mount detachment and health event subscriptions.
* **Parameters:** `mount` (`Entity?`) — the new mount entity, or `nil` to dismount.
* **Returns:** Nothing.

### `GetMount()`
* **Description:** Returns the mount entity. Prioritizes the local `rider` component (on server), falls back to the networked `player_classified` value (on client).
* **Parameters:** None.
* **Returns:** `Entity?` — the mount entity, or `nil` if not mounted.

### `GetMountRunSpeed()`
* **Description:** Returns the effective movement speed when riding. Uses live `locomotor.runspeed` if available, otherwise falls back to networked `player_classified.riderrunspeed`.
* **Parameters:** None.
* **Returns:** `number` — mount’s run speed, or `0` if no mount.

### `GetMountFasterOnRoad()`
* **Description:** Returns whether the mount provides road speed bonus. Uses live `locomotor.fasteronroad` if available, otherwise falls back to networked `player_classified.riderfasteronroad`.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if mount has road speed bonus, otherwise `false`.

### `SetSaddle(saddle)`
* **Description:** Updates the saddle entity and synchronizes ownership or networked target references to `player_classified.ridersaddle`. Ensures saddle is not held and updates network state.
* **Parameters:** `saddle` (`Entity?`) — the saddle entity, or `nil` to remove.
* **Returns:** Nothing.

### `GetSaddle()`
* **Description:** Returns the saddle entity. Prioritizes the local `rider` component (on server), falls back to the networked `player_classified` value (on client).
* **Parameters:** None.
* **Returns:** `Entity?` — the saddle entity, or `nil` if no saddle.

## Events & listeners
- **Listens to:**  
  - `isridingdirty` — triggers `OnIsRiding` with the latest riding value.  
  - `onremove` — attached to `classified` to auto-detach when the entity is destroyed.  
  - `healthdelta` — attached to the mount to call `OnMountHealth` on health change (server-side only).  
- **Pushes:** None.  
(No events are directly fired by this component.)
