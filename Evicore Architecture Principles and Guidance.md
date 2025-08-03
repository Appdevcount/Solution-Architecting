# Evicore Architecture Principles and Guidance

---

LeanIX Documentation for Evicore

Owned by Christopher Ortiz  
Last updated: Mar 19, 2025

## TOGAF [The Open Group Architecture Framework]

is a globally recognized enterprise architecture standard.  It is a ubiquitous best practice for defining, documenting and communicating an overall business and its technologies. …….

Ultimately, TOGAF via LeanIX provides a strong set of tools to document an analyze the overall Cigan business and architecture.  It includes a wide range of subjects and methods:  Business Capabilities, Processes, Projects, Data Objects, Applications, Goals and more.   

This type of analysis, documentation and repository enables improved communications and shared perspectives and understandings.  TOGAF and LeanIX are often used by Enterprise Architects and Executives to make key decisions on future direction, business changes, technology changes and the consolidation of functions and functionality.  

TOGAF offers a solution by helping businesses to establish clear ROIs, solid lines of communication, and enough shared perspective to tie everything together in successful enterprise transformation initiatives.

---

## Rationale Note from Dave Hausler

### Situation

LeanIX was purchased at the request of Noelle Eder.  The work has been conducted as a collaboration between Eric Reed and DP Koka.  

Our Cigna Enterprise Architects are engaged in established a TOGAF based view of the overall enterprise leveraging LeanIX.  Below is a very brief review of the overall set of topics.  

TOGAF [The Open Group Architecture Framework] is a globally recognized enterprise architecture standard.  It is a ubiquitous best practice for defining, documenting and communicating an overall business and its technologies. 

Ultimately, TOGAF via LeanIX provides a strong set of tools to document an analyze the overall Cigan business and architecture.  It includes a wide range of subjects and methods:  Business Capabilities, Processes, Projects, Data Objects, Applications, Goals and more.   This type of analysis, documentation and repository enables improved communications and shared perspectives and understandings.  TOGAF and LeanIX are often used by Enterprise Architects and Executives to make key decisions on future direction, business changes, technology changes and the consolidation of functions and functionality.  

Building a unified knowledge based and understanding of our overall organization requires a structured and disciplined approach.  Multiple enterprise goals, such as Project Dawn and Drive to 20205 rely on a unified and shared understanding.  LeanIX goals and purpose are at the core of creating a more singular view of our overall enterprise.   Increasingly the information in LeanIX is and will be used to make key strategic decisions.  

### Problem

Today (May 2024), Evicore products and capabilities are poorly and underrepresented in LeanIX.   In addition, much of the overall Cigna organization sees Evicore as a “black box”, as described by Enterprise Architect Ellen Anderson.   This can put Evicore at a strategic disadvantage as decisions are discussed, planned and made. 

### Implication

The risk at hand is that Evicore products and capabilities could be unknown, overlooked or worse shuttered due to a poor understanding of the Evicore business and the value we provide.  In the absence of solid information being provided via LeanIX Leaders and Enterprise Architecture could see our products and capabilities as duplicative or irrelevant.   It is true some duplicative solutions across overall Cigna do exist; however, it is critical for Evicore to provide a description of its differentiation where such exists.    

### Needed Payoff

We need to execute an effort to more fully and more accurately define and describe Evicore Products and Capabilities via the TOGAF structure being used in LeanIX.  We have at our disposal some solid foundations for this work:

- The “TrueNorth” Final Report created released in July 2021 can provide an initial foundation
- The Product and Planning organization is currently engaged in work to define our key Products
- The Evicore Integration project (Project Dawn) has established a strong list of our technical solutions and landscape.  The current list includes approximately 150 technical solutions leveraged across Evicore.  

It is suggested funding from the Evicore Integration project be leveraged to support the work associated to LeanIX and Evicore.  

---

## General Notes

We need to formally model the vertical and horizontal roadmaps in LeanIX in order to:

- Coordinate investment priorities with our business partners before work begins
- Coordinate across the roadmaps from intake through operations
- Keep “score” and determine when we reach transformative thresholds in our business & technology strategy that enable business value delivery

What’s in a roadmap? Some details can be found in Confluence here:

Playbook for creating a roadmap in LeanIX - Chief Architecture Office - Confluence (cigna.com)

By doing this work, we create the opportunity for each roadmap to be dynamic, evolving and visible to other Enterprise Architects, and other organizations across business and technology, in ways that static power point presentations cannot achieve.

Having all roadmaps formally modeled in LeanIX ensures that we know what we’re talking about when we use overloaded concepts (like “Care Management”), as well as achieving consistency with concepts in external systems like Jira, ServiceNow, and Pathfinder, and more.

---

# Architecture Principle

Draft 
What are Architecture principles?

Teams need to act small and think big.  Architecture principles are meant to provide a contextual framework around allowing teams who are innovating to solve for the now while aligning for the future.  While solutions and strategy may change more often, Architecture principles are meant to be strategic and not tactical.

Architecture Principles define the underlying general rules and guidelines for the use to make an informed decision. They reflect a level of consensus among the various elements of the enterprise and form the basis for making future IT decisions.

## Why do we have Architecture principles?

