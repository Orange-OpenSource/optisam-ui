<link rel="stylesheet" href="../../../css/enlargeImage.css" />

# Scope management

<span style="color:red">First, make sure that you are a super admin</span>

**Most of the users will only have one scope to work on.**

## What is a scope ?

Scopes are used to identify different customers of OpTISAM. It provides a way to isolate data from different customers. Currently isolation is only at application layer, but same can be extended to Database layer if required(sharding/partitioning etc). We will stick to 3 letter codes for scope.  
Scope Naming Conventions :  
- For countries : O + 2 digit country ISO code eg. OFR, OSP etc  
- For Business Units : OCB, TGI  

OpTISAM is based on scopes and require user to provide scope while creating the types of those modules.  
Each customer entity of OpTISAM will have its scope.

## Access

You can access to "Scope Management" by clicking here :

![select APM](../../img/scopeMana/accessu.jpg){: .zoom}

## Presentation

The presentation table is : 

![select APM](../../img/scopeMana/presentationu.jpg){: .zoom}

You can see :  
- Scope code : The code of the scope. You will see it in the selection tab of the scope (top left)  
- Scope name : The name of the scope  
- Created by : The mail adress of the creator of the scope  
- Created on : The date of the creation of the scope  
- Groups : The number of groups inside of the scope  

## Possibilities

You can do 3 things from there :  
- <span style="color:red">Create a new scope</span> ([here](#create-a-new-scope))  
- <span style="color:blue">Check the groups of an existing scope</span> ([here](#check-the-groups-of-an-existing-scope))  
- <span style="color:green">Delete an existing scope</span> ([here](#delete-an-existing-scope))  

![select APM](../../img/scopeMana/possibilitiesu.jpg){: .zoom}

## Create a new scope

Click on "Create scope" : 

![select APM](../../img/scopeMana/create1u.jpg){: .zoom}

This screen will be shown : 

![select APM](../../img/scopeMana/create2u.jpg){: .zoom}

You just have to fill in these 2 fields and choose the kind of scope the you want:  
- Scope ID : The ID of the scope you want to create  
- Scope Name : The name of the scope you want to create  
- Check Generic Template : if you are gonna upload your inventory with an excel file. 
- Check Specific Template : if you are not using excel files for the inventory. 

Once, you have filled in these 2 fields and choose the kind of scope, you have to click on "Create" to create the new scope !

## Check the groups of an existing scope

Place your mouse on the number in the column "Groups" of the scope you want to check :

![select APM](../../img/scopeMana/checkGrps1.jpg){: .zoom}

You will see this small list : 

![select APM](../../img/scopeMana/checkGrps2.jpg){: .zoom}

This list is the list of groups in the scope.

## Delete an existing scope

Click on the small trash icon on the line of the scope that you want to delete :  

![select APM](../../img/scopeMana/delete1.jpg){: .zoom}

You will see this screen : 

![select APM](../../img/scopeMana/delete2.jpg){: .zoom}

You have to click on "OK" if you want to delete the scope or on "Cancel" if you don't want to.  

<script src="../../../js/zoomImage.js"></script>