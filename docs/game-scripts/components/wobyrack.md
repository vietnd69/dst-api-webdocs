---
id: wobyrack
title: Wobyrack
description: A specialized drying rack component that uses a dedicated container prefab (`woby_rack_container`) for storing and drying items.
tags: [crafting, inventory, item]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7ddb19b5
system_scope: inventory
---

# Wobyrack

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WobyRack` is a subclass of `DryingRack` that implements a specific variant of the drying rack—used in-game for the Woby character’s unique crafting station. It initializes by spawning and attaching a dedicated container prefab (`woby_rack_container`) as the internal storage, then delegates to the parent `DryingRack` logic using that container. This component enables item drying functionality with behavior consistent with the base drying rack system, while ensuring the correct container instance is used.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wobyrack")
-- The rack is now ready to accept items; drying logic is inherited from DryingRack.
-- Example: Add an item programmatically via container API
if inst.components.container then
    inst.components.container:AddItem(item)
end
```

## Dependencies & tags
**Components used:** `container`, `dryingrack`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
`WobyRack` inherits all functional behavior from `DryingRack`. No new public functions are defined.

## Events & listeners
None identified.
