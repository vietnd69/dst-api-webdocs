---
id: SGantchovies
title: Sgantchovies
description: Defines the state graph for the ant chovies entity, handling transitions between idle, caught-in-net, and released-from-net animation states.
tags: [animation, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a46fd6a2
system_scope: entity
---

# Sgantchovies

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGantchovies` defines a simple state graph for the ant chovies entity, managing its animation behavior across three states: `idle`, `caught_in_net`, and `released_from_net`. This state graph controls how the entity animates when caught or released, using animation sequences managed by the `AnimState` component. It is not tied to logic-heavy behavior but focuses purely on visual feedback and state transitions triggered by specific events.

## Usage example
This state graph is attached automatically to the ant chovies prefab via the DST engine's stategraph system. Modders typically do not interact with it directly, but may extend or override it when creating custom prefabs or behaviors that reuse this animation flow.

## Dependencies & tags
**Components used:** `AnimState`
**Tags:** None identified.

## Properties
No public properties

## Main functions
Not applicable — this file returns a `StateGraph` definition, not a component class with methods.

## Events & listeners
- **Listens to:**
  - `on_caught_in_net` → transitions to `caught_in_net`
  - `on_release_from_net` → transitions to `released_from_net`
- **Pushes:** None identified