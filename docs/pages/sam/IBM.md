# IBM PVU Standard

## Editor

IBM is the editor of this metric.

## Description 

This metric is based on the number and type of processors (and their cores) to calculate a number of licenses required.

## Formula 

∑(P(numberofcores)* P(pvu))  

- P is each processor on which the database CAN run 
- pvu returns the IBM factor according to P

## Further details

You can find further details about this metric on the IBM website [here](https://www.ibm.com/software/passportadvantage/pvu_licensing_for_customers.html)