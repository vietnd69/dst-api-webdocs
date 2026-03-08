---
id: SGwobysmall
title: Sgwobysmall
description: State graph controlling Woby (small form) behavior, including movement, transformations, interactions like picking up items, storing in containers, and various emotes.
tags: [ai, stategraph, pet, transformation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d4dfca68
system_scope: ai
---

# Sgwobysmall

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwobysmall` defines the complete state machine for the small form of Woby, a pet creature in DST. It extends `SGCritter_common` to inherit standard critter behaviors (idle, walk, sleep, eat, etc.) and adds specialized states for transformation to big Woby, interactable actions (`pickup`, `give`, `dolongaction`), sitting, and rack appearance. This state graph integrates with the `locomotor` component for movement control, `wobyrack` and `container` components for item storage interactions, and the `pickable` component for object harvesting.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("woby")
inst:AddComponent("locomotor")
inst:AddComponent("wobyrack")
inst:AddComponent("container")
inst:AddComponent("pickable")
-- ... other setup ...
inst.sg = StateGraph("wobysmall", states, events, "idle", actionhandlers)
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `locomotor`, `container`, `pickable`, `wobyrack`, `pet_hunger_classified` (via `inst.pet_hunger_classified`)
**Tags:** Adds/removes: `busy`, `jumping`, `nointerrupt`, `sitting`, `transforming`, `canrotate`; checks: `moving`, `idle`

## Properties
Not applicable

## Main functions
This file is a state graph definition and does not expose standalone functions beyond returning the constructed `StateGraph` object.

## Events & listeners
- **Listens to:**
  - `transform` – triggers transition to `"transform"` state.
  - `showrack` – triggers `"rack_appear"` state unless blocked by tags.
  - `showalignmentchange` – triggers `"emote_cute"` and stops movement.
  - `start_sitting` – triggers `"sitting"` state if not already sitting or busy.
  - `animover`, `animqueueover` – internal animation completion events to transition between states.
  - `playernewstate`, `ontimeout`, `locomote`, `hop`, `sink`, `voidfall`, `oneat`, `onavoidcombat`, `ontraitchanged`, `onwakeex`, `onsleepex` – inherited from `SGCritterEvents` and `CommonHandlers`.
- **Pushes:** Standard state events (`onenter`, `onexit`) per state; events triggered via `inst:PushEvent(...)` are not explicitly listed but follow standard DST conventions.