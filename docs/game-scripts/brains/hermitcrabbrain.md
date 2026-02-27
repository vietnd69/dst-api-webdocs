---
id: hermitcrabbrain
title: Hermitcrabbrain
description: Controls the decision-making and behavior of the Hermit Crab NPC, including trading, wandering, fishing, soaking in hot springs, using weather gear, feeding pets, and responding to environmental conditions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: entity
source_hash: 4d949711
---

# Hermitcrabbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Hermitcrabbrain` component implements the behavior tree (BT) for the Hermit Crab NPC. It governs all autonomous actions and reactions, including trading with players, harvesting resources (meat, berries), fishing, soaking in hot springs, sitting on chairs, managing weather gear (umbrella/coat), feeding critters via `petleash`, speaking at appropriate times, fleeing from aggressive targets, and returning home during night or dangerous conditions (e.g., burning homes). The behavior prioritizes high-level environmental state detection (day/night, rain/snow) and interacts with multiple components including `inventory`, `npc_talker`, `petleash`, `locomotor`, `friendlevels`, `homeseeker`, `trader`, `timer`, `bathingpool`, `burnable`, and `health`.

## Dependencies & Tags

- **Components used:**
  - `bathingpool` (calls `LeavePool`)
  - `burnable` (calls `IsBurning`)
  - `combat` (calls `TargetIs`)
  - `dryable`, `dryer`, `dryingrack`, `edible`, `equippable`, `friendlevels`, `health`, `hunger`, `inventory`, `locomotor`, `npc_talker`, `petleash`, `sanity`, `timer`, `trader`
  - `homeseeker` (calls `GetHomePos`, uses `home` property)

- **Tags added/checked:**
  - `umbrella`, `lightsource`, `pickable`, `bush`, `hermitcrab_marker_fishing`, `oceanfish`, `oceanfishable`, `INLIMBO`, `cansit`, `uncomfortable_chair`, `fire`, `hermithotspring`, `bathbombable`, `critter`, `notarget`, `playerghost`, `busy`, `alert`, `mandatory`, `sitting`, `fishing_idle`, `talking`, `teleporting`, `soakin`

## Properties

| Property         | Type      | Default Value | Description |
|------------------|-----------|---------------|-------------|
| `tea_shops`      | `table`   | `{}`          | Map of currently active tea shops this hermit crab plans to visit. |
| `selected_tea_shop` | `Entity?` | `nil`       | Reference to the currently selected tea shop to travel toward. |

## Main Functions

### `HermitBrain:AddActiveTeaShop(teashop)`
* **Description:** Registers a tea shop as active for this hermit crab. It is added to `self.tea_shops` and used later when selecting a destination.
* **Parameters:**
  - `teashop` (Entity): The tea shop entity to add.
* **Returns:** None.

### `HermitBrain:RemoveActiveTeaShop(teashop)`
* **Description:** Removes a tea shop from the active set. If it was the selected shop, the locomotion is stopped and `selected_tea_shop` is cleared.
* **Parameters:**
  - `teashop` (Entity): The tea shop entity to remove.
* **Returns:** None.

### `HermitBrain:AnyActiveTeaShop()`
* **Description:** Returns whether any tea shop is currently active.
* **Parameters:** None.
* **Returns:** `boolean` — true if at least one tea shop exists in `tea_shops`.

### `HermitBrain:GetFirstTeaShop()`
* **Description:** Returns the first tea shop in `tea_shops` (or `nil` if none).
* **Parameters:** None.
* **Returns:** `Entity?` — First active tea shop or `nil`.

### `HermitBrain:ValidateTeaShops()`
* **Description:** Filters out invalid tea shops (burnt, burning, or non-existent) from `tea_shops` and clears `selected_tea_shop` if it was invalid.
* **Parameters:** None.
* **Returns:** None.

### `HermitBrain:SelectTeaShop()`
* **Description:** Validates tea shops, selects the first valid one, announces via NPC talker, and sets `selected_tea_shop`. Returns true on success.
* **Parameters:** None.
* **Returns:** `boolean?` — true if a valid tea shop was selected; `nil` otherwise.

### `HermitBrain:CheckSelectedTeaShop()`
* **Description:** Verifies that the currently selected tea shop is still valid.
* **Parameters:** None.
* **Returns:** `boolean` — true if `selected_tea_shop` is valid.

### `HermitBrain:GetSelectedTeaShopPos()`
* **Description:** Returns the world position of the selected tea shop, or `nil` if none is valid.
* **Parameters:** None.
* **Returns:** `Vector3?` — Position of tea shop or `nil`.

### `HermitBrain:GetSelectedTeaShop()`
* **Description:** Returns the selected tea shop entity if valid, or `nil`.
* **Parameters:** None.
* **Returns:** `Entity?` — Selected tea shop or `nil`.

