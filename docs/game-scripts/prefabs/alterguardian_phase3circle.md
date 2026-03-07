---
id: alterguardian_phase3circle
title: Alterguardian Phase3Circle
description: Spawns periodic laser trail FX along a circular ring around its position for use during Alterguardian Phase 3.
tags: [fx, boss, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1d69fb85
system_scope: fx
---

# Alterguardian Phase3Circle

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`alterguardian_phase3circle` is a non-persistent, network-aware prefab used exclusively in Phase 3 of the Alterguardian boss fight. It acts as a visual effect spawner that continuously generates laser trail FX (`alterguardian_lasertrail`) at evenly spaced points along a circular ring. The circle's radius is derived from `TUNING.ALTERGUARDIAN_PHASE3_SUMMONRSQ`, and points are precomputed and shuffled to avoid predictable patterns. It serves purely as a client-side visual aid and does not interact with gameplay logic directly.

## Usage example
This prefab is instantiated internally by the Alterguardian Phase 3 logic and is not meant to be added manually by modders. However, for illustrative purposes:
```lua
local circle = SpawnPrefab("alterguardian_phase3circle")
circle.Transform:SetPosition(x, y, z)
```
Note: The circle automatically spawns effects for ~3 seconds via `DoPeriodicTask` and then terminates.

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `NOCLICK`

## Properties
No public properties.

## Main functions
The constructor `fn()` initializes the prefab; no additional public methods are exposed. Internal helpers `GeneratePoints()` and `spawn_fx()` are not documented as they are not callable from outside the module scope.

## Events & listeners
- **Pushes:** None identified  
- **Listens to:** None identified