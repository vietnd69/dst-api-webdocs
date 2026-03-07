---
id: cane
title: Cane
description: A wearable weapon tool that modifies the owner's movement speed and deals damage when used.
tags: [combat, inventory, equipment, tool]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cead889b
system_scope: inventory
---

# Cane

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cane` prefab represents a wearable tool and weapon in DST. When equipped by an entity, it modifies the owner's walk speed and triggers animation overrides to display the cane correctly in hand. It relies on the `weapon` and `equippable` components to provide combat functionality and equip/unequip behavior. The cane is classified as a tool (`scrapbook_subcat = "tool"`) and supports skinned variants via skin overrides.

## Usage example
```lua
local cane = require("prefabs/cane")()
cane.components.weapon:SetDamage(15)
cane.components.equippable.walkspeedmult = 0.8
```

## Dependencies & tags
**Components used:** `weapon`, `equippable`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `weapon` to the entity during initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_subcat` | string | `"tool"` | Used for categorization in the in-game scrapbook UI. |
| `scrapbook_animoffsetx` | number | `30` | Horizontal offset for the cane's animation in the scrapbook view (server only). |

## Main functions
None identified — the cane prefab is initialized and configured entirely within the `fn()` constructor. No custom public methods are defined.

## Events & listeners
- **Listens to:** None.
- **Pushes:** 
  - `equipskinneditem` — pushed on equip if a skin build is present (provides skin name via `inst:GetSkinName()`).
  - `unequipskinneditem` — pushed on unequip if a skin build is present.

The component uses the following *callback hooks* from `equippable`:
- `onequip(inst, owner)` — override animation and symbol for the owner when equipped.
- `onunequip(inst, owner)` — restore original animation when unequipped.

These callbacks are not public API methods but internal implementation details registered via:
- `inst.components.equippable:SetOnEquip(onequip)`
- `inst.components.equippable:SetOnUnequip(onunequip)`