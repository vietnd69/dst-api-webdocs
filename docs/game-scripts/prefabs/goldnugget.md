---
id: goldnugget
title: Goldnugget
description: Defines the gold nugget and lucky gold nugget prefabs, providing them with basic physics, visual, and gameplay behaviors such as edibility, tradability, stacking, and ambient shine effects.
tags: [inventory, edible, tradable, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f80fca1f
system_scope: entity
---

# Goldnugget

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`goldnugget.lua` defines two prefabs: `goldnugget` and `lucky_goldnugget`. Both are small, non-living entities that serve as collectible resources in DST, primarily used in crafting and trading. They are equipped with components that enable them to be picked up, stacked, eaten (yielding minimal hunger), and sold for in-game currency. They also feature a persistent ambient sparkle animation triggered periodically and re-triggered on entity wake.

## Usage example
```lua
-- Spawn a gold nugget in the world
local nugget = SpawnPrefab("goldnugget")
nugget.Transform:SetPosition(x, y, z)

-- Spawn a lucky gold nugget
local lucky = SpawnPrefab("lucky_goldnugget")
lucky.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `edible`, `tradable`, `inspectable`, `inventoryitem`, `stackable`, `bait`, `snowmandecor`.  
**Tags added:** `molebait`, `quakedebris`, and conditionally `minigameitem` (unless YOTP event is active for standard nugget) or `NOCLICK`/`knockbackdelayinteraction` during knockback delay.  
**Lucky variant adds:** `minigameitem` (only during YOTP event).

## Properties
No public properties are defined directly in the `goldnugget` or `lucky_goldnugget` constructors. Instance properties like `scrapbook_overridedata` are set on `inst`, but these are prefab instance metadata rather than component-level properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `knockbackdropped` (only on lucky gold nugget) — triggers `OnKnockbackDropped` to manage temporary interaction delays (`NOCLICK`, `knockbackdelayinteraction` tags) after knockback is processed.  
- **Pushes:** None.

## Helper functions
### `shine(inst)`
* **Description:** Initiates a repeating sparkle animation on the item. Plays "sparkle" once, then loops "idle". Recursively schedules itself every 4–9 seconds while the entity is awake.
* **Parameters:** `inst` (Entity) — the gold nugget entity instance.
* **Returns:** Nothing.
* **Error states:** None; safe to call multiple times.

### `OnEntityWake(inst)`
* **Description:** Ensures the `shine` task is active if the entity wakes from sleep and no shining task is already scheduled.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** None.

### `OnKnockbackDropped(inst, data)`
* **Description:** Handles knockback drop events to apply temporary interaction blocks. Adds `NOCLICK` or `knockbackdelayinteraction` tags with associated delayed removal tasks based on `data` fields.
* **Parameters:**  
  - `inst` (Entity)  
  - `data` (table | nil) — may contain `delayinteraction` (number) and `delayplayerinteraction` (number) in seconds.
* **Returns:** Nothing.
* **Error states:** Silently ignores missing or `nil` data.

## Prefab definitions
- **`goldnugget`**: Standard gold nugget. Adds `stackable`, `bait`, and `snowmandecor` components. Gold value not explicitly set in this function (inherits default 0 from `tradable` unless elsewhere modified).
- **`lucky_goldnugget`**: Variant with `scrapbook_overridedata` for custom scrapbook display. Sets `tradable.goldvalue = 1`. Does *not* add `bait` or `snowmandecor`. Includes `KnockbackDropped` event listener.

## Special behaviors
- **Shine effect**: Non-visual-lighting effect handled via `AnimState`; runs periodically only while awake.
- **Sinking behavior**: `inventoryitem:SetSinks(true)` ensures items sink in water (via `Physics` component behavior).
- **Event-sensitive tagging**:  
  - `goldnugget` gets `minigameitem` tag *unless* `SPECIAL_EVENTS.YOTP` is active.  
  - `lucky_goldnugget` gets `minigameitem` *only if* `SPECIAL_EVENTS.YOTP` is active.
- **Hauntable support**: Standard variant includes `MakeHauntableLaunchAndSmash`, lucky variant only `MakeHauntableLaunch`.
- **Pristine state**: Both prefabs call `entity:SetPristine()`, indicating they are unmodified by world generation and safe for replication.