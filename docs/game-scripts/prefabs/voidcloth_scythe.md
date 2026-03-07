---
id: voidcloth_scythe
title: Voidcloth Scythe
description: A multiplayer-ready weapon that synergizes with the Voidcloth Set, providing increased damage and planar damage when equipped alongside a Voidcloth Hat, while also enabling shadow-empowered area attacks and harvest automation.
tags: [combat, setbonus, shadow, inventory, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a18342ac
system_scope: combat
---

# Voidcloth Scythe

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`voidcloth_scythe` is a composite prefab consisting of two main entities: the `voidcloth_scythe` weapon itself and its associated local-effect entity `voidcloth_scythe_fx`. The scythe functions as a high-utility harvesting and combat tool with built-in set-bonus logic and shadow-skill synergies. It integrates tightly with the `equippable`, `weapon`, `tool`, `finiteuses`, `planardamage`, `floater`, `inspectable`, `inventoryitem`, and `shadowlevel` components. It dynamically responds to being equipped/unequipped, repaired, or broken, and coordinates a set of client-side follow effects (`voidcloth_scythe_fx`) via `FollowSymbol` and `HighlightChild` systems.

## Usage example
The scythe is typically instantiated as a prefabricated item and added to a player's inventory or equipped directly:
```lua
-- Typical usage within a prefab's OnEquip or crafting logic:
local scythe = SpawnPrefab("voidcloth_scythe")
player.components.inventory:GiveItem(scythe)
player.components.equippable:Equip(scythe, EQUIPSLOTS.HAND)

-- Equipping with a matching Voidcloth Hat triggers set-bonus effects:
player.components.inventory:Equip("voidclothhat", EQUIPSLOTS.HEAD)
```

## Dependencies & tags
**Components used:** `equippable`, `weapon`, `tool`, `finiteuses`, `planardamage`, `floater`, `inspectable`, `inventoryitem`, `shadowlevel`, `damagetypebonus`, `talker`, `highlightchild`, `colouraddersync`, `follower`, `pickable`, `combat`, `domesticatable`, `saltlicker`, `follower`, `skilltreeupdater`.

**Tags added:** `sharp`, `show_broken_ui`, `weapon`, `shadowlevel`, `shadow_item`, `broken` (when broken). Also adds `FX` to internal effect entities.

## Properties
No public properties are exposed directly on the `voidcloth_scythe` entity beyond `inst._classified`, `inst._owner`, `inst._fxowner`, `inst.fx`, `inst.isbroken`, and `inst.talktask`. These are internal use and not part of the public API.

## Main functions
### `SetBuffEnabled(inst, enabled)`
*   **Description:** Enables or disables the Voidcloth Set bonus (increased weapon damage and planar damage) when the scythe is equipped and the owner has a `voidclothhat` equipped.
*   **Parameters:** `enabled` (boolean) — whether the set bonus should be active.
*   **Returns:** Nothing.
*   **Error states:** Safe to call when `inst.components.weapon` or `inst.components.planardamage` are absent.

### `SetBuffOwner(inst, owner)`
*   **Description:** Assigns the owner and sets up `equip`/`unequip` event listeners to monitor changes to the owner's head slot, automatically toggling the set bonus.
*   **Parameters:** `owner` (entity or `nil`) — the player entity currently holding the scythe.
*   **Returns:** Nothing.

### `SetFxOwner(inst, owner)`
*   **Description:** Updates the parent and follow behavior for the `voidcloth_scythe_fx` entity, syncing it to the owner or the scythe itself.
*   **Parameters:** `owner` (entity or `nil`) — the entity that currently has the scythe equipped.
*   **Returns:** Nothing.

### `DoScythe(inst, target, doer)`
*   **Description:** Simulates harvesting behavior — scans for pickable entities within range and in front of the doer, then harvests each valid target.
*   **Parameters:**
    *   `target` (entity) — the primary target, used to derive position.
    *   `doer` (entity) — the actor performing the scything; used for rotation and sound.
*   **Returns:** Nothing.
*   **Error states:** Harvesting proceeds only if `target.components.pickable` is present and the target is within `TUNING.VOIDCLOTH_SCYTHE_HARVEST_RADIUS` and within `TUNING.VOIDCLOTH_SCYTHE_HARVEST_ANGLE_WIDTH` degrees of the doer's facing direction.

### `OnAttack(inst, attacker, target)`
*   **Description:** Attack callback; triggers spark FX and initiates Shadow AoE if the attacker has the `wortox_allegiance_shadow` skill activated and successfully portals-hops.
*   **Parameters:**
    *   `attacker` (entity) — the entity performing the attack.
    *   `target` (entity) — the primary combat target.
*   **Returns:** Nothing.

### `OnBroken(inst)`
*   **Description:** Disables core weapon/tool components when the item breaks, updates visual state, and marks the item as broken.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Re-initializes weapon/tool components when repaired, restores visuals, and clears broken status.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (used to clean up `_classified` reference), `ontalk` / `donetalking` (local sound FX), `floater_stopfloating` (animation reset), `equip` / `unequip` (owner events, used to toggle set bonus), `isbrokendirty`, `equiptoggledirty` (client-only event for fx syncing).
- **Pushes:** `equipskinneditem`, `unequipskinneditem`, `onareaattackother` (via `combat.DoAreaAttack`).