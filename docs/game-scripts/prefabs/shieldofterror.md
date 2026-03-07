---
id: shieldofterror
title: Shieldofterror
description: A combat-item prefab that functions as a shield and food item, repairing its own armor condition when consumed and taking damage when used in combat.
tags: [combat, inventory, food, armor]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0beab2ef
system_scope: entity
---

# Shieldofterror

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Shieldofterror` is a hybrid inventory item prefab that combines shield, weapon, and food functionality. It is equipped by the player, used in combat (where it takes damage), and consumed (where it repairs its own armor condition based on nutritional values). It integrates with multiple systems: `armor`, `weapon`, `eater`, `equippable`, and `shadowlevel`, and is designed for characters who benefit from renewable or self-sustaining gear.

## Usage example
```lua
-- Typically instantiated as a prefab via `SpawnPrefab("shieldofterror")`
-- No direct component-level usage; it is a fully self-contained prefab definition.
-- The component configuration is handled internally during prefab instantiation.
```

## Dependencies & tags
**Components used:** `eater`, `weapon`, `armor`, `equippable`, `inspectable`, `inventoryitem`, `shadowlevel`  
**Tags added:** `handfed`, `fedbyall`, `toolpunch`, `eatsrawmeat`, `strongstomach`, `weapon`, `shadowlevel`

## Properties
No public properties. All internal state is encapsulated within components and the local function scope.

## Main functions
Not applicable. This is a prefab definition, not a standalone component.

## Events & listeners
- **Listens to:** `onattackother` (via `inst:ListenForEvent`) — triggers armor damage when the shield is used as a weapon.
- **Pushes:** `equipskinneditem`, `unequipskinneditem` — fired during equip/unequip to sync custom skins.
- **Pushes:** `armordamaged` (via `armor:TakeDamage`) — inherited from the armor component.