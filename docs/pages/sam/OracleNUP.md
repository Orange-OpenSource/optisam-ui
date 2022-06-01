# Oracle NUP Standard

## Editor

Oracle is the editor of this metric.

## Description 

This metric can be used in all environments. It is defined as an individual authorized by you to use the programs which are installed on a single server or multiple servers, regardless of whether the individual is actively using the programs at any given time. A non human operated device will be counted as a named user plus in addition to all individuals authorized to use the programs, if such devices can access the programs. If multiplexing hardware or software (e.g. : a TP monitor or a web server product) is used, this number must be measured at the multiplexing front end.  Automated batching of data from computer to computer is permitted. You are responsible for ensuring that the named user plus per processor minimums are maintained for the programs.  

## Formula 

MAX between A and B with :

- A = [∑(P(numberofcores)* P(corefactor))] * minimum number of NUP (default: 25)
- B = total number of current users with access to the Oracle product

### Modifiable parameter

Minimum number of NUP per processor

## Further details

You can find further details about this metric on the Oracle website [here](https://www.oracle.com/assets/databaselicensing-070584.pdf)