---
id: raindome
title: Raindome
description: Manages a dynamic rain-shield dome entity that grants rain immunity to nearby entities within its active radius.
tags: [environment, weather, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: be9743b0
system_scope: environment
---

# Raindome

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RainDome` is a server-authoritative component responsible for simulating a protective dome that shields entities from rain. It tracks which entities are under its influence using the `rainimmunity` component, dynamically updates the effective radius based on configuration, and registers itself in a global spatial registry to enable efficient `IsUnderRainDomeAtXZ` and `GetRainDomesAtXZ` queries.

The component operates in two modes:
- **Master Sim only (`TheWorld.ismastersim == true`)**: Manages entity tracking, radius changes, and global registration.
- **Client only**: Reflects the active radius via a replicated float property.

It uses internal global state (`_sizes`, `_maxsize`) to optimize spatial queries by limiting `TheSim:FindEntities` calls to only domes large enough to potentially contain the query point.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("raindome")
inst.components.raindome:SetRadius(20)   -- dome radius
inst.components.raindome:Enable()        -- activate the dome
-- Entities within 20 units gain rain immunity
inst.components.raindome:Disable()       -- deactivate and release all sources
```

## Dependencies & tags
**Components used:** `rainimmunity`
**Tags:** Adds `raindome` when enabled; checks `inspectable` for target filtering; excludes entities with tag `INLIMBO`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | `16` (only on master sim) | Desired maximum radius of the dome; only updated on master sim. |
| `enabled` | boolean | `false` | Whether the dome is currently active. |
| `_activeradius` | `net_float` | `0` | Replicated current radius (0 when disabled). |
| `_lastactiveradius` | number | `0` (client only) | Cached last active radius for cleanup in `_unreg_active_dome_size`. |
| `targets` | table | `nil` (server only) | Set of currently shielded entities. |
| `newtargets` | table | `nil` (server only) | Temporary buffer for newly discovered entities during updates. |
| `delay` | number | random `[0, 0.5)` (server only) | Cooldown timer before next target scan. |

## Main functions
### `SetRadius(radius)`
* **Description:** Sets the target radius for the dome. Only valid on the master sim.
* **Parameters:** `radius` (number) – the desired maximum radius.
* **Returns:** Nothing.

### `Enable()`
* **Description:** Activates the dome. Begins tracking nearby entities and registering the dome size globally.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if already enabled or not on master sim.

### `Disable()`
* **Description:** Deactivates the dome. Removes rain immunity from all previously covered entities and unregisters its size.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if already disabled or not on master sim.

### `GetActiveRadius()`
* **Description:** Returns the current effective radius of the dome.
* **Parameters:** None.
* **Returns:** `number` – the active radius (0 when disabled, positive when active). Same as `radius` when enabled and unchanged.

### `SetActiveRadius_Internal(new, old)`
* **Description:** Internal function to atomically update the active radius and synchronize global registration and entity shielding.
* **Parameters:**
  * `new` (number) – new radius value.
  * `old` (number) – previous radius value (used for cleanup).
* **Returns:** Nothing.
* **Error states:** Must be called only from master sim; handles transitions to/from zero radius and updates entity shielding accordingly.

## Events & listeners
- **Listens to:** 
  - `_activeradiusdirty` (client only) – triggers `OnActiveRadiusDirty` to update global size registry when the network-replicated radius changes.
  - `onremove` on target entities (server only) – invoked via `RainImmunity` to auto-unregister when a shielded entity is removed.

- **Pushes:** None directly. Entity tag and `rainimmunity` changes affect downstream systems.
