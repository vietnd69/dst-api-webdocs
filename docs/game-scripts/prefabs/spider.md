---
id: spider
title: Spider
description: Factory function defining multiple spider variant prefabs with shared combat, AI, state, and lifecycle logic.
tags: [combat, ai, entity, locomotion, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 589942cc
system_scope: entity
---

# Spider

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spider.lua` file defines a `Prefab` factory for eight distinct spider variants (base spider, warrior, hider, spitter, dropper, moon, healer, water strider) in Don't Starve Together. It centralizes shared behavior through a common initialization function (`create_common`) and variant-specific overrides. Key responsibilities include:
- Setting up animations, physics, sound, and network state for each spider.
- Configuring core components: `combat`, `follower`, `sleeper`, `eater`, `health`, `inventory`, `sanityaura`, `acidinfusible`, `locomotor`, `health`, `equippable`, and `halloweenmoonmutable`.
- Enabling inter-spider relationships via leader/follower mechanics, combat targeting/sharing, and cooperative behaviors (healing, summoning).
- Supporting lifecycle events such as entering/exiting water (for water strider), sleeping/waking (based on cave day cycle), and mutation (via Halloween moon or spider mutator food items).

## Usage example
```lua
-- Spawn a base spider with default stats and behavior
local spider = SpawnPrefab("spider")
spider.Transform:SetPosition(10, 0, 20)

-- Spawn a spider spitter (acid-infused ranged attacker)
local spitter = SpawnPrefab("spider_spitter")
spitter.Transform:SetPosition(10, 0, 20)

-- Manually infuse a spider with acid (triggers ranged projectile swap)
if spitter and spitter.components.acidinfusible then
    spitter.components.acidinfusible:SetFXLevel(2) -- increase effect level
end

-- Have a player whisperer make friends with a spider
local player = ThePlayer
player:PushEvent("makefriend")
player.components.leader:AddFollower(spider)
```

## Dependencies & tags
**Components used:**  
`spawnfader`, `locomotor`, `embarker`, `drownable`, `lootdropper`, `burnable`, `freezable`, `health`, `combat`, `follower`, `sleeper`, `knownlocations`, `eater`, `inspectable`, `inventory`, `trader`, `inventoryitem`, `sanityaura`, `acidinfusible`, `halloweenmoonmutable`, `amphibiouscreature` (water variant), `timer` (water variant)

**Tags added (common):**  
`cavedweller`, `monster`, `hostile`, `scarytoprey`, `canbetrapped`, `smallcreature`, `spider`, `drop_inventory_onpickup`, `drop_inventory_onmurder`, `trader`  

**Tags used conditionally (per variant):**  
`spider_warrior`, `spider_hider`, `spider_spitter`, `spider_healer`, `spider_moon`, `spider_water`, `lunar_aligned`, `soulless`, `shadowthrall_parasite_hosted` (runtime-only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `no_targeting` | boolean | `false` | Disables targeting logic when `true`. |
| `defensive` | boolean | `true` | Used to toggle behavior during aggressive summoned-follower sharing. |
| `bedazzled` | boolean | `false` | Disables sanity aura penalty and friendly targeting. |
| `summoned` | boolean | `false` | Prevents sleeping when `true`. |
| `recipe` | string \| nil | `nil` | Recipe name (e.g., `"mutator_warrior"`) that a leader can learn upon pickup. |
| `weapon` | Entity \| nil | `nil` | Reference to a ranged weapon entity for spitter variant. |
| `build` | string | `"spider_build"` \| variant-specific | Current animation build used for face/override symbol mapping. |
| `healtime` | number | `0` | Timestamp tracking the last healing cycle (spider_healer). |
| `_last_leader` | Entity \| nil | `nil` | Cached leader reference for corpse data saving. |

## Main functions
### `create_common(bank, build, tag, common_init, extra_data)`
*   **Description:** Core factory function that initializes shared base spider logic and components. Creates the entity, sets physics/anim/sound, adds components and listeners, and configures per-variant settings. Returns a fully constructed but unpristine entity on the client; returns the completed entity on the server.
*   **Parameters:**  
    `bank` (string) — Animation bank name (e.g., `"spider"`, `"spider_hider"`, `"spider_moon"`).  
    `build` (string) — Build name used for symbols (e.g., `"spider_build"`, `"DS_spider_caves"`).  
    `tag` (string? \| nil) — Optional extra variant tag (e.g., `"spider_warrior"`).  
    `common_init` (function? \| nil) — Optional variant-specific initialization callback.  
    `extra_data` (table? \| nil) — Optional table with keys `sg`, `brain`, `pathcaps`, `SetHappyFaceFn`.
*   **Returns:** `Entity` (on master) or `Entity` (pristine, client-only) — The initialized entity instance.

### `FindTarget(inst, radius)`
*   **Description:** Finds the first valid combat target within a given radius, respecting leader/follower relationships, PVP settings, and friendly targeting rules.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.  
    `radius` (number) — Maximum search radius in units.
*   **Returns:** `Entity?` — The first valid target, or `nil` if no target found.
*   **Error states:** Returns `nil` if `inst.no_targeting` is `true`.

### `keeptargetfn(inst, target)`
*   **Description:** Predicate used by the `combat` component to determine if the current target remains valid (alive, not self/leader, not a friendly).
*   **Parameters:**  
    `inst` (Entity) — The spider instance.  
    `target` (Entity) — The proposed target.
*   **Returns:** `boolean` — `true` if the target remains valid, `false` otherwise.

### `OnAttacked(inst, data)`
*   **Description:** Event handler fired on spider being attacked. It sets the attacker as the spider’s target, and calls `combat:ShareTarget` to summon other nearby spiders under the same leader.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.  
    `data` (table) — Event data containing `{ attacker = attacker_entity }`.
*   **Returns:** Nothing.

### `DoHeal(inst)`
*   **Description:** Heals nearby spiders and allies within `SPIDER_HEALING_RADIUS`. Skips healing for spiders targeting the healer, the healer’s leader, or the healer’s leader’s followers.
*   **Parameters:**  
    `inst` (Entity) — The spider_healer instance.
*   **Returns:** Nothing.

### `DoSpikeAttack(inst, pt)`
*   **Description:** Spawns a radial pattern of lunar spikes at a given point. Used by spider_moon.
*   **Parameters:**  
    `inst` (Entity) — The spider_moon instance.  
    `pt` (Vector3) — Target point in world space.
*   **Returns:** Nothing.

### `NormalRetarget(inst)`
*   **Description:** Retarget function for base spider and healer variants, using `TUNING.SPIDER_INVESTIGATETARGET_DIST` or `TUNING.SPIDER_TARGET_DIST`.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.
*   **Returns:** `Entity?` — The new target found by `FindTarget`, or `nil`.

### `WarriorRetarget(inst)`
*   **Description:** Retarget function for warrior/hider/spitter variants, using `TUNING.SPIDER_WARRIOR_TARGET_DIST`.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.
*   **Returns:** `Entity?` — The new target found by `FindTarget`, or `nil`.

### `WaterRetarget(inst)`
*   **Description:** Retarget function for water variant, reducing range when chasing fish.
*   **Parameters:**  
    `inst` (Entity) — The spider_water instance.
*   **Returns:** `Entity?` — The new target, or `nil`.

### `SetHappyFace(inst, is_happy)`
*   **Description:** Applies or removes the happy face override for the spider. Used when leashed or released.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.  
    `is_happy` (boolean) — `true` to show happy face, `false` to hide.
*   **Returns:** Nothing.

### `ShouldSleep(inst)`
*   **Description:** Determines if the spider should fall asleep (only during cave day and if not otherwise awakened).
*   **Parameters:**  
    `inst` (Entity) — The spider instance.
*   **Returns:** `boolean` — `true` if sleeping conditions are met.

### `ShouldWake(inst)`
*   **Description:** Determines if a sleeping spider should wake up (e.g., combat, danger, leader present, or night).
*   **Parameters:**  
    `inst` (Entity) — The spider instance.
*   **Returns:** `boolean` — `true` if waking conditions are met.

### `OnGetItemFromPlayer(inst, giver, item)`
*   **Description:** Event handler for when the spider accepts an item from a player (e.g., meat, hat). Handles eating food or equipping hats, and triggering follower relationships.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.  
    `giver` (Entity) — The player or entity giving the item.  
    `item` (Entity) — The item being offered.
*   **Returns:** Nothing.

### `OnRefuseItem(inst, item)`
*   **Description:** Event handler for rejected items (e.g., non-food). Plays a taunt state and wakes the spider if asleep.
*   **Parameters:**  
    `inst` (Entity) — The spider instance.  
    `item` (Entity) — The rejected item.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — Triggers `OnAttacked` to set target and share target with allies.  
  `startleashing` — Triggers `OnStartLeashing` (enables pickup, happy face, recipe unlock).  
  `stopleashing` — Triggers `OnStopLeashing` (disables pickup, resets happy face).  
  `ontrapped` — Triggers `OnTrapped` (drops all inventory).  
  `oneat` — Triggers `OnEat` (attempts mutation if food has `spidermutator`).  
  `ondropped` — Triggers `OnDropped` (sleep/wake state transition based on conditions).  
  `gotosleep` — Triggers `OnGoToSleep` (allows pickup while asleep).  
  `onwakeup` — Triggers `OnWakeUp` (prevents pickup unless leashed).  
  `onpickup` — Triggers `OnPickup` (removes home and homeseeker on pickup).  
  `iscaveday` (world watch) — Triggers `OnIsCaveDay` (wakes spider on night, returns to den on day if unled).  
  `death` — Implicitly handled via `leader:RemoveFollower` (see `follower` component).

- **Pushes:**  
  `makefriend` — Emitted by leader on successful friend-making.  
  `unlockrecipe` — Emitted by leader when a recipe is learned.  
  `feedincontainer`, `feedmount` — Emitted during eating interaction (see `Eater:Eat`).  
  `healthdelta` — Emitted by `health` component on damage/healing.  
  `dropitem` — Emitted by `inventory` on item drop.  
  `leaderchanged` — Emitted by `follower` on leader change.