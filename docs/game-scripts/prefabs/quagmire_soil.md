---
id: quagmire_soil
title: Quagmire Soil
description: Represents a soil tile prefab used in the Quagmire biome that supports the Plant Soil action and integrates with the mouse interaction system.
tags: [quagmire, interaction, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 674400c5
system_scope: environment
---

# Quagmire Soil

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_soil` is a simple environment prefab that visually represents a soil tile in the Quagmire biome. It provides a functional layer for the `PLANTSOIL` action and supports client-side mouse interaction logic via the `playeractionpicker` component. It does not possess persistent gameplay logic beyond animation and action interaction.

## Usage example
This prefab is automatically instantiated by the world generation system and is not typically created directly by modders.

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `soil`

## Properties
No public properties

## Main functions
### `CanMouseThrough(inst)`
* **Description:** Determines if the player’s cursor can pass through this entity (i.e., no high-priority actions like `PLANTSOIL` are active on it). Used to enable mouse interaction with entities behind it.
* **Parameters:** `inst` (Entity) — the entity instance itself.
* **Returns:** Two values:
  - `can_mouse_through` (boolean): `true` if both left- and right-click actions are low-priority or `nil`.
  - `true` (boolean): indicates a valid decision was made (used internally).
* **Error states:** Returns `nil, nil` if the player or `playeractionpicker` is unavailable.

### `DisplayNameFn(inst)`
* **Description:** Provides a localized, context-sensitive display name string for the `PLANTSOIL` action when the player hovers over the entity. Only returns text if a controller is attached.
* **Parameters:** `inst` (Entity) — the entity instance itself.
* **Returns:** `string` — an empty string or a formatted string like `"X Plant Soil"` (where `X` is the action button label).
* **Error states:** Returns an empty string if no controller is attached or localization fails.

## Events & listeners
None identified.

## Additional Notes
- The prefab sets `inst.entity:SetPristine()` to indicate no runtime state modifications are expected on the server.
- On the client, it immediately returns after setting up render-only properties.
- On the server, it triggers a `master_postinit` callback via `event_server_data` for further initialization (not defined in this file).
- The animation bank and build are both `"quagmire_soil"`, with the `"rise"` animation played on spawn. It renders on the `LAYER_BACKGROUND` with sort order `3`.