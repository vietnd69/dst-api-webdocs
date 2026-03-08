---
id: SGlunarplanttentacle
title: Sglunarplanttentacle
description: Defines the state machine behavior for the lunar plant tentacle enemy, handling idle, taunt, attack, and death states with combat integration.
tags: [combat, ai, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 57c1efeb
system_scope: ai
---

# Sglunarplanttentacle

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlunarplanttentacle` is a StateGraph implementation that governs the behavior of the lunar plant tentacle entity. It defines a finite state machine with states for idle, taunt, attack, and death, and integrates tightly with the `combat` component to manage targeting, aggro forwarding, and attack execution. It extends `CommonStates` to reuse standard combat animation patterns and includes event handlers for death and new combat target events.

## Usage example
```lua
-- Typically instantiated automatically by the entity prefab system.
-- The state graph is returned and used internally by the entity's StateGraph component:
local sg = require("stategraphs/SGlunarplanttentacle")
-- This graph is attached to the entity via inst:AddChild(sg) in the prefab definition.
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** 
- `"idle"`, `"invisible"` (added in `idle` state)
- `"taunting"` (added in `taunt` state)
- `"busy"` (added in `death` state)
- `"attack"` (added dynamically during attack animations via `CommonStates.AddSimpleState`)

## Properties
No public properties.

## Main functions
This file is a pure StateGraph definition (no class-based component), so there are no instance methods to document. All logic is embedded in state definitions and event handlers.

## Events & listeners
- **Listens to:** 
  - `death` - transitions the entity to the `death` state.
  - `newcombattarget` (in `idle` state) — triggers transition to `taunt` if a target is provided.
- **Pushes:** None (does not fire custom events; relies on state transitions and combat component events).