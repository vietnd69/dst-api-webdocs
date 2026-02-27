---
id: mermguardbrain
title: Mermguardbrain
description: Brain component for Merm guards that coordinates movement, combat, and social behaviors such as following, healing, armor collection, and trading via behavior trees.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 5c0db9b4
---

# Mermguardbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `mermguardbrain` component defines the behavior logic for Merm guard entities using a behavior tree (BT). It orchestrates high-level decision-making such as following a leader, collecting armor from armories, seeking healing from players, avoiding electric fences, attacking enemies, and responding to offering pot calls. It integrates heavily with combat, inventory, follower, trader, and timer components to execute context-sensitive behaviors. The component is initialized via a constructor that configures a priority-based behavior tree in `OnStart()`.

## Dependencies & Tags
- **Components used:**
  - `combat` — for target tracking, attack timing, and range calculations.
  - `container` — for checking offering pot contents.
  - `eater` — for determining edible items.
  - `equippable` — for checking equip slots.
  - `follower` — for leader and loyalty tracking.
  - `health` — for detecting leader death.
  - `inventory` — for equipped/head armor retrieval and item searching.
  - `inventoryitem` — for ownership checks of items.
  - `knownlocations` — for retrieving home location.
  - `playercontroller` — for detecting remote interactions (e.g., trading/healing).
  - `timer` — for managing face time and don't-face intervals.
  - `trader` — for detecting active trade attempts.
- **Tags checked/added:**  
  `merm_armory`, `merm_armory_upgraded`, `mermarmorhat`, `mermarmorupgradedhat`, `INLIMBO`, `edible_VEGGIE`, `outofreach`, `scarytoprey`, `offering_pot`, `lunarminion`, `shadowminion`, `busy` (state tag), `jumping` (state tag).  
  No tags are explicitly added or removed by this component.

## Properties
This component does not define custom properties beyond inherited `Brain` behavior. All critical constants and logic are defined as local functions and module-level variables.

## Main Functions
### `MermBrain:OnStart()`
* **Description:** Initializes the full behavior tree for the Merm guard by constructing a priority node hierarchy. It configures dynamic nodes for combat, wandering, following, armor collection, trader interaction, healing, and response to offering pots.
* **Parameters:** None.
* **Returns:** None. The behavior tree is stored in `self.bt`.

## Helper Functions (Internal)
The following helper functions are used within the behavior tree logic:

### `GetLeader(inst)`
* **Description:** Returns the current leader of the Merm, if any, using the `follower` component.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity or nil` — The leader entity or `nil`.

### `NeedsArmor(inst)`
* **Description:** Checks whether the Merm lacks a head armor item. Checks first for equipped armor, then for armor in inventory.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `boolean` — `true` if no head armor is equipped or available in inventory.

### `GetClosestArmory(inst, dist)`
* **Description:** Finds the closest valid armory entity within a given radius (`FIND_ARMORY_RANGE` by default). Prioritizes upgraded armories over standard ones.
* **Parameters:**  
  `inst` — The entity instance.  
  `dist` (`number`) — Optional search radius.
* **Returns:** `Entity or nil` — The closest valid armory, or `nil`.

### `NeedsArmorAndFoundArmor(inst)`
* **Description:** Combines `NeedsArmor` and `GetClosestArmory` checks.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `boolean` — `true` if armor is needed and an armory is within range.

### `CollectArmor(inst)`
* **Description:** Triggers an `merm_use_building` event toward the closest armory if armor is needed.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `PickupArmor(inst)`
* **Description:** Attempts to pickup head armor from armories, prioritizing upgraded variants. Returns a `BufferedAction` or `nil`.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `BufferedAction or nil`.

### `GetHealerFn(inst)`
* **Description:** Scans for players within `TRADE_DIST` who are attempting to use the `HEAL` action on this Merm. Prioritizes the leader or other merms.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity or nil` — The healing player or `nil`.

### `KeepHealerFn(inst, target)`
* **Description:** Verifies whether a given entity is still actively attempting to heal this Merm.
* **Parameters:**  
  `inst` — The entity instance.  
  `target` — The entity to check.
* **Returns:** `boolean`.

### `GetTraderFn(inst)`
* **Description:** Finds a player within `TRADE_DIST` currently trying to trade with this Merm (via `trader:IsTryingToTradeWithMe`).
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity or nil`.

### `KeepTraderFn(inst, target)`
* **Description:** Verifies whether the given player is still attempting to trade.
* **Parameters:**  
  `inst` — The entity instance.  
  `target` — The player entity.
* **Returns:** `boolean`.

### `GetFaceTargetFn(inst)`
* **Description:** Selects a target for face behaviors. Prioritizes the leader, then nearby players, unless a `dontfacetime` timer is running.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity or nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether to keep facing the given target, based on leader identity or proximity.
* **Parameters:**  
  `inst` — The entity instance.  
  `target` — The face target entity.
* **Returns:** `boolean`.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target as the source of threat for running away.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Entity or nil`.

### `EatFoodAction(inst)`
* **Description:** Attempts to find and eat edible food (e.g., vegetables), prioritizing items in inventory or nearby. Avoids items held by others or located in unsafe spots (near scary mobs or invalid ground).
* **Parameters:** `inst` — The entity instance.
* **Returns:** `BufferedAction or nil`.

### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the Merm’s known home position if it has no leader; otherwise, returns `nil`.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Vector3 or nil`.

### `TargetFollowDistFn(inst)`
* **Description:** Calculates a dynamic follow distance based on loyalty and platform presence (reduced range if on a boat).
* **Parameters:** `inst` — The entity instance.
* **Returns:** `number` — Distance in world units.

### `TargetFollowTargetDistFn(inst)`
* **Description:** Calculates minimum distance from the combat target to maintain during following, based on the target's attack range.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `number`.

### `shouldanswercall(inst)`
* **Description:** Checks if this Merm should respond to an offering pot call. Returns false if already bound, is a lunar/shadow minion, or has a leader.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `boolean`.

### `Getcalledofferingpot(inst)`
* **Description:** Returns the position adjacent to the calling offering pot if still valid.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `Vector3 or nil`.

### `answercall(inst)`
* **Description:** Instructs the offering pot to process the Merm’s response.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

## Events & Listeners
This component pushes or listens to no events directly. It triggers behaviors through action nodes (`DoAction`) and state transitions via behavior tree nodes, but does not register `inst:ListenForEvent` or call `inst:PushEvent` internally.

Note: While the code uses `inst:PushEvent("merm_use_building", ...)`, this is done in a helper function (`CollectArmor`) but not registered as a listener elsewhere in this file, so it is treated as an event *trigger* for external systems, not a listened event.

- **Pushes:**  
  - `"merm_use_building"` — Sent to the armory entity when collecting armor (via `CollectArmor`).  
  - (`"merm_spawn_fx"` spawn and sound are side effects, not events.)

- **Listens to:** None.