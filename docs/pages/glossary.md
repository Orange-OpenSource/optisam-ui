# Glossary 

*Click on the top of a column to order alphabetically*

| Word                  | Description                            |
| :------------------- | :------------------------------------ |
| **Aggregate** | An aggregate is a group of several products, covered by the same license (each license can have a different version). When a product is used on different equipments on a same network with different versions, we can create an aggregation with this set of products if a same license covers all this versions.|
| **Application** | Applications are software entities where are installed the products. |
| **Acquired Rights** | Acquired rights represent all licensing rights owned by a scope. Those rights must be able to cover all products owned by this scope. |
| **Counterfeiting** | Non compliance regarding licensing usage. Situation where less products rights than required have been acquired. |
| **Compliance** | Conformity regarding the licensing usage (compliant, non compliant). |
| **Data file** | In OpTISAM, a data file corresponds to a file that we will import in OpTISAM and which is containing a set of data. These data must, to be considered as valid data, be mapped with a data type define in metadatafile. |
| **Group** | Group enables access to one or more scopes. Group in Optisam context is logical grouping of 2 or more scopes. Each user belong to one or more groups. Group provides mechanism to have a user linked with multiple scopes. A user can see the park linked to all the scopes of its groups. |
| **Instance** | An instance is an instance of an application. An application can have multiple instances running. All instances together form the application. Instances can be deployed on the fly. |
| **Editor** | Software editor. |
| **Equipment** | An equipment is a part of the park where products are installed. A physical or virtual machine on which are installed some products. All equipments in OpTISAM are link together thanks to a hierarchy (father/son). |
| **Equipment Types** | Each virtual or physical equipment belongs to a type (or category). The type of an equipment defines its attributes and places in equipment hierarchy. Equipment types are customizable in OpTISAM (with metadata files). For example, some equipment types can be (from father to child) : datacenter, vcenter, cluster, server, partition. |
| **License** | Official permission or permit to do, use, or own something (as well as the document of that permission or permit). A license is granted by a party to another party as an element of an agreement between those parties. |
| **Metadata file** | In OpTISAM, a metadata file corresponds to a file that will import to OpTISAM and that allows to define the structure of an equipment type. |
| **Metric** | A metric is a unit of measurement used to count the number of licenses necessary for a given use for a given product. |
| **Obsolescence** | The risk of obsolescence corresponds, for a metric, to the impact rate on a scope if a product's license expires. |
| **Underusage** | Situation where an entity has bought more licenses than required to be compliant. |
| **Product Usage Right** | Licensing provides options and flexibility, called PUR. PUR are (not exhaustive) : customer’s use rights, rights to use other versions, applicable use rights, disaster recovery rights, permitted periods of use, conditions on use, required used of some product, metric. (Anne-Lucie Cosse, Thesis) |
| **SAM** | Software asset management (SAM) is a business practice that involves managing and optimizing the purchase, deployment, maintenance, utilization, and disposal of software applications within an organization. According to ITIL, SAM is defined as “[…] all of the infrastructure and processes necessary for the effective management, control, and protection of the software assets […] throughout all stages of their lifecycle.” |
| **Scope** | Scopes are used to identify different customers of OpTISAM. It provides a way to isolate data from different customers. Currently isolation is only at application layer, but same can be extended to Database layer if required(sharding/partitioning etc). We will stick to 3 letter codes for scope.<br/>Scope Naming Conventions :<br/>- For countries : O + 2 digit country ISO code eg. OFR, OSP etc<br/>- For Business Units : OCB, TGI<br/>Most the modules of OpTISAM are scope aware and require user to provide scope while creating the types of those modules.  |
| **SKU** | Stands for “Stock Keeping Unit”. SKU is a not normalized code defined by the software editor. It can be found very often in product catalogues/purchase orders during purchasing phase. |
| **SWIDTAG** | Stands for SoftWare IDentification TAG. SWIDtags record unique information about an installed software application, including its name, edition, version, whether it’s part of a bundle and more. SWIDtags support software inventory and asset management initiatives. Software entitlement tags will specify how license consumption measurement can be automated. This provides the next level of support for the automated software asset management process. (Anne-Lucie Cosse, Thesis) |
| **User** | User is anybody who can access/use OpTISAM application. User can be human or api consumers. Each user has a role and a set of groups to which he belongs|
| **User Role** | User can exist with below 3 types of role in the system : Super Admin (has full access on all scopes of all groups), Admin (has full access to scopes of his groups), Normal (has read access to scopes of his groups) |