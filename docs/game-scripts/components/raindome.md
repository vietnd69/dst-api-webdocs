---
id: raindome
title: Raindome
description: Manages a spherical rain-shield effect around an entity, dynamically tracking affected entities and adjusting coverage based on enabled state and radius.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: be9743b0
---

# Raindome

## Overview
This component implements a global rain-protection dome around an entity, which dynamically shields nearby entities (typically players) from rain when active. It operates in two modes: client-side updates to reflect networked radius changes and server-side (master sim) logic to manage entity inclusion/exclusion, registration of active dome sizes, and radius-based spatial queries.

## Dependencies & Tags
- **Components:** Relies on `rainimmunity` component being added to affected entities.
- **Tags added on enable:** `"raindome"` (on the dome entity itself), `"inspectable"` (for entity search).
- **Tags excluded in search:** `"INLIMBO"`.
- **Network Variables:** `raindome._activeradius` (synced `float`, triggers `_activeradiusdirty` event).
- **Global Support Functions:** `GetRainDomesAtXZ`, `IsUnderRainDomeAtXZ` use `TheSim:FindEntities` with `"raindome"` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | `number` | `16` (server only) | The *configured* radius of the dome. Only settable on master sim. |
| `enabled` | `boolean` | `false` (server only) | Whether the dome is currently active. Only modified on master sim. |
| `_activeradius` | `net_float` | `0` | The *actual* radius used by the dome (0 when disabled). Synced to clients. |
| `_lastactiveradius` | `number` | `0` (client only) | Tracks previous active radius on client for cleanup during updates. |

## Main Functions

### `SetRadius(radius)`
* **Description:** Sets the *configured* radius of the dome (server only). Does not immediately update active radius or覆盖; requires `Enable()` to apply.
* **Parameters:** `radius` (number) — New radius value.

### `Enable()`
* **Description:** Activates the dome: sets active radius to the configured `radius`, registers it globally, starts updating target list, and adds the `"raindome"` tag.
* **Parameters:** None.

### `Disable()`
* **Description:** Deactivates the dome: sets active radius to `0`, unregisters it globally, stops updating, and removes the `"raindome"` tag. Also removes rain immunity from previously affected entities.
* **Parameters:** None.

### `SetActiveRadius_Internal(new, old)`
* **Description:** Core internal helper used by `Enable`/`Disable`. Handles global dome size registration/unregistration, adding/removing tags, starting/stopping updates, and managing the list of affected entities.
* **Parameters:**  
  `new` (number) — New active radius (0 to disable).  
  `old` (number) — Previous active radius.

### `GetActiveRadius()`
* **Description:** Returns the current *active* radius (including 0 when disabled), matching `_activeradius`.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Periodically scans entities within configured `radius` and grants rain immunity to them (by calling `rainimmunity:AddSource`). Also updates the refresh delay based on target wakefulness.
* **Parameters:** `dt` (number) — Delta time since last frame.

## Events & Listeners
- **Listen:** `inst:ListenForEvent("_activeradiusdirty", OnActiveRadiusDirty)` — Client-side; triggers global registration/unregistration of active dome size when radius syncs.
- **Push (implicit via network):** `_activeradiusdirty` — Fired by network framework when `_activeradius` changes (not manually called here).
- **Push (global cleanup):** `_unreg_active_dome_size` and `_reg_active_dome_size` — Internal helpers, not events, used by `OnActiveRadiusDirty` and `OnRemoveEntity`.