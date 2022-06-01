# Attribute Sum Standard

## Editor

This calculation type can be used for RedHat CEPH licence.

## Description 

This metric divides the value of an attribute of an equipment type (e.g. : the number of cores of a server) by a reference value that you can choose when you create the metric, then it rounds this value up to the next largest integer.

## Formula 

Ceil(Sum (on all equipments of the chosen Equipment type) of the attribute values)/Reference value (present in the metric)