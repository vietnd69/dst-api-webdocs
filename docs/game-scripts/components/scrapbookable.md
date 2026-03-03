---
id: scrapbookable
title: Scrapbookable
description: Enables an entity to be taught or learned via a callback function when interacted with in the scrapbook system.
tags: [crafting, ui, learning]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f9a86b33
system_scope: ui
---

# Scrapbookable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Scrapbookable` is a lightweight component that allows an entity to be "taught" — a concept used in the scrapbook UI system to track learned recipes or knowledge entries. When an entity has this component, it can register a callback that executes upon teaching, typically used to unlock content in the scrapbook. It does not manage state persistence or UI rendering itself, but acts as a trigger point for external systems (e.g., the scrapbook screen) to invoke knowledge acquisition logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("scrapbookable")

inst.components.scrapbookable:SetOnTeachFn(function(entity, doer)
    print(entity.prefab .. " was taught by " .. (doer and doer.prefab or "unknown"))
    -- Unlock recipe or update progress here
end)

-- Later, when player attempts to learn this entity:
inst.components.scrapbookable:Teach(player)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `SetOnTeachFn(fn)`
*   **Description:** Registers the callback function to be executed when the `Teach` method is called. This function is typically used to unlock content (e.g., a recipe in the scrapbook).
*   **Parameters:** `fn` (function) — a callback with signature `function(inst, doer)`, where `inst` is the entity with the `Scrapbookable` component and `doer` is the entity performing the teaching (e.g., the player).
*   **Returns:** Nothing.
*   **Error states:** Accepts `nil` as valid input; clearing any previously set function.

### `Teach(doer)`
*   **Description:** Executes the registered `onteach` callback (if one exists) and signals that this entity has been taught. Returns `true` to indicate success.
*   **Parameters:** `doer` (Entity or `nil`) — the entity causing the teaching action (e.g., the player).
*   **Returns:** `true` — always returned regardless of whether a callback was defined.
*   **Error states:** Does not fail; if no callback is set, it silently returns `true` after no-op.

## Events & listeners
None identified
