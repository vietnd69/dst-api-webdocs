---
id: wobyrack
title: Wobyrack
description: WobyRack is a specialized drying rack component that initializes with an associated woby_rack_container entity and inherits behavior from the base DryingRack component.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 7ddb19b5
---

# Wobyrack

## Overview
WobyRack is a component that extends `DryingRack` to provide a custom drying rack implementation tied to the "Woby" theme. It automatically spawns and attaches a `woby_rack_container` entity as its storage container, then delegates core drying rack functionality (e.g., item drying logic, slots, drying timers) to the parent `DryingRack` class via its constructor.

## Dependencies & Tags
- Inherits from `DryingRack` component (via `Class(DryingRack, ...)`).
- Spawns and retrieves the `container` component from a `woby_rack_container` prefab.
- Does not explicitly add or remove any tags on the host entity in the provided code.

## Properties
No public properties are explicitly defined or initialized in `WobyRack`'s own `_ctor`. All relevant state is managed through inheritance from `DryingRack` and its container. The constructor depends on `DryingRack._ctor`, which (based on standard DST patterns) typically initializes properties like `slots`, `dryrate`, `maxdryingtime`, and `items` — but these are defined in the parent class, not here.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| *None explicitly defined* | — | — | This component does not define any new public properties; it relies entirely on the inherited `DryingRack` behavior and its container.

## Main Functions
### `WobyRack._ctor(inst)`
* **Description:** Constructor for the WobyRack component. It spawns the `woby_rack_container` prefab, retrieves its `container` component, sets the container's entity parent to the rack's entity (ensuring correct grouping and coordinate inheritance), and initializes the parent `DryingRack` with the rack instance and container.
* **Parameters:** `inst` — The entity instance this component is attached to (typically a spawned Woby Rack actor).

### `WobyRack:_dbg_print(...)`
* **Description:** A no-op debugging print function (currently commented out) that would log messages prefixed with "WobyRack:" if uncommented. Used for internal development debugging.
* **Parameters:** `...` — Variadic arguments passed to `print`.

## Events & Listeners
None identified in this component’s source code.