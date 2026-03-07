---
id: spider_web_spit_creep
title: Spider Web Spit Creep
description: Creates a short-lived, non-persistent ground creep effect under a spider's spit projectile impact.
tags: [fx, environment, creep]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b58eefd0
system_scope: environment
---

# Spider Web Spit Creep

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spider_web_spit_creep` is a temporary prefab instance that visualizes the residual effect of a spider's spit impact by applying a ground creep (e.g., sticky web residue) on the terrain. It is created only on the master simulation and automatically destroyed after 5 seconds. This prefab does not persist across sessions and has no functional logic beyond setting up its physical area and scheduling removal.

## Usage example
This prefab is instantiated internally by the game when a spider fires spit at a surface. Modders do not typically create it directly, but if needed:

```lua
local inst = Prefab("spider_web_spit_creep")
if inst and TheWorld.ismastersim then
    inst.components.groundcreepentity:SetRadius(3)
    inst:DoTaskInTime(5, inst.Remove)
    inst.persists = false
end
```

## Dependencies & tags
**Components used:** `transform`, `groundcreepentity`, `network`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This prefab is instantiated via a `Prefab` function — the `fn` function serves as the constructor.

### `fn()`
*   **Description:** The prefab constructor. Initializes the entity with required components, configures the ground creep radius, sets persistence off, and schedules self-destruction after 5 seconds.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — a fully configured but non-persistent spider spit creep entity, or an incomplete entity on non-master clients.
*   **Error states:** Returns early on non-mastersim clients without completing setup.

## Events & listeners
None identified.