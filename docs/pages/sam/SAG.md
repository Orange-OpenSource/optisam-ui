# SAG

## Editor

Software AG is the editor of this metric.

## Description 

This metric is based on the number and type of processors (and their cores) to calculate a number of licenses required.

## Formula description

The number of required licenses shall be determined by counting the maximum between amount of licenses in production environment AND amount of licenses in any other environment type.

## Formula 

Take the MAX between these 2 :  
- The amount of licenses in production environment 
- The amount of licenses of any other environment type 

With :  
Amount of licenses in an environment = ∑(P(numberofcores) * P(coreclass))  

Where :  
- P is each virtual processor on which the product runs   
- coreclass returns the SAG factor according to P

## Further details

You can find further details about this metric on the SAG website [here](https://www.softwareag.com/corporate/images/Processor_Core_Performance_Table_tcm389-164459.pdf) and [here](https://www.softwareag.com/corporate/images/UVU_Performance_Table_tcm389-164458.pdf)