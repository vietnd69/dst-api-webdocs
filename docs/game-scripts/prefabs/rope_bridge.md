---
id: rope_bridge
title: Rope Bridge
description: Manages the visual and functional representation of rope bridges in the world, including placement, animation states, and interaction with the rope bridge placement system.
tags: [world, bridge, placement, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f7a05114
system_scope: world
---

# Rope Bridge

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rope_bridge` system defines the game representation and behavior of rope bridges. It includes three prefabs: `rope_bridge_fx` (the actual bridge entity), `rope_bridge_kit` (the crafting item used to place bridges), and `rope_bridge_kit_placer` (the visual placement helper). The system coordinates with the `ropebridgemanager` component for bridge placement logic, and interacts with `deployable`, `stackable`, `inventory`, and `placer` components for functionality. It handles animation state transitions, sound effects, quaking detection, and minimap icon rendering.

## Usage example
```lua
-- Placing a rope bridge via inventory item
local bridge_kit = SpawnPrefab("rope_bridge_kit")
bridge_kit.components.stackable:SetStackSize(3)

-- The bridge_kit uses DEPLOYMODE.CUSTOM with a custom deployment function
-- Deployable behavior is configured in kitfn():
--   inst.components.deployable.ondeploy = OnDeploy
--   inst.components.deployable:SetDeployMode(DEPLOYMODE.CUSTOM)

-- At placement point, OnDeploy is called with target point and deployer
-- It checks for ropebridgemanager and spawns bridge segments via QueueCreateRopeBridgeAtPoint
```

## Dependencies & tags
**Components used:** `deployable`, `stackable`, `fuel`, `inventoryitem`, `placer`, `ropebridgemanager`, `quaker`, `inventory`, `inspectable`.  
**Tags:** `NOCLICK`, `decor`, `FX`, `CLASSIFIED`, `placer`, `deploykititem`, `usedeployspacingasoffset`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `killed` | boolean | `false` | Indicates whether the bridge has been destroyed. |
| `rope1`, `rope2` | entity | `nil` | Child entities for left/right rope visuals. |
| `icon` | entity | `nil` | Minimap icon entity. |
| `animdata` | net_smallbyte | — | Networked animation state data (packed byte). |
| `iconoffset` | net_tinybyte | `0` | Networked icon offset data for minimap display. |
| `pos` | Vector3 | — | Internal placement helper position (placer only). |
| `pieces` | table | `{}` | Array of bridge segment entities (placer only). |
| `numvisiblepieces` | number | `0` | Count of currently visible placement preview pieces (placer only). |

## Main functions
### `Rope_KillFX(inst)`
*   **Description:** Triggers bridge rope destruction animation and prepares entity removal. Only activates once per bridge instance.
*   **Parameters:** `inst` (entity) — the bridge instance to destroy.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `inst.killed` is already `true`.

### `CreateRope()`
*   **Description:** Creates and configures a single rope visual entity (no physics, non-persistent, parented to bridge).
*   **Parameters:** None.
*   **Returns:** entity — newly created rope entity with `ANIM_ORIENTATION.BillBoard`, bank `"rope_bridge"`, and `KillFX` method attached.

### `OnAnimData(inst)`
*   **Description:** Updates rope animations based on packed `animdata` value. Called on non-master clients when `animdatadirty` event fires.
*   **Parameters:** `inst` (entity) — bridge instance with `animdata` network component.
*   **Returns:** Nothing.

### `GetAnimDataForState(inst, state)`
*   **Description:** Encodes the current state (`place`, `idle`, `shake`, `break`) into the `animdata` byte while preserving rope variation bits.
*   **Parameters:** `inst` (entity), `state` (string) — animation state identifier.
*   **Returns:** number — updated packed animation data value.

### `SkipPre(inst)`
*   **Description:** Transitions bridge from placement animation directly to idle state, canceling sounds.
*   **Parameters:** `inst` (entity) — bridge instance.
*   **Returns:** Nothing.

### `ShakeIt(inst)`
*   **Description:** Initiates bridge shaking animation and looped sound effect, unless bridge is killed or asleep.
*   **Parameters:** `inst` (entity) — bridge instance.
*   **Returns:** Nothing.

### `KillFX(inst)`
*   **Description:** Triggers bridge destruction sequence: plays break sound, sets up break animation, and schedules removal.
*   **Parameters:** `inst` (entity) — bridge instance.
*   **Returns:** Nothing.

### `SetIconOffset(inst, offset)`
*   **Description:** Updates minimap icon visibility and position based on `offset` value (0: hidden, 1: center, 2: offset).
*   **Parameters:** `inst` (entity), `offset` (number or nil).
*   **Returns:** Nothing.

### `CLIENT_CanDeploy(inst, pt, mouseover, deployer, rotation)`
*   **Description:** Validates whether a rope bridge can be deployed at a point, checking quaking state, deployment constraints, and stack/inventory availability.
*   **Parameters:**  
  `inst` (entity) — bridge kit item,  
  `pt` (Vector3) — target placement point,  
  `mouseover` (boolean) — whether targeting via mouse,  
  `deployer` (entity) — player attempting placement,  
  `rotation` (number) — rotation value (unused).  
*   **Returns:** boolean — `true` if deployment is valid and sufficient resources exist.
*   **Error states:** Returns `false` if quaking is active or deployment constraints fail.

### `OnDeploy(inst, pt, deployer)`
*   **Description:** Master-side deployment handler. Consumes bridge kits or items, then queues bridge segment creation through `ropebridgemanager`.
*   **Parameters:** `inst` (entity) — bridge kit item, `pt` (Vector3), `deployer` (entity).
*   **Returns:** Nothing.
*   **Error states:** Early exit if ropebridgemanager missing, deployment check fails, or insufficient resources.

### `placer_onupdatetransform(inst)`
*   **Description:** Placement helper callback. Updates bridge segment preview positions, orientations, and tinting (green=valid, red=invalid) based on deployment feasibility.
*   **Parameters:** `inst` (entity) — placer helper instance.
*   **Returns:** Nothing.

### `placer_oncanbuild(inst, mouseblocked)`
*   **Description:** Placement helper callback. Controls helper visibility and inventory icon based on build state.
*   **Parameters:** `inst` (entity), `mouseblocked` (boolean).
*   **Returns:** Nothing.

### `placer_oncannotbuild(inst, mouseblocked)`
*   **Description:** Placement helper callback. Toggles visibility and icon if build invalid and preview pieces exist.
*   **Parameters:** `inst` (entity), `mouseblocked` (boolean).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (on `rope_bridge_fx`) — transitions from `bridge_place` to `bridge_idle`, removes entity if killed.
- **Pushes:** `animdatadirty`, `iconoffsetdirty` (network events for `rope_bridge_fx` to synchronize client visuals).
- **Deploy callbacks:** `CLIENT_CanDeploy`, `OnDeploy` — used internally by `deployable` component (`DEPLOYMODE.CUSTOM`).