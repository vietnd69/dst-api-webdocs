---
id: beargervest
title: Beargervest
description: A wearable vest that slowly consumes fuel to reduce hunger burn rate while equipped and provide thermal insulation.
tags: [equipment, inventory, consumption, insulation]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e20f978
system_scope: inventory
---

# Beargervest

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `beargervest` is an inventory item prefab that grants thermal insulation and reduces the wearer’s hunger burn rate. It functions as a fueled item—consuming fuel over time while equipped—and provides no armor protection. The vest supports skin overrides via `GetSkinBuild()` and integrates with the equippable system to manage visual and gameplay effects when worn or unequipped.

## Usage example
```lua
local inst = Prefab("beargervest", fn, assets)
-- The beargervest prefab is used as-is; no manual component manipulation is required.
-- When equipped by a player, it automatically starts fuel consumption,
-- reduces hunger burn rate, and overrides the body symbol for rendering.
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `tradable`, `equippable`, `insulator`, `fueled`, `hunger` (via `owner.components.hunger`), `transform`, `animstate`, `network`
**Tags:** None added, removed, or checked directly on `inst`.

## Properties
No public properties are initialized in the constructor or exposed directly.

## Main functions
Not applicable — this is a prefab definition (`fn`) rather than a component class. No instance methods are defined beyond those inherited from attached components.

## Events & listeners
- **Listens to:** None — no `inst:ListenForEvent()` calls appear in this file.
- **Pushes:** `equipskinneditem` (via `owner:PushEvent`), `unequipskinneditem` (via `owner:PushEvent`) — triggered during equip/unequip when a skin build exists.
- **Callback functions:**  
  `onequip(inst, owner)` — starts fuel consumption, applies hunger modifier, and overrides the body symbol.  
  `onunequip(inst, owner)` — clears override, removes hunger modifier, stops fuel consumption, and pushes unequip event for skins.  
  `onequiptomodel(inst, owner)` — removes hunger modifier and stops fuel consumption (used for model preview).  
  `onperish(inst)` — removes the vest when its fuel is fully depleted.