### `HermitBrain:OnStart()`
* **Description:** Initializes the behavior tree root. Contains high-priority nodes for weather gear toggling, talk queue handling, tea shop navigation, critter feeding, trading, fleeing, soaking, and daily vs. nightly behavior sub-trees. Uses a `PriorityNode` to evaluate conditions in order of priority.
* **Parameters:** None.
* **Returns:** None. (Assigns `self.bt`.)

## Helper Functions (Internal)

### `IsTeaShopValid(teashop)`
* Returns true if the tea shop is valid (exists, not burnt, not burning).

### `getfriendlevelspeech(inst, target)`
* Constructs appropriate greeting text based on `friendlevels.level`. Applies custom logic for level 10 (player condition-based remarks). Uses `npc_talker:Say` or `Chatter` based on whether it’s chatter or full speech.

### `GetTraderFn(inst)`
* Finds a nearby player attempting to trade within `TRADE_DIST`. Triggers a chatter line and updates timers (`speak_time`, `complain_time`). Returns the player entity.

### `KeepTraderFn(inst, target)`
* Returns true if the target is still the same trader and not talking.

### `HasValidHome(inst)`
* Verifies that `homeseeker.home` exists, is valid, not burning, and not burnt.

### `GetHomePos(inst)`
* Returns home position using `homeseeker:GetHomePos()` if valid.

### `GetFaceTargetFn(inst)`
* Finds the closest player within `START_FACE_DIST`. Triggers a greeting based on friendship level using `getfriendlevelspeech`. Returns the player if appropriate.

### `KeepFaceTargetFn(inst, target)`
* Ensures face target remains valid and within range (`KEEP_FACE_DIST`).

### `DoCommentAction(inst)`
* Handles action to move or speak at a pre-defined comment location (`inst.comment_data`).

### `DoFeedPetCritterAction(inst)`
* Checks if any critter pet is hungry. If so, finds honey in inventory (spawns one if missing), then creates a `BufferedAction` to feed the hungry critter. Announces feeding using `npc_talker`.

### `CanWanderAtPoint(pos)`
* Determines if wandering is permitted at a position: always true in day; in night, only if within range of a `lightsource` (to avoid being in the dark).

### `GetFirstHungryPetCritter(inst)`
* Returns the first pet critter that is hungry, not on the ocean, and not in a blocked area.

### `GetFoodForCritter(inst)`
* Tries to find honey in inventory; spawns one if not found.

### `DoChairSit(inst)`
* Finds a valid sittable chair and creates `BufferedAction` to sit.

### `DoSoakin(inst)`
* Checks for a valid `hermithotspring` that isn’t bath-bombed or depleted, and returns `BufferedAction` to `SOAKIN`.

### `ExitHotSpring(inst)`
* Calls `LeavePool` on the bathing pool if currently soaking.

### `DoReel(inst)`
* Returns buffered action to reel if currently hooked and idle.

### `DoHarvestMeat(inst)`
* Harvests dried meat from drying racks or done dryers if `CHEVO_marker` is set.

### `DoHarvestBerries(inst)`
* Picks a nearby `pickable` or `bush` if `CHEVO_marker` is set.

### `DoFishingAction(inst)`
* Checks for fishing markers, finds the one with the most fish nearby, spawns and equips a rod if needed, and initiates ocean fishing.

### `DoBottleToss(inst)`
* Tosses a `messagebottle_throwable` into the ocean near fishing markers, if no umbrella is equipped and not in a bad living area.

### `DoTalkQueue(inst)`
* Advances NPC talk queue if not busy or talking.

### `DoThrow(inst)`
* Pushes `"tossitem"` event if `inst.itemstotoss` is set.

### `runawaytest(inst)`
* Determines whether to flee from players when `friendlevels.level` is low or unfriendly.

## Events & Listeners

### Listens to
None explicitly registered via `inst:ListenForEvent`. The brain responds to game events indirectly via stategraph state tags (e.g., `busy`, `talking`, `soakin`) and condition checks.

### Pushes
- `"setoverflow"` (via `inventory:Unequip`)
- `"unequip"` (via `inventory:Unequip`)
- `"setoverflow"` (in `EquipUmbrella`, `UnEquipUmbrella`, `EquipCoat`, `UnEquipBody`)
- `"oceanfishing_stoppedfishing"` (when fishing is interrupted to face player)
- `"hermitcrab_entered"` (on tea shop entry)
- `"tossitem"` (in `DoThrow`)
- `"locomote"` (via `locomotor:Stop`)
- `"ms_leavebathingpool"` (via `bathingpool:LeavePool`)