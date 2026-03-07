---
id: saddle
title: Saddle
description: Provides mount-related stats and behaviors for saddle items, including damage/speed bonuses, finite durability, and optional special effects like planar resistance or visual overlays.
tags: [combat, mount, durability, equipment, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ddc38220
system_scope: inventory
---

# Saddle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `saddle.lua` file defines several saddle prefabs (basic, war, race, Wathgrithr, and shadow) used for equipping onto beefalo mounts. Each saddle applies modifiers to the mount via the `saddler` component, manages finite durability via `finiteuses`, and supports optional features such as planar damage/defense, damage type bonuses/resists, and visual FX (especially for the shadow saddle). The file also implements specialized logic for the shadow saddle, including forge repairability, FX spawning, and colour syncing.

## Usage example
```lua
local saddle = Prefab("saddle_war")
local inst = saddle.fn()
inst.components.saddler:SetBonusDamage(10)
inst.components.finiteuses:SetUses(50)
inst:PushEvent("equipped", { owner = player })
```

## Dependencies & tags
**Components used:** `saddler`, `finiteuses`, `inspectable`, `inventoryitem`, `planardamage`, `planardefense`, `damagetypebonus`, `damagetyperesist`, `colouraddersync`, `updatelooper`, `highlightchild`.  
**Tags added:** `usesdepleted` (via `finiteuses`), `broken` (shadow saddle), `FX`, `combatmount` (some saddles), `show_broken_ui` (shadow saddle).

## Properties
No public properties are initialized directly in this file. Saddle behavior is controlled through the `data` table passed to `MakeSaddle`, and individual components expose their state via methods (e.g., `inst.components.saddler.bonusdamage`).

## Main functions
### `SetupSaddler(inst)`
* **Description:** Attaches and configures the `saddler` component with stats derived from the saddle's data table. Also sets discard callbacks and swap details for animations/skins.
* **Parameters:** `inst` (Entity) — the saddle instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if `inst._data` is missing or malformed.

### `ShadowSaddle_Fx_SetOwner(inst, owner)`
* **Description:** Assigns an owner to the shadow saddle FX entity, managing parent-child relationships, FX attachment, colour syncing, and footprint generation logic (for player-only mounts).
* **Parameters:** `inst` (Entity) — the FX entity (`saddle_shadow_fx`); `owner` (Entity) — the mounting entity (player or beefalo).
* **Returns:** Nothing.
* **Error states:** Returns early if `owner` equals `inst._fxowner`.

### `MakeSaddle(name, data)`
* **Description:** Factory function that creates and returns a `Prefab` for a saddle type. Handles common setup (physics, animation, inventory), data caching, component instantiation (`saddler`, `finiteuses`, etc.), and post-initialization hooks.
* **Parameters:**  
  - `name` (string) — prefab name (e.g., `"saddle_basic"`).  
  - `data` (table) — configuration with keys like `bonusdamage`, `speedmult`, `uses`, `floater`, `extra_tags`, `commoninit`, `postinit`, etc.
* **Returns:** `Prefab` — a ready-to-spawn saddle prefab.

### `CreateFxFollowFrame(i)`
* **Description:** Creates a non-networked visual FX entity that follows the saddle attachment symbol on the mount. Includes animation, colour override, and highlight child logic.
* **Parameters:** `i` (number) — frame index (1–3).
* **Returns:** `Entity` — the created FX follow entity.

## Events & listeners
- **Listens to:**  
  - `equipped` — triggers `ShadowSaddle_OnEquipped` (creates `saddle_shadow_fx`),  
  - `unequipped` — triggers `ShadowSaddle_OnUnequipped` (destroys `saddle_shadow_fx`),  
  - `saddle_shadow_fx.ownerevent` — client-side only, triggers FX refresh on owner change,  
  - `onremove` — internal to `ColourAdder:AttachChild` (automatically managed).  
- **Pushes:**  
  - `percentusedchange` (via `finiteuses` on use/depletion),  
  - `saddle_shadow_fx.ownerevent` (networked event for client sync),  
  - `BuffExpired`-style logic via `OnUsedUp` (spawns breaking chunks and removes saddle).