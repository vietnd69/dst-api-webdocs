---
id: researchpointconverter
title: Researchpointconverter
description: A placeholder component that provides stub methods for activation and toggle states; it is intended to be replaced by prototyper.lua.
tags: [research, placeholder]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2cc86799
system_scope: entity
---

# Researchpointconverter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ResearchPointConverter` is a stub component that initializes basic internal state and provides minimal toggle/activation hooks. It is explicitly marked as deprecated in its source file with the comment `--DON'T USE THIS! Use prototyper.lua instead.` It exists only to maintain API compatibility in legacy contexts and should not be used in new development. The component defines no meaningful game logic or side effects beyond conditionally invoking optional callback functions.

## Usage example
```lua
-- Not recommended. Use prototyper.lua instead.
local inst = CreateEntity()
inst:AddComponent("researchpointconverter")
inst.components.researchpointconverter:TurnOn()
inst.components.researchpointconverter:Activate()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `val` | number | `0` | Unused internal counter/state value. |
| `active` | boolean | `false` | Unused boolean flag. |
| `level` | number | `1` | Unused level indicator. |
| `on` | boolean | `false` | Tracks whether the component is currently "on". |

## Main functions
### `TurnOn()`
* **Description:** Attempts to call the optional `self.onturnon` callback and sets the `on` flag to `true`, but only if the component is currently off. Does nothing if already on or if `onturnon` is not defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `TurnOff()`
* **Description:** Attempts to call the optional `self.onturnoff` callback and sets the `on` flag to `false`, but only if the component is currently on. Does nothing if already off or if `onturnoff` is not defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `Activate()`
* **Description:** Invokes the optional `self.onactivate` callback. Does nothing if `onactivate` is not defined.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
