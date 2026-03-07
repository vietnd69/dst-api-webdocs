---
id: beef_bell
title: Beef Bell
description: Manages the logic for the Beef Bell item, including linking to a beefalo, inventory interactions, revive functionality for the Shadow Beef Bell variant, and synchronization between server and client.
tags: [inventory, leader, mounting, revival]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 12e26e32
system_scope: inventory
---

# Beef Bell

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `beef_bell` prefab manages the behavior of both the standard Beef Bell and the Shadow Beef Bell. It acts as a container that can be linked to a single `beefalo` via the `leader` component, enabling the bell to control a follower beefalo. The shadow variant adds revive mechanics and recharging capabilities. The component integrates tightly with the `inventoryitem`, `useabletargeteditem`, `leader`, `migrationpetowner`, `rideable`, `health`, `floater`, `rechargeable`, and `skinner_beefalo` components.

## Usage example
```lua
-- Typical server-side usage when spawning the bell
local bell = Prefab("beef_bell", ...)

-- Attach to an entity and link a beefalo
bell.components.useabletargeteditem:SetTargetPrefab("beefalo")
bell.components.leader:AddFollower(beefalo)
bell.components.inventoryitem:SetOnPutInInventoryFn(OnPutInInventory)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `useabletargeteditem`, `leader`, `migrationpetowner`, `health`, `rideable`, `rider`, `floater`, `rechargeable`, `skinner_beefalo`, `tradable`, `Inspectable`.

**Tags:** `bell`, `donotautopick`, `shadowbell` (only for `shadow_beef_bell`), `rechargeable` (only for `shadow_beef_bell`), `nobundling` (added when linked to a beefalo), `oncooldown` (only for `shadow_beef_bell`).

## Properties
No public properties are exposed as fields. State is stored in `inst` fields such as `_IsLinkedBell`, `_OnPlayerDesmounted`, `CleanUpBell`, `HasBeefalo`, `GetBeefalo`, `OnStopUsing`, and `OnIsBondedDirty` — these are internal helper functions attached directly to `inst`.

## Main functions
### `GetBeefalo(inst)`
*   **Description:** Returns the first follower beefalo in the leader's follower list, or `nil` if none exists.
*   **Parameters:** `inst` (entity) — the bell entity.
*   **Returns:** Entity — the linked beefalo, or `nil`.
*   **Error states:** Returns `nil` if `inst.components.leader` is missing or has no followers.

### `GetAliveBeefalo(inst)`
*   **Description:** Returns the linked beefalo only if it exists and is not dead.
*   **Parameters:** `inst` (entity).
*   **Returns:** Entity — alive linked beefalo, or `nil`.

### `OnUsedOnBeefalo(inst, target, user)`
*   **Description:** Called when the bell is used on a beefalo. Links the bell to the beefalo, sets inventory visuals, and updates bonding state.
*   **Parameters:**  
    *   `inst` (entity) — the bell.  
    *   `target` (entity) — the target beefalo.  
    *   `user` (entity or `nil`) — the player using the bell.
*   **Returns:**  
    *   `boolean` — success.  
    *   `string?` — failure reason prefixed with `"BEEF_BELL_"`.
*   **Error states:** Returns `false, "BEEF_BELL_INVALID_TARGET"` if `target.SetBeefBellOwner` is missing; `false` if the beefalo is dead or another player has a linked bell.

### `OnStopUsing(inst, beefalo)`
*   **Description:** Handles cleanup when the bell is removed from use. Drops skins, clears followers, and resets bell appearance. For the shadow bell, handles ghost erosion and delayed removal of the dead beefalo.
*   **Parameters:**  
    *   `inst` (entity) — the bell.  
    *   `beefalo` (entity or `nil`) — the linked beefalo. If `nil`, retrieves via `GetBeefalo`.
*   **Returns:** Nothing.
*   **Error states:** If `beefalo` is dead and the bell is a shadow bell, it initiates a server-side erosion animation before removing the beefalo.

### `ShadowBell_OnIsBondedDirty(inst)`
*   **Description:** Adjusts the floating effect scale and reinitializes float effects for the shadow bell when bonding status changes.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ShadowBell_ReviveTarget(inst, target, doer)`
*   **Description:** Revives a dead beefalo linked to this shadow bell and applies the shadow curse debuff to the user. Also discharges the bell.
*   **Parameters:**  
    *   `inst` (entity) — the shadow bell.  
    *   `target` (entity) — the dead beefalo.  
    *   `doer` (entity) — the player performing the revive.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `player_despawn` — triggers `OnPlayerDespawned`.  
    - `dismounted` — temporary listener during dismount in `OnPlayerDespawned`.  
    - `isbondeddirty` (client-only for `shadow_beef_bell`) — triggers `OnIsBondedDirty`.
- **Pushes:**  
    - `invincibletoggle` (via `health.SetInvincible`) — when setting invincibility during despawn logic.  
    - `dropitem` (via `inventory.DropItem`) — when dropping a conflicting bell.  
    - `onclothingchanged` (via `skinner_beefalo.reloadclothing`) — when reloading clothing after load.  
    - `despawn` — to signal the linked beefalo should despawn.
