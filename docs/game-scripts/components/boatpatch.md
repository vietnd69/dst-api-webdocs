---
id: boatpatch
title: Boatpatch
description: Assigns the `boat_patch` tag to an entity and provides basic patch type tracking for boat-related environmental patches.
tags: [boat, environment, tag]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d6635142
system_scope: entity
---

# Boatpatch

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Boatpatch` is a lightweight component that tags an entity with `boat_patch`, indicating it functions as a boat patch (e.g., for repairing or interacting with boats). It stores an optional `patch_type` value and provides a simple accessor for it. This component is typically attached to prefabs representing patches in the world (e.g., wooden patches used for boat repair) and helps distinguish them from other entity types during gameplay logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatpatch")
inst.components.boatpatch.patch_type = "wood"
print(inst.components.boatpatch:GetPatchType()) -- "wood"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `boat_patch` on instantiation; removes `boat_patch` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `patch_type` | string? | `nil` | Optional identifier for the patch type (e.g., `"wood"`, `"leather"`). Set externally after instantiation. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Automatically called when the component is removed from its entity. Removes the `boat_patch` tag to maintain tag hygiene.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetPatchType()`
* **Description:** Returns the currently stored patch type.
* **Parameters:** None.
* **Returns:** `string?` — the value of `self.patch_type`, or `nil` if unset.

## Events & listeners
None identified
