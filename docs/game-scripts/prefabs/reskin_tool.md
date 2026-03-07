---
id: reskin_tool
title: Reskin Tool
description: A consumable tool used to cycle and apply different visual skins to entities and characters in the game.
tags: [inventory, visual, item, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5713fcc5
system_scope: inventory
---

# Reskin Tool

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `reskin_tool` is a versatile inventory item that allows players to cycle through available visual skins for compatible entities (including characters, structures, and interactive objects). It leverages the `spellcaster` component to enable targeted casting, uses `equippable` for animation overrides when held, and integrates with `beard` for character-specific beard skin management. It also supports custom skin data and cross-world synchronization for world-migrating structures like wormholes and cave entrances.

## Usage example
```lua
-- Typical usage inside a prefab definition
local inst = Prefab("reskin_tool", tool_fn, assets, prefabs)

-- When a player equips the tool:
if inst.components.equippable then
    inst.components.equippable:SetOnEquip(function(item, owner) 
        -- Optional: Custom equip behavior
    end)
end

-- When used on a target:
inst.components.spellcaster:SetSpellFn(function(tool, target, pos, caster) 
    -- Custom spell behavior, e.g., reskin behavior
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `spellcaster`, `fuel`, `inspectable`  
**Tags added:** `nopunch`, `veryquickcast`  
**Tags checked:** None explicitly via `HasTag`, but skin selection logic references `prefab` names and component presence (`beard`, `teleporter`, `worldmigrator`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_cached_reskinname` | table | `{}` | Per-prefab cache of the currently selected skin name for the tool user. Used to remember the last skin applied per target type. |

## Main functions
### `GetReskinFXInfo(target)`
* **Description:** Returns visual effect sizing configuration (`offset`, `scale`, `scalex`, `scaley`) for the reskin FX particle system, based on the target's `prefab`. Special handling for upgraded treasure chests.
* **Parameters:** `target` (Entity) — the entity being reskinned.
* **Returns:** `table` — a table with optional keys `offset` (number), `scale`/`scalex`/`scaley` (numbers), or `{}` if no override is defined.
* **Error states:** Returns `{}` if `target.prefab` has no entry in `reskin_fx_info` or is not `"treasurechest"`.

### `GetNextSkin(userid, target, tool, skip_base)`
* **Description:** Determines the next skin to apply by iterating over available skins for the target entity (e.g., character, building), checking ownership, skip rules (`PREFAB_SKINS_SHOULD_NOT_SELECT`), and active event locks. Handles special case for bearded characters.
* **Parameters:**
  * `userid` (string) — the player's user ID for ownership checks.
  * `target` (Entity) — the entity to be reskinned.
  * `tool` (Entity) — the reskin tool instance.
  * `skip_base` (boolean) — whether to skip the base skin and cycle only from special/alternate skins.
* **Returns:**
  * `cached_skin` (string or `nil`) — the next valid skin name, or `nil` if none available.
  * `prefab_to_skin` (string) — the effective prefab key used for skin lookup (e.g., `"wolverine_beard"` for beards).
  * `is_beard` (boolean) — whether the target is a character with a skinnable beard.
  * `skin_custom` (table or `nil`) — custom skin metadata, if any unlockable skin with differing data is selected.
* **Error states:** Returns `(nil, ...)` if no owned skin is available and `skip_base` is `true`.

### `spellCB(tool, target, pos, caster)`
* **Description:** The core spell callback executed when the reskin tool is used on a target. Validates ownership/targeting, computes the next skin via `GetNextSkin`, spawns a reskin FX prefab, adjusts FX scale/position, and applies the new skin via `TheSim:ReskinEntity` (or equivalent for beards, wormholes, cave entrances).
* **Parameters:**
  * `tool` (Entity) — the reskin tool instance.
  * `target` (Entity or `nil`) — the target entity, defaults to `caster` for beard targeting.
  * `pos` (Vector3) — world position of the cast.
  * `caster` (Entity) — the entity using the tool (typically a player).
* **Returns:** Nothing.
* **Error states:** Silently returns early if: `target` is invalid or redirects to a non-owned entity; `target` has `reskin_tool_cannot_target_this`; or no valid skin is found when `skip_base` is `true`.

### `can_cast_fn(doer, target, pos, tool)`
* **Description:** Determines whether the reskin tool may be cast on a given target. Validates target permissions (e.g., ownership for linked entities), checks for block flags, and ensures a skin exists to apply.
* **Parameters:**
  * `doer` (Entity) — the entity attempting to cast the tool (typically a player).
  * `target` (Entity or `nil`) — the entity targeted for reskin.
  * `pos` (Vector3) — world position of the cast.
  * `tool` (Entity) — the reskin tool instance.
* **Returns:** `boolean` — `true` if the tool may be used, `false` otherwise.
* **Error states:** Returns `false` if target is not owned (for linked entities), has the `reskin_tool_cannot_target_this` flag, or is an unskinnable player/character.

### `onequip(inst, owner)`
* **Description:** Called when the tool is equipped by a player. Overrides the player’s hand animation to show the tool and broadcasts a custom event (`equipskinneditem`) if a skinned build is present.
* **Parameters:**
  * `inst` (Entity) — the reskin tool instance.
  * `owner` (Entity) — the player equipping the tool.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Called when the tool is unequipped. Restores the default hand animation and optionally broadcasts `unequipskinneditem`.
* **Parameters:**
  * `inst` (Entity) — the reskin tool instance.
  * `owner` (Entity) — the player unequipping the tool.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (component does not register `ListenForEvent` handlers).
- **Pushes:** 
  * `equipskinneditem` (with `inst:GetSkinName()` as payload) — on equip if `GetSkinBuild()` returns non-`nil`.
  * `unequipskinneditem` (with `inst:GetSkinName()` as payload) — on unequip if `GetSkinBuild()` returns non-`nil`.