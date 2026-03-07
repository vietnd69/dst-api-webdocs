---
id: abigail_flower
title: Abigail Flower
description: Manages the ghostly bond-based summoned flower item that provides spell commands to ghostly friends and updates visual state based on bond level and proximity.
tags: [summoning, ghost, spell, inventory, fx]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f18364f9
system_scope: entity
---

# Abigail Flower

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `abigail_flower` prefab represents the haunted flower item used by Wendy's ghost companion Abigail. It dynamically provides spell commands via the `spellbook` component based on the bond level between the player and their ghost, and updates its visual representation (animation, sound, and inventory image) in response to bond level changes and positional context. It reacts to entity lifecycle events (put in inventory, dropped, sleep/wake) and syncs spell state across clients using network events. It also supports being used as a ghostly elixir target and integrates with ground-based proximity detection and summoning/removal FX systems.

## Usage example
```lua
-- The prefab is instantiated automatically via Prefab() at game startup.
-- Typical modder interaction involves listening for events or extending behavior:
local flower =_prefab("abigail_flower")
flower:AddComponent("mycustomcomp")
flower:ListenForEvent("abigail_flower._updatespells", my_handler)
```

## Dependencies & tags
**Components used:** `spellbook`, `aoetargeting`, `aoespell`, `ghostlyelixirable`, `inspectable`, `inventoryitem`, `lootdropper`, `summoningitem`, `burnable`
**Tags:** Adds `abigail_flower`, `give_dolongaction`, `ghostlyelixirable`, `FX` (for FX prefabs only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_bond_level` | number | `0` | Current visible bond level (0–3) used to drive animations and inventory overrides. |
| `_owner` | entity or nil | `nil` | The current owner entity (player) for spell command resolution. |
| `_container` | entity or nil | `nil` | Container (e.g., backpack) that holds the flower if equipped. |
| `_ongroundupdatetask` | periodic task or nil | `Task` | Periodic task that updates ground-level proximity and animations every 0.5s when dropped. |
| `flower_skin_id` | net_hash | `net_hash(...)` | Networked hash used to trigger skin updates via event `abiflowerskiniddirty`. |

## Main functions
### `OnOwnerUpdated(inst, owner)`
*   **Description:** Handles re-parenting when the flower is moved between containers, inventory slots, or backpacks; updates the owner reference, removes/adds event listeners for skill/summon events, and triggers spell refreshes.
*   **Parameters:** `inst` (entity), `owner` (entity or nil) — the new owner or container.
*   **Returns:** Nothing.
*   **Error states:** Does not fail; handles edge cases such as dropped items, equipped backpacks, or items in static containers.

### `UpdateGroundAnimation(inst)`
*   **Description:** Determines the closest valid ghost-friendly player within proximity distance, updates `_bond_level`, and adjusts animation and sound accordingly (e.g., `level0_pre` → `level0_loop`, `level2_loop`, etc.).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** If no valid player is within range, `_bond_level` defaults to `0`.

### `getstatus(inst, viewer)`
*   **Description:** Returns a string status code for inspection UI based on the current bond level visible to the viewer (if viewer is a ghost with bond data).
*   **Parameters:** `inst` (entity), `viewer` (entity or nil) — the entity inspecting the item.
*   **Returns:** `"LEVEL3"`, `"LEVEL2"`, `"LEVEL1"`, or `nil`.
*   **Error states:** Returns `nil` if `_bond_level` is `0` or viewer lacks ghostly bond data.

### `updatespells(inst, owner)`
*   **Description:** Configures the spellbook component with ghost commands appropriate for the owner.
*   **Parameters:** `inst` (entity), `owner` (entity or nil).
*   **Returns:** Nothing.
*   **Error states:** If `owner` is `nil`, sets spellbook items to an empty table.

### `DoClientUpdateSpells(inst, force)`
*   **Description:** (Client-only) Recalculates spell items based on the local player and refreshes spellbook if needed; registers/removes event callbacks for skill activation/deactivation.
*   **Parameters:** `inst` (entity), `force` (boolean) — whether to force a refresh.
*   **Returns:** Nothing.
*   **Error states:** No-op if owner hasn’t changed and `force` is `false`.

### `OnUpdateSpellsDirty(inst)`
*   **Description:** Triggers client-side spell refresh via network event `abigail_flower._updatespells`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onputininventory"` → `topocket` (stops ground updates, refreshes owner context)  
  - `"ondropped"` → `toground` (starts ground proximity updates)  
  - `"unequipped"`/`"equipped"` (container events) → `onequipped`/`onunequipped`  
  - `"abiflowerskiniddirty"` → `OnSkinIDDirty`  
  - `"abigail_flower._updatespells"` (client) → `OnUpdateSpellsDirty`  
  - `"onactivateskill_server"`, `"ondeactivateskill_server"`, `"ghostlybond_summoncomplete"`, `"ghostlybond_recallcomplete"` (server-side skill/summon state changes)  
  - `"spellupdateneeded"` → `Server_UpdateSkills`  
- **Pushes:**  
  - `"abigail_flower._updatespells"` (network event) to trigger client-side spell refresh  
  - `"animover"` (on FX prefabs only) → triggers `Remove`