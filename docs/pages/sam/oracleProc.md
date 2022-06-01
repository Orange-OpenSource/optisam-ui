# Oracle Processor Standard

## Editor

Oracle is the editor of this metric.

## Description 

The number of required licenses shall be determined bymultiplying the total number of cores of the processor by a core processor licensing factor specified on the Oracle Processor Core Factor Table which can be accessed [here](https://www.oracle.com/corporate/contracts/contract-documents/license-definitions-rules.html#processor).

All cores on all multicore chips for each licensed program are to be aggregated before multiplying by the appropriate core processor licensing factor and all fractions of a number are to be rounded up to the next whole number. 

## Normal counting

### Formula 

∑(INT(P(numberofcores)* P(corefactor)))

Where :  
- P is each processor on which the database CAN run  
- corefactor refers to the Oracle factor according to P

### Further details

You can find further details about this metric on the Oracle website [here](https://www.oracle.com/assets/databaselicensing-070584.pdf) and [here](https://www.oracle.com/assets/partitioning-070609.pdf).

## Soft Partitions

| Server Type | Case | OpTISAM Metric Configuration | Formula | Status |
| :---------- | :--- | :--------------------------- | :------ | :----- |
| VMWare | No isolation or VMWare version > 6.7 | oracle.processor with last equipment = whole park | ∑(on all vcenter)∑(on all clusters of the vcenter)∑(on all servers included in the cluster, if one partition of a server has Oracle installed)(P(numberofcores)* P(corefactor)) | Not yet available, S2 2021 |
| VMWare | VCenter isolated or VMWare version <= 6.7 | oracle.processor with last equipment = vcenter, integer round up on cluster level | For each vcenter ∑(on all clusters of the vcenter)∑(on all servers included in the cluster, if one partition of a server has Oracle installed)(P(numberofcores)* P(corefactor)) | Available |
| VMWare | All cluster on which Oracle is installed are isolated | oracle.processor with last equipment = cluster, integer round up on cluster level | For each cluster ∑(on all servers included in the cluster, if one partition of a server has Oracle installed)(P(numberofcores) * P(corefactor)) | Available |
| VMWare | Some clusters are isolated, some aren't | oracle.processor with last equipment = cluster, integer round up on cluster level | Can be done by deleting VCenter parent of isolated clusters | Available |
| VMWare | Server isolated | Does not exist | Does not exist | / |

## Hard Partitions

For now, the computation is the same as the normal counting :  

∑(INT(P(numberofcores)* P(corefactor)))

Where :  
- P is each processor on which the database CAN run  
- corefactor refers to the Oracle factor according to P

OpTISAM will compute the compliance for the whole server as approximation.