---
id: SGfused_shadeling_bomb
title: Sgfused Shadeling Bomb
description: Defines the state graph for the fused shadeling bomb entity, controlling its movement (walking), idle, spawn, and bounce behaviors.
tags: [ai, movement, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 24694426
system_scope: entity
---

# Sgfused Shadeling Bomb

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfused_shadeling_bomb` is a `StateGraph` definition for the fused shadeling bomb entity. It manages core behavioral states such as `walk`, `idle_ground`, `bounce`, and `spawn`. The state graph integrates with the `locomotor` component to respond to movement intent and with the `timer` component during spawning to ensure proper timing.

## Usage example
This state graph is not used directly by modders; it is automatically applied to the `fused_shadeling_bomb` prefab. Modders who wish to modify its behavior should override or extend the state graph at load time using `AddStateGraph` and custom state overrides.

## Dependencies & tags
**Components used:** `locomotor`, `timer`
**Tags:** States use tags `moving`, `idle`, `canrotate`, and `busy` via `HasStateTag` and state definitions.

## Properties
No public properties. As a `StateGraph` file, it defines behavior declaratively and does not expose modifiable instance properties.

## Main functions
This file does not define any standalone functions — it constructs and returns a `StateGraph` instance. State behavior is implemented in state handlers (`onenter`, `ontimeout`, `onexit`) and event callbacks.

## Events & listeners
- **Listens to:** `locomote` - triggered when locomotion intent changes; evaluates whether the entity should transition between `walk` and `idle` states based on `WantsToMoveForward()` and current state tags.