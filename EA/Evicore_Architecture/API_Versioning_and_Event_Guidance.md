# API Versioning and Event Guidance

## Versioning for API Endpoints

Owned by Ketan Shah
Last updated: Mar 24, 2021 by James Crawford (Unlicensed)

### Introduction

In all cases, teams should avoid coupling their microservices to other services. However, in some cases, this cannot be easily avoided (APIs). In order to promote stability and quicker delivery, then teams should follow proper approaches to making additive or substantial changes to these constructs.

#### What should require a new version?
- An additive change to the contract of an API
- A subtraction of attributes from the contract of an API

#### When should a new version not be used?
- When an API has a substantial behavior change that deviates from the previous behavior. In this case, a new API should be published.

#### Suggested practice for versioning
- Prefer custom content types to version APIs (e.g., Accept: application/vnd.evicore.request-v2+json)
- URI path versioning is less preferred due to deployment overhead

#### Deprecation
- Maintain two versions during deprecation period (3-4 sprints)

## Event Naming, Versioning, and Notifications

Owned by Ketan Shah
Last updated: Jul 13, 2022 by Phil Jerkins (Unlicensed)

### Message naming convention
- Commands: <Verb><Subject>
- Events: <Subject><Verb>
- Do not include version in the event name

### Event Versioning
- Any change (additive or breaking) should result in a new version
- Use a "Version" attribute in the event envelope
- Follow Semantic Versioning

#### Examples
- Minor version for non-required field addition
- Major version for required field addition

#### Forward compatibility
- Consumers should honor event name and version
- Double publish strategy for breaking changes

#### Notification of Event Changes
- Email, user story, DevOps wiki, Confluence page

#### Code Example
- [Obsolete] and [DataContract] attributes for event classes
