---
id: tentaclespike
title: Tentaclespike
description: A consumable weapon item that deals damage and degrades after a fixed number of uses.
tags: [combat, consumable, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e904abc3
system_scope: inventory
---

# Tentaclespike

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tentaclespike` prefab represents a durable, single-use weapon item used primarily in combat. It is attached to an entity via the `equippable` component for manual handling and leverages the `weapon` component for damage output. It is also enhanced with the `finiteuses` component to track usage and self-destruct once depleted. The prefab functions as an inventory item and can be launched via Haunt mechanic interactions.

## Usage example
```lua
local inst = MakePrefab("tentaclespike")
-- Optional: adjust damage or uses programmatically
inst.components.weapon:SetDamage(30)
inst.components.finiteuses:SetUses(5)
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `equippable`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`  
**Tags:** Adds `sharp`, `weapon`

## Properties
No public properties.

## Main functions
Not applicable. The prefab is initialized via its constructor function `fn()` and exposes no custom instance methods beyond component APIs.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** 
  - `percentusedchange` — fired internally by `finiteuses` when usage percentage changes (via `SetUses`).
  - The entity is removed (`inst:Remove()`) when `finiteuses` reaches zero, via `SetOnFinished(inst.Remove)`.