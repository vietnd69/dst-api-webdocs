---
id: kitcoon
title: Kitcoon
description: Manages the behavior and state of kitcoons, including sleeping, following, hiding, and interacting with players and environments.
tags: [locomotion, ai, follower, hider]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d9a278f7
system_scope: entity
---

# Kitcoon

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `kitcoon.lua` file defines the `MakeKitcoon` factory function that constructs kitcoon entities (companion characters in DST). It configures core components—`follower`, `sleeper`, `locomotor`, `hideandseekhider`, `embarker`, and `kitcoon`—to implement behavior such as automatic sleeping/following logic, panic responses, teleportation to home den, and participation in Hide and Seek minigames. The kitcoon supports multiple biomes and event variants, and integrates with the game’s leader/follower system and world persistence.

## Usage example
```lua
-- Create a kitcoon instance (e.g., forest variant)
local kitcoon = MakeKitcoon("kitcoon_forest", false)()
-- Access components
kitcoon.components.follower:SetLeader(player)
kitcoon.components.hideandseekhider:StartGoingToHidingSpot(hiding_spot, 10)
kitcoon.components.sleeper:WakeUp()
```

## Dependencies & tags
**Components used:** `follower`, `entitytracker`, `kitcoon`, `named`, `timer`, `sleeper`, `locomotor`, `embarker`, `drownable`, `hideandseekhider`, `inspectable`, `spawnfader`, `health` (externally via `IsDead`), `talker` (externally via `Say`), `leader` (externally via `AddFollower`), `kitcoonden` (externally via `AddKitcoon`/`RemoveKitcoon`), `sleeper` (externally via `WakeUp`/`IsAsleep`).

**Tags added:** `kitcoon`, `companion`, `notraptrigger`, `noauradamage`, `NOBLOCK`, `NOCLICK`, `DECOR`, `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_first_nuzzle` | boolean | `true` | Tracks whether this kitcoon has been nuzzled by a player for the first time. |
| `_toy_follow_target` | entity | `nil` | Temporary target for toy-following behavior after playing with a toy. |
| `_hiding_prop` | string | `"kitcoon_hider_prop"` | Prefab name used when hiding in Hide and Seek. |
| `_sound_task` | task | `nil` | Task reference for periodic hiding sounds. |
| `next_play_time` | number | `GetTime() + TUNING.KITCOON_PLAYFUL_DELAY + math.random() * TUNING.KITCOON_PLAYFUL_DELAY_RAND` | Timestamp when the kitcoon may next play with toys. |
| `playmatetags` | table | `{"kitcoon"}` | Tags used to identify valid playmate entities. |

## Main functions
### `MakeKitcoon(name, is_unique)`
* **Description:** Factory function that returns a prefab definition for a kitcoon with specified build and uniqueness. Initializes components, sets up state graph and brain, and registers world event listeners for collection (e.g., YOT event). Non-unique kitcoons increment `NUM_BASIC_KITCOONS`.
* **Parameters:** 
  - `name` (string) — Build name (e.g., `"kitcoon_forest"`) used to locate animation assets.
  - `is_unique` (boolean) — If `true`, enables event-specific collection listeners.
* **Returns:** `Prefab` — A fully configured prefab definition.
* **Error states:** None — always returns a valid `Prefab` instance.

### `TeleportHome(inst)`
* **Description:** Attempts to teleport the kitcoon to its home den if the den exists and is beyond the neighbor distance threshold. Upon successful teleport, wakes the kitcoon and transitions to the `"evicted"` state.
* **Parameters:** 
  - `inst` (Entity) — The kitcoon entity instance.
* **Returns:** `boolean` — `true` if teleport occurred (den found and dist exceeded), `false` otherwise.
* **Error states:** Returns `false` if no home den is tracked (`entitytracker` returns `nil`).

### `OnFound(inst, doer)`
* **Description:** Handler for Hide and Seek “found” events. Grants player friendship, adds kitcoon to leader’s follower list, plays a wild-found announcement, or teleports to den if no valid player.
* **Parameters:** 
  - `inst` (Entity) — The kitcoon entity instance.
  - `doer` (Entity) — The entity that found the kitcoon (typically a player).
* **Returns:** Nothing.
* **Error states:** If `doer` is `nil` or invalid, or if kitcoon is asleep and no home den exists, it may fallback to `"evicted"` state or teleport.

### `StartGoingToHidingSpot(inst, hiding_spot, hide_time)`
* **Description:** Begins the hiding animation sequence for Hide and Seek. Plays a pounce sound, adds `NOCLICK` tag, and schedules panic/timer logic.
* **Parameters:** 
  - `inst` (Entity) — The kitcoon entity instance.
  - `hiding_spot` (Entity) — The hiding spot entity (unused in logic but required by interface).
  - `hide_time` (number) — Total hiding duration in seconds.
* **Returns:** Nothing.
* **Error states:** If `hide_time` is too short for animation, panic timer is shortened accordingly.

### `OnChangedLeader(inst, new_leader)`
* **Description:** Responds to leadership changes. Adds/removes kitcoon from den’s `kitcoonden` component, aborts active hiding.
* **Parameters:** 
  - `inst` (Entity) — The kitcoon entity instance.
  - `new_leader` (Entity or `nil`) — The new leader entity or `nil` if leadership was lost.
* **Returns:** Nothing.
* **Error states:** None — handles both leader gain and loss gracefully.

### `OnPetted(inst, data)`
* **Description:** Called when the kitcoon is petted. Wakes the kitcoon, adds it to the petting player’s follower list if not already a follower, and transitions to `"nuzzle"` state.
* **Parameters:** 
  - `inst` (Entity) — The kitcoon entity instance.
  - `data` (table) — Event data containing `{ doer = player_entity }`.
* **Returns:** Nothing.
* **Error states:** Returns early silently if `data.doer` is invalid or missing.

## Events & listeners
- **Listens to:** 
  - `timerdone` (via `inst:ListenForEvent`) — Triggers `OnTimerDone` to handle `"teleport_home"` logic.
  - `on_petted` (via `inst:ListenForEvent`) — Triggers `OnPetted` handler.
  - `epicscare` (via `inst:ListenForEvent`) — Triggers `DoPanic`.
  - `on_played_with` (via `inst:ListenForEvent`) — Triggers `OnPlayedWithToy` for toy-following.
  - `ms_collectallkitcoons` (via `inst:ListenForEvent`) — Collects all kitcoons during YOT event.
  - `ms_collect_uniquekitcoons` (via `inst:ListenForEvent`) — Collects unique kitcoons during specific events.
  - `onremove` (via `inst:ListenForEvent` on kitcoon/den) — Handled in `kitcoonden` via `OnAddKitcoon`.

- **Pushes:** 
  - `"makefriend"` — Emitted on kitcoon introduction to enable friendship logic.
  - `"startfollowing"` — Pushed by `follower` component when leader is assigned.
  - `"onwakeup"` — Pushed by `sleeper` component when waking up.
  - `"animover"` — Used internally for `kitcoon_hide_fx` removal.