<link rel="stylesheet" href="../../../../css/enlargeImage.css" />

# Simulation <!-- (-Metrics) -->

The metrics simulation enables you to see the impact of a metric change on the compliance or on the financial aspect.

## Access to the page

Click on "Simulation" :

![select APM](../../../img/exploring/simulation/SimulationAccess.jpg){: .zoom}

You will able to see this page 

![select APM](../../../img/exploring/simulation/createSimulation.jpg){: .zoom}

## Create the simulation

To create the simulation, follow these steps:

![select APM](../../../img/exploring/simulation/createSimulation2.jpg){: .zoom}

1. Select the editor of the product on which you want to create the simulation
2. Chose the products on which you want to create the simulation
3. Edit the unit cost which will be used to simulate the new total cost
4. Click on "simulate" to create the simulation

<!--
Select the editor and the SWIDtag of the product on which you want to create the simulation : 

![select APM](../../../img/exploring/simulation/metricsFirst.jpg){: .zoom}

It will automatically write the metric and the cost that this product is using in the acquired rights.  

### Select the metric

Check the <span style="color:blue">metrics</span> and write the <span style="color:red">unit cost</span> that you want to use to create the simulation : 

![select APM](../../../img/exploring/simulation/metricsSecond.jpg){: .zoom}
-->
## Check the results

Once you have clicked on "Simulate", The results will be displayed on the right

![select APM](../../../img/exploring/simulation/checkResults.jpg){: .zoom}

The results are displayed by sku witch 3 attributes:

- Total computed cost before simulation : The last cost 
- Total computed cost after simulation : The new cost
- Delta : Difference between the last cost and the new one. 

Notice that the color of the frame of each sku depends of the "Delta":

- <span style="color:red">Red : The new total cost is greater than the last one, so "Delta" > 0 </span>

- <span style="color:green">Green : The new total cost is lesser than the last one, so "Delta" < 0 </span>

**You can also check the differents total costs by editor before and after the simulation on the top on the results.** 

<!--
![select APM](../../../img/exploring/simulation/metricsThird.jpg){: .zoom}

The results are displayed on the left by metric with 3 attributes :  
- Licenses : Number of licenses to acquire for the metric  
- Total cost : The total cost of the licenses  
- Status : "Existing" or "Not existing" depending if the metric is used or not  
-->
## Further details

For further details, you can check [here](../../../managing/simulationsManagement) the documentation about "Simulations management".

<script src="../../../../js/zoomImage.js"></script>