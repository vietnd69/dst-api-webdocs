---
id: summoningitem
title: Summoningitem
description: A minimal placeholder component that stores a reference to its host entity and provides no additional functionality.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 1fac26b9
---

# Summoningitem

## Overview
This is a trivial component that serves as a structural placeholder in the Entity Component System. It initializes with a reference to the host entity (`inst`) and provides no state, logic, event handling, or behavioral functionality beyond basic instantiation.

## Dependencies & Tags
None identified.

## Properties
No public properties are clearly identified from the source. The component only assigns `self.inst`, which is not a public property by conventional API design.

## Main Functions
No public functional methods are defined beyond the constructor. The class contains only the constructor `_ctor` (implemented as `function(self, inst)`) which initializes `self.inst`.

## Events & Listeners
None.