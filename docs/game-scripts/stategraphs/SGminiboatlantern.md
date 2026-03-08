---
id: SGminiboatlantern
title: Sgminiboatlantern
description: Defines the state graph for the mini boat lantern entity, handling its idle state and transition to idle on locomotion or lighting state changes.
tags: [locomotion, lighting, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 297cd98e
system_scope: entity
---

# Sgminiboatlantern

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`sgminiboatlantern` is a state graph for the mini boat lantern entity, used to manage its animation and movement behavior. It defines a single `idle` state that stops physical movement via the `locomotor` component and selects an appropriate idle animation based on terrain (water vs. ground). The state graph responds to `floater_stopfloating` and `onturnoff` events by transitioning back to the `idle` state. It inherits walk-related state definitions from `CommonStates.AddWalkStates`.

## Usage example
This state graph is automatically assigned to the mini boat lantern prefab by the game engine and does not require direct usage in mod code. It is referenced internally during entity instantiation.

## Dependencies & tags
**Components used:** `locomotor`  
**Tags:** `idle`, `canrotate` (applied to the `idle` state)

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
- **Listens to:**  
  - `floater_stopfloating` — transitions to the `idle` state when floating ceases.  
  - `onturnoff` — transitions to the `idle` state when the lantern is turned off.  
- **Pushes:** none