- Promote Enterprise Level Thinking - we operate independently and think small but we act as one organization. we need to know how our solutions work in concert with other solutions to deliver on the organization's mission.
- Ensure High Availability - Systems and Products that are highly available help our business run efficiently and seamlessly interruptions which makes patients and customers happy!
- Contemplate Security - Systems are secure making eviCore as a reliable and trustworthy partner for its clients. Secure systems provide necessary protection to protected health information that patients entrust to eviCore to keep safe.
- Proactive Management via. Alert & Monitoring - External and Internal monitoring of systems allows eviCore teams to see and fix problems before they are felt by clients.
- Scalability - Systems can scale to accommodate the growth of the organization
- Better User Experience - Systems are designed for a pleasant user experience.  Systems and solutions should provide benefit to people.
- Clean Business Data - Systems are designed to maintain the integrity of data at the right level.  Appropriate data controls should be put in place at both transactional and reporting.levels.
- Resource Reuse - Saving time and money by reusing exiting services and proven patterns.
- Efficient Infrastructure Utilization - The infrastructure principles help us think about efficient utilization of infrastructure resources ensuring we are fiscally responsible with how we leverage resources.
- Cloud Management - The cloud is a big part of our future in self service, agility and scale.  We want to promote cloud first thinking so teams are already thinking about the transition before migrating.

## How do we take advantage of Enterprise Architecture Principles?

The architecture principles are a great tool to promote thought during innovation.  If your team is looking to engage a strategic partner, build a new solution, or to purchasing a new product, the Architecture Principles are a great reference to help make sure you've got the right dots to connect.

---

## Architecture principles
- Evolutionary systems
- Scale Horizontally
- Cloud Native
- Convergence over Divergence - Systems and architectures should converge as Enterprise Service wherever there is a same/similar characteristic .Duplicate capability is expensive and proliferates conflicting data
- Small and Simple
- Design Application to be monitored
- Design for Rollback
- Design to be Disabled
- Automation
- Fault Isolation
- Limit Reason for change
- Performance and Responsiveness -We must maintain a continued focus on the impact of changes to the performance of our applications or we risk impacting user experience, our ability to scale cost-effectively, and the stability of our systems.. Degradations in performance are investigated, understood, and either remedied or accepted as appropriate in the business context.
- Secure by Design
- Build or Buy

---

## Guidance:
Separation of Teams' Concerns with Domains and Events

---

## Versioning for API Endpoints

Owned by Ketan Shah  
Last updated: Mar 24, 2021 by James Crawford (Unlicensed)

### Introduction

In all cases, teams should avoid coupling their microservices to other services. However, in some cases, this cannot be easily avoided (APIs). In order to promote stability and quicker delivery, then teams should follow proper approaches to making additive or substantial changes to these constructs.

#### What should require a new version?

A new version should be published whenever any of the following happens:

- An additive change to the contract of an API
- A subtraction of attributes from the contract of an API

#### When should a new version not be used?

- When an API has a substantial behavior change that deviates from the previous behavior.

In this case, a new API should be published.

#### What is the suggested practice for versioning?

APIs

In most cases, teams should prefer to use custom content types to version APIs. This has the noted advantage of not necessitating URLs to change when a team looks to upgrade API versions, and it allows parts of an API to evolve over time.

Custom content types can be added to the accept headers of an API.

```
GET /Request/123 HTTP/1.1
Accept: application/vnd.evicore.request-v2+json
```

Web APIs will need to handle the custom accept header, and employ a strategy for the version as needed. A basic illustration of a custom accept header-driven strategy may be read at this site.

An approach like this grants more freedom of design and additive change to each team. When using other approaches (such as the URI path noted below), it becomes necessary for the entire platform to keep track of which version of API it is on. In some cases, one team adjusting their version will cause other teams to need to redeploy into the correct version path, even without changes being done. This is an unnecessary coupling that the content accepts type helps to solve.

##### Note about URI path versioning

One may see URI path versioning employed when breaking changes occur to an API. These are typically seen in such a way:

```
https://<baseurl>/v1/Request
https://<baseurl>/v2/Request
```

This way works, but it is cumbersome to track, particularly in a platform where APIs do not move at the same rates or in the same way. Changes tend to be more nuanced.

This also adds deployment overhead to keep multiple versions of the API active. Because of the more permanent and challenging nature of this change, it is not suggested to the version in this way

##### Deprecation

In most cases, it may be necessary to maintain two different versions of an API endpoint. There should be a clear communication of a deprecation period (generally, 3-4 sprints). This should be communicated as early as possible to allow teams to plan and update to the newer API.

---

## Event Naming, Versioning, and notifications

Owned by Ketan Shah  
Last updated: Jul 13, 2022 by Phil Jerkins (Unlicensed)

### Introduction

eP has evolved a lot and has seen lots of requirement change, leading to refactoring. In an event-sourced application, that poses a few problems. In order to promote stability and quicker delivery, then teams should follow proper guidance to making additive or substantial changes to events and follow a proper event naming and versioning convention.

#### Purpose

The purpose of this document is to provide guidance to all evicore team members who are producing and consuming events from eP. It has been observed teams are using different naming and versioning convention. For example, the version is postfix in the event name itself i.e. instead of RequestForServiceSubmitted teams are using RequestForServiceSubmittedV2. The intent of this document is to provide guidance on naming and versioning conventions (for example: not using the version in the event name and instead use Version attribute of event envelope) as per the current event/command envelope structure in eP and the current state of evicore.bus library, so that all the consumers of events are aware of changes been made in the events (additive or breaking) and are fully backward compatible (i.e. able to support previous version of events)     

#### Message naming convention

In eP, there are two types of messages which are published to Kafka which can be classified as 

- Commands
- Events

Commands are an instruction, telling a system to "do something" example Submit the request. Deny the authorization etc. Commands can be validated, approved/rejected, processed.

Events on the other hand reflect an immutable fact. Example: RequestSubmitted, Authorization approved. We can't approve/reject events in the past.

