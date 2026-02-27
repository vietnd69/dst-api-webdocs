---
id: researchpointconverter
title: Researchpointconverter
description: A simple toggleable component that triggers optional callback functions when activated, turned on, or turned off.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2cc86799
---

# Researchpointconverter

## Overview
This component provides a minimal abstraction for entities that need to track activation state and optionally respond to state changes via user-defined callbacks. It stores simple state variables (`val`, `active`, `level`, `on`) and exposes `TurnOn`, `TurnOff`, and `Activate` methods that invoke optional callback hooks if present. According to the source comment, this component is deprecated and should not be used; `prototyper.lua` is recommended instead.

## Dependencies & Tags
No external components are added or required by this script. No tags are applied or removed. The component simply attaches to an entity via `Class(function(self, inst) ...)`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The entity instance the component is attached to. |
| `val` | `number` | `0` | An arbitrary numeric value (unused internally). |
| `active` | `boolean` | `false` | Logical state flag (unused internally). |
| `level` | `number` | `1` | An arbitrary level value (unused internally). |
| `on` | `boolean` | `false` | Tracks whether the converter is currently "on". |

## Main Functions
### `TurnOn()`
* **Description:** Turns the converter "on" if it is currently off, and invokes the optional `onturnon` callback (passed externally) with `self.inst` as its argument.
* **Parameters:** None.

### `TurnOff()`
* **Description:** Turns the converter "off" if it is currently on, and invokes the optional `onturnoff` callback (passed externally) with `self.inst` as its argument.
* **Parameters:** None.

### `Activate()`
* **Description:** Invokes the optional `onactivate` callback if defined. No entity reference is passed in this case.
* **Parameters:** None.

## Events & Listeners
No events are listened to or emitted by this component.