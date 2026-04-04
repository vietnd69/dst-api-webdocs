---
id: reskin_tool
title: Reskin Tool
description: Defines the Reskin Tool item prefab that allows players to change the skin of valid entities.
tags: [item, skin, utility, spell]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: prefabs
source_hash: 43854840
system_scope: entity
---

# Reskin Tool

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
The `reskin_tool` prefab defines a special inventory item that functions as a spellcaster. When used on a valid target, it cycles through available skins that the player owns or removes the current skin. It handles complex logic for ownership validation, visual effects positioning, and synchronizing skin changes across linked entities (such as wormholes or cave entrances). This tool is primarily used in development or specific game modes to test or apply cosmetic variations.

## Usage example
```lua
-- Spawning the Reskin Tool in the world
local tool = SpawnPrefab("reskin_tool")
tool.components.inventoryitem:GiveTo(ThePlayer)

-- Accessing spell configuration
if tool.components.spellcaster then
    tool.components.spellcaster.canuseontargets = true
    tool.components.spellcaster.canusefrominventory = true
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `spellcaster`, `fuel`, `inspectable`
**Tags:** Adds `nopunch`, `veryquickcast`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_cached_reskinname` | table | `{}` | Caches the last applied skin name per prefab to facilitate cycling. |
| `spelltype` | string | `"RESKIN"` | Identifies the type of spell for UI and logic handling. |
| `scrapbook_specialinfo` | string | `"RESKINTOOL"` | Special identifier used for scrapbook or recipe tracking. |
| `reskin_tool_target_redirect` | entity | `nil` | Optional field on targets to redirect the reskin action to another entity. |
| `reskin_tool_cannot_target_this` | boolean | `nil` | If true on a target, prevents the tool from affecting it. |

## Main functions
### `spellCB(tool, target, pos, caster)`
*   **Description:** The callback function executed when the spell is successfully cast on a target. It determines the next skin, spawns visual effects, and applies the skin change via `TheSim:ReskinEntity`.
*   **Parameters:**
    *   `tool` (entity) - The reskin tool instance.
    *   `target` (entity) - The entity being reskinned.
    *   `pos` (Vector3) - The world position of the cast.
    *   `caster` (entity) - The player or entity casting the spell.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the target is invalid, ownership checks fail, or no valid skin is found. Handles special logic for `wormhole` (teleporter) and `cave_entrance` (worldmigrator) to sync skins across links.

### `can_cast_fn(doer, target, pos, tool)`
*   **Description:** Validation function called before casting to determine if the tool can be used on the specific target.
*   **Parameters:**
    *   `doer` (entity) - The player attempting to use the tool.
    *   `target` (entity) - The potential target entity.
    *   `pos` (Vector3) - The target position.
    *   `tool` (entity) - The tool instance.
*   **Returns:** `boolean` - `true` if the cast is allowed, `false` otherwise.
*   **Error states:** Returns `false` if the player does not own the next skin in the cycle, if the target is another player's beard, or if the target explicitly blocks reskinning.

### `GetNextSkin(userid, target, tool, skip_base)`
*   **Description:** Iterates through available skins for the target's prefab to find the next valid skin the user owns.
*   **Parameters:**
    *   `userid` (string) - The user's ID for ownership checks.
    *   `target` (entity) - The entity to be reskinned.
    *   `tool` (entity) - The tool instance (used for caching).
    *   `skip_base` (boolean) - If true, skips the base (default) skin.
*   **Returns:** `string`, `string`, `boolean`, `table` - Returns the new skin name, the prefab key used, a boolean indicating if it is a beard, and custom skin data.

### `GetReskinFXInfo(target)`
*   **Description:** Retrieves scaling and offset data for the visual effects spawned during reskinning, specific to the target prefab.
*   **Parameters:**
    *   `target` (entity) - The entity being reskinned.
*   **Returns:** `table` - Contains `offset`, `scale`, `scalex`, and `scaley` values.

### `onequip(inst, owner)`
*   **Description:** Callback triggered when a player equips the tool. Overrides the player's animation symbols to show the skinned version of the tool.
*   **Parameters:**
    *   `inst` (entity) - The tool instance.
    *   `owner` (entity) - The player equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Callback triggered when a player unequips the tool. Restores default arm animations.
*   **Parameters:**
    *   `inst` (entity) - The tool instance.
    *   `owner` (entity) - The player unequipping the item.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `equipskinneditem` - Fired when the tool is equipped, passing the skin name.
- **Pushes:** `unequipskinneditem` - Fired when the tool is unequipped, passing the skin name.