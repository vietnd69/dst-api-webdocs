---
id: koalefant_carcass
title: Koalefant Carcass
description: Manages the state, decay, and visual progression of a koalefant carcass object, including meat consumption tracking, seasonal build variants, and decay timing.
tags: [environment, entity, decay, food]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 95d07fe6
system_scope: environment
---

# Koalefant Carcass

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `koalefant_carcass` prefab represents a consumable carcass dropped by a koalefant. It manages visual progression across `NUM_LEVELS = 3` meat levels, decay timing, seasonal variations (summer vs. winter builds), and interaction with the `burnable`, `sanityaura`, and `timer` components. It is designed to erode gradually as it is eaten, and self-destructs after a fixed decay duration if untouched.

## Usage example
```lua
-- Typical use within the game's prefabs system
return Prefab("koalefant_carcass", fn, assets)

-- After spawning, external code can manipulate meat level:
inst.components.koalefant_carcass.SetMeatPct(inst, 0.5)  -- sets meat to 50%
inst.components.koalefant_carcass.MakeWinter(inst)       -- switches to winter build
```

## Dependencies & tags
**Components used:** `burnable`, `sanityaura`, `timer`, `inspectable`  
**Tags:** Adds `meat_carcass` initially; removes `meat_carcass` and adds `NOCLICK` during final decay phase.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` | Current carcass state level (1–3); tied to remaining meat. |
| `meat` | number | `TUNING.KOALEFANT_CARCASS_MEAT_PER_LEVEL * NUM_LEVELS` | Total current meat quantity. |
| `winter` | boolean | `false` | Whether the carcass uses the winter build texture. |

## Main functions
### `SetLevel(inst, level)`
*   **Description:** Updates the visual animation and internal level based on the given `level`. Automatically triggers erasure logic when level exceeds `NUM_LEVELS`.
*   **Parameters:** `level` (number) – the target level (1-based, 1 ≤ level ≤ 4).
*   **Returns:** Nothing.
*   **Error states:** When `level > NUM_LEVELS`, enables `fastextinguish` on `burnable`, removes the `burnable` and `meat_carcass` tags, disables persistence, and schedules erasure via `ErodeAway` after 10 seconds.

### `SetMeat(inst, meat)`
*   **Description:** Adjusts the `meat` property and recalculates the `level` based on `TUNING.KOALEFANT_CARCASS_MEAT_PER_LEVEL`. Triggers `SetLevel`.
*   **Parameters:** `meat` (number) – absolute meat amount.
*   **Returns:** Nothing.

### `SetMeatPct(inst, pct)`
*   **Description:** Sets `meat` as a percentage (`0.0`–`1.0`) of the maximum capacity.
*   **Parameters:** `pct` (number) – percentage of full meat capacity.
*   **Returns:** Nothing.

### `OnChomped(inst, data)`
*   **Description:** Handles consumption (e.g., by a player or animal). Decreases meat, triggers a shake animation, plays an impact sound, and resets the decay timer.
*   **Parameters:** `data` (table, optional) – may contain `amount` (number, default `1`) for meat reduction.
*   **Returns:** Nothing.

### `MakeWinter(inst)`
*   **Description:** Applies the winter build variant to the carcass by setting the animation bank and build.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `chomped` – triggers `OnChomped` to reduce meat and reset decay.
- **Listens to:** `timerdone` – triggers `OnTimerDone` when decay timer completes, leading to erasure.
- **Pushes:** No events are pushed by this component.

## Additional Notes
- `SetMeatPct`, `MakeWinter`, `OnSave`, and `OnLoad` are attached directly to `inst` as top-level methods for convenience.
- The `burnable` component is initialized but configured to *not* disintegrate on extinguish (via `SetOnExtinguishFn(nil)`).
- The decay timer is reinitialized on every `chomped` event using `timer:SetTimeLeft("decay", ...)`.
- Persistence data stores only `meat` if below max capacity, and `winter` as a boolean flag.