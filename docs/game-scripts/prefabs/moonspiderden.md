---
id: moonspiderden
title: Moonspiderden
description: A regenerative boss lair that spawns moon spiders and responds to player actions, world state, and environmental events like quakes.
tags: [boss, spawner, environment, regeneration, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4b6411a
system_scope: environment
---

# Moonspiderden

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonspiderden` is a prefabricated structure representing a mutating lunar spider mound. It functions as a dynamic boss arena element that regenerates over time, adjusts its aggression and spider capacity based on damage taken, and reacts to world events like quakes and daytime in caves. It relies heavily on the `workable`, `childspawner`, `lootdropper`, and `sleeper` components, and manages multiple spawn states and sound/animation behaviors depending on its health. The den is non-player controllable and triggers large-scale spider spawns when mined or interacted with.

## Usage example
This component is instantiated automatically by the game via the `moonspiderden` prefab definition and is not meant for direct instantiation by modders. However, modders can interact with its public API:
```lua
-- Example of invoking a public method on an existing moonspiderden instance
local den = SpawnPrefab("moonspiderden")
if den ~= nil then
    -- Force all current and pending spiders to spawn immediately (e.g. in response to an event)
    den.components.childspawner:ReleaseAllChildren()
    -- Or use the den's own SummonChildren method
    den:PushEvent("startquake") -- triggers quaking behavior that wakes buried spiders
end
```

## Dependencies & tags
**Components used:** `workable`, `childspawner`, `lootdropper`, `inspectable`, `sleeper`, `inventory`, `knownlocations`, `burnable`, `fueled`, `hauntable`, `groundcreepentity`, `obstacle`, `physics`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`.

**Tags:** Adds `spiderden`. Does not add `cavedweller` (commented out in source).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stage` | number | `LARGE` (`3`) | Current growth stage (`SMALL=1`, `MEDIUM=2`, `LARGE=3`). Updated when work is done or regenerated. |
| `_num_investigators` | number | `2` (stage-dependent) | Max number of spiders assigned to investigate a player's location. |
| `_idle_task` | task | `nil` | Periodic task responsible for idle twitch animations. |
| `_regen_task` | task | `nil` | Periodic task responsible for passive regeneration of work left. |
| `_sleep_start_time` | number | `nil` | Timestamp when entity entered sleep state; used to compute regen during sleep. |

## Main functions
### `set_stage(inst, workleft, regrow)`
*   **Description:** Determines and sets the den's current growth stage based on remaining work, adjusts child counts and emergency warrior limits accordingly, updates ground creep radius, and triggers stage-change animations and sounds if `regrow` is `true`. |
*   **Parameters:** `workleft` (number) — current remaining work points; `regrow` (boolean) — if `true`, enables growth animations and regen-based sounds. |
*   **Returns:** Nothing. Modifies `inst._stage`, childspawner capacities, and visual state. |

### `SpawnInvestigators(inst, data)`
*   **Description:** Spawns up to `_num_investigators` spiders outside the den, marks them with `"investigate"` location data, and triggers twitch animations. Used in response to `"creepactivate"` events. |
*   **Parameters:** `data` (table, optional) — expected to contain `target` (an entity), used to record investigation position. |
*   **Returns:** Nothing. May spawn new spiders and set `"investigate"` locations via `knownlocations`. |

### `SummonChildren(inst, data)`
*   **Description:** Forces all pending and currently allocated children to spawn immediately (ignoring spawn timers). Applies `"spider_summoned_buff"` debuff to newly spawned spiders. Used for event-triggered mass spawns. |
*   **Parameters:** `data` (table, unused). |
*   **Returns:** Nothing. Calls `childspawner:ReleaseAllChildren()` and applies debuffs. |

### `push_twitch_idle(inst, skip_anim_check)`
*   **Description:** Triggers random twitch animations and sound effects (cracking sounds) at timed intervals, typically when the den is above 50% health and not in a non-twitch animation. |
*   **Parameters:** `inst` (EntityInst), `skip_anim_check` (boolean, optional) — if `true`, skips animation state checks. |
*   **Returns:** Nothing. Schedules sounds and animation changes via `DoTaskInTime`. |

### `OnGoHome(inst, child)`
*   **Description:** Called when a spawned spider returns home. Drops any equipped hat item (head slot) before the spider goes home. |
*   **Parameters:** `inst` (EntityInst - den), `child` (EntityInst - spider). |
*   **Returns:** Nothing. Uses `inventory:GetEquippedItem(EQUIPSLOTS.HEAD)` and `inventory:DropItem()`. |

### `OnSpawnChild(inst, spider)`
*   **Description:** Callback invoked immediately after a spider is spawned. Instructs the spider to enter the `"taunt"` state. |
*   **Parameters:** `inst` (EntityInst - den), `spider` (EntityInst - newly spawned spider). |
*   **Returns:** Nothing. Sets spider stategraph state via `spider.sg:GoToState("taunt")`. |

### `StopSpawning(inst)`
*   **Description:** Stops spider spawning by calling `childspawner:StopSpawning()`. Triggered on entering a cave day. |
*   **Parameters:** `inst` (EntityInst - den). |
*   **Returns:** Nothing. Does nothing if `childspawner` is missing. |

### `StartSpawning(inst)`
*   **Description:** Starts spider spawning by calling `childspawner:StartSpawning()`. Triggered on exiting a cave day (e.g., back to surface or night). |
*   **Parameters:** `inst` (EntityInst - den). |
*   **Returns:** Nothing. Does nothing if `childspawner` is missing or in cave day. |

## Events & listeners
- **Listens to:** `creepactivate` — triggers `SpawnInvestigators`.
- **Listens to:** `startquake` (via `TheWorld.net`) — triggers `OnQuakeBegin`, which wakes spiders and sets `_quaking = true`.
- **Listens to:** `endquake` (via `TheWorld.net`) — triggers `OnQuakeEnd`, which clears `_quaking`.
- **Pushes:** `dropitem` — fired internally when inventory drops items (via `inventory:DropItem`).
- **Pushes:** `onwakeup` — fired internally when sleeper wakes up (via `sleeper:WakeUp`).
- **Pushes:** `entity_droploot` — fired after loot is dropped.
