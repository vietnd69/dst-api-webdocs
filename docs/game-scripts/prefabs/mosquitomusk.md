---
id: mosquitomusk
title: Mosquitomusk
description: A consumable inventory item that spoils over time and can be repaired with vitae material; used as bait for mosquito-based mechanics.
tags: [consumable, spoilage, repair, bait]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d66c9b8b
system_scope: inventory
---

# Mosquitomusk

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mosquitomusk` prefab defines a consumable, perishable inventory item used primarily as mosquito bait. It integrates with the `perishable`, `repairable`, `inventoryitem`, and `inspectable` components. Once applied to an entity, it supports decay over time, spontaneous ignition (when ignited), and repair using vitae material — though repair is currently disabled via comment.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("mosquitomusk")
inst.components.inventoryitem:Drop()
inst.components.perishable:SetPercent(0.5)
inst.components.repairable:Repair(MATERIALS.VITAE)
```

## Dependencies & tags
**Components used:** `repairable`, `perishable`, `inspectable`, `inventoryitem`  
**Tags:** Adds `mosquitomusk`, `show_spoilage`, `floating`, `tiny` (via `MakeInventoryFloatable`), `flammable`, `burnable`, `propagator`, `hauntable`

## Properties
No public properties.

## Main functions
This prefab does not define any custom main functions beyond component method calls.

## Events & listeners
This prefab does not define any custom event listeners or push events. It relies on component-level event handling (e.g., `perishable` fires `perishchange`, `repairable` may fire `repaired`, but those are not explicitly handled in this file).