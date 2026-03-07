---
id: moonrockidol
title: Moonrockidol
description: A moon-related artifact that activates when near a moon portal and deactivates when stored or moved away.
tags: [inventory, environment, portal]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6b35460a
system_scope: environment
---

# Moonrockidol

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonrockidol` prefab functions as a portable moon relic that emits light and displays a special animation when positioned near a moon portal. It uses the `inventoryitem` and `moonrelic` components to manage its behavior in inventories and during proximity events. Activation occurs automatically upon proximity to a `moonportal` entity and deactivation occurs when picked up or when the timer expires.

## Usage example
```lua
local inst = SpawnPrefab("moonrockidol")
inst.Transform:SetPosition(x, y, z)

-- Force activation near a moon portal
inst:PushEvent("ms_moonportalproximity", { instant = true })
```

## Dependencies & tags
**Components used:** `inventoryitem`, `moonrelic`, `inspectable`
**Tags:** Adds `moonportalkey`, `donotautopick`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_task` | `Task` or `nil` | `nil` | Reference to the delayed task that reverts the idol after proximity expires. |

## Main functions
### `turnon(inst, instant)`
* **Description:** Activates the idol by playing the `idol_loop` animation and enabling a light override (`0.2`). If `instant` is `true`, it jumps to a random frame in the animation loop; otherwise, it plays `idol_pre` then `idol_loop`.
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
  * `instant` (boolean) — Whether to start the loop immediately or with a short transition.
* **Returns:** Nothing.

### `turnoff(inst)`
* **Description:** Deactivates the idol by playing the `idle` animation and disabling light override (`0`).
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
* **Returns:** Nothing.

### `onmoonportalproximity(inst, data)`
* **Description:** Handles proximity to a moon portal. Cancels any existing `_task`, sets the inventory image name to `"moonrockidolon"`, and activates the idol if not held. Starts a 1.05-second delayed task (`onproximitytimeout`) to reset the image and deactivate if no longer near the portal.
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
  * `data` (table, optional) — Optional event data; if present and contains `instant`, triggers immediate activation.
* **Returns:** Nothing.

### `onproximitytimeout(inst)`
* **Description:** Runs after the 1.05-second proximity delay. Resets the inventory image name (via `ChangeImageName` with no arguments, reverting to default), and turns off the idol if it is no longer held.
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
* **Returns:** Nothing.

### `topocket(inst)`
* **Description:** Callback triggered when the idol is placed in an inventory. If `_task` is active, turns off the idol immediately.
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
* **Returns:** Nothing.

### `toground(inst)`
* **Description:** Callback triggered when the idol is dropped. If `_task` is active, turns on the idol (for re-activation upon ground placement near portal).
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
* **Returns:** Nothing.

### `onbuilt(inst, builder)`
* **Description:** Called when the idol is built/placed by a player. Immediately checks for moon portal proximity within radius `8` using `FindEntities`, and if found, triggers `onmoonportalproximity` with `instant = true`.
* **Parameters:** 
  * `inst` (Entity) — The idol instance.
  * `builder` (Entity) — The entity that built the idol (unused internally).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `onputininventory` → `topocket`
  - `ondropped` → `toground`
  - `ms_moonportalproximity` → `onmoonportalproximity`
- **Pushes:** None directly; relies on external events to drive state changes.