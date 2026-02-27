---
id: beardbunnymanbrain
title: Beardbunnymanbrain
description: A brain class for Werepig entities that manages behavior through a behavior tree, including combat, foraging, wandering, and home-seeking.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f2cfe18a
---

# Beardbunnymanbrain

> Based on game build **714014** | Last updated: 2026-02-27

> This file is marked as **unused and unmaintained** in the official codebase. It exists only as a legacy reference, and should not be used as a reference for new development.

## Overview
This component defines the AI brain for Werepig entities (`WerePigBrain`). It inherits from `Brain` and implements behavior logic using a behavior tree (`BT`) composed of common behavior nodes. The brain handles priority-based decision making: panic responses take precedence, followed by opportunistic eating, combat, and then wandering near a remembered home location. It interacts with `combat`, `eater`, `follower`, `homeseeker`, and `knownlocations` components to coordinate actions.

Note: The file name (`beardbunnymanbrain.lua`) does not match the actual class name (`WerePigBrain`). This mismatch suggests the file was likely misnamed or repurposed during development and is no longer actively used.

## Dependencies & Tags
- **Components used:**
  - `combat`: accessed via `inst.components.combat.target`, `inst.components.combat.defaultdamage`
  - `eater`: accessed via `inst.components.eater:CanEat(...)`
  - `follower`: accessed via `inst.components.follower:GetLeader()`
  - `homeseeker`: accessed via `inst.components.homeseeker.home` and `IsValid()`
  - `knownlocations`: accessed via `inst.components.knownlocations:GetLocation("home")` and `inst.components.knownlocations:RememberLocation(...)`
- **Tags:** None identified.

## Properties
The class does not declare any public properties in the constructor. All state is managed internally by behavior nodes and component interactions.

## Main Functions
### `FindFoodAction(inst)`
* **Description:** Locates an edible entity within `SEE_FOOD_DIST` (`10` units) that satisfies `CanEat()` and is on a passable point. Returns a buffered `EAT` action targeting that entity, or `nil`.
* **Parameters:**
  - `inst` (`Entity`): The entity instance whose brain is making the decision.
* **Returns:** `BufferedAction` or `nil`.

### `GoHomeAction(inst)`
* **Description:** Constructs a buffered `GOHOME` action if the entity has no active leader, has a valid `homeseeker` component, and a valid home location stored in `homeseeker.home`.
* **Parameters:**
  - `inst` (`Entity`): The entity instance.
* **Returns:** `BufferedAction` or `nil`.

### `TargetIsAggressive(inst)`
* **Description:** Checks whether the current combat target is currently aggressive — that is, has positive `defaultdamage`, has `combat` component, and is targeting the entity (`target.components.combat.target == inst`).
* **Parameters:**
  - `inst` (`Entity`): The entity instance.
* **Returns:** `boolean` — `true` if the target is aggressive and valid.

### `WerePigBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Establishes priority order: panic conditions > safe eating > combat (chase and attack) > wandering near home. Uses `WhileNode` to enable opportunistic eating only when the target is not aggressive.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` to the constructed `BT` instance.

### `WerePigBrain:OnInitializationComplete()`
* **Description:** Records the entity’s current position as the `"home"` location using `KnownLocations:RememberLocation(...)`.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None. This component does not register or dispatch any events directly. Behavioral responses (e.g., panic) are driven by `BrainCommon` helper nodes.