##### Naming commands

Commands typically have two parts:

- Verb
- Subject

The verb is usually the imperative mood, present tense. "Submit a Request". The verb is "submit", the mood is "imperative", and the subject, "Request". So the convention to follow can be

`<Verb><Subject>`

##### Naming Events

While commands are an imperative mood, events represent something that happened in the past, so we typically see events represented as a past-tense verb, along with a subject:

- Past-tense verb
- Subject

Similar to the commands, include both the verb and the subject as part of the message name, but reversed:

`<Subject><Verb>`

Note: Command and Event message should not have a version in their name i.e. RequestforservicesubmittedV2 is not a convention we want to follow 

#### Event Versioning

##### What should require a new version?

A new version should be published whenever any of the following happens:

- An additive change of required attributes
- A subtraction of attributes
- An additive change of not required attributes

In short, any change regardless of whether it is backwards compatible or not should result in a new version of an event. This is to follow the versioning approach of AVRO.

##### When should a new name instead of simply a new version be used?

- When there is a substantial change to the meaning or context of the event

##### How to version an event?

Every event should include a version number within the event itself. Event consumers can then use this version number and event name to determine how to handle/process the event. It is recommended an event should follow Sematic Versioning when versioning the event. Two part i.e. 1.1 and Four part 1.1.0.0 is also valid versioning scheme but should be avoided wherever possible.

Below JSON snippet is the example from the current eP production event where the event message has an attribute called “Version”.  The team should utilize this “Version” attribute when it is appropriate to create a new version of an event.

Note: Payload attribute value has been decoded for illustration purpose

```json
{
  "Payload": "{\"Note\":{\"DocumentType\":\"notes\",\"Key\":\"776afe8e-cda2-42de-a546-3adf701505e6\",\"Metadata\":{},\"Creator\":\"epfertilityadvisor undefined\",\"CreatorRole\":\"FertilityAdvisor\",\"Content\":\"t\",\"GeneratingAgent\":\"epfertilityadvisor@evicore.com\",\"GeneratingAgentSource\":\"Add Note\",\"GeneratingAgentContext\":\"FertilityAdvisor\",\"DateCreated\":\"2021-03-16T15:39:22.7038599Z\",\"ReferenceEntities\":[{\"Type\":\"requestForService\",\"Key\":\"dde9a33e-eda8-47b9-80ba-05a7f0f94b83\"}],\"Context\":\"Care coordination note\"}}",
  "Name": "NoteSaved",
  "Version": "1.0.0",
  "SerializationMethod": "JsonSerializationProvider",
  "Sent": "2021-03-16T15:39:22.7038599Z",
  "Key": "b3513257-2cfb-4f24-a7cc-d9a287adaf2e",
  "Metadata": {
    "referenceEntityKeys": {
      "requestForService": "dde9a33e-eda8-47b9-80ba-05a7f0f94b83",
      "notes": "776afe8e-cda2-42de-a546-3adf701505e6"
    },
    "eventType": "GeneralNotes",
    "generatingAgent": "epfertilityadvisor@evicore.com",
    "generatingAgentContext": null,
    "generatingSource": null,
    "generatingAgentRole": "FertilityAdvisor",
    "generatingAgentDisplayName": "epfertilityadvisor undefined",
    "summary": "User epfertilityadvisor undefined created a Note"
  }
}
```

In the above sample event message, there is a payload attribute that actually holds the event schema and if there is an addition of a not required field like “NoteAttachment” to the event payload minor version should be increased.    

```json
{
  "Payload": "{\"Note\":{\"DocumentType\":\"notes\",\"NoteAttachment\": \"\", \"Key\":\"776afe8e-cda2-42de-a546-3adf701505e6\",\"Metadata\":{},\"Creator\":\"epfertilityadvisor undefined\",\"CreatorRole\":\"FertilityAdvisor\",\"Content\":\"t\",\"GeneratingAgent\":\"epfertilityadvisor@evicore.com\",\"GeneratingAgentSource\":\"Add Note\",\"GeneratingAgentContext\":\"FertilityAdvisor\",\"DateCreated\":\"2021-03-16T15:39:22.7038599Z\",\"ReferenceEntities\":[{\"Type\":\"requestForService\",\"Key\":\"dde9a33e-eda8-47b9-80ba-05a7f0f94b83\"}],\"Context\":\"Care coordination note\"}}",
  "Name": "NoteSaved",
  "Version": "1.1.0",
  "SerializationMethod": "JsonSerializationProvider",
  "Sent": "2021-03-16T15:39:22.7038599Z",
  "Key": "b3513257-2cfb-4f24-a7cc-d9a287adaf2e",
  "Metadata": {
    "referenceEntityKeys": {
      "requestForService": "dde9a33e-eda8-47b9-80ba-05a7f0f94b83",
      "notes": "776afe8e-cda2-42de-a546-3adf701505e6"
    },
    "eventType": "GeneralNotes",
    "generatingAgent": "epfertilityadvisor@evicore.com",
    "generatingAgentContext": null,
    "generatingSource": null,
    "generatingAgentRole": "FertilityAdvisor",
    "generatingAgentDisplayName": "epfertilityadvisor undefined",
    "summary": "User epfertilityadvisor undefined created a Note"
  }
}
```

If there is a breaking change like adding a required attribute(s) a Major version should be changed. For example in the sample event message below a required attribute called “Description” is added 

