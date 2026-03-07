---
id: lavae_pet
title: Lavae Pet
description: Manages the behavior, stats, and interactions of the Lavae pet companion in DST, including hunger-based heat/light regulation, sleep cycles, and ability to accept ashes for feeding.
tags: [ai, companion, hunger, heat, light]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9af3ef25
system_scope: entity
---

# Lavae Pet

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavae_pet` prefab defines the Lavae pet entity — a companion that provides light and heat to the player. It consumes ashes via the `edible` and `eater` components, regulates its heat and light output based on hunger level, and uses a custom `sleeper` to fall asleep when near the leader and well-fed. It integrates with the `follower`, `trader`, `heater`, `propagator`, and `inspectable` components to support gameplay mechanics like following, feeding, and status display.

## Usage example
```lua
local inst = SpawnPrefab("lavae_pet")
if inst and inst.components then
    -- Set leader for following
    inst.components.follower:SetLeader(player)
    -- The pet automatically adjusts heat/light as hunger changes
    -- and sleeps/wakes based on hunger and proximity
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `inspectable`, `locomotor`, `follower`, `cooker`, `heater`, `propagator`, `knownlocations`, `sleeper`, `trader`, `eater`, `inventory`, `hunger`, `lootdropper`

**Tags:** `companion`, `noauradamage`, `character`, `scarytoprey`, `notraptrigger`, `smallcreature`, `cooker`, `trader`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MIN_HEAT` | number | `15` | Minimum heat output when starving. |
| `MAX_HEAT` | number | `100` | Maximum heat output when fully fed. |
| `WAKE_TO_FOLLOW_DISTANCE` | number | `14` | Max distance to leader to wake up and follow. |
| `SLEEP_NEAR_LEADER_DISTANCE` | number | `7` | Max distance to leader to fall asleep. |
| `inst.Light` | Light | N/A | Light component with radius/intensity/color controlled by hunger. |
| `inst.components.heater.heat` | number | `MAX_HEAT` | Heat output of the pet, varies linearly with hunger. |
| `inst.components.propagator.propagaterange` | number | `2` | Range over which heat propagates. |
| `inst.components.propagator.heatoutput` | number | `3` | Heat contributed per propagator update. |
| `inst.components.sleeper.testperiod` | number | `4 ± 2` | Randomized interval (seconds) between sleep/wake tests. |

## Main functions
### `ShouldWakeUp(inst)`
* **Description:** Determines whether the pet should wake up. Wakes if the default wake test passes, if it is not near its leader, or if hunger is ≤25%.
* **Parameters:** `inst` (Entity) — the pet instance.
* **Returns:** `boolean` — `true` if pet should wake up.

### `ShouldSleep(inst)`
* **Description:** Determines whether the pet should fall asleep. Sleeps if default sleep test passes, it is near its leader (within 7 units), hunger is >25%, and it is not a full moon.
* **Parameters:** `inst` (Entity) — the pet instance.
* **Returns:** `boolean` — `true` if pet should sleep.

### `ShouldAcceptItem(inst, item)`
* **Description:** Validates whether the pet can accept and eat an item. It rejects if asleep, inventory full, item lacks `edible` component, or item is not in its edible diet (`BURNT` only).
* **Parameters:** 
  * `inst` (Entity) — the pet instance.
  * `item` (Entity) — the item being offered.
* **Returns:** `boolean` — `true` if item can be accepted.

### `OnHungerDelta(inst, data)`
* **Description:** Reacts to hunger changes by adjusting heat output and light properties (radius, intensity, and colour remain fixed in definition, but radius/intensity scale with hunger). Linearly interpolates between `MIN_HEAT`/`MAX_HEAT`, `0.33`/`1`, and `0.25`/`0.75` based on hunger percent.
* **Parameters:** 
  * `inst` (Entity) — the pet instance.
  * `data.newpercent` (number) — current hunger as a fraction (`0.0` to `1.0`).
* **Returns:** Nothing (modifies `heater.heat`, `Light` properties in-place).

### `OnHaunt(inst, haunter)`
* **Description:** Handles haunting. On haunt, with `TUNING.HAUNT_CHANCE_ALWAYS` probability, sets panic state (e.g., to flee or animate differently).
* **Parameters:** 
  * `inst` (Entity) — the pet instance.
  * `haunter` (Entity) — the haunting entity.
* **Returns:** `boolean` — `true` if haunt succeeded (caused panic), else `false`.

### `describe(inst)`
* **Description:** Returns a status string based on hunger level for display in the `inspectable` UI.
* **Parameters:** `inst` (Entity) — the pet instance.
* **Returns:** `string` — one of: `"STARVING"` (≤25% hunger), `"HUNGRY"` (≤50%), `"CONTENT"` (≤75%), or `"GENERIC"` (fully fed).

## Events & listeners
- **Listens to:** `hungerdelta` — fires `OnHungerDelta` when hunger value changes, to update heat and light.

## Inventory & Trader Details
- **Inventory:** `maxslots = 2` — holds ashes for feeding.
- **Trader:** `deleteitemonaccept = false` — item remains in inventory (e.g., reused for feeding), but `ShouldAcceptItem` enforces constraints before acceptance.

## sleep/wake behavior summary
- Sleeps only when well-fed (`hunger > 0.25`) and near leader (`≤7` units), and not on full moons.
- Wakes when hungry (`hunger ≤ 0.25`) or too far from leader (`>14` units).
- Sleep/wake tests run every `~4` seconds (randomized ±2).