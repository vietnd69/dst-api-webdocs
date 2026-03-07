---
id: firecrackers
title: Firecrackers
description: A consumable explosive item that detonates when ignited, creating a chain reaction of physical propulsion and startle effects on nearby entities.
tags: [combat, explosion, inventory, physics]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 06e4c894
system_scope: world
---

# Firecrackers

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `firecrackers` prefab represents a stackable explosive item that ignites after a fuse timer, then triggers a cascade of physical behavior: it launches itself into the air with random velocity, animates in-flight using a spinning effect, and startles nearby entities (`canbestartled` tag) within range. Each detonation consumes part of the stack, repeating until fully exhausted. This behavior relies on interactions with `burnable`, `inventoryitem`, and `stackable` components.

## Usage example
```lua
local inst = SpawnPrefab("firecrackers")
inst.Transform:SetPosition(x, y, z)
inst.components.burnable:Ignite(inst)
```

## Dependencies & tags
**Components used:** `stackable`, `inventoryitem`, `burnable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `physics`, `network`  
**Tags:** Adds `explosive`, `NOCLICK`, `scarytoprey` during detonation; checks `canbestartled` on nearby entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `starttask` | `Task` or `nil` | `nil` | Task handle for the delayed fuse timer; `nil` means not ignited. |
| `persists` | `boolean` | `true` (default) → `false` after ignition | Controls whether the item saves to world save; set to `false` once active. |

## Main functions
### `DoPop(inst, remaining, total, level, hissvol)`
* **Description:** Handles one stage of the firecracker's detonation sequence: spawns an explosion FX, startles nearby entities, updates animation to remove visible stages, and re-launches itself for the next stage if stack remains. Recursively schedules the next `DoPop` call.
* **Parameters:**
  * `inst` (`Entity`) — The firecracker instance.
  * `remaining` (`number`) — How many detonation steps remain.
  * `total` (`number`) — Original stack count at start.
  * `level` (`number`) — Current visual stage level (controls which layers are hidden).
  * `hissvol` (`number`) — Current volume of the fuse sound.
* **Returns:** Nothing.
* **Error states:** None; the recursive call schedules the next step if `remaining > 1`, otherwise removes the entity.

### `StartExploding(inst, count)`
* **Description:** Finalizes ignition setup: adds `NOCLICK` and `scarytoprey` tags, sets low friction for smooth movement, and initiates the first `DoPop` with full stack count.
* **Parameters:**
  * `inst` (`Entity`) — The firecracker instance.
  * `count` (`number`) — Number of stages (computed from stack size and tuning).
* **Returns:** Nothing.

### `StartFuse(inst)`
* **Description:** Begins the fuse phase: removes the `burnable` component, plays the fuse animation and sound, schedules `StartExploding` after animation duration, removes the `stackable` component, and disables persistence.
* **Parameters:** `inst` (`Entity`) — The firecracker instance.
* **Returns:** Nothing.

### `OnIgniteFn(inst)`
* **Description:** Called when the firecracker is ignited. Schedules `StartFuse` with zero delay if not already ignited; prevents pickup during active fuse by setting `canbepickedup = false`.
* **Parameters:** `inst` (`Entity`) — The firecracker instance.
* **Returns:** Nothing.

### `OnExtinguishFn(inst)`
* **Description:** Called if the firecracker is extinguished before ignition completes. Cancels the pending fuse task (if any), resets `starttask` to `nil`, and restores pickup (`canbepickedup = true`).
* **Parameters:** `inst` (`Entity`) — The firecracker instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly.  
- **Pushes:** `startle` — fires on nearby entities with tag `canbestartled` during each `DoPop` call (via `v:PushEvent("startle", { source = inst })`).