```json
{
  "Payload": "{\"Note\":{\"DocumentType\":\"notes\",\"Description\": \"Test\", \"Key\":\"776afe8e-cda2-42de-a546-3adf701505e6\",\"Metadata\":{},\"Creator\":\"epfertilityadvisor undefined\",\"CreatorRole\":\"FertilityAdvisor\",\"Content\":\"t\",\"GeneratingAgent\":\"epfertilityadvisor@evicore.com\",\"GeneratingAgentSource\":\"Add Note\",\"GeneratingAgentContext\":\"FertilityAdvisor\",\"DateCreated\":\"2021-03-16T15:39:22.7038599Z\",\"ReferenceEntities\":[{\"Type\":\"requestForService\",\"Key\":\"dde9a33e-eda8-47b9-80ba-05a7f0f94b83\"}],\"Context\":\"Care coordination note\"}}",
  "Name": "NoteSaved",
  "Version": "2.0.0",
  "SerializationMethod": "JsonSerializationProvider",
  "Sent": "2021-03-16T15:39:22.7038599Z",
  "Key": "b3513257-2cfb-4f24-a7cc-d9a287adaf2e",
  "Metadata": {
    "referenceEntityKeys": {
      "requestForService": "dde9a33e-eda8-47b9-80ba-05a7f0f94b83",
      "notes": "776afe8e-cda2-42de-a546-3adf701505e6"
    },
    "eventType": "GeneralNotes",
    "generatingAgent": "epfertilityadvisor@evicore.com",
    "generatingAgentContext": null,
    "generatingSource": null,
    "generatingAgentRole": "FertilityAdvisor",
    "generatingAgentDisplayName": "epfertilityadvisor undefined",
    "summary": "User epfertilityadvisor undefined created a Note"
  }
}
```

##### Forward compatible

Generally, adding additional not required properties to an event (which is a minor version change) should not cause a versioning conflict with the event consumer. Meaning if we have a contract that defines the shape of our event, as long as we don’t break that contract, the existing event consumers should be able to process our new event and ignore the additional properties. 

If there is a change in the contract, then a new Major version of that event needs to be created and consumers should require specific changes to consume a new major version.

**NOTES**

New eviCore.Bus version 12.0.0 currently support forward compatibility

It’s is recommended to upgrade to latest eviCore.Bus version 12.0.0 to support new event versioning strategy 

##### Example of Forward Compatible event strategy

Consumer 1.0.0 Producer 1.0.0 = Consumed  
Consumer 1.0.0 Producer 1.1.0 = Consumed!  
Consumer 1.1.0 Producer 1.0.0 = Skipped  
Consumer 1.0.0 Producer 2.0.0 = Skipped  
Consumer 1.0.0.0 Producer 1.1.0.0 = Consumed  
Consumer "Cat" Producer "Dog" = Skipped  
Consumer "Frog" Producer "Frog" = Consumed! (Bus does not dictate a versioning scheme, but only supports exact matches for non Semantic Versions)  
Consumer 1.0.0.0 Producer 1.1.0 = Consumed  
Consumer 1.0.0. Producer 1.1.0.0 = Consumed  
Consumer 1.0.0. Producer 1.1.0.alpha.beta.gamma = Consumed

Essentially, only the first two parts of the version are significant. As long as they are integers, Major == Major, and Consumer Minor <= Producer Minor, the message is Accepted.

Consumer subscribing to Service Message wrapper should honor the message version

Few of the microservices in eP subscribe to service message wrapper and there is a high probability for services processing the same event with the different version which can cause a side effect. It is required that every microservice should honor the event name and version in their implementation to have a predictable outcome.  

##### How to publish an event?

If an event isn’t forward compatible i.e. there is a contract change(Major version change), you might want to publish both v1 and v2 of the event that occurred. By this approach (double publish) it is made sure existing consumers continue using the old version of an event and giving them the opportunity to upgrade their consumer to listen to new events. 

With double publish strategy, there should be a policy set that will allow deprecating the old version of an event once all consumers have upgraded to handle new version of an event

Note: Anyone using eviCore.Bus library need to make sure you update the version detail in your command/event message    

```csharp
[Obsolete]
[DataContract]
public class SleepRequestForServiceSubmitted : EventMessage
{
    /// <summary>
    /// The Request For Service that was saved. It is passed as a JObject to include extra properties but should conform to the <see cref="RequestForServiceDTO" />.
    /// </summary>
    [DataMember]
    public SleepRequestForServiceSubmittedEventModel Request { get; set; }

    [IgnoreDataMember]
    [JsonIgnore]
    public override ServiceMessageTypeDefinition ServiceMessageTypeDefinition { get; } =
        new ServiceMessageTypeDefinition("SleepRequestForServiceSubmitted",
        "1.0.1",
        new JsonSerializationProvider());
}
```

and if there is a breaking change create a new class with the version and update the version in the service message definition as shown below  

```csharp
[DataContract]
public class SleepRequestForServiceSubmittedV2 : EventMessage
{
    /// <summary>
    /// The Request For Service that was saved. It is passed as a JObject to include extra properties but should conform to the <see cref="RequestForServiceDTO" />.
    /// </summary>
    [DataMember]
    public SleepRequestForServiceSubmittedEventModelV2 Request { get; set; }

    [IgnoreDataMember]
    [JsonIgnore]
    public override ServiceMessageTypeDefinition ServiceMessageTypeDefinition { get; } =
        new ServiceMessageTypeDefinition("SleepRequestForServiceSubmitted",
        "2.0.0",
        new JsonSerializationProvider());
}
```

##### How do we notify Event Changes?

