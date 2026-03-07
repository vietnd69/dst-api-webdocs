---
id: daywalker2_items
title: Daywalker2 Items
description: Creates FX prefabs that simulate breaking and releasing loot for the Daywalker2 boss fight, including physics motion and conditional armor modification.
tags: [fx, boss, loot, physics]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 60589661
system_scope: fx
---

# Daywalker2 Items

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines prefabs used to visualize the breaking of Daywalker2 boss components (e.g., spikes, armor, objects) during combat. Each FX prefab is a temporary entity that animates, moves with physics, and optionally spawns loot upon completion. When loot is present (e.g., scrap hat), the component attaches to the loot and adjusts its armor condition via `armor:SetPercent`. The file returns six distinct FX prefabs used in the boss fight.

## Usage example
```lua
-- Example usage inside the Daywalker2 AI or damage logic:
local fx = SpawnPrefab("daywalker2_spike_loot_fx")
fx.Transform:SetPosition(entity.Transform:GetWorldPosition())

-- When the FX completes animation, it automatically:
--   - Spawns a "scraphat" with randomized armor (6%–20%)
--   - Removes itself from the world
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `Physics`, `Armor` (on spawned loot)
**Tags:** Adds `FX` and `NOCLICK` to FX entities.

## Properties
No public properties. This file returns prefab constructors, not component instances.

## Main functions
### `MakeItemBreakFx(name, anim, loot)`
*   **Description:** Factory function that returns a `Prefab` for a breaking FX entity. If `loot` is provided, the FX will spawn that item and apply randomized armor condition (6%–20%) on completion.
*   **Parameters:**
    *   `name` (string) — Unique identifier for the prefab (e.g., `"daywalker2_spike_break_fx"`).
    *   `anim` (string) — Animation bank name to play (e.g., `"spike_break"`).
    *   `loot` (string or nil) — Optional prefab name to spawn as loot (e.g., `"scraphat"`).
*   **Returns:** A `Prefab` function ready for use with `SpawnPrefab`.
*   **Error states:** None documented.

### `OnAnimOver(inst)`
*   **Description:** Callback invoked when the FX animation completes. If `inst.loot` is set, it spawns the loot prefab and sets its armor to a random percentage. Otherwise, erodes the FX away.
*   **Parameters:** `inst` (entity) — The FX instance.
*   **Returns:** Nothing.
*   **Error states:** If `loot` is absent, removes its own `animover` listener and stops physics.

### `OnHitGround(inst, speed)`
*   **Description:** Sets the physics motor velocity to half the initial speed after a delay, simulating rolling to a stop.
*   **Parameters:**  
    *   `inst` (entity) — The FX instance.  
    *   `speed` (number) — Initial horizontal speed passed from task scheduling.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` when animation finishes.
- **Pushes:** None.
