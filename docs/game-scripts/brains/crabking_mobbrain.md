---
id: crabking_mobbrain
title: Crabking Mobbrain
description: Controls the behavior tree logic for the Crab King mob, including platform abandonment when the platform is critically damaged, evasion of electric fences and panic triggers, combat engagement, and homing wander movement to a remembered home location.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9f160765
---

# Crabking Mobbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree for the Crab King mob, a boss-entity in DST. It orchestrates high-priority survival behaviors (panic triggers), tactical platform abandonment, active combat via `ChaseAndAttack`, and navigation back to a remembered home position using `Wander`. It inherits from the base `Brain` class and is attached to the mob entity via `inst:AddComponent("brain")`. The brain relies on two external components: `health` to determine when the Crab King's platform is too damaged to remain on, and `knownlocations` to store and retrieve the home position used for wander navigation.

## Dependencies & Tags
- **Components used:**  
  - `health`: Reads `currenthealth` to evaluate platform integrity.
  - `knownlocations`: Calls `GetLocation("home")` for wander target and `RememberLocation("home", ...)` during initialization.
- **Tags:** None identified.

## Properties
No public instance properties are initialized in the constructor beyond the base `Brain` functionality. The component uses local constants and internal state (`self.bt`) which are not exposed as public properties.

## Main Functions

### `CrabkingMobBrain:OnStart()`
* **Description:** Constructs and assigns the behavior tree root node. This method is called automatically when the brain begins running. It defines a priority node with five sub-nodes evaluated in order: panic triggers (for fire/electric fence), a platform-abandonment check, combat engagement, and wander movement.
* **Parameters:** None.
* **Returns:** None. Initializes `self.bt` with the constructed behavior tree.

### `CrabkingMobBrain:OnInitializationComplete()`
* **Description:** Registers the mob's current position as its "home" location in the `knownlocations` component. This point becomes the target for wander behavior during later gameplay.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None. This component does not register or fire any events directly. It operates entirely through behavior tree evaluation and component API calls.