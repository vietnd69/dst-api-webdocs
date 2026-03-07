---
id: boatcannonuser
title: Boatcannonuser
description: Manages the state and synchronization of boat cannon aiming for a player entity, handling client-side aiming visuals and server-side cannon assignment.
tags: [boat, combat, aiming, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c5cb98d1
system_scope: entity
---

# Boatcannonuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatCannonUser` is an entity component that manages the aiming state and visual feedback for a player using a boat cannon. It synchronizes the currently aimed cannon between server and client, updates aiming reticles and range indicators, and coordinates transitions between aiming and non-aiming states. It relies on the `boatcannon` component for cannon operation and the `reticule` component for targeting visuals. It is typically attached to player entities.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("boatcannonuser")

-- Assign a boat cannon (server-only)
local cannon = GetSomeBoatCannon()
inst.components.boatcannonuser:SetCannon(cannon)

-- Retrieve current aimed cannon (safe on both client and server)
local current_cannon = inst.components.boatcannonuser:GetCannon()
```

## Dependencies & tags
**Components used:** `boatcannon`, `reticule`, `player_classified`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this component. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Whether this component is running on the master simulation (server). |
| `aimingcannon` | `Entity?` | `nil` | The currently aimed boat cannon entity (client-side tracking). |
| `aim_range_fx` | `Prefab?` | `nil` | The AOE range effect prefab instance used for visual aiming feedback. |
| `task` | `Task?` | `nil` | A task handle for deferred aiming logic (client-side). |
| `classified` | `Classified?` | `nil` | Reference to the player's `player_classified` component for observing the `cannon` property (client-side). |

## Main functions
### `GetCannon()`
* **Description:** Returns the currently assigned boat cannon entity from the player's classified component (server-authoritative).
* **Parameters:** None.
* **Returns:** `Entity?` — The cannon entity if assigned and classified is available; otherwise `nil`.
* **Error states:** Returns `nil` if `self.classified` is `nil` or if `self.classified.cannon:value()` is `nil`.

### `GetAimPos()`
* **Description:** Returns the current aiming position from the reticle of the aiming cannon.
* **Parameters:** None.
* **Returns:** `Vector3?` — The `targetpos` of the cannon's reticle if aiming is active and reticle exists; otherwise `nil`.

### `GetReticule()`
* **Description:** Returns the `reticule` component of the currently aimed cannon.
* **Parameters:** None.
* **Returns:** `Reticule?` — The reticle component if `aimingcannon` and its reticle exist; otherwise `nil`.

### `SetCannon(cannon)`
* **Description:** (Server-only) Assigns a new cannon for the player to aim, updating classification, event listeners, and initiating aiming on the cannon component.
* **Parameters:** `cannon` (`Entity?`) — The cannon entity to assign, or `nil` to stop aiming.
* **Returns:** Nothing.
* **Error states:** Asserts `ismastersim`; throws if called on client. Handles switching cannons: stops aiming on previous cannon, starts aiming on new cannon (if present), sets cannon orientation, and triggers client-side `OnCannonChanged`.

### `OnCannonChanged(cannon)`
* **Description:** (Client + server) Updates client-side aiming visuals and state when the assigned cannon changes.
* **Parameters:** `cannon` (`Entity?`) — The newly assigned cannon entity or `nil`.
* **Returns:** Nothing.
* **Error states:** Only updates visuals if `self.inst == ThePlayer`. Destroys existing reticle and range FX before setting up new ones.

### `CancelAimingStateInternal()`
* **Description:** (Server-only) Exits the `is_using_cannon` state if active, transitioning to `aim_cannon_pst`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Asserts `ismastersim`.

## Events & listeners
- **Listens to:** `onremove` — On the player entity to detach the `classified` component, and on the cannon entity to clear it if removed.
- **Pushes:** None.
- **External event callback:** `aimingcannonchanged` — Triggers `OnCannonChanged(cannon)` via `OnAimingCannonChanged`.

### Client-only event handler:
- **`OnAimingCannonChanged(inst, cannon)`** — Top-level helper that delegates `cannon` changes to `self:OnCannonChanged(cannon)`.

### Server-only callback:
- **`cannon_remove_callback`** — Removes the cannon reference from `classified.cannon` and cancels aiming state if the cannon entity is removed.

## Notes
- Client-side functions (`GetAimPos`, `GetReticule`, `OnCannonChanged`) rely on `aimingcannon` being set via server-initiated `SetCannon` and synchronization through the `player_classified` component.
- The `aim_range_fx` prefab is spawned client-side and attached to the cannon’s platform for movement synchronization.
- Internal comments warn that `aim_range_fx` and `task` are local aiming variables and must not be used in server-only code paths.
