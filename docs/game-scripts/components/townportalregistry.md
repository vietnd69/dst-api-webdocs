---
id: townportalregistry
title: Townportalregistry
description: Manages the collection of town portals, tracks the currently activated portal, and handles dynamic linking between portals based on teleportation permissions and WagPunk barrier state.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 73483376
---

# Townportalregistry

## Overview
The `TownportalRegistry` component maintains a global registry of town portals within the world, tracks the currently activated portal, and manages inter-portal linking logic. It responds to activation/deactivation events, portal registration/removal, and WagPunk barrier state changes to determine which portals can be teleported between. This component runs exclusively on the master simulation.

## Dependencies & Tags
- **Required Components (on event payloads):**
  - `townportal` entities must have a `Transform` component (used for position queries).
  - `townportal` entities may have `inventoryitem` and/or `channelable` components (used optionally for ownership and state management).
- **Tags:** None explicitly added or removed by this component.
- **Environment:** Asserts `TheWorld.ismastersim`; does not instantiate on clients.

## Properties
No explicit public properties are defined via `self.` assignment in `_ctor`. All state is stored in private local variables inside the constructor closure.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | — | — | No public instance properties are initialized. Internal state (`_townportals`, `_activetownportal`, `linkedportals`) is kept in private scope. |

## Main Functions

### `self:GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the current state, including the number of registered portals and whether a portal is active.
* **Parameters:** None.

### `IsATownPortalActive()`
* **Description:** Returns `true` if a town portal is currently activated (i.e., `_activetownportal` is not `nil`), otherwise `false`.
* **Parameters:** None.

## Events & Listeners
- **Listens For:**
  - `"ms_registertownportal"` → triggers `OnRegisterTownPortal(inst, townportal)`
  - `"townportalactivated"` → triggers `OnTownPortalActivated(inst, townportal)`
  - `"townportaldeactivated"` → triggers `OnTownPortalDeactivated(inst, portal)`
  - `"ms_wagpunk_barrier_isactive"` → triggers `OnBarrierIsActive(inst, isactive)`
  - `"ms_wagpunk_barrier_playerentered"` → triggers `OnPlayerEnteredOrLeftBarrier(inst, player)`
  - `"ms_wagpunk_barrier_playerleft"` → triggers `OnPlayerEnteredOrLeftBarrier(inst, player)`
  - `"onremove"` (on individual town portal entities) → triggers `OnRemoveTownPortal(townportal)`

- **Pushes Events:**
  - `townportal:PushEvent("linktownportals")` — clears link state on deactivation or barrier entry.
  - `townportal:PushEvent("linktownportals", other_portal)` — notifies a portal of a new active link to another portal.
  - `"linktownportals"` is used to signal changes in portal linkage status to subscribers (e.g., UI or portal components).