<link rel="stylesheet" href="../../../css/enlargeImage.css" />

# Metrics management

<span style="color:red">First, make sure that you are an admin and that you are working on the good scope :</span>

![select APM](../../img/goodScope.jpg){: .zoom}

## What is a metric ?

A metric is a unit of measurement used to count the number of licenses necessary for a given use for a given product.

In OpTISAM, we have two famillies of metrics : metrics for on premise products and metrics for Saas products.



The table below show you metrics in each familly:

| On Premise                      | Saas                                 |
| :---------------------- | :------------------------------------ |
|attribute.counter.standard|saas.concurrent.standard|
|attribute.sum.standard|saas.nominative.standard|
|equipment.attribute.standard||
|ibm.pvu.standard||
|instance.number.standard||
|oracle.nup.standard||
|oracle.processor.standard||
|sag.processor.standard||
|static.standard||
|user.sum.standard||
|microsoft.sql.enterprise||
|windows.server.datacenter||

## Access

You can access to "Metrics management" by clicking here :

![select APM](../../img/metricsMana/access.jpg){: .zoom}

## Possibilities

You can do 3 things from there :  
- <span style="color:red">Add a new metric</span> ([here](#add-a-new-metric))  
- <span style="color:blue">See the details of an existing metric</span> ([here](#see-the-details-of-an-existing-metric))  
- <span style="color:green">Delete an existing metric</span>([here](#delete-an-existing-metric))  
- <span style="color:orange">Edit and existing metric</span>([here](#Edit-an-existing-metric))  

![select APM](../../img/metricsMana/possibilities.jpg){: .zoom}

## Add a new metric

You have to click on Add Metric :

![select APM](../../img/metricsMana/first.jpg){: .zoom}

This window will be displayed :

![select APM](../../img/metricsMana/addNew.jpg){: .zoom}

You can see these different fields :  
- "Type Name" : Write the name of your choice for your new metric <span style="color:red">(**It must be the same name as in your acquired rights**)</span>    
- "Metric Type" : Choose the type of your new metric  

When you choose the "Metric Type", the window changes depending on which "Metric Type" has been chosen. For example, if we choose "sag.processor.standard" : 

![select APM](../../img/metricsMana/addNew2.jpg){: .zoom}

The field on the top right is completed with the formula of the metric and I have new fields to fill in according to the metric that I chose.
Here is an example with the fields to complete for the "sag.processor.standard" metric :  
- Reference Equipment : One of the equipment type  
- Core : The attribute of the equipment that references the number of cores  
- Corefactor : The attribute of the equipment that references the "corefactor"  

Once you have completed all the fields, you have to click on "Create" to create your new metric !

<span style="color:red">Notice that, if a metric type already exists, you can create another one of the same type with a different name.</span>

## See the details of an existing metric 

By clicking anywhere on the line of a metric in the list, the details of the metric will be displayed like this :

![select APM](../../img/metricsMana/details.jpg){: .zoom}

You can see on this screen :  
- Metric Name : The name of the metric  
- Metric Type : The type of the metric  
- Metric Description : The formula used to calculate the metric  
- Other attributes : All of the other attributes are changing depending on the metric type, they are used to obtain the values of the formula (e.g : "Core" represents "Core(perCPU) nb" in the formula, "CPU" represents "CPU nb" in the formula). All of these attributes are equipment attributes

## Delete an existing metric

You have to click on the little trash icon next to the metric that you want to delete as displayed below.

![select APM](../../img/metricsMana/delete.png){: .zoom}

After clicking on the trash icon, the frame below will be displayed. If you are sure to delete the metric click on "OK" 

![select APM](../../img/metricsMana/delete2.jpg){: .zoom}

<script src="../../../js/zoomImage.js"></script>

## Edit an existing metric

You have to click on the little pencil icon next to the metric that you want to edit as displayed below.

![select APM](../../img/metricsMana/edit.png){: .zoom}

After clicking on the pencil icon, the frame below will be displayed. 

![select APM](../../img/metricsMana/edit2.png){: .zoom}

You will be allowed to edit all parameters except the metric name and type.

Once the changes done, click on update to save the news parameters.

<br/>

### ***Translate NUP into Processor metric***

During the creation or updatation, it is possible to translate NUP to processor metric.

To do that, after fill all the field required to create the metric, check the box named "Transform to prossor" as displayed below. The NUP metric will be translate to processor metric.

![select APM](../../img/metricsMana/translateNUP.jpg){: .zoom}

1. Check the box 
2. Chose your oracle.processor.standard metric name. Here "oracle.processor"

Once the box checked and the metric name chosed, OpTISAM will translate  the NUP as 1 licence NUP = 50 lincenses processor. 

<span style="color:red"> Notice that, once the NUP translated to processor, it will be consider like processor licences during the compliance computation </span>

### ***Allocate a metric to an equipment***

It's possible to allocate a metric to a product and an equipment. 

Notice that the metric is applied to all parent equipments till the upper equipment in the hierarchy given as last equipment of the metric and if the equipment is part of a vcenter, all equipments under the same vcenter will have the metric for the same product, and when the metric is modified, it impacts all the equipments under the vcenter. 

Only metrics with types oracle.nup.standard and oracle.processor.standard can be allocated. 

To allocate a metric to a product and an equipment, go first to equipment.

![select APM](../../img/metricsMana/allocate.jpg){: .zoom}

This page will be displayed:

![select APM](../../img/metricsMana/allocate2.jpg){: .zoom}

You will have now to chose on which equipment you desire to allocate the metric by its ID and click on it.

![select APM](../../img/metricsMana/allocate3.jpg){: .zoom}

Then go to product:

![select APM](../../img/metricsMana/allocate4.jpg){: .zoom}

Once on product page, you will have to chose the product on which do the allocation by clicking on the pencil icone. 

![select APM](../../img/metricsMana/allocate5.jpg){: .zoom}

This page will be displayed:

![select APM](../../img/metricsMana/allocate6.jpg){: .zoom}

You will have to fill the two fields.

1. Equipment user: The number of user of the equipment
2. Allocated metric: The type of metric (oracle.nup.standard or oracle.processor.standard)

Once the two fields fill, click on update. Now a metric is allocated to a specific product and equipment. 