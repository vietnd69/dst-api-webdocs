---
id: debughelpers
title: Debughelpers
description: Provides utility functions for logging entity and component state information to the console.
tags: [debug, utility, logging]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 9b210458
system_scope: entity
---

# Debughelpers

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`Debughelpers` is a collection of global utility functions designed to assist developers in inspecting the runtime state of the game. It provides tools to dump the contents of entities, components, and Lua function upvalues to the standard output log. This module is primarily used during development to diagnose issues related to entity state, component data, or closure environments. It does not attach to entities as a component but operates as a standalone debugging script.

## Usage example
```lua
-- Inspect the local player entity structure
DumpEntity(ThePlayer)

-- Inspect a specific component table
DumpComponent(ThePlayer.components.inventory)

-- Inspect upvalues of a specific function
DumpUpvalues(SomeClosureFunction)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
No public properties. This module consists of standalone functions and does not maintain internal state.

## Main functions
### `DumpComponent(comp)`
*   **Description:** Iterates over a component table and prints its keys and values to the console. It attempts to identify functions, valid entity tables, and standard values to provide detailed logging.
*   **Parameters:** `comp` (table) - The component table to inspect.
*   **Returns:** Nothing.
*   **Error states:** May print `nil` or generic tostring representations if data types are unsupported.

### `DumpEntity(ent)`
*   **Description:** Prints comprehensive debug information for an entity instance. It outputs the entity debug string, iterates over the entity table members, and recursively calls `DumpComponent` for each attached component.
*   **Parameters:** `ent` (Entity) - The entity instance to inspect.
*   **Returns:** Nothing.
*   **Error states:** Depends on the validity of the entity passed; invalid entities may cause errors when accessing `ent.entity`.

### `DumpUpvalues(func)`
*   **Description:** Uses the Lua debug library to inspect the upvalues of a given function closure. It prints the index, name, type, and value of each upvalue.
*   **Parameters:** `func` (function) - The function closure to inspect.
*   **Returns:** Nothing.
*   **Error states:** Requires a valid function closure; passing non-function types will result in debug library errors.

## Events & listeners
None identified.