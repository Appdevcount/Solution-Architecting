# Data Persistence Choices

Owned by Pridhviraj Nandarapu (Unlicensed)
Last updated: Jul 15, 2021

## Objective

Choosing the right data store/database

### SQL vs NoSQL
- Relational databases: PostgreSQL, MySQL, Oracle, SQL Server
- Key-value databases: Redis, Riak, Cosmos, Hbase, Oracle BerkeleyDB
- Document databases: MongoDB, CouchDB, elastic Search, Cosmos, CouchBase
- Column family databases: Cassandra, Cosmos, HBase
- Graph databases: Neo4j, Cosmos, Titan

### RDBMS vs NoSQL Comparison
- Master-slave vs masterless architecture
- Structured vs multi-model data
- Consistency, availability, scaling, performance

### Criteria for Selecting Database Types
- Key-value: frequent small reads/writes, simple models
- Document: flexibility, variable attributes, denormalization
- Column family: large volumes, high availability, distributed
- Graph: networked entities, rapid traversal

### Using NoSQL and Relational Together
- Complementary roles
- Choose based on problem domain and requirements

### Summary
- No single best database; choose based on needs
