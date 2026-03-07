---
id: quagmire_fish
title: Quagmire Fish
description: Creates quagmire-region fish prefabs with raw and cooked variants, including animation, inventory physics, and network support for Don't Starve Together.
tags: [prefab, quagmire, cooking, meat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 15b35278
system_scope: entity
---

# Quagmire Fish

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines prefabs for quagmire fish items (specifically *quagmire_salmon* and *quagmire_crabmeat*), along with their cooked counterparts. It uses helper functions (`_fn`, `raw_fn`, `cooked_fn`) to configure entity properties such as transforms, animation states, networkability, inventory physics, and tags. The component is not a reusable *component* in the ECS sense but a *prefab factory*—it generates distinct prefabs for the game to instantiate. It supports both client-side (pristine) and server-side (master) initialization with optional extensibility via `common_init_fn` and `master_init_fn` callbacks.

## Usage example
This file does not define a reusable component. Instead, it returns a list of prefabs. Modders typically reference the resulting prefabs by name, e.g.:

```lua
-- Example: Creating a quagmire salmon item instance
local inst = CreateEntity()
inst.prefab = "quagmire_salmon"
-- Use `inst` as needed (e.g., spawn in world, give to player)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds the following tags to all fish prefabs: `"meat"`, `"catfood"`, `"quagmire_stewable"`. The raw variant also adds `"cookable"`.

## Properties
No public properties. This file does not define a component class or expose properties; it is a prefab factory.

## Main functions
### `_fn(data, common_init_fn, master_init_fn)`
*   **Description:** Core entity construction function. Sets up transform, anim state, network, physics, animation bank/build, and tags. Optionally invokes initialization callbacks. Returns a pristine or fully initialized entity depending on context.
*   **Parameters:**  
    *   `data` (table) – Prefab configuration including build name, cooked name, etc.  
    *   `common_init_fn` (function?) – Optional callback applied to `inst` on both client and server.  
    *   `master_init_fn` (function?) – Optional callback applied only on the server (when `TheWorld.ismastersim` is `true`).  
*   **Returns:** `inst` (Entity instance).  
*   **Error states:** Returns early with only pristine setup if called on a non-master simulation instance (`TheWorld.ismastersim == false`).

### `raw_fn(data)`
*   **Description:** Factory returning a closure that, when invoked, constructs a raw (uncooked) fish prefab with a standard common and master initialization sequence.
*   **Parameters:** `data` (table) – Required to configure raw-fish properties.  
*   **Returns:** A zero-argument function that calls `_fn` with raw-specific init callbacks.  

### `cooked_fn(data)`
*   **Description:** Factory returning a closure that, when invoked, constructs a cooked fish prefab.
*   **Parameters:** `data` (table) – Required to configure cooked-fish properties.  
*   **Returns:** A zero-argument function that calls `_fn` with cooked-specific init callbacks.  

### `MakeMeatItem(data)`
*   **Description:** Registers both raw and cooked prefabs for a quagmire fish using the `Prefab()` constructor and appends them to the internal `prefab_list`. Called for each fish type.
*   **Parameters:** `data` (table) – Must contain:  
    *   `name` (string) – e.g., `"quagmire_salmon"`  
    *   `cooked` (string) – e.g., `"quagmire_salmon_cooked"`  
    *   `build` (string) – animation bank/build name  
    *   `assets` (table) – list of `Asset()` declarations  
    *   `prefabs` (table) – list of related prefabs (e.g., cooked form, spoilage variant, burnt ingredients)  
*   **Returns:** Nothing. Side effect is updating `prefab_list`.

## Events & listeners
None identified.