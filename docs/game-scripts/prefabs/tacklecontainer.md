---
id: tacklecontainer
title: Tacklecontainer
description: Implements a portable, burnable storage container for the Hermit character with animated open/close states and integration into the container and inventory systems.
tags: [storage, portable, burnable, hermit, container]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8204b325
system_scope: inventory
---

# Tacklecontainer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Tacklecontainer` is a prefab factory for portable storage containers used by the Hermit character. It creates entities with `container`, `inventoryitem`, `burnable`, and `hauntable` components. The component logic is embedded directly in the prefab factory function and relies on external components for behavior (e.g., `Container`, `Burnable`, `InventoryItem`). Key functionality includes sound-triggered animations for opening/closing, image updates based on state (open/closed), burning behavior that drops all contents, and save/load persistence for burn state.

## Usage example
```lua
-- Create a standard tackle container
local container = Prefab("tacklecontainer", "prefabs/tacklecontainer")

-- Create a super tackle container
local super_container = Prefab("supertacklecontainer", "prefabs/tacklecontainer")
```

## Dependencies & tags
**Components used:** `container`, `inventoryitem`, `burnable`, `hauntable`, `inspectable`, `lootdropper`  
**Tags:** Adds `portablestorage`

## Properties
No public properties are exposed beyond internal instance fields (`_sounds`, `_baseinventoryimagename`) and externally modified component state.

## Main functions
*The core logic is implemented via component callbacks (e.g., `onopenfn`, `onclosefn`, `onputininventoryfn`, `onburnt`) set during construction. No standalone public methods are defined in this file.*

## Events & listeners
- **Listens to:** Component callbacks (`onopenfn`, `onclosefn`, `onputininventoryfn`, `onburnt`) installed on `inst.components.container` and `inst.components.inventoryitem`.
- **Pushes:** Events (`onclose`) triggered via `inst:PushEvent("onclose", {doer = doer})` internally through the `Container:Close()` callback chain; also `imagechange` emitted via `InventoryItem:ChangeImageName()`.