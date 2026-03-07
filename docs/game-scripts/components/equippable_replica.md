---
id: equippable_replica
title: Equippable Replica
description: Manages network-replicated equipment slot and restriction logic for equippable items in DST's client-server architecture.
tags: [network, inventory, equipment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8e4d0899
system_scope: network
---

# Equippable Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Equippable Replica` is a client-side component that provides synchronized access to equip slot and unequipping restriction state for equippable items. It mirrors data from the server-side `equippable` component and integrates with `inventoryitem` and `linkeditem` to enforce equip rules (e.g., owner-only restrictions) on the client. It does not own state but proxies networked values, enabling consistent behavior between server authority and client rendering.

## Usage example
```lua
-- Client-side check: determine if a held item is equipped in its slot
if inst.replica.equippable:IsEquipped() then
    print("Item is currently equipped.")
end

-- Prevent a player from unequipping a critical item
inst.replica.equippable:SetPreventUnequipping(true)
```

## Dependencies & tags
**Components used:** `equippable` (server-side), `linkeditem` (server-side), `inventoryitem` (server-side), `equipslotutil`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_equipslot` | `net_tinybyte` or `net_smallbyte` | `0` | Networked equip slot ID. Uses `net_tinybyte` if `EquipSlot.Count() <= 7`, otherwise `net_smallbyte`. |
| `_preventunequipping` | `net_bool` | `false` | Networked flag indicating whether the item can be unequipped. |

## Main functions
### `SetEquipSlot(eslot)`
*   **Description:** Sets the networked equip slot ID for this item. Must be called server-side to trigger sync to clients.
*   **Parameters:** `eslot` (EquipSlot constant) — a slot identifier from `equipslotutil.lua` (e.g., `EquipSlot.BACK`, `EquipSlot.HANDS`).
*   **Returns:** Nothing.
*   **Error states:** None — silently truncates or clamps invalid slot IDs via `EquipSlot.ToID()`.

### `EquipSlot()`
*   **Description:** Returns the current equip slot ID as a symbolic constant.
*   **Parameters:** None.
*   **Returns:** (EquipSlot constant) — the slot identifier (e.g., `EquipSlot.HELMET`).
*   **Error states:** May return `nil` if `EquipSlot.FromID()` receives an out-of-range ID.

### `IsEquipped()`
*   **Description:** Determines whether the item is currently equipped on an entity. Falls back to client-side heuristics if the server-side `equippable` component is unavailable.
*   **Parameters:** None.
*   **Returns:** (boolean) — `true` if equipped, `false` otherwise.
*   **Error states:** Returns `false` if no `equippable` or `inventoryitem` component is available on the target entity.

### `IsRestricted(target)`
*   **Description:** Checks if a given entity (usually a player) is allowed to equip this item. Enforces `linkeditem` owner restrictions and `inventoryitem` tag-based restrictions.
*   **Parameters:** `target` (Entity) — the entity attempting to equip the item.
*   **Returns:** (boolean) — `true` if the item is restricted for `target`, `false` otherwise.
*   **Error states:** Returns `false` for non-player entities (`target` must have `player` tag to trigger restrictions).

### `ShouldPreventUnequipping()`
*   **Description:** Returns whether unequipping this item is blocked.
*   **Parameters:** None.
*   **Returns:** (boolean) — `true` if unequipping is prevented.
*   **Error states:** None.

### `SetPreventUnequipping(shouldprevent)`
*   **Description:** Sets the networked flag to prevent or allow unequipping. Must be called server-side to sync to clients.
*   **Parameters:** `shouldprevent` (boolean) — if `true`, the item cannot be unequipped.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