- Email to ePJSONChanges@evicore.com and all scrum team with details about the changes and new schema prior to deploying in PROD
- Update the details of changes in a user story or feature
- Updates DevOps wiki or create  a Confluence Page (till we get Kafka schema registry) to maintain event schema registry 

---

## Data Persistence Choices

Owned by Pridhviraj Nandarapu (Unlicensed)  
Last updated: Jul 15, 2021

### Objective 

Choosing the right data store/database 

#### Paradox of choice

Developers have never had as many good database options as they have today. Relational databases have a long and proven track record of successful use in a wide range of applications. These databases have been so successful they virtually eliminated the widespread use of earlier database models, such as file-based, hierarchical, and network databases. It was not until the advent of commercial web systems, such as search engines, that relational databases strained to meet developers’ demands.

However, it wasn’t long before things began to change, and the application and data center requirements of key internet players like Amazon, Facebook, and Google began to outgrow the RDBMS for certain types of applications. The need for more flexible data models that supported agile development methodologies and the requirements to consume large amounts of fast-incoming data from millions of cloud application users around the globe—while maintaining high levels of performance and uptime— necessitated the introduction of a new data management platform.

If you are a developer starting a data management project today, you will have to decide which type of database management system to use. Your major options are

- Relational databases, such as PostgreSQL, MySQL, Oracle, and Microsoft SQL Server
- Key-value databases, such as Redis, Riak, Cosmos, Hbase, and Oracle BerkeleyDB
- Document databases, such as MongoDB, CouchDB, elastic Search, Cosmos and CouchBase
- Column family databases, such as Cassandra, Cosmos, and HBase
- Graph databases, such as Neo4j, Cosmos, and Titan

#### Choosing between SQL & NoSQL Datastore 

While there are hundreds of different “Not Only SQL” (NoSQL) databases offered today, each with its own particular features and benefits, what you should know is that a NoSQL database generally differs from a traditional RDBMS in the following ways:

- Data model – While an RDBMS primarily handles structured data in a rigid data model, a NoSQL database typically provides a more flexible and fluid data model and can be more adept at serving the agile development methodologies used for modern cloud applications. Note that one misconception about NoSQL data models is that they do not handle structured data, which is untrue. Lastly, as mentioned above, some NoSQL engines are designed to support multiple data models against a single backend.
- Architecture – Whereas an RDBMS is normally architected in a centralized, scale-up or sharding, master-slave fashion, NoSQL systems operate in a distributed, scale-out, masterless manner (i.e., there is no “master” node, all nodes are equal). However, some NoSQL databases like MongoDB, DynamoDB, Azure Cosmos DB, and HBase are master-slave or multi-master by design.
- Data distribution model – Because of their master-slave architectures, an RDBMS distributes data to slave machines that can act as read-only copies of the data and/ or failover for the primary machine. By contrast, a NoSQL database distributes data evenly to all nodes making up a database cluster and enables both reads and writes on all machines. Furthermore, the replication model of an RDBMS (including master-to-master) is not designed well for wide-scale, multi-geographical replication and synchronization of data between different locales and cloud availability zones, whereas NoSQL data stores replication was built from the ground up to handle such things. 
- Availability model – An RDBMS typically uses a failover design where a master fails over to a slave machine, whereas a NoSQL system is masterless and provides redundancy of both data and function on each node so that it offers continuous availability with no downtime versus simple high availability in the way an RDBMS does. 
- Scaling and performance model – An RDBMS typically scales vertically by adding extra CPU, RAM, etc., to a centralized machine, whereas a NoSQL database scales horizontally by adding extra nodes that deliver increased scale and performance in a linear manner

#### Deciding Between an RDBMS and NoSQL 

How do you decide when to use an RDBMS and when to use a specific type of NoSQL database?

In short, an RDBMS is great for centralized applications that need ACID transactions and whose data fits well within the relational data model. 

The following chart provides a general comparison between the characteristics that point toward an RDBMS versus those that signal a NoSQL database may be a better choice

| RDBMS | NO Sql |
|-------|--------|
| Master-slave architecture | Masterless architecture |
| Relational, structured data | Multi-model (tabular, key/value, document, graph) |
| Moderate velocity data | High velocity data (time-series data from devices, sensors, etc.) |
| Always strongly consistent | Tunable consistency  (eventual to strong) |
| Complex/nested transactions | Lightweight transactions |
| Protect uptime via failover/log shipping | Protect uptime via failover/log shipping |
| High availability | Continuous availability |
| Scale up for more users/data | Scale out for more users/data |
| Maintain data volumes with purge | High data volumes; retain forever; horizontal scalability without boundaries |
| Transaction workloads | Mixed workloads of transactions and analytics |

#### Choosing a NoSql Datastore 

In relational database design, the structure and relations of entities drives design—not so in NoSQL database design. Of course, you will model entities and relations, but performance is more important than preserving the relational model.

The relational model emerged for pragmatic reasons, that is, data anomalies and difficulty reusing existing databases for new applications. NoSQL databases also emerged for pragmatic reasons, specifically, the inability to scale to meet growing demands for high volumes of read and write operations.

In exchange for improved read and write performance, you may lose other features of relational databases, such as immediate consistency and ACID transactions (although this is not always the case).

Throughout this article, queries have driven the design of data models. This is the case because queries describe how data will be used. Queries are also a good starting point for understanding how well various NoSQL databases will meet your needs. You will also need to understand other factors, such as

- The volume of reads and writes
- Tolerance for inconsistent data in replicas
- The nature of relations between entities and how that affects query patterns
- Availability and disaster recovery requirements
- The need for flexibility in data models
- Latency requirements

The following sections provide some sample use cases and some criteria for matching different NoSQL database models to different requirements

