---
id: moon_device
title: Moon Device
description: Serves as the central hub for constructing and launching the Moon Altar boss sequence, handling stage transitions, construction logic, and meteor impacts.
tags: [boss, construction, event, environment, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 15976544
system_scope: environment
---

# Moon Device

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moon_device` prefab represents a multi-stage structure that initiates and manages the Moon Altar boss event in DST. It is constructed in three stages (`moon_device_construction1` → `moon_device_construction2` → `moon_device`), and upon reaching the final stage (`level == 3`), it automatically begins a countdown before triggering the boss spawn and associated effects. It relies on placement directly atop an existing `moon_altar_link`, and integrates tightly with construction, placement, and environmental destruction systems.

## Usage example
```lua
-- Typical usage inside the game's startup sequence
-- This prefab is auto-registered via MakeDeviceStage and returned by the script.
-- Modders typically interact with it indirectly through construction and events.

-- Example: Accessing properties after the device is built
if TheWorld.map:GetTag("CELESTIAL_ORB_FOUND") then
    print("Moon Device reached stage 2 or 3; Celestial Orb recipes unlocked.")
end
```

## Dependencies & tags
**Components used:** `constructionsite`, `inspectable`, `placer`, `health`, `combat`, `container`, `mine`, `inventoryitem`, `workable`  
**Tags added:** `moon_device`, `structure`, `nomagic`, `antlion_sinkhole_blocker`, `constructionsite` (only during construction stages)  
**Tags checked:** `moon_altar_link`, `can_build_moon_device`, `smashable`, `irreplaceable`, `FX`, `ghost`, `INLIMBO`, `NOCLICK`, `playerghost`, `_combat`, `_inventoryitem`, `CHOP_workable`, `DIG_workable`, `HAMMER_workable`, `MINE_workable`, `moonglass`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `3` (for full device), `1` or `2` (for construction stages) | Current construction/activation stage; used to determine behavior and animations. |
| `_pillars` | table | `nil` | Array of 4 pillar entities spawned at level >= 2. |
| `_top` | entity | `nil` | Top component entity spawned at level == 3. |
| `_link` | entity | `nil` | `moon_altar_link_contained` entity used for visual tether. |
| `_has_replaced_moon_altar_link` | boolean | `false` | Tracks whether the original `moon_altar_link` has been replaced and removed. |
| `_construction_product` | string | `nil` | Name of the prefab this stage builds into (e.g., `"moon_device_construction2"`). |

## Main functions
No user-facing methods exist for external callers—this is a prefab definition script that constructs entities via factory functions. All logic is internal to prefab construction and event-driven callbacks. However, the following internal helpers play critical roles:

### `OnConstructed(inst, doer)`
*   **Description:** Checks if construction materials meet the required amounts per `CONSTRUCTION_PLANS`. If so, replaces this construction-site entity with the next upgrade prefab (`_construction_product`) and plays sound/animation for level transitions.
*   **Parameters:** `inst` (entity) — the construction site entity; `doer` (entity) — not used.
*   **Returns:** Nothing.
*   **Error states:** Silently skips replacement if material counts are insufficient.

### `ClearArea(inst)`
*   **Description:** During device destruction (stage 1 break), this clears a 15-radius area by applying various effects (altar-specific FX, kill, destroy, damage, launch) to entities in range, depending on their components and tags.
*   **Parameters:** `inst` (entity) — the moon device being destroyed.
*   **Returns:** Nothing.

### `breaksequence(inst)`
*   **Description:** Starts the countdown sequence leading to boss spawn. Spawns a falling FX, waits ~9 frames, then triggers `break_device`, which in turn spawns break FX, scorch marks, and finally spawns the `alterguardian_phase1` boss.
*   **Parameters:** `inst` (entity) — the moon device entity.
*   **Returns:** Nothing.

### `placer_onupdatetransform(inst)`
*   **Description:** Snap-to-grid logic for the construction placer: finds nearest `moon_altar_link`, snaps position, and sets `accept_placement` based on the linker's `can_build_moon_device` tag.
*   **Parameters:** `inst` (entity) — the placer entity.
*   **Returns:** Nothing.

### `placer_override_testfn(inst)`
*   **Description:** Overrides placement test to enforce placement *only* when a valid `moon_altar_link` is nearby, ignoring standard block checks (water, etc.) to avoid blocking progression.
*   **Parameters:** `inst` (entity) — the placer entity.
*   **Returns:** `can_build`, `mouse_blocked` — booleans (always `inst.accept_placement`, `false` respectively).

## Events & listeners
- **Listens to:**
  - `onbuilt` — triggers `base_onbuilt`, playing construction sound and animation.
  - `onremove` — clears the global `existing_moon_device` reference.
- **Pushes:** None directly (events are emitted by other components it uses, e.g., construction system fires `onbuilt`).

## Notes
- Only one `moon_device` instance is permitted; if a second is created, it removes itself.
- At stage 2 or 3, the world tag `CELESTIAL_ORB_FOUND` is enabled, unlocking related crafting recipes.
- The device is only valid when built directly on top of a `moon_altar_link`; otherwise, it removes itself during `validate_spawn`.
- The countdown to boss spawn (`BREAK_DELAY = 9.5` seconds) starts immediately upon reaching level 3, unless `POPULATING` is true (e.g., worldgen load), in which case the meteor spawner is deferred.