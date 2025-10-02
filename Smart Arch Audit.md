# Smart Arch Audit

| SmartArch MU Review Summary |  |  |  |  |
| --- | --- | --- | --- | --- |
| Project Name: |  |  | Review Date: |  |
| Name of Reviewer(s): |  |  | Name of Reviewee/ Project Lead: |  |
| Overall Compliance %: |  |  | Overall Status: |  |
| SmartArch MU Review Guidelines |  |  |  |  |
| 1.  All sections are mandatory. 2. Scoring Guidelines: 3 = Satisfactory adherence, 2 = Partial adherence, 1 = Knowledge but no adherence, 0 = No knowledge and no adherence, NA = Not applicable3. A team has to score 90 % to get MU certified.  4.  Once certified, the certificate is valid for a period of 6 months & it is the responsibility of the project to schedule another SmartArch review, if applicable. 5. Workflow: - As per the review date requested for, the quality team will schedule architecture review for the project and also identify and allocate two auditors to conduct the review- The schedule of SmartArch Reviews will be published to the auditor & project team by Quality team ( similar to the other Smart audits). - Project Lead will provide overview to SmartArch reviewers on the scheduled date & time. - The identified SmartArch Reviewers to review the project based on published review criteria and publish the draft report with observations and suggestions. - The project team to analyse the observations (some of them may need client approval prior to implementation.)-  SmartArch MU Reviewer will upload the checklist & report in QMS and close the review findings after final discussion. - Project team to provide the comments for observations and share them with the reviewers in QMS - Internal audit module. - If some observations are agreed to be implemented in future, then it is the responsibility of the DL to initiate the SmartArch Review for them after they are implemented.  -  SmartArch Review status (pending/completed/ overdue) would appear on the QMS - AnP window of the respective project in the Comfort Table. |  |  |  |  |
| SmartArch MU Review Criteria |  |  |  |  |
| Sr No. | Review Checkpoint | Score | Review Finding | Remarks / References |
| Architecture : 4+1 Architecture, Requirement Analysis & 3rd Party tools |  |  |  |  |
| 1 | System Design document containing the logical view, process view, development view, physical view or use case view diagrams. |  |  |  |
| 2 | UML Diagrams for the requirements (applicable if 4+1 architecture is not available). |  |  |  |
| 3 | Dependencies on any other system. |  |  |  |
| 4 | Any third party application that would be used or other applications and/or systems that require integration with yours. |  |  |  |
| 5 | Hardware and Software details and Technology Stack. |  |  |  |
| Requirement:  Requirements, Dependencies on other teams and general |  |  |  |  |
| 6 | Uncovering problems and conflicts in requirements. |  |  |  |
| 7 | What all cross cutting concerns are being considered. |  |  |  |
| 8 | Any healthcare related workflows implemented in the applications & related controls. |  |  |  |
| 9 | Any medical device integrations required. |  |  |  |
| 10 | Need for Caching, Concurrency, Instrumentation, etc. |  |  |  |
| Design Patterns & Anti-Patterns:  Important Design Patterns, ESB patterns, Anti-patterns |  |  |  |  |
| 11 | Important Design Patterns and Anit-Patterns being used. |  |  |  |
| 12 | Any tool used to detect the need for Anti-Patterns. |  |  |  |
| Software Architecture (NFR) : Quality Attributes – Scalability, Availability, Accessibility, Resilience |  |  |  |  |
| 13 | All NFR's that are considered in the Architecture. |  |  |  |
| 14 | Any impact in the system performance or architecture due to consideration of any NFR attributes. |  |  |  |
| Design for Performance : Architecture and Design guidelines, Application Performance |  |  |  |  |
| 15 | What type of performance testing are you doing? (Performance,  Load, Stress)? Any tools used for the same. Usage of CIDs (CitiusTech Instrumentation Dashboards) planned for. |  |  |  |
| 16 | Parameters that need to be measured for performance identified- 1. Users2. Volume3. Response time4. Throughput5. Physical6. Resource consumption: CPU, Memory, Disk I/O |  |  |  |
| Design for Security : System Security,  Threat Model |  |  |  |  |
| 17 | Identification/Authentication: Diagrammatic representation of the process flow of how a user is identified to the application and how the application authenticates that the user is who they claim to be. Provide supporting documentation to the diagram explaining the flow from the user interface to the application/database server(s) and back to the user. Compliance with corporate policies on accounts, passwords, etc. |  |  |  |
| 18 | Authorization: Provide a process flow from beginning to end showing how a user requests access to the application, indicating the associated security controls and separation of duties. This should include how the request is approved by the appropriate data owner, how the user is placed into the appropriate access-level classification profile, how the user ID, password, and access is created and provided to the user. Also include how the user is informed of their responsibilities associated with using the application, given a copy of the access agreement, how to change password, who to call for help, etc. |  |  |  |
| 19 | Access Controls: Document how the user IDs, passwords, and access profiles are added, changed, removed, and documented. The documentation should include who is responsible for these processes. |  |  |  |
| 20 | Sensitive Information Protection: Provide documentation that identifies sensitive data requiring additional protection. Identify the data owners responsible for this data and the process to be used to protect storage, transmission, printing, and distribution of this data. Identify the techniques like encryption, etc. that will be used for the same. Include how the password file/field is protected. How will users be prevented from viewing someone else's sensitive information? Are there agreements with outside parties (partners, suppliers, contractors, etc.) concerning the safeguarding of information? If so, what are the obligations? |  |  |  |
| 21 | Audit Trails and Audit Logs: Identify and document group accounts required by the users or application support, including operating system group accounts. Identify and document individual accounts and/or roles that have superuser type privileges, what these privileges are, who has access to these accounts, how access to these accounts is controlled, tracked, and logged, and how password change and distribution are handled, including operating system accounts. Also identify audit logs, who can read the audit logs, who can modify the audit logs, who can delete the audit logs, and how the audit logs are protected and stored. Whether the user IDs are obscured in the audit trails, mechanism for archiving & log deletion. |  |  |  |
| 22 | External Access Considerations: Will the application be used internally only? If not, whether the application compliant with corporate external access requirements. |  |  |  |
| 23 | Tools used to check the application against different threats. |  |  |  |
| 24 | Considerations of any specific requirements for HIPAA compliance and applications handling PHI/ PII data. |  |  |  |
| Cloud computing |  |  |  |  |
| 25 | Compliance of the solution to the five essential characteristics of cloud computing- On demand self-service, Broad network access, Resource pooling, Rapid elasticity, Measured service. |  |  |  |
| 26 | In case the solution is multi-tenant, whether the specific controls for multi tenancy considered & covered in the  multi-tenancy architecture from the application and data perspectives. |  |  |  |
| Big Data |  |  |  |  |
| 27 | Is Big Data aligned with Specific Business Goals. |  |  |  |
| Mobile app development |  |  |  |  |
| 28 | Device types & OS to be supported. |  |  |  |
| 29 | Considerations of whether it is an Online or Offline application. |  |  |  |
| 30 | Any device resource constraints such as battery life, memory size, and processor speed, connectivity type (3G, 4G, etc.). |  |  |  |
| 31 | User Interface considerations & involvement of UX team. |  |  |  |
| 32 | Compliance with client corporate mobile application guidelines, if any. |  |  |  |
| Total Score |  | 0 |  |  |