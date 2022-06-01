<link rel="stylesheet" href="../../../css/enlargeImage.css" />

<span style="color:red">First, make sure that you are an admin and that you are working on the good scope :</span>

![select APM](../../img/goodScopeu.jpg){: .zoom}

## What is a simulation ?

The simulations in OpTISAM are used to simulate a change in the inventory park or in the licensing of the products.

## Access

You can access to "Simulation management" by clicking here :

![select APM](../../img/simuMana/accessu.jpg){: .zoom}

## Presentation

The presentation table is :

![select APM](../../img/simuMana/pres.jpg){: .zoom}

You can see :  
- Configuration ID : The ID of the simulation's configuration   
- Configuration Name : The name of the simulation's configuration  
- Equipment Type : The equipment type on which the simulation will be done  
- Attributes : The main attribute that will be modified for the simulation  
- Created On : Date of the creation of the simulation's configuration  

## Possibilities

You can do 3 things from here :  
- <span style="color:red">Create a new configuration</span> ([here](#create-a-new-configuration)) : to create a hardware simulation (on an equipment)  
- <span style="color:blue">Edit an exisiting configuration</span> ([here](#edit-an-existing-configuration))  
- <span style="color:green">Delete an exisiting configuration</span> ([here](#delete-an-existing-configuration))  

![select APM](../../img/simuMana/possibilities.jpg){: .zoom}

## Create a new configuration

Click on "Create Configuration" :

![select APM](../../img/simuMana/create1.jpg){: .zoom}

This screen will be shown :  

![select APM](../../img/simuMana/create2.jpg){: .zoom}

You have 3 fields to fill in :  
- Group : Must stay "ROOT"  
- Configuration Name : Choose the name that you want to give to your configuration  
- Equipment Type : Select the equipment type on which you want to create a simulation's configuration  

Once, you've filled in the fields, a new window will be shown :  

![select APM](../../img/simuMana/create3.jpg){: .zoom}

In this window, you will be able to select the attribute on which you want to do a simulation and join a CSV file corresponding to this attribute. 

Let's take an example with the "server_cpu", you will have to create a CSV file with new values corresponding to all the new values of "core_cpu" as below :  

![select APM](../../img/simuMana/create4.jpg){: .zoom}

As you can see, we have 4 different values of the "server_cpu" with different attributes associated to these values.  
So, in the simulation, if you select Intel(R) Xeon-1, it will simulate with :  
- pvu = 50  
- server_coresNumber = 4  
- sag = 0.625  
- server_processorsNumber = 2  
- corefactor_oracle = 1  

You can find a file filled in [here](../../excel/simu.csv)  

Once, the file is created, you have to click on the paper click next to the attribute you want to edit :  

![select APM](../../img/simuMana/create5.jpg){: .zoom}

Then select the CSV file you've just created :  

![select APM](../../img/simuMana/create6.jpg){: .zoom}

You can click on the small trash on the right if you've made a mistake in order to delete the file :  

![select APM](../../img/simuMana/create7.jpg){: .zoom}

Once you've uploaded the right file for the right attribute, just scroll and click on "Apply" in order to create the new simulation's configuration.

![select APM](../../img/simuMana/create8.jpg){: .zoom}

## Edit an exisiting configuration

Click on the small pencil in the line of the simulation's configuration you want to edit : 

![select APM](../../img/simuMana/edit1.jpg){: .zoom}

This screen will be shown :  

![select APM](../../img/simuMana/edit2.jpg){: .zoom}

From here, you can :  
1. Add a new file to modify an attribute in the simulation as explained in [Create a new configuration](#create-a-new-configuration)  
2. Delete a file already added to the simulation's configuration by clicking on the trash  

Once, it's done, you have to click on "Update" to edit the simulation's configuration.

## Delete an exisiting configuration

Click on the small trash in the line of the simulation's configuration you want to delete :  

![select APM](../../img/simuMana/delete1.jpg){: .zoom}

This screen will be shown :  

![select APM](../../img/simuMana/delete2.jpg){: .zoom}

Click on OK in order to delete the simulation's configuration.

<script src="../../../js/zoomImage.js"></script>