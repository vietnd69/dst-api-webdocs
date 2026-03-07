---
id: hermitcrab
title: Hermitcrab
description: Manages the Hermit Crab NPC’s friendship progression, trading, home management, and island activity tracking in DST.
tags: [npc, friendship, trading, home, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c9588c8a
system_scope: entity
---

# Hermitcrab

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermitcrab` prefab implements the Hermit Crab NPC’s core logic in Don't Starve Together. It coordinates friendship tasks, item trading, shop unlocking, home decoration scoring, seasonal event awareness (e.g., weather, seasons), and island activity monitoring. The entity acts as a trader and quest-giver tied to the Pearl’s relocation mechanics, with interactions governed by friendship levels, environment, and task completion states. It uses components such as `friendlevels`, `trader`, `craftingstation`, `container`, `inventory`, `timer`, and `talker` to manage its behavior and communication.

## Usage example
```lua
-- The prefab is instantiated via the core Prefab() system (no manual instantiation).
-- Typical modding usage involves listening to its custom events:
inst:ListenForEvent("ms_register_hermitcrab", function(world, data)
    local hermit = data
    -- Register custom interaction logic with the Hermit Crab
end)

-- Extend friend rewards or tasks:
local tasks = inst.components.friendlevels.friendlytasks
tasks[TASKS.GIVE_HEAVY_FISH].complaintest = function(inst) return inst.CHEVO_marker ~= nil end
```

## Dependencies & tags
**Components used:**  
`builder`, `container`, `craftingstation`, `dryer`, `dryingrack`, `eater`, `edible`, `entitytracker`, `equippable`, `friendlevels`, `health`, `homeseeker`, `inspectable`, `insulator`, `inventory`, `inventoryitem`, `leader`, `locomotor`, `lootdropper`, `messagebottlemanager`, `npc_talker`, `petleash`, `pickable`, `pointofinterest`, `prototyper`, `stuckdetection`, `talker`, `teleportedoverride`, `timer`, `trader`, `unwrappable`, `wagpunk_arena_manager`, `weighable`, `worldmeteorshower`.

**Tags:**  
Adds `"character"`, `"hermitcrab"`, `"trader"`. Checks and conditionally removes `"highfriendlevel"` via `inst:AddTag`/`inst:HasTag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shop_level` | number | `1` (initialized to 1 in `EnableShop`) | Current shop tier (1–5). |
| `CHEVO_marker` | Entity or `nil` | `nil` | Marker entity associated with the Hermit Crab’s island (for task proximity checks). |
| `comment_data` | Table or `nil` | `nil` | Temporary comment state for dialogue triggers (position, speech, distance). Cleared on teleport events. |
| `commented_on_decors` | Table | `{}` | Tracks which decoration types have been commented on (e.g., `PEARL_DECORATION_TYPES.TILES`). |
| `driedthings` | number or `nil` | `nil` | Counter for dried items on meat racks. |
| `heavyfish` | number or `nil` | `nil` | Counter for heavy fish received. Triggers `TASKS.GIVE_HEAVY_FISH` at count 5. |
| `itemstotoss` | Table or `nil` | `nil` | List of items (usually small fish or invalid maps) to drop and fling before rewards. |
| `storelevelunlocked` | Function or `nil` | `storelevelunlocked` | A periodic task (cancelable) that announces shop unlock to players nearby. |
| `pearlgiven` | boolean or `nil` | `nil` | Tracks whether the pearl has been awarded. |
| `gotcrackedpearl` | boolean or `nil` | `nil` | Set when a cracked pearl is accepted. Enables the shellweaver recipe. |
| `introduced` | boolean or `nil` | `nil` | Tracks whether the Hermit Crab’s introduction line has been given at high friendship. |
| `segs` | Table or `nil` | `nil` | World day segments (e.g., `"night"`, `"dusk"`), updated via `clocksegschanged` event. |

## Main functions
### `EnableShop(inst, shop_level)`
*   **Description:** Initializes the `prototyper` component and sets the shop tier (1–5), loading the appropriate tech tree and unlocking recipes.
*   **Parameters:** `shop_level` (number) – Desired shop level (clamped to ≤5).
*   **Returns:** Nothing.
*   **Error states:** If `shop_level` is nil, uses existing `_shop_level` or defaults to 1.

### `OnAcceptItem(inst, giver, item, count)`
*   **Description:** Handles accepted trade items (e.g., ocean fish, umbrellas, puffy vests, flower salad, cracked pearl, map scrolls, dried foods). Triggers friendship tasks, rewards, and temporary state updates.
*   **Parameters:** `giver` (Entity) – Player giving the item. `item` (Entity) – Item being offered. `count` (number) – Not used in implementation.
*   **Returns:** Nothing.
*   **Error states:** Heavy ocean fish may be stored in `itemstotoss` if under the threshold; valid maps may be added to `itemstotoss` if invalid or duplicate. Small fish are tracked but not retained.

### `OnRefuseItem(inst, giver, item)`
*   **Description:** Responds to refused trade items using conditionally appropriate chatter (e.g., “already have umbrella”, “not raining”, “not snowing”) and transitions the Hermit Crab to the `refuse` state.
*   **Parameters:** `giver` (Entity) – Player attempting to trade. `item` (Entity) – Item offered.
*   **Returns:** Nothing.

### `complain(inst)`
*   **Description:** Evaluates pending friendship tasks, decor scores, and living area issues to generate a random complaint string if unmet conditions are present. Restarts talk timers.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `rewardcheck(inst)`
*   **Description:** Processes queued friend rewards, selects appropriate speech for the reward type (intro, group, task, default), and sets up a periodic task (`giverewardstask`) to speak near a player while the Hermit Crab is at home.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** String key (e.g., `"HERMITCRAB_INTRODUCE"`) for the dialogue to be spoken, or `nil`.

### `storelevelunlocked(inst)`
*   **Description:** Launches a periodic task that waits for the Hermit Crab to return home and find a nearby player, then announces the unlocked shop level once.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `getgeneralfriendlevel(inst)`
*   **Description:** Maps the current friend level (from `friendlevels.level`) to a string: `"LOW"` (0–3), `"MED"` (4–7), or `"HIGH"` (8+).
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** String (`"LOW"`, `"MED"`, or `"HIGH"`).

### `StartMeetPlayersTask(inst)`
*   **Description:** Starts a periodic task to scan for players within `MEET_PLAYERS_RANGE_SQ` (400 units²) and notify the `messagebottlemanager` that the Hermit Crab has been found.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `startfishing(inst)`
*   **Description:** Ensures the Hermit Crab has and equips an ocean fishing rod, populates its bobber/lure slots if missing, and starts the `fishingtime` timer to end the state.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `stopfishing(inst)`
*   **Description:** Cancels the fishing timer, removes the fishing event listener, unequips the rod after a delay, and clears hook state.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `IsInBadLivingArea(inst)`
*   **Description:** Returns `true` if the Hermit Crab is in a topologically disapproved area (Moon Island or Monkey Island layout/task).
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** boolean.

### `OnHermitCrabEnterTeaShop(inst)`
*   **Description:** Shuts down movement, disables physics, removes `prototyper`, fires `enter_teashop`, and updates animation offset for serving mode.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `OnHermitCrabLeaveTeaShop(inst)`
*   **Description:** Restores movement, re-enables physics, re-adds shop, clears queues, restarts brain, and resets animation offset.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes Hermit Crab state for persistence (shop level, tasks, rewards, pearl status, etc.).
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance. `data` (Table) – Save table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores persisted state. Re-initializes shop if present and re-applies tags like `"highfriendlevel"`.
*   **Parameters:** `inst` (Entity) – The Hermit Crab instance. `data` (Table) – Saved data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `home_upgraded`, `CHEVO_growfrombutterfly`, `CHEVO_makechair`, `CHEVO_starteddrying`, `CHEVO_fertilized`, `CHEVO_heavyobject_winched`, `CHEVO_lureplantdied`, `friend_level_changed`, `friend_task_complete`, `dancingplayer`, `moonfissurevent`, `clocksegschanged`, `enterlimbo`, `exitlimbo`, `onsatinchair`, `teleport_move`, `teleported`, `adopted_critter`, `critter_doemote`, `talkercolordirty` (client), `ms_register_hermitcrab`, `ms_register_hermitcrab_marker`, `ms_register_pearl_entity`.  
  Also listens to `"timerdone"` for fishing events.

- **Pushes:**  
  `use_pocket_scale`, `enter_teashop`, `dance`, `friend_level_changed`, `friend_task_complete`, `itemget`, `dropitem`, `wrappeditem`.