##### Criteria for Selecting Key-Value Databases

Key-value databases are well suited to applications that have frequent small reads and writes along with simple data models. The values stored in key-value databases may be simple scalar values, such as integers or Booleans, but they may be structured data types, such as lists and JSON structures.

Key-value databases generally have simple query facilities that allow you to look up a value by its key. Some key-value databases support search features that provide for somewhat more flexibility. Developers can use tricks, such as enumerated keys, to implement range queries, but these databases usually lack the query capabilities of the document, column family, and graph databases.

Key-value databases are used in a wide range of applications, such as the following:

- Caching data from relational databases to improve performance
- Tracking transient attributes in a web application, such as a shopping cart
- Storing configuration and user data information for mobile applications
- Storing large objects, such as images and audio files

##### Criteria for Selecting Document Databases

Document databases are designed for flexibility. If an application requires the ability to store varying attributes along with large amounts of data, then document databases are a good option. For example, to represent products in a relational database, a modeler may use a table for common attributes and additional tables for each subtype of product to store attributes used only in the subtype of product. Document databases can handle this situation easily.

Document databases provide for embedded documents, which are useful for denormalizing. Instead of storing data in different tables, data that is frequently queried together is stored together in the same document.

Document databases improve on the query capabilities of key-value databases with indexing and the ability to filter documents based on attributes in the document.

Document databases are probably the most popular of the NoSQL databases because of their flexibility, performance, and ease of use.

These databases are well suited to a number of use cases, including

- Back-end support for websites with high volumes of reads and writes
- Managing data types with variable attributes, such as products
- Tracking variable types of metadata
- Applications that use JSON data structures
- Applications benefiting from denormalization by embedding structures within structures

Document databases are also available from cloud services such as Microsoft Azure Document and Cloudant’s database.

##### Criteria for Selecting Column Family Databases

Column family databases are designed for large volumes of data, read and write performance, and high availability. Google introduced BigTable to address the needs of its services. Facebook developed Cassandra to back its Inbox Search service.

These database management systems run on clusters of multiple servers. If your data is small enough to run with a single server, then a column family database is probably more than you need—consider a document or key-value database instead.

Column family databases are well suited for use with

- Applications that require the ability to always write to the database
- Applications that are geographically distributed over multiple data centers
- Applications that can tolerate some short-term inconsistency in replicas
- Applications with dynamic fields
- Applications with the potential for truly large volumes of data, such as hundreds of terabytes

##### Criteria for Selecting Graph Databases

Problem domains that lend themselves to representations as networks of connected entities are well suited for graph databases. One way to assess the usefulness of a graph database is to determine if instances of entities have relations to other instances of entities.

For example, two orders in an e-commerce application probably have no connection to each other. They might be ordered by the same customer, but that is a shared attribute, not a connection.

Similarly, a game player’s configuration and game state have little to do with other game players’ configurations. Entities like these are readily modeled with key-value, document, or relational databases.

Now consider examples mentioned in the discussion of graph databases, such as highways connecting cities, proteins interacting with other proteins, and employees working with other employees. In all of these cases, there is some type of connection, link, or direct relationship between two instances of entities.

These are the types of problem domains that are well suited to graph databases. Other examples of these types of problem domains include

- Network and IT infrastructure management
- Identity and access management
- Business process management
- Recommending products and services
- Social networking

From these examples, it is clear that when there is a need to model explicit relations between entities and rapidly traverse paths between entities, then graph databases are a good database option.

Large-scale graph processing, such as with large social networks, may actually use column family databases for storage and retrieval. Graph operations are built on top of the database management system. The Titan graph database and analysis platform takes this approach.

Key-value, document, column family, and graph databases meet different types of needs. Unlike relational databases that essentially displaced their predecessors, these NoSQL databases will continue to coexist with each other and relational databases because there is a growing need for different types of applications with varying requirements and competing demands.

#### Using NoSQL and Relational Databases Together

NoSQL and relational databases are complementary. 

Relational databases offer many features that protect the integrity of data and reduce the risk of data anomalies. Relational databases incur operational overhead providing these features.

In some use cases, performance is more important than ensuring immediate consistency or supporting ACID transactions. In these cases, NoSQL databases may be the better solution. Choosing a database is the process of choosing the right tool for the job. The more varied your set of jobs, the more varied your toolkit.

Modern data management infrastructure is responsible for a wider range of applications and data types than ever before. When E. F. Codd developed the relational model in the 1970s, businesses and governments were the primary users of databases.

Today, IT professionals are working with more of the same types of business data that existed in the 1970s as well as new types, such as social media and detailed customer demographics and preference data.

Mobile devices generate large volumes of data about users’ behaviors and location. The instrumentation of cars, appliances, and other devices, referred to as the Internet of Things (IoT), is another potential data source. With so many changes in the scope and size of data and applications, it is no surprise that additional database management techniques are needed.

Relational databases will continue to support transaction processing systems and business intelligence applications. Decades of work with transaction processing systems and data warehouses have led to best practices and design principles that continue to meet the needs of businesses, governments, and other organizations.

At the same time, these organizations are adapting to technologies that did not exist when the relational model was first formulated. Customer-facing web applications, mobile services, and Big Data analytics might work well with relational databases, but in some cases, they do not.

The current technology landscape requires a variety of database technologies. Just as there is no best programming language, there is no best database management system. There are database systems better suited to some problems than others, and the job of developers and designers is to find the best database for the requirements at hand.

#### Summary

