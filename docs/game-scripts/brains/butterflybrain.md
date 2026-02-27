---
id: butterflybrain
title: Butterflybrain
description: Controls the AI behavior of a butterfly entity by managing movement, flower collection, and escape responses.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e1711b66
---

# Butterflybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `ButterflyBrain` component defines the behavior tree for a butterfly entity in Don't Starve Together. It orchestrates core AI actions such as wandering toward flowers, collecting pollen, returning home (to a flower), and fleeing from threats. This brain integrates with the game's behavior system (via `behaviours/`) and leverages shared panic triggers from `BrainCommon`. It relies on the `pollinator` component to determine pollen collection status and the `skilltreeupdater` component to check for player-specific modifiers that affect threat perception.

## Dependencies & Tags
- **Components used:**
  - `pollinator`: Checked via `self.inst.components.pollinator:HasCollectedEnough()` to determine if the butterfly should return home.
  - `skilltreeupdater`: Checked via `guy.components.skilltreeupdater:IsActivated("wormwood_bugs")` in the `RUN_AWAY_PARAMS` filter to suppress panic in players who have unlocked that skill.
- **Tags:**
  - Uses `{"scarytoprey"}` for threat detection (in `RunAway`).
  - Uses `{"flower"}` via `GetClosestInstWithTag` for flower seeking.
- **Behaviors referenced:**
  - `RunAway`, `Wander`, `DoAction`, `FindFlower`
  - Shared triggers: `BrainCommon.PanicTrigger`, `BrainCommon.ElectricFencePanicTrigger`

## Properties
No public properties are initialized in the constructor. The class uses local constants (`RUN_AWAY_DIST`, `STOP_RUN_AWAY_DIST`, etc.) and a behavior tree (`self.bt`) stored on the instance.

## Main Functions

### `ButterflyBrain:OnStart()`
* **Description:** Initializes and sets the behavior tree for the butterfly. This method is called when the brain takes control of the entity. It builds a priority-based behavior tree that evaluates actions in order: panic responses (if triggered), threat avoidance, flight-to-home logic, flower seeking, and finally general wandering.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None identified. The brain does not register or dispatch events directly. It operates solely via its behavior tree evaluation loop.