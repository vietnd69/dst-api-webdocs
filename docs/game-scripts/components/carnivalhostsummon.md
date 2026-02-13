---
id: carnivalhostsummon
title: Carnivalhostsummon
description: Manages an entity's eligibility to be summoned by the Carnival Host by adding or removing a specific tag.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Carnivalhostsummon

## Overview
This component marks an entity as being summonable by the Carnival Host. Its primary function is to add the `carnivalhostsummon` tag upon initialization, with a method to dynamically add or remove this tag later.

## Dependencies & Tags
**Tags**
* `carnivalhostsummon`: Added to the entity to mark it as a valid target for being summoned.

## Properties
No public properties were clearly identified from the source.

## Main Functions
### `SetCanSummon(cansummon)`
* **Description:** Enables or disables the entity's ability to be summoned by the Carnival Host by adding or removing the `carnivalhostsummon` tag.
* **Parameters:**
    * `cansummon` (boolean): If `true`, the `carnivalhostsummon` tag is added. If `false`, it is removed.