---
id: vault_teleporter
title: Vault Teleporter
description: Manages teleportation behavior and state for the Vault Teleporter structure, including channeling, hauntable interactions, and visual/animation states based on power and construction status.
tags: [teleportation, boss, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1039cbe7
system_scope: world
---

# Vault Teleporter

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `vault_teleporter` component governs the behavior of the Vault Teleporter structure, including its channeling logic, hauntable interactions, visual states (idle, powered, unpowered, broken, under construction), and teleportation effects. It integrates with the `channelable`, `hauntable`, `inspectable`, and `trader` components to support a multi-state lifecycle based on power availability and player activity. It also coordinates sound and animation events for teleportation departures and arrivals.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vault_teleporter")
-- Initialize state
inst.MakeFixed()
-- Set powered state (e.g., after repairing)
inst:SetPowered(true)
-- Trigger teleport departure effect
inst:OnDepartFx()
-- Spawn a vault orb
inst:SpawnOrb()
```

## Dependencies & tags
**Components used:** `channelable`, `hauntable`, `inspectable`, `trader`, `vault_teleporter`  
**Tags:** `vault_teleporter`, `staysthroughvirtualrooms`, `DECOR`, `NOCLICK`, `trader_repair`, `donotautopick`

## Properties
No public properties

## Main functions
### `SetPowered(powered)`
*   **Description:** Updates the teleporter's power state, toggling animation, sound, and hauntable presence. Does not handle broken state.
*   **Parameters:** `powered` (boolean) - whether the device should be powered on.
*   **Returns:** Nothing.

### `MakeFixed()`
*   **Description:** Restores the teleporter to a fully functional, fixed state. Removes trader/repair UI, enables channeling, and sets animated state to idle off.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakeBroken()`
*   **Description:** Sets the teleporter to broken state, requiring player interaction to repair with a vault orb. Adds `trader` and `trader_repair` tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakeUnderConstruction()`
*   **Description:** Puts the teleporter into an unfinished state (e.g., during initial construction). Removes trader/hauntable components and changes name in UI.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SpawnOrb()`
*   **Description:** Spawns a `vault_orb` prefab at a randomized position near the teleporter.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnPlaced(inst)`
*   **Description:** Configures orientation and direction code upon placement. Updates base visual orientation and synchronization.
*   **Parameters:** None (called with `inst` as argument).
*   **Returns:** Nothing.

### `OnDepartFx(inst)`
*   **Description:** Plays the teleport departure sound effect (`rifts6/vault_portal/teleport_fx`). Used before teleportation occurs.
*   **Parameters:** None (called with `inst` as argument).
*   **Returns:** Nothing.

### `OnArriveFx(inst)`
*   **Description:** Plays the teleport arrival sound effect (`rifts6/vault_portal/teleport_arrive_FX`). Used after teleportation completes.
*   **Parameters:** None (called with `inst` as argument).
*   **Returns:** Nothing.

### `CheckForNearbyGhosts(inst)`
*   **Description:** Detects players within 12 units who can trigger channeling; starts/stops channeling per player presence. Used for default (non-lobby) teleporter hauntable behavior.
*   **Parameters:** None (called with `inst` as argument).
*   **Returns:** Nothing.

### `AddHauntable(inst)`
*   **Description:** Adds the `hauntable` component if missing and configures cooldown/haunt/unhaunt callbacks based on target room (lobby vs. vault).
*   **Parameters:** None (called with `inst` as argument).
*   **Returns:** Nothing.

### `UpdateHauntable(inst)`
*   **Description:** Updates hauntable behavior depending on whether teleporter targets the lobby or the vault (different cooldowns and haunt handlers).
*   **Parameters:** None (called with `inst` as argument).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `dircodedirty` (client-side only) – triggers `OnDirCodeDirty`; `newvaultteleporterroomid` – calls `OnNewVaultTeleporterRoomID`; `animover` – handles post-repair animation completion.
- **Pushes:** `ms_vault_teleporter_channel_start` – fired when channeling starts (with `inst` and `doer`); `ms_vault_teleporter_channel_stop` – fired when channeling stops (with `inst`, `aborted`, and `doer`); `ms_vault_teleporter_repair` – fired after repair finishes (with `inst` and `doer`).