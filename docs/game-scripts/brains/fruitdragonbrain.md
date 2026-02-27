---
id: fruitdragonbrain
title: Fruitdragonbrain
description: Controls the behavior tree for the Fruit Dragon entity, determining how it wanders, follows its home object, retreats during challenges, and attacks.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 94e2e450
---

# Fruitdragonbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`FruitDragonBrain` is a brain component responsible for defining the behavioral logic of the Fruit Dragon entity using a behavior tree. It integrates with several helper behaviors (e.g., `Wander`, `Follow`, `RunAway`, `ChaseAndAttack`) and leverages components like `entitytracker` to locate its home object, `inventoryitem` for grand ownership, and `timer` to detect panic states. The brain prioritizes panic responses (electric fences, challenge loss), then movement relative to its home (chasing, following, or wandering), and finally fallback wandering when no home is present.

## Dependencies & Tags
- **Components used:** `entitytracker`, `inventoryitem`, `locomotor`, `timer`
- **Tags:** None identified.

## Properties
No public properties are initialized in the constructor. The class extends `Brain` and stores its behavior tree in `self.bt`.

## Main Functions
### `FruitDragonBrain:OnStart()`
* **Description:** Initializes and sets the behavior tree for the Fruit Dragon. The tree is structured to prioritize panic behavior, followed by challenge-specific retreat logic, chase/attack, home-related movement (with special handling for moveable homes), and fallback wander behavior.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
This component does not register or push any events directly. It relies entirely on the behavior tree framework for execution flow and decision-making.