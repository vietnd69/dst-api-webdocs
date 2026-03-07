---
id: wortox_reviver
title: Wortox Reviver
description: Manages the Wortox player's life revival mechanic by storing and releasing souls, linked to skill tree progression and owner identity.
tags: [inventory, skilltree, soul, teleport]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b5001815
system_scope: inventory
---

# Wortox Reviver

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wortox_reviver` prefab represents the physical item used by Wortox to revive fallen souls. It functions as a consumable spell item that stores soul capacity based on time (perishable) and owner skill progression. When consumed, it either frees stored souls (self-use) or teleports Wortox to their owner (when used on another Wortox or the owner). It dynamically adapts its consumption behavior and network identity based on the owner's skill tree states, particularly `wortox_lifebringer_1`, `wortox_lifebringer_2`, and `wortox_lifebringer_3`. The item attaches to an owner via `linkeditem`, tracks spoilage via `perishable`, and integrates with `spellcaster` for teleportation logic.

## Usage example
```lua
-- Typically created by the game engine for Wortox upon character selection or load.
-- Example usage in mod code (not standard client-side usage):
local reviver = SpawnPrefab("wortox_reviver")
if reviver then
    reviver.components.inventoryitem:SetOwner(some_player)
    reviver.components.spellcaster:SetSpellFn(my_custom_spell_fn)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `linkeditem`, `perishable`, `spellcaster`, `stackable`, `skilltreeupdater`, `rider`, `inspectable`, `tradable`
**Tags:** `reviver`, `show_spoilage`, `crushitemcast`, `WORTOX_REVIVER_LOCK_spellcaster` (added conditionally)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wortox_reviver_body` | Entity or nil | `nil` | Reference to the spawned visual body entity when attached to a player. |
| `spelltype` | string | `"SQUEEZE"` | Initial spell type; overridden dynamically based on skill tree. |
| `swap_build` | string | `"swap_wortox_reviver"` | Build name for the swap mesh when equipped. |
| `swap_symbol` | string | `"swap_wortox_reviver"` | Symbol name used for swap attachment. |
| `crushitemcast_sound` | string | `"meta5/wortox/ttheart_in_f18"` | Sound played when casting via crush (e.g., Squeeze). |
| `displaynamefn` | function | `DisplayNameFn` | Callback to generate the display name, incorporating owner name. |
| `OnStartBody` | function | `OnStartBody` | Callback invoked when the item attaches to a new owner. |
| `OnStopBody` | function | `OnStopBody` | Callback invoked when the item detaches from an owner. |
| `OnConsume` | function | `OnConsume` | Callback invoked when the item is consumed (consumed/removed). |
| `OnBuiltFn` | function | `OnBuiltFn` | Callback invoked when crafted, for owner attachment. |
| `OnLoad` | function | `OnLoad` | Callback invoked when loaded from save, triggers `OnInitFromLoad`. |

## Main functions
### `TryToAttachWortoxID(inst, owner)`
* **Description:** Attaches the owner's user ID to the `linkeditem` component if the owner has the `wortox_lifebringer_1` skill activated. Prevents attachment if the item is already linked or owner is invalid.
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
  - `owner` (Entity or nil) — the potential owner entity (e.g., player).  
* **Returns:** Nothing. Modifies `inst.components.linkeditem` if conditions are met.

### `SetAllowConsumption(inst, allow)`
* **Description:** Controls whether the spell can be cast. Sets the spell type to `WORTOX_REVIVER_LOCK` (prevents casting) if `allow` is false; otherwise removes the spell type restriction.
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
  - `allow` (boolean) — whether to allow consumption/casting.  
* **Returns:** Nothing. Updates `inst.components.spellcaster.spelltype`.

### `SpellFn(inst, target, pos, caster)`
* **Description:** Implements the core teleportation and soul-release logic. If used on self (caster == owner), spawns and drops soul prefabs based on current spoilage and recipe cost. If used on another target, teleports the caster to the owner’s location (with nearby-platform collision resolution).
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
  - `target` (Entity or nil) — the target (often the same as `caster`).  
  - `pos` (Vec3 or nil) — target world position.  
  - `caster` (Entity or nil) — the entity initiating the spell.  
* **Returns:** Nothing. May spawn prefabs, push events (`wortox_reviver_failteleport`), or change stategraphs.  
* **Error states:**  
  - Returns early if `caster` is nil.  
  - Pushes `wortox_reviver_failteleport` event if `owner` is missing after casting started or if teleport path is blocked.

### `OnConsume(inst, owner)`
* **Description:** Handles item removal upon consumption. If the item is stacked, only the consumed instance is removed; otherwise the entire entity is destroyed.
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
  - `owner` (Entity or nil) — the consuming entity (currently unused in logic).  
* **Returns:** Nothing. Removes `inst` or its stack portion.

### `OnPerish(inst)`
* **Description:** Converts the spoiled item into a `wortox_soul` and attempts to drop it at the owner’s position (if owner exists); otherwise spawns it in world and fades out.
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
* **Returns:** Nothing. Spawns soul, drops it via `inventoryitem:DropItem`, and removes `inst`.

### `OnStartBody(inst, owner)`
* **Description:** Spawns and attaches a visual `wortox_reviver_body` entity to the owner as a follower (e.g., for animation synced to player swap). Removes any existing body first.
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
  - `owner` (Entity) — the player now equipped with the item.  
* **Returns:** Nothing. Sets `inst.wortox_reviver_body` and registers an event listener to clean it on removal.

### `OnStopBody(inst, owner)`
* **Description:** Removes the `wortox_reviver_body` when the item is unequipped.
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
  - `owner` (Entity) — the player detaching the item (unused in logic).  
* **Returns:** Nothing.

### `DisplayNameFn(inst)`
* **Description:** Generates a localized display name including the owner’s name (e.g., “Wortox’s Reviver — [OwnerName]”).
* **Parameters:**  
  - `inst` (Entity) — the `wortox_reviver` instance.  
* **Returns:** `string` — formatted display name or `nil`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on `wortox_reviver_body`) — triggers `OnRemove_Body` to clear the body reference.  
  - `animover` (on `inst`) — fires `inst.Remove` in `OnPerish` after fade-out animation.  
- **Pushes:**  
  - `dropitem` (via `inventoryitem:DropItem`) — fired when dropping souls or perishables.  
  - `wortox_reviver_failteleport` — fired on failed teleport attempts.