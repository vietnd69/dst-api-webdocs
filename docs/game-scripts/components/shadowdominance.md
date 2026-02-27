---
id: shadowdominance
title: Shadowdominance
description: Manages the 'shadowdominance' tag on an entity when equipped, ensuring the tag is added upon equip and removed when unequipped or the entity no longer holds any shadowdominance items.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3dddb4d3
---

# Shadowdominance

## Overview
This component enforces the presence or absence of the `shadowdominance` tag on an entity based on its equipped items. It integrates with the `equippable` and `inventoryitem` components to dynamically add the tag when the item is equipped (and the owner lacks a shadow submissiveness override) and remove it when unequipped or removed—while also checking for other equipped shadowdominance items before removal.

## Dependencies & Tags
**Depends on components:**
- `equippable`
- `inventoryitem`

**Tag management:**
- Adds `shadowdominance` tag on initialization (via constructor).
- Adds/removes `shadowdominance` tag from the *owner* entity during equip/unequip/remove lifecycle events.

**Interacts with:**
- Owner's `_shadowdsubmissive_task` (internal reference to shadow submissiveness state).
- Owner's `inventory.equipslots` to detect other shadowdominance-equipped items.

## Properties
No public instance properties are defined. The only stored reference is `self.inst`, which holds the entity instance the component is attached to.

## Main Functions

### `ShadowDominance:OnRemoveFromEntity()`
* **Description:** Cleans up the component when removed from its entity. Ensures the `shadowdominance` tag is removed from `inst`, all event listeners are deregistered, and a final cleanup step is performed to check and potentially remove the tag from the owner if still equipped at removal time.
* **Parameters:** None (instance method).

## Events & Listeners
- **Listens for:**
  - `"equipped"` → triggers `OnEquipped`
  - `"unequipped"` → triggers `OnUnequipped`
  - `"onremove"` → triggers `OnRemove`
- **Pushes/Triggers events:**
  - None (does not push events itself).