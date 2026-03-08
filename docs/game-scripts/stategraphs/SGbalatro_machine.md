---
id: SGbalatro_machine
title: Sgbalatro Machine
description: Controls the idle and talking animations of the Jimbo character in a Balatro cabinet using timeout-based state transitions.
tags: [animation, ai, interactivity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2f3e6113
system_scope: entity
---

# Sgbalatro Machine

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbalatro_machine` is a stategraph that governs the interactive behavior of the Balatro cabinet's Jimbo character. It alternates between an idle state (where it waits for a timeout and optionally triggers a talking sequence upon detecting a nearby player) and a talk state (which plays a randomized talk animation and sound). It relies on the `timer` and `talker` components to manage periodic timers and speech output.

## Usage example
This stategraph is not meant to be manually instantiated by modders; it is internally used by the `balatro_machine` prefab. It is registered as a stategraph with the name `"balatro_machine"` and attached to the entity during prefab initialization.

## Dependencies & tags
**Components used:**  
- `timer` — used via `inst.components.timer:StartTimer` and `inst.components.timer:TimerExists`  
- `talker` — used via `inst.components.talker:Chatter`  
**Tags:** None identified.

## Properties
No public properties are declared in this stategraph definition. State logic is driven entirely via state-specific `onenter` and event handlers.

## Main functions
Not applicable — this is a stategraph definition, not a component class. It does not expose public methods; behavior is defined declaratively via `states` and `events`.

## Events & listeners
- **Listens to:** `animover` — handled in the `"talk"` state to transition back to `"idle"` after animation finishes.  
- **Pushes:** No events are pushed by this stategraph.
