---
id: lureplantbrain
title: Lureplantbrain
description: Manages the AI behavior tree for the Lureplant entity, prioritizing minion control during gameplay.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 896e1eb9
---

# Lureplantbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component implements the AI behavior for the Lureplant entity in Don't Starve Together. It extends the base `Brain` class and constructs a behavior tree (`BT`) during initialization. The primary behavior node is a `PriorityNode` that executes `ControlMinions` as its top-priority action, with the intention to fall back to a `StandStill` behavior (currently commented out). This brain governs how the Lureplant directs its attached minions in combat and movement.

## Dependencies & Tags
- **Components used:** None identified (no direct component access via `inst.components.X`).
- **Tags:** None identified.

## Properties
No public properties are defined or initialized in this component. The class relies entirely on inherited `Brain` functionality and internal behavior tree construction.

## Main Functions

### `LureplantBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node when the brain is started. Sets up a priority-based behavior node that prioritizes minion control over alternative behaviors.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
No events are registered or fired by this component.