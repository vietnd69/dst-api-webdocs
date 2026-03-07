---
id: boatpatch
title: Boatpatch
description: A game entity component that enables repairs to damaged boats using consumable patch materials (wood or kelp), providing health restoration and related functional behavior.
tags: [boat, repair, item, consumable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a48080f
system_scope: entity
---

# Boatpatch

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boatpatch` component is attached to the `boatpatch` and `boatpatch_kelp` prefabs to provide boat repair functionality. It exposes a `patch_type` property used to differentiate material types and integrates with the `repairer` component to apply health to damaged boats. When kelp is used, additional edible, perishable, bait, and tradable behaviors are enabled.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst:AddComponent("boatpatch")
inst.components.boatpatch.patch_type = "wood"
-- Typically used in combination with repairer, inventoryitem, stackable, and fuel components
```

## Dependencies & tags
**Components used:** None directly (this component is defined in `components/boatpatch.lua`, referenced here via the prefab instantiation). This file creates prefabs that add the `boatpatch`, `repairer`, `stackable`, `fuel`, `edible`, `perishable`, `bait`, `tradable`, `inventoryitem`, `inspectable`, `burnable`, and `propagator` components.

**Tags added:** `allow_action_on_impassable`, `boat_patch`, `show_spoilage` (kelp only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `patch_type` | string | `"wood"` | Specifies the material type used for repair (`"wood"` or `"kelp"`); set in `fn_kelp()` and used by `repairer` logic. |

## Main functions
Not applicable.

## Events & listeners
None identified.