Application developers have choices about which programming language they use, which development environments they work in, and which web frameworks they deploy. They also have choices when it comes to database management systems. The different types of database management systems were all developed to solve real-world problems that could not be solved as well with other types of databases.

One of the jobs of developers and designers is to choose an appropriate database system for their applications. You do this by understanding your problem domain and your user requirements. Often you will have options. You could use a key-value store or a document database in some cases. Other times, a graph database might be the best fit. Do not be surprised if you find yourself working with key-value databases one day and graph databases the next. The choice of the database should be driven by your needs.

---

## Benefits of Event Driven Architecture

Owned by Paul Hefer (Unlicensed)  
Last updated: Oct 15, 2021

- Event-based architectures are asynchronous without blocking. This allows resources to move freely to the next task once their unit of work is complete, without worrying about what happened before or will happen next.
- Services don’t need knowledge of, or dependencies on other services. When using events, services operate independently, without knowledge of other services, including their implementation details and transport protocol.
- Services under an event model can be updated, tested, and deployed independently and more easily.
- Since the services are decoupled under an event-driven architecture, and as services typically perform only one task, tracking down bottlenecks to a specific service, and scaling that service becomes easy.
- An event-driven architecture with a queue can recover lost work by “replaying” events from the past. This can be valuable to prevent data loss when a consumer needs to recover. This pattern achieves high performance through its asynchronous capabilities, the ability to perform decoupled, parallel asynchronous operations outweighs the cost of queuing and dequeuing messages.
- Scalability is naturally achieved in this pattern through highly independent and decoupled event processors. Each event processor can be scaled separately, allowing for fine-grained scalability.
- Real-time situational awareness means that business decisions, whether manual or automated, can be made using all of the available data that reflects the current state of the systems.

From Event-driven architecture benefits & models | Apiumhub

---

## API Design guidelines and recommended practices

Owned by Kamal Gurnani  
Jan 12, 2022

The purpose of this document is to provide some important design aspects and recommended practices for implementing APIs

### API Design Considerations

#### Coupling

API based systems typically has multiple APIs and underlying subsystems involved in the solution. Low coupling will allow you to change or upgrade the components independently, without this impacting any other components in the system.

By focusing on building the components as atomic, self-contained parts, you can get optimal flexibility and improve your reusability

#### Chattiness

Chattiness refers to the number of calls the API consumer is required to make to get the necessary information. Chattiness must be avoided in your API design. Otherwise, it will lead to very poor end user experience. Multiple API calls consume both network bandwidth and increase the overall transaction time for any scenario.

API operations must be designed in a way that they provide the information or data that's been requested in one go. Transaction modeling techniques that use sequence diagrams can be adopted to identify whether there is chattiness in the workflow.

Chattiness is also considered to be a performance anti-pattern. Refer to this article to find out more: 

Chatty I/O antipattern - Azure Architecture Center 

#### Client Complexity

Please refer to BFF pattern section below

#### Cognitive Complexity

The more code or logic that you have in your API, the more difficult it will be to unit test all the paths, so any upgrades or changes are risky, In general, cognitive complexity must be low for a good API design. If there are multiple process steps, you should remodel your business workflow to avoid incurring high cognitive complexity in your components.

SonarQube has been integrated with CI/CD pipelines for all the major projects across Core Engineering applications. SonarQube can measure the Cognitive Complexity of your code

#### Caching

Please refer to  ‘Improving API Performance’ under API Management Strategy and Best Practices

#### Response Caching

Please refer to  ‘Improving API Performance’ under API Management Strategy and Best Practices

#### Discoverability

Discoverability refers to the ease with which information about the list of APIs, their corresponding operations, and usage techniques can be accessed. The adoption of the API platform is largely dependent on how easily developers can complete their integrations. Hence, you must provide as much information as possible in the definition files to avoid any ambiguity in understanding.

#### Versioning

APIs typically undergo multiple revisions as part of the change management cycles. Hence, it is imperative that you adopt a proper versioning strategy to distinctly identify what changed in which version. Furthermore, the changes must be backward compatible to ensure that any existing client integrations are not impacted.

for more details, please refer to link below

Versioning for API Endpoints 

#### Security

Please refer to ‘Secure by Design’ section under API Implementation - Recommended Practices

### API Implementation  - Recommended Practices

- Sequence Diagrams - It is recommended to use sequence diagram as part of your low-level design to depict request-response flows. It aids in capturing all the subsystems that will be involved as part of complete operation
- Embrace Clean Architecture (Hexagonal Architecture) 
    - Separation of Core application logic from external dependencies
    - Database connections, user interface, message handlers all connected through set of adapters/ports to the core application.
- Secure by Design
    - Implement Authorization - 
        - Role based access and protect methods by Okta 
        - protect against CSRF attacks
    - Input Validation - Url Validation, Validate incoming contents types, validate response types
    - Output encoding - Security headers, JSON /XML encoding
    - Cryptography- 
        - Data in transit: Mandate the use of TLS,
        - Data in storage: When handling sensitive data, ensure that it is encrypted using modern and secure cryptography techniques.
        - Message integrity: Make use of OAuth tokens in the request header to ensure the integrity of the transmission
    - Avoid keeping secrets in code and utilize secure credential management for your deployment environment.
- Size and Granularity
    - xx
- User-digestible response codes and Messages
    - xx
- Backends for Front-ends
    - xxx
- Use cloud design patterns
    - Azure Architecture Center has published a collection of cloud design patterns that development teams must plan to incorporate in their designs.
    - You can review the full catalog of cloud design patterns here: 
    - Cloud Design Patterns - Azure Architecture Center .
    - These patterns are mostly structural and behavioral patterns that address common challenges for cloud-based applications.

