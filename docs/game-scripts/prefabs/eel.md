---
id: eel
title: Eel
description: Generates raw and cooked eel prefabs with configurable states, perishability, dryability, and cooking yields.
tags: [inventory, food, crafting, perishable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0f75e4e2
system_scope: inventory
---

# Eel

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `eel.lua` script defines a reusable prefab factory for generating raw and cooked eel items. It creates entities with core gameplay features: edible nutrition values, stackability, bait functionality, perishability, dryability (raw only), cookability (raw only), and tradable gold value. The factory supports two distinct成品: a raw, perishable eel and a cooked, shelf-stable version. It integrates tightly with the `edible`, `perishable`, `stackable`, `bait`, `dryable`, `cookable`, `tradable`, and `inventoryitem` components.

## Usage example
```lua
local eel_fn = require "prefabs/eel"
local raw_eel, cooked_eel = eel_fn("myeel", "myeel_build")
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `bait`, `perishable`, `dryable`, `cookable`, `tradable`, `inventoryitem`, `inspectable`  
**Tags added:** `meat`, `catfood`, `fishmeat`, `dryable` (raw only), `cookable` (raw only)

## Properties
No public properties are exposed directly by this script. The generated prefabs return entities with component-based properties (e.g., `inst.components.edible.healthvalue`).

## Main functions
### `commonfn(build, anim, loop, dryable, cookable)`
*   **Description:** Shared constructor logic used to initialize both raw and cooked eel entities. Sets up core components, animation, tags, and perish/dry/cook capabilities based on parameters.
*   **Parameters:**
    *   `build` (string) — Build name for the entity's `Transform` and `AnimState`.
    *   `anim` (string) — Animation name to play initially.
    *   `loop` (boolean) — Whether the animation should loop.
    *   `dryable` (boolean) — If true, adds `dryable` tag and component.
    *   `cookable` (boolean) — If true, adds `cookable` tag and component.
*   **Returns:** `inst` (entity instance) — Fully configured entity, or a client-only entity if `not TheWorld.ismastersim`.
*   **Error states:** If `TheWorld.ismastersim` is false, only minimal client-side setup is performed; server-side components are skipped.

### `rawfn(build)`
*   **Description:** Generates the raw eel prefab instance with all perishable and dryable features enabled.
*   **Parameters:** `build` (string) — Build name for the entity.
*   **Returns:** `inst` (entity instance) — Raw eel with fast perish, kick-stopping behavior when inventory-put, and small healthy yield.
*   **Error states:** Sets up a one-shot task (`stopkicking`) to transition animation to `dead` after 2–4 seconds if not picked up; overrides `OnLoad` and inventory put callback.

### `cookedfn(build)`
*   **Description:** Generates the cooked eel prefab instance with reduced perish rate and higher food value than raw.
*   **Parameters:** `build` (string) — Build name for the entity.
*   **Returns:** `inst` (entity instance) — Cooked eel with slower perish, improved stats, and non-looping cooked animation.
*   **Error states:** None; cooked eel is fully stable and non-kicking.

### `makeeel(build)`
*   **Description:** Wraps `rawfn` and `cookedfn` into parameter-capturing factory functions.
*   **Parameters:** `build` (string) — Build name passed to both raw and cooked creators.
*   **Returns:** Two functions: `makerawfn` and `makecookedfn`, each of which returns a prefab instance when invoked.

### `eel(name, build)`
*   **Description:** Top-level factory function that returns two `Prefab` objects: one for raw eel and one for cooked.
*   **Parameters:**
    *   `name` (string) — Name of the raw eel prefab (e.g., `"eel"`).
    *   `build` (string) — Build file base name (e.g., `"eel01"`).
*   **Returns:** `Prefab, Prefab` — The raw and cooked eel prefab definitions.

## Events & listeners
- **Listens to:** `OnLoad` — Assigned to `stopkicking` to ensure correct animation state after loading.
- **Pushes:** No events are explicitly pushed by this script; it relies on component behavior (e.g., `perishable` emits `perish`).

### `stopkicking(inst)`
*   **Description:** Helper function to transition eel animation to `dead` state when it stops "kicking".
*   **Parameters:** `inst` (entity instance) — The eel entity whose animation should change.
*   **Returns:** Nothing.