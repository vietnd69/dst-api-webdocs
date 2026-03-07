---
id: shadowheart_infused
title: Shadowheart Infused
description: A consumable item that provides a temporary sanity boost and emits a moderate sanity aura while held or carried.
tags: [sanity, item, consumable, aura]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aef3c4f3
system_scope: inventory
---

# Shadowheart Infused

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowheart_infused` is a consumable item prefab that grants a temporary sanity bonus and emits a persistent negative sanity aura (_sanityaura_-TUNING.SANITYAURA_MED). It behaves as a standard inventory item but integrates with multiple systems: it uses the `drownable` component for water interaction, `lootdropper` to define its drop behavior, and `sanityaura` for environmental effect. It is network-aware, with dedicated client-side entities (`shadowheart_infused_dark_fx`) rendered only on non-dedicated clients to provide visual feedback.

## Usage example
```lua
-- Typical usage within the game world:
local inst = MakePrefab("shadowheart_infused")
-- The item is automatically ready for use as a held item.
-- It will emit a subtle heartbeat sound periodically when active.
-- Dropping the item triggers the stunned state via OnDropped.
```

## Dependencies & tags
**Components used:** `drownable`, `inspectable`, `lootdropper`, `sanityaura`, `inventoryitem`, `locomotor`, `tradable`, `highlightchild` (client), `transform`, `animstate`, `soundemitter`, `network`, `flickerfx` (indirect via tag "FX").
**Tags added:** `canbetrapped`, `shadowheart`, `FX` (for the client-side effect entity only).

## Properties
No public properties are defined directly in this file. Component properties are managed via their respective component APIs (e.g., `inst.components.sanityaura.aura` is set after `AddComponent`).

## Main functions
### `CLIENT_AttachShadowFx(inst)`
*   **Description:** Creates and attaches a non-networked visual effect entity (`shadowheart_infused_dark_fx`) to the item for client-side rendering. It plays a looping dark animation and follows the item's position offset.
*   **Parameters:** `inst` (Entity) — the parent entity to which the effect is attached.
*   **Returns:** Entity — the newly created `shadow_fx` entity.
*   **Error states:** Only intended for non-dedicated clients (`TheNet:IsDedicated() == false`); no effect on dedicated servers.

### `DoBeat(inst)`
*   **Description:** Plays the "shadow_heart" sound and schedules the next heartbeat sound event with randomized delay (0.75–1.5s).
*   **Parameters:** `inst` (Entity) — the item instance.
*   **Returns:** Nothing.
*   **Error states:** None identified; relies on valid `SoundEmitter`.

### `OnEntityWake(inst)`
*   **Description:** Restarts the heartbeat sound task upon the entity waking from sleep. Cancels any existing task first.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Returns early if the entity is in limbo or asleep.

### `OnEntitySleep(inst)`
*   **Description:** Cancels the heartbeat sound task when the entity goes to sleep.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Sends the item’s state graph to the `"stunned"` state when dropped.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnLanded(inst)`
*   **Description:** Triggers a drown check via the `drownable` component when the item lands — relevant if it falls into water.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `exitlimbo` — triggers `inst.OnEntityWake`, resuming heartbeat sounds.
- **Listens to:** `enterlimbo` — triggers `inst.OnEntitySleep`, stopping heartbeat sounds.
- **Listens to:** `on_landed` — triggers `OnLanded`, ensuring drownability checks occur on impact.
- **Pushes:** None directly — event dispatch is handled by components like `locomotor`, `drownable`, and state graphs.
