---
id: SGeyeturret
title: Sgeyeturret
description: Defines the state machine for the Eye Turret entity, managing idle, attack, hit, and death animations and behaviors.
tags: [combat, ai, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 154b71dc
system_scope: entity
---

# Sgeyeturret

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGeyeturret` is the stategraph for the Eye Turret entity in Don't Starve Together. It orchestrates the entity's core behaviors—such as idle rotation, attacking with a projectile, reacting to damage (via hit states), and dying with loot dropping and sound effects—by defining state transitions and event listeners. It integrates with the `combat`, `health`, and `lootdropper` components to handle combat logic and looting on death, and uses `CommonStates` helpers to support freeze and electrocute states.

## Usage example
The stategraph is loaded and applied automatically by the game engine when the `eyeturret` prefab is instantiated. Modders do not typically call this stategraph directly, but can extend or override its behavior via prefab-level stategraph overrides or by modifying component logic.

## Dependencies & tags
**Components used:** `combat`, `health`, `lootdropper`
**Tags:** `idle`, `canrotate`, `busy`, `hit`, `attack`
**Common states used:** `AddFrozenStates`, `AddElectrocuteStates`

## Properties
No public properties exposed.

## Main functions
This file returns a `StateGraph` definition; it does not define custom methods. All logic is embedded within state definitions (`State{}`) and event handlers (`EventHandler{}`).

## Events & listeners
- **Listens to:** `death`, `doattack`, `attacked`, `animover`, and standard death/freeze/electrocute handlers via `CommonHandlers`.
- **Pushes:** The stategraph itself does not push events; it responds to external events (e.g., `attacked`, `doattack`) and internal transitions (`animover`).