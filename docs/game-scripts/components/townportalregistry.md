---
id: townportalregistry
title: Townportalregistry
description: Manages the registration, activation, and linking of town portals in the game world, particularly in relation to the Wag Punk Arena barrier.
tags: [portal, world, arena]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 73483376
system_scope: world
---
# Townportalregistry

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Townportalregistry` is a server-only component responsible for tracking all town portals registered in the world, managing which one is currently active, and handling the linking logic between portals (e.g., for teleportation). It enforces teleportation rules based on position and coordinates using the `IsTeleportLinkingPermittedFromPoint` and `IsTeleportingPermittedFromPointToPoint` functions. It also responds to the Wag Punk Arena barrier state — when the barrier is up, it disables linked portals' channels and updates their linking status accordingly.

This component is attached to the world entity (`TheWorld`) and runs exclusively on the master simulation. It relies on the `inventoryitem` component to resolve grand owners for positional checks, and the `channelable` component to disable/enable portal channels during barrier events.

## Usage example
```lua
-- This component is automatically attached to TheWorld and not meant to be added manually
-- Triggering registration and activation events is done via other systems:
inst:PushEvent("ms_registertownportal", townportal)
inst:PushEvent("townportalactivated", townportal)
inst:PushEvent("townportaldeactivated", townportal)
```

## Dependencies & tags
**Components used:** `inventoryitem` (via `GetGrandOwner`), `channelable` (via `SetEnabled`)
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetDebugString()`
*   **Description:** Returns a human-readable string for debugging purposes, summarizing the number of registered portals and whether one is currently active.
*   **Parameters:** None.
*   **Returns:** `string` - e.g., `"Town Portals: 2, Town Portal Activated!"`.
*   **Error states:** None.

## Events & listeners
- **Listens to:**
  - `ms_registertownportal` (data: `townportal`) – Registers a new town portal.
  - `townportalactivated` (data: `townportal`) – Marks a portal as active and links it to valid portals.
  - `townportaldeactivated` (data: `portal`) – Removes a portal from being active and updates links.
  - `ms_wagpunk_barrier_isactive` (data: `isactive`) – Reactivates portal linkage logic when the barrier state changes.
  - `ms_wagpunk_barrier_playerentered` – Schedules a recheck of portal states when a player enters the barrier zone.
  - `ms_wagpunk_barrier_playerleft` – Schedules a recheck of portal states when a player leaves the barrier zone.
- **Pushes:**
  - `linktownportals` (data: optional `other_portal`) – Fired on a portal to indicate it should link with another portal (or clear current linking). `nil` data means unlinking.

`<`!-- End of documentation -->
