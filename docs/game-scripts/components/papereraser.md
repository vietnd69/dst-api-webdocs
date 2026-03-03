---
id: papereraser
title: Papereraser
description: Enables an entity to erase erasable paper items, converting them into their erased form via the ErasablePaper component.
tags: [crafting, inventory, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bd2bb01c
system_scope: inventory
---

# Papereraser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PaperEraser` is a utility component that allows an entity (typically a tool or character) to transform erasable paper items into their erased variants. It is designed to be attached to items (e.g., erasers) and works in conjunction with the `ErasablePaper` component on the paper entity. The component primarily provides a `DoErase` method that delegates to the target paper’s `DoErase` function and reports success via a boolean return.

## Usage example
```lua
local eraser = SpawnPrefab("eraser")
eraser:AddComponent("papereraser")

-- Later, to erase a paper item:
local paper = SpawnPrefab("papyrus")
local success = eraser.components.papereraser:DoErase(paper, player)
if success then
    print("Paper was successfully erased!")
end
```

## Dependencies & tags
**Components used:** None directly — relies on the target paper having the `erasablepaper` component.  
**Tags:** Adds `papereraser` on instantiation; removes it when the component is removed from the entity.

## Properties
No public properties. Instance variables `stacksize` and `erased_prefab` are commented out in the constructor and not used.

## Main functions
### `DoErase(paper, doer)`
* **Description:** Attempts to erase the given `paper` entity using this eraser entity. Calls the `DoErase` method on the paper’s `erasablepaper` component and returns whether the operation succeeded (i.e., produced a valid result).
* **Parameters:**  
  - `paper` (Entity) — The entity representing the erasable paper to be erased. Must have the `erasablepaper` component.  
  - `doer` (Entity) — The entity performing the erasure (e.g., the player).
* **Returns:**  
  - `true` if `erasablepaper:DoErase(...)` returns a non-`nil` value (i.e., the erase succeeded and returned a new item).  
  - `false` otherwise (e.g., if `erasablepaper` is missing or the spawn failed).
* **Error states:** No explicit error handling — the call silently fails if the `erasablepaper` component is missing or `DoErase` returns `nil`.

## Events & listeners
None identified.
