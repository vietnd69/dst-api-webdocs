---
id: monkeyprojectile
title: Monkeyprojectile
description: A reusable prefab for monkey-throwable projectile objects that deal minor sanity damage on impact or splash upon missing.
tags: [combat, fx, projectile]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 510daa6f
system_scope: combat
---

# Monkeyprojectile

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`monkeyprojectile` is a lightweight prefab instance used as a thrown object (e.g., by Monkeys) in combat. It leverages the `projectile` component to handle flight and collision behavior, and triggers specific logic on hit or miss: dealing small sanity damage to the target on hit, or spawning a splash effect and a `poop` entity upon missing or when landing in invalid terrain. It does not persist across game saves (`persists = false`) and is optimized for single-use, short-range throws.

The prefab integrates with the `sanity`, `inventoryitem`, and `projectile` components and is designed to be spawned dynamically during gameplay.

## Usage example
This prefab is not added directly to entities; instead, it is spawned via `SpawnPrefab("monkeyprojectile")` and then launched using `LaunchAt()` (inherited behavior from `projectile` setup). Example internal usage (as seen in the codebase):
```lua
local projectile = SpawnPrefab("monkeyprojectile")
LaunchAt(projectile, target, thrower)
```

## Dependencies & tags
**Components used:** `projectile`, `inventoryitem` (via external calls in `OnHit`), `sanity` (via external calls in `OnHit`)  
**Tags:** Adds `projectile`

## Properties
No public properties are initialized or stored on the entity instance. All configuration is internal to the projectile logic and behavior functions.

## Main functions
No custom methods are defined on the entity instance. Logic is implemented as local functions (`SplashOceanPoop`, `SpawnPoop`, `OnHit`, `OnMiss`) passed as callbacks to the `projectile` component.

## Events & listeners
- **Listens to:** None (the prefab itself does not register listeners).
- **Pushes:** The projectile itself pushes no events; however, the `OnHit` function triggers the target entity to push `attacked` with `{ attacker = owner, damage = 0 }`.