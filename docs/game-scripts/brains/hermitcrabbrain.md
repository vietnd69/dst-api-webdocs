---
id: hermitcrabbrain
title: Hermitcrabbrain
description: Manages the AI behavior tree for the Hermit Crab, including trading, fishing, hotspring soaking, pet feeding, tea shop navigation, and environmental adaptation (weather, day/night).
tags: [brain, ai, npc, weather, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 4d949711
system_scope: brain
---

# Hermitcrabbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hermitcrabbrain` implements the decision-making logic for the Hermit Crab entity via a Behavior Tree (`BT`). It orchestrates high-level tasks such as trading with players, fishing, harvesting meat/berries, soaking in hotsprings, feeding pets, and navigating weather/terrain changes. It relies heavily on the `inventory`, `npc_talker`, `locomotor`, `friendlevels`, `homeseeker`, `petleash`, `trader`, and `timer` components to execute context-aware actions and respond to dynamic in-game conditions.

## Usage example
This component is not added manually. It is automatically assigned to the Hermit Crab prefab via its `Brain` definition in the game's asset pipeline. Example of its integration:
```lua
local inst = CreateEntity()
inst:AddBrain("hermitcrabbrain")
-- The brain initializes and starts executing its Behavior Tree during inst:DoTaskInTime(0, ...)
```

## Dependencies & tags
**Components used:** `bathingpool`, `burnable`, `combat`, `dryable`, `dryer`, `dryingrack`, `edible`, `equippable`, `friendlevels`, `health`, `homeseeker`, `hunger`, `inventory`, `locomotor`, `npc_talker`, `petleash`, `sanity`, `timer`, `trader`  
**Tags checked:** `umbrella`, `lightsource`, `cansit`, `hermitcrab_marker_fishing`, `critter`, `oceanfish`, `oceanfishable`, `INLIMBO`, `pig`, `_combat`, `bathbombable`, `hermithotspring`, `pickable`, `bush`, `playerghost`, `notarget`, `sitting`  
**Tags added:** `sitting_on_chair` (via stategraph)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tea_shops` | table | `{}` | Map of valid tea shop entities (`[ent] = true`) the Hermit Crab considers visiting. |
| `selected_tea_shop` | Entity or `nil` | `nil` | The currently selected tea shop to navigate toward. |

## Main functions
### `HermitBrain:AddActiveTeaShop(teashop)`
* **Description:** Registers a tea shop entity as active for this Hermit Crab.
* **Parameters:** `teashop` (Entity) — the tea shop entity to add.
* **Returns:** Nothing.

### `HermitBrain:RemoveActiveTeaShop(teashop)`
* **Description:** Removes a tea shop from the active set and stops the Hermit Crab’s locomotion if it was the selected shop.
* **Parameters:** `teashop` (Entity) — the tea shop entity to remove.
* **Returns:** Nothing.

### `HermitBrain:SelectTeaShop()`
* **Description:** Validates active tea shops and selects the first valid one. If successful, triggers chatter announcing movement toward the shop.
* **Parameters:** None.
* **Returns:** `true` if a tea shop was selected; `nil` otherwise.

### `HermitBrain:GetSelectedTeaShopPos()`
* **Description:** Returns the world position of the currently selected tea shop if valid.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `HermitBrain:GetSelectedTeaShop()`
* **Description:** Returns the selected tea shop entity if valid.
* **Parameters:** None.
* **Returns:** Entity or `nil`.

### `HermitBrain:ValidateTeaShops()`
* **Description:** Filters out invalid tea shops (burnt, destroyed, etc.) from the `tea_shops` set and clears `selected_tea_shop` if invalidated.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoFeedPetCritterAction(inst)`
* **Description:** Creates a buffered action to feed the first nearby hungry critter pet with honey from inventory (spawning honey if missing).
* **Parameters:** `inst` (Entity) — the Hermit Crab instance.
* **Returns:** `BufferedAction` or `nil`.

### `DoFishingAction(inst)`
* **Description:** Attempts to initiate ocean fishing at the nearest valid fishing marker with the most fish in range, using the fishing rod (equipped or inventory).
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `DoSoakin(inst)`
* **Description:** Initiates soaking in a valid, non-burnt hotspring that has not been exhausted by a bath bomb.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `ExitHotSpring(inst)`
* **Description:** Removes the Hermit Crab from the current hotspring bath pool.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `getfriendlevelspeech(inst, target)`
* **Description:** Generates and queues greeting speech based on friendship level, optionally including player status advice (if friend level = 10). Manages timers (`speak_time`, `complain_time`).
* **Parameters:** `inst` (Entity), `target` (Entity, optional).
* **Returns:** `string`, `table`, or `nil` — the speech string to queue; also returns `true` if using chatter-style queuing.

### `runawaytest(inst)`
* **Description:** Returns `true` if the Hermit Crab is unfriendly (friend level ≤ `UNFRIENDLY_LEVEL`) and a player is nearby; also initiates greeting chatter before retreating.
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean`.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the closest player (within `START_FACE_DIST`) as a face target, triggering a greeting if not already greeted. Handles fishing interruption.
* **Parameters:** `inst` (Entity).
* **Returns:** Entity or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Continues facing `target` only if valid, within range (`KEEP_FACE_DIST`), and not busy/talking.
* **Parameters:** `inst` (Entity), `target` (Entity).
* **Returns:** `boolean`.

### `DoBottleToss(inst)`
* **Description:** Tosses a message bottle into the ocean from the nearest fishing marker if no umbrella is equipped and no cooldown is active.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `DoChairSit(inst)`
* **Description:** Attempts to sit on a comfortable chair in the Hermit Crab’s island radius.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

## Events & listeners
- **Listens to:** `hermitcrab_entered` — fired by the tea shop when the Hermit Crab arrives.
- **Pushes:** `oceanfishing_stoppedfishing`, `tossitem`, `ms_leavebathingpool` (via `bathingpool:LeavePool`), `unequip`, `setoverflow` (via inventory operations), `locomote`, `buffed` (via `DoAction` success callbacks, indirectly via `npc_talker`).