---

## API Management Strategy and Best Practices

For API Management and security considerations, please refer to link below

APIs and API Management

- Policies for internal and external consumptions of APIs
    - Azure APIM sits between your API clients and your backend APIs, and it will add a few useful features to your backend APIs. APIM consists of three main components, Azure portal, Azure API Gateway, and Developer portal. APIM policies will be configured in the Azure portal, and they execute inside Azure API Gateway
    - Policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of Statements that are executed sequentially on the request or response of an API. Popular Statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box
    - Please refer to link below on policies and defining policies.
    - Azure API Management policy reference 

### Improving API Performance

APIs and operations in API Management can be configured with response caching. Response caching can significantly reduce latency for API callers and backend load for API providers

Please refer to link below on APIM caching policies

Azure API Management policy reference 

Custom caching in Azure API Management 

### APIM Logging and Monitoring

With Azure Monitor, you can visualize, query, route, archive, and take actions on the metrics or logs coming from your Azure API Management service

Tutorial - Monitor APIs in Azure API Management 

### Integrating APIM with Azure Application Gateway

You can configure Azure API Management in a virtual network in internal mode, which makes it accessible only within the virtual network. Azure Application Gateway is a platform as a service (PaaS) that acts as a Layer-7 load balancer. It acts as a reverse-proxy service and provides among its offerings Azure Web Application Firewall (WAF).

By combining API Management provisioned in an internal virtual network with the Application Gateway front end, you can:

- Use the same API Management resource for consumption by both internal consumers and external consumers.
- Use a single API Management resource and have a subset of APIs defined in API Management available for external consumers.
- Provide a turnkey way to switch access to API Management from the public internet on and off
- for more details please refer to link below

Integrating APIM with AKS

---

## AKS Best Practices - A quick check-list

- Refrain from injecting sensitive information into images and use Secrets instead
    - always use Secrets—either Kubernetes Secrets or Azure Key Vaults—for sensitive information
- Implement Pod identity
    - Don’t have fixed credentials stored in Pod images. Rather you can use Pod identities, which use the Azure Identity solution for all the access to the desired (Azure) resources. These credentials could be any credentials used to talk with other Azure services, like Azure SQL or Azure Storage
- Use a Kubernetes Namespace.
    - Namespaces are the logical partitions of your resources. They not only enforce the separation of resources but also limit the permissible user scope
    - Avoid using the default namespace.
- Specify the correct security context for a pod
    - This is an important factor in deciding your Pod access control settings. If the context is not set, the Pod gets the default one, which exposes it with more rights.

---

## Enforcement of compliance on the build image

Owned by Ketan Shah  
Last updated: Aug 25, 2022

---

## Data Integration Approaches

### Introduction

With business evolving, many organizations are looking to increase their digital footprint with a digital-first initiative. With the increase in B2B and B2C, there is a need to think about how different organizations and enterprises can integrate and share the data. 

Also, currently eviCore has been receiving a lot of requests from Insurance Carrier to use a real-time API for Member Lookup, Member eligibility, Provider Lookup, Provider eligibility, and others. As the adoption of API increases in the new digital world, an understanding is required to adopt any data integration style in a given use case context.

This document is focused on providing some insights and discussing the pros and cons of each of the data integration styles that can be used when communicating outside of organizational boundaries, within the enterprise, or within and outside application domain boundaries.

As an enterprise currently there are three scenarios that need to be explored on how to integrate and share the data

- Integrate data across the organization. Example share data between eviCore and insurance carrier aka Health Plan
- Integrate data within the enterprise. Example share data between eviCore and Evernorth
- Integrate data across the application/application domain. Example share data between ImageOne and eviCore Platform or eP WebIntake Domain and WNS 

The purpose of this document is to highlight some fundamental challenges for data integration, introduce generic different approaches for data integration  and provide details on some important aspects to be considered which will help users make an informed decision when choosing any type of communication style for data integration

### Audience

This document is created to be consumed by anyone who needs to make an informed decision on what style of communication needs to be used to solve their use case.

#### Fundamental challenges for data integration for any type of solution(s)

- Networks are unreliable: Integration solutions have to transport data from one computer to another across networks. Compared to a process running on a single computer, distributed computing has to be prepared to deal with a much larger set of possible problems. Oftentimes, two systems to be integrated are separated by continents, and data between them has to travel through phone lines, LAN segments, routers, switches, public networks, and satellite links. Each of these steps can cause delays or interruptions.
- Networks are slow. Sending data across a network is multiple orders of magnitude slower than making a local method call. Designing a widely distributed solution the same way you would approach a single application could have disastrous performance implications
- Any two applications are different: Integration solutions need to transmit information between systems that use different programming languages, operating platforms, and data formats. An integration solution needs to be able to interface with all these different technologies.

#### Different approaches for data integration

##### File Transfer 

File transfer was and is the common way of exchanging data within and outside of an organization’s boundary. In File transfer, one application writes a file to a given location and a given format on which two parties have agreed so that another application can consume or read that file. For this type of data integration, there are common protocols used and some of them are

Though this is the most common type of data integration practice there are a few advantages and disadvantages when using it

Pros

Cons

##### Shared Database

Multiple applications share the same database schema, located in a single physical database. Because there is no duplicate data storage, no data has to be transferred from one application to the other. For this type of data integration, there are common protocols/styles/query language used and some of them are

Though this is not the most common type of data integration practice there are some use cases where it can be used. There are a few advantages and disadvantages when using it

Pros

Cons

---

...existing content continues...
