---
id: forestresourcespawner
title: Forestresourcespawner
description: Manages periodic spawning of renewable forest resources such as flint, saplings, and berry bushes near spawn points when no players are nearby.
tags: [resource, world, environment, spawning]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5c3c03b2
system_scope: world
---

# Forestresourcespawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ForestResourceSpawner` is a server-side component responsible for automatically regenerating renewable natural resources (e.g., flint, grass, berry bushes) in the forest world. It operates by periodically selecting a registered spawn point and spawning missing resource prefabs within a radius around that point — but only if no players are nearby. This ensures resources regenerate without interference from active players. The component relies on a list of "renewable sets", each mapping target-resource prefabs to potential replacement prefabs, and uses map filtering to ensure valid placement.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("forestresourcespawner")
-- Resources will begin regenerating when the component receives the "ms_enableresourcerenewal" event with enable=true
-- Spawn points must be registered via "ms_registerspawnpoint" events
inst.components.forestresourcespawner:Enable()  -- Not a direct method — use event instead
inst:PushEvent("ms_enableresourcerenewal", { enable = true })
```

## Dependencies & tags
**Components used:** None — this component does not call `inst.components.X` methods.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
None — the component exposes no public methods; functionality is controlled entirely via events.

## Events & listeners
- **Listens to:**
  - `ms_registerspawnpoint` — triggered when a new spawn point entity is added; registers it for resource renewal. Handler: `OnRegisterSpawnPoint`.
  - `ms_enableresourcerenewal` — enables or disables resource renewal. Handler: `OnEnableResourceRenewal`.
- **Pushes:** None — this component does not fire events.

### Event Details
- `ms_registerspawnpoint`
  - **Payload:** `{ spawnpt = inst }`, where `spawnpt` is an entity instance representing a registered spawn point.
  - **Behavior:** Adds the spawn point to the internal `_spawnpts` list and registers for its `onremove` event to automatically unregister it upon removal.

- `ms_enableresourcerenewal`
  - **Payload:** `{ enable = boolean }`
  - **Behavior:** Starts or stops the periodic renewal task depending on the `enable` flag. If `enable` is `true`, the renewal loop begins via `Start()`; otherwise, `Stop()` cancels any pending task.

### Notes
- The renewal task runs in a loop: each cycle selects a spawn point, checks for nearby players (`MIN_PLAYER_DISTANCE = 240`), and attempts to spawn up to 3 missing resources per renewable set within `RENEW_RADIUS = 60`.
- Placement uses map validation (`CanPlantAtPoint`, `IsDeployPointClear`, `CanPlacePrefabFilteredAtPoint`) and avoids roads.
- `easing.inQuint` is used to bias spawn point selection toward earlier points in the list.
