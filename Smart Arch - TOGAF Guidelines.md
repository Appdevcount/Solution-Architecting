# Smart Arch - TOGAF Guidelines

## TOGAF Guidelines Summary

The document above represents TOGAF (The Open Group Architecture Framework) guidelines organized as a comprehensive checklist. This reference guide covers key architecture domains:

### Key Areas Covered

- Hardware and Operating System considerations
- Processors, Servers, and Clients architecture
- Client-side implementation details
- Application Server specifications
- Data Server requirements
- Commercial Off-The-Shelf (COTS) software evaluation
- System Engineering and Methodology approaches

### How to Use This Checklist

This checklist should be used during architecture planning and review sessions to ensure comprehensive coverage of all critical aspects of enterprise architecture. Each section contains specific questions that should be addressed by the architecture team to validate design decisions and identify potential gaps.

### Implementation Recommendations

- Review each section thoroughly during architecture development
- Document answers to relevant questions based on your specific project context
- Use as validation tool during architecture review sessions
- Revisit periodically throughout the project lifecycle to ensure continued alignment

| Reference - TOGAF Guidelines |  |
| --- | --- |
| 1. Hardware and Operating System Checklist |  |
| 1 | What is the project's lifecycle approach? |
| 2 | At what stage is the project in its lifecycle? |
| 3 | What key issues have been identified or analyzed that the project believes will drive evaluations of hardware and operating systems for networks, servers, and end-user devices? |
| 4 | What system capabilities will involve high-volume and/or high-frequency data transfers? |
| 5 | How does the system design impact or involve end-user devices? |
| 6 | What is the quantity and distribution (regional and global) of usage, data storage, and processing? |
| 7 | What applications are affinitized with your project by similarities in data, application services, etc.? To what degree is data affinitized with your project? |
| 8 | What hardware and operating system choices have been made before functional design of key elements of the system? |
| 9 | If hardware and operating system decisions were made outside of the project's control: |
| 10 | What awareness does the project have of the rationale for those decisions? |
| 11 | How can the project influence those decisions as system design takes shape? |
| 12 | If some non-standards have been chosen: |
| 13 | What are the essential business and technical requirements for not using corporate standards? |
| 14 | Is this supported by a business case? |
| 15 | Have the assumptions in the business case been subject to scrutiny? |
| 16 | What is your process for evaluating full lifecycle costs of hardware and operating systems? |
| 17 | How has corporate financial management been engaged in evaluation of lifecycle costs? |
| 18 | Have you performed a financial analysis of the supplier? |
| 19 | Have you made commitments to any supplier? |
| 20 | Do you believe your requirements can be met by only one supplier? |
| 2. Software Services and Middleware Checklist |  |
| 27 | Describe how the system or system components rely on common messaging infrastructure versus a unique point-to-point communication structure. |
| 3. Applications Checklists |  |
| 3.1 Infrastructure (Enterprise Productivity) Applications |  |
| 1 | Is there need for capabilities that are not provided through the enterprise's standard infrastructure application products? For example: |
| 2 | Collaboration |
| 3 | Application sharing |
| 4 | Video conferencing |
| 5 | Calendaring |
| 6 | Email |
| 7 | Workflow management |
| 8 | Publishing/word processing applications |
| 9 | HTML |
| 10 | SGML and XML |
| 11 | Portable document format |
| 12 | Document processing (proprietary format) |
| 13 | Desktop publishing |
| 14 | Spreadsheet applications |
| 15 | Presentation applications |
| 16 | Business presentations |
| 17 | Image |
| 18 | Animation |
| 19 | Video |
| 20 | Sound |
| 21 | CBT |
| 22 | Web browsers |
| 23 | Data management applications |
| 24 | Database interface |
| 25 | Document management |
| 26 | Product data management |
| 27 | Data warehouses/mart |
| 28 | Program management applications |
| 29 | Project management |
| 30 | Program visibility |
| 31 | Describe the business requirements for enterprise infrastructure application capabilities that are not met by the standard products. |
| 3.2 Business Applications |  |
| 1 | Are any of the capabilities required provided by standard products supporting one or more line-of-business applications? For example: |
| 2 | Business acquisition applications |
| 3 | Sales and marketing |
| 4 | Engineering applications |
| 5 | Computer-aided design |
| 6 | Computer-aided engineering |
| 7 | Mathematical and statistics analysis |
| 8 | Supplier management applications |
| 9 | Supply chain management |
| 10 | Customer relationship management |
| 11 | Manufacturing applications |
| 12 | Enterprise Resource Planning (ERP) applications |
| 13 | Manufacturing execution systems |
| 14 | Manufacturing quality |
| 15 | Manufacturing process engineering |
| 16 | Machine and adaptive control |
| 17 | Customer support applications |
| 18 | Airline logistics support |
| 19 | Maintenance engineering |
| 20 | Finance applications |
| 21 | People applications |
| 22 | Facilities applications |
| 23 | Information systems applications |
| 24 | Systems engineering |
| 25 | Software engineering |
| 26 | Web developer tools |
| 27 | Integrated development environments |
| 28 | Lifecycle categories |
| 29 | Functional categories |
| 30 | Specialty categories |
| 31 | Computer-aided manufacturing |
| 32 | e-Business enablement |
| 33 | Business process engineering |
| 34 | Statistical quality control |
| 35 | Describe the process requirements for business application capabilities that are not met by the standard products. |
| 3.3 Application Integration Approach |  |
| 1 | What integration points (business process/activity, application, data, computing environment) are targeted by this architecture? |
| 2 | What application integration techniques will be applied (common business objects [ORBs], standard data definitions [STEP, XML, etc.], common user interface presentation/desktop)? |
| 4. Information Management Checklists |  |
| 4.1 Data Values |  |
| 1 | What are the processes that standardize the management and use of the data? |
| 2 | What business process supports the entry and validation of the data? Use of the data? |
| 3 | What business actions correspond to the creation and modification of the data? |
| 4 | What business actions correspond to the deletion of the data and is it considered part of a business record? |
| 5 | What are the data quality requirements required by the business user? |
| 6 | What processes are in place to support data referential integrity and/or normalization? |
| 4.2 Data Definition |  |
| 1 | What are the data model, data definitions, structure, and hosting options of purchased applications (COTS)? |
| 2 | What are the rules for defining and maintaining the data requirements and designs for all components of the information system? |
| 3 | What shareable repository is used to capture the model content and the supporting information for data? |
| 4 | What is the physical data model definition (derived from logical data models) used to design the database? |
| 5 | What software development and data management tools have been selected? |
| 6 | What data owners have been identified to be responsible for common data definitions, eliminating unplanned redundancy, providing consistently reliable, timely, and accurate information, and protecting data from misuse and destruction? |
| 4.3 Security/Protection |  |
| 1 | What are the data entity and attribute access rules which protect the data from unintentional and unauthorized alterations, disclosure, and distribution? |
| 2 | What are the data protection mechanisms to protect data from unauthorized external access? |
| 3 | What are the data protection mechanisms to control access to data from external sources that temporarily have internal residence within the enterprise? |
| 4.4 Hosting, Data Types, and Sharing |  |
| 1 | What is the discipline for managing sole-authority data as one logical source with defined updating rules for physical data residing on different platforms? |
| 2 | What is the discipline for managing replicated data, which is derived from operational sole-authority data? |
| 3 | What tier data server has been identified for the storage of high or medium-critical operational data? |
| 4 | What tier data server has been identified for the storage of type C operational data? |
| 5 | What tier data server has been identified for the storage of decision support data contained in a data warehouse? |
| 6 | What Database Management Systems (DBMSs) have been implemented? |
| 4.5 Common Services |  |
| 1 | What are the standardized distributed data management services (e.g., validation, consistency checks, data edits, encryption, and transaction management) and where do they reside? |
| 4.6 Access Method |  |
| 1 | What are the data access requirements for standard file, message, and data management? |
| 2 | What are the access requirements for decision support data? |
| 3 | What are the data storage and the application logic locations? |
| 4 | What query language is being used? |
| 5. Security Checklist |  |
| 1 | Security Awareness: Have you ensured that the corporate security policies and guidelines to which you are designing are the latest versions? Have you read them? Are you aware of all relevant computing security compliance and risk acceptance processes? (Interviewer should list all relevant policies and guidelines.) |
| 2 | Identification/Authentication: Diagram the process flow of how a user is identified to the application and how the application authenticates that the user is who they claim to be. Provide supporting documentation to the diagram explaining the flow from the user interface to the application/database server(s) and back to the user. Are you compliant with corporate policies on accounts, passwords, etc.? |
| 3 | Authorization: Provide a process flow from beginning to end showing how a user requests access to the application, indicating the associated security controls and separation of duties. This should include how the request is approved by the appropriate data owner, how the user is placed into the appropriate access-level classification profile, how the user ID, password, and access is created and provided to the user. Also include how the user is informed of their responsibilities associated with using the application, given a copy of the access agreement, how to change password, who to call for help, etc. |
| 4 | Access Controls: Document how the user IDs, passwords, and access profiles are added, changed, removed, and documented. The documentation should include who is responsible for these processes. |
| 5 | Sensitive Information Protection: Provide documentation that identifies sensitive data requiring additional protection. Identify the data owners responsible for this data and the process to be used to protect storage, transmission, printing, and distribution of this data. Include how the password file/field is protected. How will users be prevented from viewing someone else's sensitive information? Are there agreements with outside parties (partners, suppliers, contractors, etc.) concerning the safeguarding of information? If so, what are the obligations? |
| 6 | Audit Trails and Audit Logs: Identify and document group accounts required by the users or application support, including operating system group accounts. Identify and document individual accounts and/or roles that have superuser type privileges, what these privileges are, who has access to these accounts, how access to these accounts is controlled, tracked, and logged, and how password change and distribution are handled, including operating system accounts. Also identify audit logs, who can read the audit logs, who can modify the audit logs, who can delete the audit logs, and how the audit logs are protected and stored. Is the user ID obscured in the audit trails? |
| 7 | External Access Considerations: Will the application be used internally only? If not, are you compliant with corporate external access requirements? |
| 6. System Management Checklist |  |
| 1 | What is the frequency of software changes that must be distributed? |
| 2 | What tools are used for software distribution? |
| 3 | Are multiple software and/or data versions allowed in production? |
| 4 | What is the user data backup frequency and expected restore time? |
| 5 | How are user accounts created and managed? |
| 6 | What is the system license management strategy? |
| 7 | What general system administration tools are required? |
| 8 | What specific application administration tools are required? |
| 9 | What specific service administration tools are required? |
| 10 | How are service calls received and dispatched? |
| 11 | Describe how the system is uninstalled. |
| 12 | Describe the process or tools available for checking that the system is properly installed. |
| 13 | Describe tools or instrumentation that are available that monitor the health and performance of the system. |
| 14 | Describe the tools or process in place that can be used to determine where the system has been installed. |
| 15 | Describe what form of audit logs are in place to capture system history, particularly after a mishap. |
| 16 | Describe the capabilities of the system to dispatch its own error messages to service personnel. |
| 7. System Engineering/Overall Architecture Checklists |  |
| 7.1 General |  |
| 1 | What other applications and/or systems require integration with yours? |
| 2 | Describe the integration level and strategy with each. |
| 3 | How geographically distributed is the user base? |
| 4 | What is the strategic importance of this system to other user communities inside or outside the enterprise? |
| 5 | What computing resources are needed to provide system service to users inside the enterprise? Outside the enterprise and using enterprise computing assets? Outside the enterprise and using their own assets? |
| 6 | How can users outside the native delivery environment access your applications and data? |
| 7 | What is the life expectancy of this application? |
| 8 | Describe the design that accommodates changes in the user base, stored data, and delivery system technology. |
| 9 | What is the size of the user base and their expected performance level? |
| 10 | What performance and stress test techniques do you use? |
| 11 | What is the overall organization of the software and data components? |
| 12 | What is the overall service and system configuration? |
| 13 | How are software and data configured and mapped to the service and system configuration? |
| 14 | What proprietary technology (hardware and software) is needed for this system? |
| 15 | Describe how each and every version of the software can be reproduced and re-deployed over time. |
| 16 | Describe the current user base and how that base is expected to change over the next three to five years. |
| 17 | Describe the current geographic distribution of the user base and how that base is expected to change over the next three to five years. |
| 18 | Describe how many current or future users need to use the application in a mobile capacity or who need to work off-line. |
| 19 | Describe what the application generally does, the major components of the application, and the major data flows. |
| 20 | Describe the instrumentation included in the application that allows for the health and performance of the application to be monitored. |
| 21 | Describe the business justification for the system. |
| 22 | Describe the rationale for picking the system development language over other options in terms of initial development cost versus long-term maintenance cost. |
| 23 | Describe the systems analysis process that was used to come up with the system architecture and product selection phase of the system architecture. |
| 24 | Who besides the original customer might have a use for or benefit from using this system? |
| 25 | What percentage of the users use the system in browse mode versus update mode? |
| 26 | What is the typical length of requests that are transactional? |
| 27 | Do you need guaranteed data delivery or update, or does the system tolerate failure? |
| 28 | What are the up-time requirements of the system? |
| 29 | Describe where the system architecture adheres or does not adhere to standards. |
| 30 | Describe the project planning and analysis approach used on the project. |
| 7.2 Processors/Servers/Clients |  |
| 1 | Describe the client/server Application Architecture. |
| 2 | Annotate the pictorial to illustrate where application functionality is executed. |
| 7.3 Client |  |
| 1 | Are functions other than presentation performed on the user device? |
| 2 | Describe the data and process help facility being provided. |
| 3 | Describe the screen-to-screen navigation technique. |
| 4 | Describe how the user navigates between this and other applications. |
| 5 | How is this and other applications launched from the user device? |
| 6 | Are there any inter-application data and process sharing capabilities? If so, describe what is being shared and by what technique/technology. |
| 7 | Describe data volumes being transferred to the client. |
| 8 | What are the additional requirements for local data storage to support the application? |
| 9 | What are the additional requirements for local software storage/memory to support the application? |
| 10 | Are there any known hardware/software conflicts or capacity limitations caused by other application requirements or situations which would affect the application users? |
| 11 | Describe how the look-and-feel of your presentation layer compares to the look-and-feel of the other existing applications. |
| 12 | Describe to what extent the client needs to support asynchronous and/or synchronous communication. |
| 13 | Describe how the presentation layer of the system is separated from other computational or data transfer layers of the system. |
| 7.4 Application Server |  |
| 1 | Can/do the presentation layer and application layers run on separate processors? |
| 2 | Can/do the application layer and data access layer run on separate processors? |
| 3 | Can this application be placed on an application server independent of all other applications? If not, explain the dependencies. |
| 4 | Can additional parallel application servers be easily added? If so, what is the load balancing mechanism? |
| 5 | Has the resource demand generated by the application been measured and what is the value? If so, has the capacity of the planned server been confirmed at the application and aggregate levels? |
| 7.5 Data Server |  |
| 1 | Are there other applications which must share the data server? If so, identify them and describe the data and data access requirements. |
| 2 | Has the resource demand generated by the application been measured and what is the value? If so, has the capacity of the planned server been confirmed at the application and aggregate levels? |
| 7.6 COTS (where applicable) |  |
| 1 | Is the vendor substantial and stable? |
| 2 | Will the enterprise receive source code upon demise of the vendor? |
| 3 | Is this software configured for the enterprise's usage? |
| 4 | Is there any peculiar A&D data or processes that would impede the use of this software? |
| 5 | Is this software currently available? |
| 6 | Has it been used/demonstrated for volume/availability/service-level requirements similar to those of the enterprise? |
| 7 | Describe the past financial and market share history of the vendor. |
| 7.7 System Engineering/Methods & Tools Checklist |  |
| 1 | Do metrics exist for the current way of doing business? |
| 2 | Has the system owner created evaluation criteria that will be used to guide the project? Describe how the evaluation criteria will be used. |
| 3 | Has research of existing architectures been done to leverage existing work? Describe the method used to discover and understand. Will the architectures be integrated? If so, explain the method that will be used. |
| 4 | Describe the methods that will be used on the project: |
| 5 | For defining business strategies |
| 6 | For defining areas in need of improvement |
| 7 | For defining baseline and target business processes |
| 8 | For defining transition processes |
| 9 | For managing the project |
| 10 | For team communication |
| 11 | For knowledge management, change management, and configuration management |
| 12 | For software development |
| 13 | For referencing standards and statements of direction |
| 14 | For quality assurance of deliverables |
| 15 | For design reviews and deliverable acceptance |
| 16 | For capturing metrics |
| 17 | Are the methods documented and distributed to each team member? |
| 18 | To what extent are team members familiar with these methods? |
| 19 | What processes are in place to ensure compliance with the methods? |
| 20 | Describe the infrastructure that is in place to support the use of the methods through the end of the project and anticipated releases. |
| 21 | How is consultation and trouble-shooting provided? |
| 22 | How is training co-ordinated? |
| 23 | How are changes and enhancements incorporated and cascaded? |
| 24 | How are lessons learned captured and communicated? |
| 25 | What tools are being used on the project? (Specify versions and platforms). To what extent are team members familiar with these tools? |
| 26 | Describe the infrastructure that is in place to support the use of the tools through the end of the project and anticipated releases? |
| 27 | How is consultation and trouble-shooting provided? |
| 28 | How is training co-ordinated? |
| 29 | How are changes and enhancements incorporated and cascaded? |
| 30 | How are lessons learned captured and communicated? |
| 31 | Describe how the project will promote the re-use of its deliverables and deliverable content. |
| 32 | Will the architecture designs "live" after the project has been implemented? Describe the method that will be used to incorporate changes back into the architecture designs. |
| 33 | Were the current processes defined? |
| 34 | Were issues documented, rated, and associated to current processes? If not, how do you know you are fixing something that is broken? |
| 35 | Were existing/planned process improvement activities identified and associated to current processes? If not, how do you know this activity is not in conflict with or redundant to other Statements of Work? |
| 36 | Do you have current metrics? Do you have forecasted metrics? If not, how do you know you are improving something? |
| 37 | What processes will you put in place to gather, evaluate, and report metrics? |
| 38 | What impacts will the new design have on existing business processes, organizations, and information systems? Have they been documented and shared with the owners? |

##