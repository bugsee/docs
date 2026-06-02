---
title: "Webhook events"
description: "Reference for all Bugsee webhook event types and their JSON payload structures, covering app, issue, user, and feedback events."
sidebar_position: 2
slug: "/webhooks/events"
---

Bugsee will send notifications for the following events:

- [Events data](#events-data)
  - [app.created](#appcreated)
  - [app.updated](#appupdated)
  - [app.deleted](#appdeleted)
  - [issue.created](#issuecreated)
  - [issue.updated](#issueupdated)
  - [issue.closed](#issueclosed)
  - [issue.reopened](#issuereopened)
  - [issue.regressed](#issueregressed)
  - [issue.deleted](#issuedeleted)
  - [issue.comment](#issuecomment)
  - [user.created](#usercreated)
  - [user.updated](#userupdated)
  - [user.deleted](#userdeleted)
  - [unsymbolicated.created](#unsymbolicatedcreated)
  - [feedback.message.in](#feedbackmessagein)
  - [feedback.message.out](#feedbackmessageout)
  - [build.created](#buildcreated)
  - [build.deleted](#builddeleted)
  - [build.vulnerabilities\_detected](#buildvulnerabilities_detected)
- [Common data structures](#common-data-structures)
  - [Recording](#recording)
  - [Environment](#environment)


All webhook payloads has common structure, like the one below:

```json
{
    "id": "4fhs63jd",
    "type": "app.created",
    "created_on": "2018-01-16T08:18:25.411Z",
    "payload": {}
}
```

|Field|Type|Description|
|---|---|---|
|id|String|Unique request ID|
|type|String|Event type. One of the listed above|
|created_on|String|Date and time of event generation (ISO date format)|
|payload|Object|Event data|

Depending on the "type" field value, "payload" field will contain various data described below.

<p>&nbsp;</p>

## Events data

### app.created

This event is triggered when new application is created in organization. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS",
        "description": "Our primary iOS application",
        "type": "ios",
        "subtype": "",
        "timezone": 0,
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2017-12-16T12:18:40.387Z",
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique application key (within organization)|
||name|String|Application name|
||url|String|Web URL for the application|
||description|String|Description for the application|
||type|String|Type of the application. One of the following: 'ios', 'android', 'web'|
||subtype|String|In case of type is 'android' or 'ios' this field contains the type of framework/platform used to create the actual app. One of 'xamarin', 'cordova', 'react_native', 'unity' or empty in case of native app|
||timezone|Number|Timezone offset from GMT [-11..11]|
||created_on|String|Date and time when application was created (ISO formatted string)|
||updated_on|String|Date and time when application was last updated (ISO formatted string)|
||created_by|Object|Object with the name and email of the user who created the application|


### app.updated

This event is triggered when one of the applications is updated in organization (one or more its fields are changed). It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS",
        "description": "Our primary iOS application",
        "type": "ios",
        "subtype": "",
        "timezone": 0,
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2017-12-16T12:18:40.387Z",
        "updated_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    },
    "changes": {
        "<field_name>": {
            "from": "",
            "to": ""
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**||||
||key|String|Unique application key (within organization)|
||name|String|Application name|
||url|String|Web URL for the application|
||description|String|Description for the application|
||type|String|Type of the application. One of the following: 'ios', 'android', 'web'|
||subtype|String|In case of type is 'android' or 'ios' this field contains the type of framework/platform used to create the actual app. One of 'xamarin', 'cordova', 'react_native', 'unity' or empty in case of native app|
||timezone|Number|Timezone offset from GMT [-11..11]|
||created_on|String|Date and time when application was created (ISO formatted string)|
||updated_on|String|Date and time when application was last updated (ISO formatted string)|
||updated_by|Object|Information about the user who updated the application|
|**changes**||||
||&lt;field_name&gt;|Object|Object which contains the information about fields that were changed. Each key-value pair in that object denotes the change, where key (&lt;field_name&gt;) is then name of field value is an object with "from" and "to" fields that contain previous and new values correspondingly|

### app.deleted

This event is triggered when some application is deleted from organization. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS",
        "description": "Our primary iOS application",
        "type": "ios",
        "subtype": "",
        "timezone": 0,
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2017-12-16T12:18:40.387Z",
        "deleted_on": "2017-12-16T12:18:40.387Z",
        "deleted_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique application key (within organization)|
||name|String|Application name|
||url|String|Web URL for the application|
||description|String|Description for the application|
||type|String|Type of the application. One of the following: 'ios', 'android', 'web'|
||subtype|String|In case of type is 'android' or 'ios' this field contains the type of framework/platform used to create the actual app. One of 'xamarin', 'cordova', 'react_native', 'unity' or empty in case of native app|
||timezone|Number|Timezone offset from GMT [-11..11]|
||created_on|String|Date and time when application was created (ISO formatted string)|
||updated_on|String|Date and time when application was last updated (ISO formatted string)|
||deleted_by|Object|Object with the name and email of the user who deleted the application|

### issue.created

This event is triggered when new issue is reported. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "bug",
        "state": "open",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "medium",
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "recordings": [{
            "key": "vmd73hsr",
            "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123/vmd73hsr",
            "environment": {},
            "attributes": {
                // Session/user attributes
            },
            "attachments": [{   // "attachments" property can be null if not present
                "name": "<Attachment name>",
                "url": "<Attachment URL>"
            }], 
            "created_on": "2018-10-16T08:18:25.411Z",
            "updated_on": "2018-10-16T08:18:25.411Z"
        }],
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
||recordings|Array&lt;Object&gt;|List of recordings in the issue. Refer to [recording](#recording) section for details on Recording object|
||created_by|Object|Object with the name and email of the user who created the issue|

### issue.updated

This event is triggered when existing issue is updated (one or more fields are changed). It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "bug",
        "state": "open",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "medium",
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "updated_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "recordings": []
    },
    "changes": {
        "<field_name>": {
            "from": "",
            "to": ""
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
|**changes**|||
||&lt;field_name&gt;|Object|Object which contains the information about fields that were changed. Each key-value pair in that object denotes the change, where key (&lt;field_name&gt;) is then name of field value is an object with "from" and "to" fields that contain previous and new values correspondingly|

### issue.closed

This event is triggered when issue is closed. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "bug",
        "state": "closed",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "medium",
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "closed_on": "2018-10-16T08:18:25.411Z",
        "closed_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "recordings": []
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
||closed_on|String|Date and time when issue was closed (ISO formatted string)|
||closed_by|Object|Object with the name and email of the user who closed the issue|

### issue.reopened

This event is triggered when issue is re-opened. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "bug",
        "state": "open",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "medium",
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "closed_on": "2018-10-16T08:18:25.411Z",
        "closed_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "reopened_on": "2018-10-16T08:18:25.411Z",
        "reopened_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "recordings": []
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
||closed_on|String|Date and time when issue was closed (ISO formatted string)|
||closed_by|Object|Object with the name and email of the user who closed the issue|
||reopened_on|String|Date and time when issue was closed (ISO formatted string)|
||reopened_by|Object|Object with the name and email of the user who re-opened the issue|

### issue.regressed

This event is triggered when regression is detected (closed issue is reported again in/after fixed version). It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "crash",
        "state": "open",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "blocker",
        "created_on": "2018-10-16T08:18:25.411Z",
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "updated_on": "2018-10-16T08:18:25.411Z",
        "recordings": [{
            "key": "vmd73hsr",
            "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123/vmd73hsr",
            "environment": {},
            "attributes": {
                // Session/user attributes
            },
            "attachments": [{   // "attachments" property can be null if not present
                "name": "<Attachment name>",
                "url": "<Attachment URL>"
            }],
            "created_on": "2018-10-16T08:18:25.411Z",
            "updated_on": "2018-10-16T08:18:25.411Z"
        }],
        "closed_on": "2018-10-16T08:18:25.411Z",
        "regressed_on": "2018-10-16T08:18:25.411Z"
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
||recordings|Array&lt;Object&gt;|List of recordings in the issue. Usually contains one last recording from issue that caused regression. Refer to [recording](#recording) section for details on Recording object|
||closed_on|String|Date and time when issue was closed (ISO formatted string)|
||closed_by|Object|Object with the name and email of the user who closed the issue|
||regressed_on|String|Date and time when issue regression was detected (ISO formatted string)|

### issue.deleted

This event is triggered when new issue is deleted. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "bug",
        "state": "open",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "medium",
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "deleted_on": "2018-10-16T08:18:25.411Z",
        "deleted_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "recordings": []
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
||deleted_on|String|Date and time when issue was deleted (ISO formatted string)|
||deleted_by|Object|Object with the name and email of the user who deleted the issue|

### issue.comment

This event is triggered when someone add comment to issue. It has the following payload data structure:

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123"
    },
    "comment": {
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "text": "I am on it! Will fix asap!"
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||url|String|Web URL for issue|
|**comment**|||
||created_by|Object|Object with the name and email of the user who created the comment|
||text|String|Comment message|


### user.created

This event is triggered when new user is added to the organization. It has the following payload data structure:

```json
{
    "user": {
        "name": "Amy Jameson",
        "email": "amy.jameson@example.com",
        "admin": false,
        "disabled": false,
        "country": "us",
        "timezone": 0,
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**user**|||
||name|String|Full user name|
||email|String|Email address|
||admin|Boolean|Flag that indicates whether user is admin or not|
||disabled|Boolean|Flag that indicates whether account is disabled or not|
||country|String|Country code for the user (may not be accurate because is guessed from IP)|
||timezone|Number|Timezone offset from GMT|
||created_on|String|Date and time when account was created (ISO formatted string)|
||updated_on|String|Date and time when account was last updated (ISO formatted string)|
||created_by|Object|Object with the name and email of the user who created the account (usually this the one who sends an invite)|

### user.updated

This event is triggered when user account changes. It has the following payload data structure:

```json
{
    "user": {
        "name": "Amy Jameson",
        "email": "amy.jameson@example.com",
        "admin": false,
        "disabled": false,
        "country": "us",
        "timezone": 0,
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    },
    "changes": {
        "<field_name>": {
            "from": "",
            "to": ""
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**user**||||
||name|String|Full user name|
||email|String|Email address|
||admin|Boolean|Flag that indicates whether user is admin or not|
||disabled|Boolean|Flag that indicates whether account is disabled or not|
||country|String|Country code for the user (may not be accurate because is guessed from IP)|
||timezone|Number|Timezone offset from GMT|
||created_on|String|Date and time when account was created (ISO formatted string)|
||updated_on|String|Date and time when account was last updated (ISO formatted string)|
|**changes**|||
||&lt;field_name&gt;|Object|Object which contains the information about fields that were changed. Each key-value pair in that object denotes the change, where key (&lt;field_name&gt;) is then name of field value is an object with "from" and "to" fields that contain previous and new values correspondingly|

### user.deleted

This event is triggered when new user is deleted from organization. It has the following payload data structure:

```json
{
    "user": {
        "name": "Amy Jameson",
        "email": "amy.jameson@example.com",
        "admin": false,
        "disabled": false,
        "country": "us",
        "timezone": 0,
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "deleted_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**user**|||
||name|String|Full user name|
||email|String|Email address|
||admin|Boolean|Flag that indicates whether user is admin or not|
||disabled|Boolean|Flag that indicates whether account is disabled or not|
||country|String|Country code for the user (may not be accurate because is guessed from IP)|
||timezone|Number|Timezone offset from GMT|
||created_on|String|Date and time when account was created (ISO formatted string)|
||updated_on|String|Date and time when account was last updated (ISO formatted string)|
||deleted_by|Object|Object with the name and email of the user who deleted the account|

<p>&nbsp;</p>

### unsymbolicated.created

This event is triggered when issue is marked as "missing symbols".

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "issue": {
        "key": "IOS-123",
        "summary": "Something went wrong",
        "description": "When app started and sign up screen appeared it missed the 'Sign Up' button",
        "type": "bug",
        "state": "open",
        "labels": [],
        "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123",
        "severity": "medium",
        "created_on": "2018-10-16T08:18:25.411Z",
        "updated_on": "2018-10-16T08:18:25.411Z",
        "recordings": [{
            "key": "vmd73hsr",
            "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123/vmd73hsr",
            "environment": {},
            "attributes": {
                // Session/user attributes
            },
            "attachments": [{   // "attachments" property can be null if not present
                "name": "<Attachment name>",
                "url": "<Attachment URL>"
            }],
            "created_on": "2018-10-16T08:18:25.411Z",
            "updated_on": "2018-10-16T08:18:25.411Z"
        }],
        "created_by": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**issue**|||
||key|String|Unique issue key within application|
||summary|String|Brief issue description|
||description|String|Detailed issue description|
||type|String|Issue type. One of "bug", "crash", "error"|
||state|String|Issue state. One of "open", "closed"|
||labels|Array&lt;String&gt;|List of text labels issue is marked with|
||url|String|Web URL for issue|
||severity|String|Issue severity. One of "unknown", "low", "medium", "high", "critical", "blocker"|
||created_on|String|Date and time when issue was created (ISO formatted string)|
||updated_on|String|Date and time when issue was last updated (ISO formatted string)|
||recordings|Array&lt;Object&gt;|List of recordings in the issue. Refer to [recording](#recording) section for details on Recording object|
||created_by|Object|Object with the name and email of the user who created the issue|


### feedback.message.in

This event is triggered when new feedback message is received from end user device (phone, tablet, etc)

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "thread": {
        "state": "open",
        "user": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "device_id": "D11B5769-781B-44B0-9CB7-B2D8D9C7A831"
    },
    "message": {
        "messages": [{
            "text": "This is my message!",
            "created_on": "2018-10-16T08:18:25.411Z"
        }],
        "user": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**thread**|||
||state|String|Thread state. Either "open" or "closed"|
||user|Object|Object with the name and email of the user who created/started the thread|
||device_id|String|Unique identifier for end-user device|
|**message**|||
||messages|Array|Array of objects of ({ "text": "", "created_on": "" }) that represent actual messages|
||user|Object|Object with the name and email of the user who sent the message(s)|
||device_id|String|Unique identifier for end-user device|


### feedback.message.out

This event is triggered when new feedback message is sent to the end user device (phone, tablet, etc) from dashboard

```json
{
    "app": {
        "key": "IOS",
        "name": "iOS application",
        "url": "https://app.bugsee.com/#/apps/IOS"
    },
    "thread": {
        "state": "open",
        "user": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        },
        "device_id": "D11B5769-781B-44B0-9CB7-B2D8D9C7A831"
    },
    "message": {
        "messages": [{
            "text": "This is my message!",
            "created_on": "2018-10-16T08:18:25.411Z"
        }],
        "user": {
            "name": "John Smith",
            "email": "john.smith@example.com"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique issue key within application|
||name|String|Application name|
||url|String|Web URL for application|
|**thread**|||
||state|String|Thread state. Either "open" or "closed"|
||user|Object|Object with the name and email of the user who created/started the thread|
||device_id|String|Unique identifier for end-user device|
|**message**|||
||messages|Array|Array of objects of ({ "text": "", "created_on": "" }) that represent actual messages|
||user|Object|Object with the name and email of the user who sent the message(s)|
||device_id|String|Unique identifier for end-user device|


### build.created

This event fires twice during a build's lifecycle, distinguished by the `size_analysis_status` field on the `current` build:

1. **Build registered (`size_analysis_status: "unavailable"`)** — fires immediately when the Bugsee Gradle plugin or BugseeAgent registers a new build without requesting an artefact upload (the new default, "build info only" path). The payload carries the build's metadata (uuid, package_id, version, build, VCS, build_metadata, artefact_size) but the analyzer-level size fields (`size_summary` and the analyzer fields inside `size_diff_summary` such as `download_size_delta` / `install_size_delta`) are absent — those require the full size analyzer. `size_diff_summary` IS populated with the raw-artefact delta fields (`artifact_size_delta`, `artifact_size_pct`, `artifact_trend`, `base_artifact_size`) when a baseline build exists for the same `(package_id, format, build_configuration)`. The full `previous` build sub-object is omitted on this trigger — consumers gate "is regression?" on `artifact_trend === "regression"`.

2. **Size analysis complete (`size_analysis_status: "ready"`)** — fires when the optional size analysis upload finishes processing on the server. The payload additionally carries `size_summary`, the full analyzer fields inside `size_diff_summary` (download / install / shipped-variant deltas), and (when available) the `previous` build for comparison. The artifact delta fields are also populated here against the same baseline.

Consumers that only want post-analysis notifications can branch on `current.size_analysis_status === "ready"`. Consumers that want to be notified about every release archive (including build-info-only) read the event unconditionally.

**Build-info-only payload (`size_analysis_status: "unavailable"`)** — sent at registration when the client opted out of the artefact upload. `size_summary` and the full `previous` sub-object are absent (no analyzer ran). `size_diff_summary` carries only the artefact-byte delta fields:

```json
{
    "app": {
        "key": "ANDROID",
        "name": "Android application",
        "url": "https://app.bugsee.com/#/apps/ANDROID"
    },
    "build": {
        "current": {
            "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "package_id": "com.example.app",
            "version": "2.4.1",
            "build": "153",
            "build_configuration": "release",
            "format": "aab",
            "size_analysis_status": "unavailable",
            "url": "https://app.bugsee.com/#/apps/ANDROID/builds/5b7f2a1e9f1b2c0001a3d5b2",
            "artifact_size": 35241984,
            "size_diff_summary": {
                "artifact_size_delta": 1048576,
                "artifact_size_pct": 3.0,
                "artifact_trend": "regression",
                "base_artifact_size": 34193408
            },
            "vcs": {
                "commit_sha": "a1b2c3d4e5f6789012345678901234567890abcd",
                "branch": "main",
                "provider": "github",
                "repo": "acme/example-app"
            },
            "build_metadata": {
                "machine": "github-actions:runner-2",
                "plugin_version": "7.0.0",
                "build_system_version": "8.6",
                "build_sdk_version": "36"
            },
            "created_on": "2026-04-18T12:34:56.000Z",
            "updated_on": "2026-04-18T12:34:56.000Z"
        }
    }
}
```

**Size-analysis-ready payload (`size_analysis_status: "ready"`)** — sent when the worker completes the analysis; carries the full size data plus the comparison baseline when available:

```json
{
    "app": {
        "key": "ANDROID",
        "name": "Android application",
        "url": "https://app.bugsee.com/#/apps/ANDROID"
    },
    "build": {
        "current": {
            "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "package_id": "com.example.app",
            "version": "2.4.1",
            "build": "153",
            "build_configuration": "release",
            "format": "aab",
            "size_analysis_status": "ready",
            "url": "https://app.bugsee.com/#/apps/ANDROID/builds/5b7f2a1e9f1b2c0001a3d5b2",
            "artifact_size": 35241984,
            "size_summary": {
                "schema_version": 3,
                "analysis_version": "3.0.0",
                "analysis_mode": "aab",
                "download_size": 35241984,
                "install_size": 58720256,
                "install_size_on_device": 60817408,
                "install_block_size": 4096
            },
            "size_diff_summary": {
                "trend": "regression",
                "download_size_delta": 1048576,
                "download_size_pct": 3.0,
                "install_size_delta": 2097152,
                "install_size_pct": 3.7,
                "default_variant": {"abi": "arm64-v8a", "density": "xxhdpi", "locale": null},
                "default_variant_unmatched": false,
                "raw_download_size_delta": 1572864,
                "raw_install_size_delta": 3145728,
                "raw_trend": "regression",
                "regressed_variants_count": 7,
                "any_variant_regressed": true,
                "artifact_size_delta": 1048576,
                "artifact_size_pct": 3.0,
                "artifact_trend": "regression",
                "base_artifact_size": 34193408
            },
            "vcs": {
                "commit_sha": "a1b2c3d4e5f6789012345678901234567890abcd",
                "base_sha": "9876543210fedcba9876543210fedcba98765432",
                "branch": "main",
                "base_branch": "main",
                "pr_number": 42,
                "provider": "github",
                "repo": "acme/example-app"
            },
            "created_on": "2026-04-18T12:34:56.000Z",
            "updated_on": "2026-04-18T12:36:22.000Z"
        },
        "previous": {
            "uuid": "98765432-10fe-dcba-9876-543210fedcba",
            "package_id": "com.example.app",
            "version": "2.4.0",
            "build": "148",
            "build_configuration": "release",
            "format": "aab",
            "size_analysis_status": "ready",
            "url": "https://app.bugsee.com/#/apps/ANDROID/builds/5b7f1a0e9f1b2c0001a3d5a1",
            "artifact_size": 34193408,
            "size_summary": {
                "download_size": 34193408,
                "install_size": 56623104
            },
            "vcs": {
                "commit_sha": "9876543210fedcba9876543210fedcba98765432",
                "branch": "main",
                "provider": "github",
                "repo": "acme/example-app"
            },
            "created_on": "2026-04-11T09:18:01.000Z",
            "updated_on": "2026-04-11T09:19:33.000Z"
        }
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique application key (within organization)|
||name|String|Application name|
||url|String|Web URL for the application|
|**build.current**|||
||uuid|String|Build UUID injected into the manifest / Info.plist by the build-time agent|
||package_id|String|Android applicationId / iOS bundleIdentifier|
||version|String|`versionName` / `CFBundleShortVersionString`|
||build|String|`versionCode` / `CFBundleVersion`|
||build_configuration|String|Variant / configuration name (e.g. `release`, `freeRelease`)|
||format|String|`aab`, `apk`, or `ipa`|
||size_analysis_status|String|`unavailable` (build-info only), `uploading` / `processing` (in flight), `ready` (analysis complete), or `failed`|
||url|String|Web URL for the build in the Bugsee dashboard|
||artifact_size|Number|Raw artefact byte count captured at upload time|
||size_summary|Object|Scalar size aggregates — see [Size summary](#size-summary). **Absent** when `size_analysis_status !== "ready"`|
||size_diff_summary|Object|Diff vs the previous build — see [Size diff summary](#size-diff-summary). The analyzer-level fields (`download_size_delta`, `install_size_delta`, shipped-variant deltas, …) are present only on the size-analysis-ready trigger. The raw-artefact fields (`artifact_size_delta`, `artifact_size_pct`, `artifact_trend`, `base_artifact_size`) are present on every trigger when a baseline exists, including the build-info-only path. **Absent entirely** when no baseline existed at all|
||vcs|Object|Commit context resolved at upload time (`commit_sha`, `branch`, `base_branch`, `pr_number`, `provider`, `repo`). May be absent when the build was produced from a host without a git context|
||created_on|String|Date and time the build record was created (ISO formatted string)|
||updated_on|String|Date and time the build record was last updated (ISO formatted string)|
|**build.previous**|Object|Same shape as `build.current`. **Absent** on the first build for this `(package_id, build_configuration)` tuple and on the build-info-only trigger|

### build.deleted

This event is triggered when a build record is deleted from the dashboard (manually or via API). It has the following payload data structure:

```json
{
    "app": {
        "key": "ANDROID",
        "name": "Android application",
        "url": "https://app.bugsee.com/#/apps/ANDROID"
    },
    "build": {
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "package_id": "com.example.app",
        "version": "2.4.1",
        "build": "153",
        "build_configuration": "release",
        "format": "aab",
        "size_analysis_status": "ready",
        "url": "https://app.bugsee.com/#/apps/ANDROID/builds/5b7f2a1e9f1b2c0001a3d5b2",
        "created_on": "2026-04-18T12:34:56.000Z",
        "updated_on": "2026-04-18T12:36:22.000Z"
    },
    "deleted_by": {
        "name": "John Smith",
        "email": "john.smith@example.com"
    }
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique application key (within organization)|
||name|String|Application name|
||url|String|Web URL for the application|
|**build**|||
||uuid|String|Build UUID|
||package_id|String|Android applicationId / iOS bundleIdentifier|
||version|String|`versionName` / `CFBundleShortVersionString`|
||build|String|`versionCode` / `CFBundleVersion`|
||build_configuration|String|Variant / configuration name|
||format|String|`aab`, `apk`, or `ipa`|
||size_analysis_status|String|Status the build had at the time of deletion|
||url|String|Web URL for the build in the Bugsee dashboard|
||created_on|String|Date and time the build record was created (ISO formatted string)|
||updated_on|String|Date and time the build record was last updated (ISO formatted string)|
|**deleted_by**|Object|Object with the name and email of the user who deleted the build. Absent for API-initiated deletions without a user context|


### build.vulnerabilities_detected

This event fires when a vulnerability scan completes and the diff against the previous scan reports at least one **newly-discovered** vulnerability (`diff.new_count > 0`). It does NOT fire when a scan completes with no new vulns, when only previously-known vulns are re-confirmed, or when the diff carries only resolved entries.

The payload pairs the affected build's full long-form projection with the scan's summary and diff sub-documents, plus a top-N list of the newly-discovered vulnerabilities (capped at 50, sorted by severity DESC then by `vuln_id`) so a Slack / CI / ticketing consumer can render an actionable alert without a follow-up fetch.

A 5-minute server-side deduplication window prevents back-to-back fanouts for the same build (e.g. a manual re-trigger right after a periodic scan). A manual `Scan for vulnerabilities` action from the dashboard clears the window, so an operator-initiated re-trigger always notifies.

```json
{
    "app": {
        "key": "ANDROID",
        "name": "Android application",
        "url": "https://app.bugsee.com/#/apps/ANDROID"
    },
    "build": {
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "package_id": "com.example.app",
        "version": "2.4.1",
        "build": "153",
        "build_configuration": "release",
        "format": "aab",
        "size_analysis_status": "ready",
        "url": "https://app.bugsee.com/#/apps/ANDROID/builds/5b7f2a1e9f1b2c0001a3d5b2",
        "created_on": "2026-04-18T12:34:56.000Z",
        "updated_on": "2026-04-18T12:36:22.000Z"
    },
    "summary": {
        "scanned_at": "2026-05-23T07:14:00.000Z",
        "sources": ["osv", "github_advisory"],
        "vuln_count": 4,
        "critical_count": 1,
        "high_count": 2,
        "medium_count": 1,
        "low_count": 0,
        "info_count": 0,
        "affected_entries_count": 3
    },
    "diff": {
        "previous_scanned_at": "2026-05-22T07:14:00.000Z",
        "new_count": 3,
        "resolved_count": 1,
        "unchanged_count": 1
    },
    "new_vulnerabilities": [
        {
            "identity": "com.example:foo@1.2.3",
            "vuln_id": "GHSA-aaaa-bbbb-cccc",
            "severity": "CRITICAL",
            "summary": "Remote code execution in com.example:foo",
            "references": ["https://github.com/advisories/GHSA-aaaa-bbbb-cccc"]
        },
        {
            "identity": "com.example:bar@2.0.0",
            "vuln_id": "CVE-2025-1234",
            "severity": "HIGH",
            "summary": "Denial of service via crafted input",
            "references": ["https://nvd.nist.gov/vuln/detail/CVE-2025-1234"]
        }
    ]
}
```

|Object|Field|Type|Description|
|---|---|---|---|
|**app**|||
||key|String|Unique application key (within organization)|
||name|String|Application name|
||url|String|Web URL for the application|
|**build**|||
||uuid|String|Build UUID|
||package_id|String|Android applicationId / iOS bundleIdentifier|
||version|String|`versionName` / `CFBundleShortVersionString`|
||build|String|`versionCode` / `CFBundleVersion`|
||build_configuration|String|Variant / configuration name|
||format|String|`aab`, `apk`, or `ipa`|
||size_analysis_status|String|Size-analysis status at scan time|
||url|String|Web URL for the build in the Bugsee dashboard|
||created_on|String|Date and time the build record was created (ISO formatted string)|
||updated_on|String|Date and time the build record was last updated (ISO formatted string)|
|**summary**|||
||scanned_at|String|Date and time the scan completed (ISO formatted string)|
||sources|Array&lt;String&gt;|Vulnerability databases consulted. Always a subset of `["osv", "github_advisory"]`. `github_advisory` appears only when `GITHUB_ADVISORY_TOKEN` is configured on the worker|
||vuln_count|Number|Total distinct findings detected on this scan|
||critical_count|Number|Findings with `severity === "CRITICAL"`|
||high_count|Number|Findings with `severity === "HIGH"`|
||medium_count|Number|Findings with `severity === "MEDIUM"`|
||low_count|Number|Findings with `severity === "LOW"`|
||info_count|Number|Findings with `severity === "INFO"`|
||affected_entries_count|Number|Number of distinct `(group:name@version)` dependency entries with at least one finding|
|**diff**|||
||previous_scanned_at|String|`scanned_at` of the prior scan this delta is computed against. Absent on the first-ever scan for a build|
||new_count|Number|Newly-discovered findings since the previous scan. Always `&gt;= 1` for this event — by contract, the event does not fire when `new_count === 0`|
||resolved_count|Number|Findings that were present in the previous scan but are no longer detected (e.g. dependency upgrade, advisory withdrawal)|
||unchanged_count|Number|Findings carried over from the previous scan unchanged|
|**new_vulnerabilities**|Array&lt;Object&gt;|Top-50 newly-discovered findings, sorted by severity (`CRITICAL` first) then by `vuln_id` ascending for stable ordering across re-deliveries|
||identity|String|`group:name@version` identifier of the affected dependency entry|
||vuln_id|String|Stable advisory identifier (`GHSA-...` or `CVE-...`). Use this for cross-referencing with external trackers|
||severity|String|One of `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, or `UNKNOWN`|
||summary|String|One-line description of the vulnerability. May be truncated to ~4096 characters; consult `references[]` for the full advisory|
||references|Array&lt;String&gt;|URLs of advisory pages, CVE entries, and other authoritative sources. May be empty when no references are published|


## Common data structures

### Size summary

|Field|Type|Description|
|---|---|---|
|schema_version|Number|Schema version of the size analysis document (currently `3`)|
|analysis_version|String|Worker version that produced the analysis|
|analysis_mode|String|`apk` for raw APK/AAB uploads, `aab_universal_via_bundletool` when the worker expanded an AAB through bundletool, `ipa` for iOS bundles|
|download_size|Number|Total download size in bytes (compressed) — the raw bundle as uploaded|
|install_size|Number|Total install size in bytes (uncompressed) — the raw bundle as uploaded|
|install_size_on_device|Number|Install size rounded up to the filesystem block size — what the raw bundle occupies on the device|
|install_block_size|Number|Filesystem block size used for `install_size_on_device` rounding (typically `4096` on Android; iOS bundles may omit this field)|

The full per-variant breakdown (`shipped_variants`, `shipped_default`, `strippable_*`) is **not** included in the webhook scalar summary — those fields live in the size-analysis blob on S3 (worst case ~1,700 variant entries on an app translated into every Android-supported locale) and would bloat the webhook payload.

### Size diff summary

The headline `trend` / `*_delta` / `*_pct` fields reflect the **default shipped variant** — the AAB slice a representative modern device would actually download from Google Play (`arm64-v8a` / `xxhdpi` / base locale by default). This means VCS status checks, email notifications, and the build-list regression indicator fire on user-visible changes rather than debug-symbol churn or all-ABIs-summed bundle deltas.

The raw-bundle framing (full AAB delta regardless of splits) is preserved separately as `raw_*` fields for callers that still want the full-upload view — infra dashboards watching upload-side storage, etc.

|Field|Type|Description|
|---|---|---|
|trend|String|One of `regression`, `improvement`, `unchanged`, reflecting the default shipped variant's install-size delta. Drives the dashboard's trend indicator, VCS status-check state, and the build-created notification email|
|download_size_delta|Number|Signed byte delta vs. the baseline for the default shipped variant (negative = smaller)|
|download_size_pct|Number|Signed percentage delta vs. the baseline|
|install_size_delta|Number|Signed byte delta vs. the baseline|
|install_size_pct|Number|Signed percentage delta vs. the baseline|
|default_variant|Object or null|The (abi, density, locale) triple the headline metrics are computed against. `null` only when the diff falls back to raw totals — see `default_variant_unmatched`|
|default_variant_unmatched|Boolean|`true` when no (abi, density, locale) triple is common to both builds (e.g. the AAB fundamentally changed shape — pure-Java → native — between uploads). The headline fields then reflect the raw bundle delta as a fallback|
|raw_download_size_delta|Number|Full-bundle delta before split-awareness. Tracks changes to the AAB's total upload size regardless of which bytes actually reach devices|
|raw_install_size_delta|Number|Full-bundle install-size delta (uncompressed)|
|raw_trend|String|Full-bundle trend. Can disagree with `trend` when the shipped variant moved in the opposite direction to the raw bundle|
|regressed_variants_count|Number|Count of (abi, density, locale) triples whose install size regressed between base and head. Lets the mailer / webhook surface "N of M variants regressed" without walking the full per-variant table|
|any_variant_regressed|Boolean|`true` iff `regressed_variants_count > 0`|
|artifact_size_delta|Number|Signed byte delta of the raw uploaded artefact (AAB / APK / IPA) vs the baseline. Available on every build with a captured `artifact_size` and a baseline — including the build-info-only path where the full analyzer never ran. Distinct from `download_size_delta` (analyzer's per-variant download metric, requires full analysis)|
|artifact_size_pct|Number|Signed percentage delta of the raw uploaded artefact vs the baseline|
|artifact_trend|String|One of `regression`, `improvement`, `unchanged`. Drives the regression indicator for builds where the full analyzer didn't run; consumers gate "is this a regression?" on this field|
|base_artifact_size|Number|Raw artefact byte count of the baseline build the delta was computed against|

`shipped_variants_diff` — the full per-variant breakdown — exists only in the S3 size-analysis blob, not in the webhook scalar summary, for the same payload-size reason as `shipped_variants` above.

### Recording

```json
{
    "key": "vmd73hsr",
    "url": "https://app.bugsee.com/#/apps/IOS/issues/IOS-123/vmd73hsr",
    "environment": {},
    "created_on": "2018-10-16T08:18:25.411Z",
    "updated_on": "2018-10-16T08:18:25.411Z"
}
```

|Field|Type|Description|
|---|---|---|
|key|String|Unique key for the recording|
|url|String|Web URL for the recording|
|environment|Object|Object that contains all the environment information. Refer to [environment](#environment) section for more details|
created_on|String|Date and time when recording was created (ISO formatted string)|
|updated_on|String|Date and time when recording was last updated (ISO formatted string)|

### Environment

```json
{
    "app": {
        "package_id": "com.example.MyCoolApp",
        "version": "1.0.0",
        "build": "1",
        "installer": "",
        "debuggable": false,
        "debugger_attached": false,
        "instant": false,
        "extension": false,
        "locale": "en_US",
        "build_type": "com.google.android.instantapps.supervisor",
        "build_flavor": "",
        "debug": false,
        "distribution": "",
        "mdm_config": false
    },
    "platform": {
        "type": "android",
        "version": "24",
        "release_name": "7.0",
        "build": "",
        "jailbreak": false,
        "memory_total": 0,
        "memory_free": 0,
        "disk_total": 0,
        "disk_free": 0,
        "os": "",
        "arch": "",
        "locale": "",
        "locale_extended_info": {
            "format_locale" : "en_US",
            "display_locale" : "en_US",
            "chosen_locales" : [ 
                "en_US"
            ]
        },
        "supported_abis": [
            "arm64-v8a",
            "armeabi-v7a",
            "armeabi"
        ]
    },
    "hardware": {
        "manufacturer": "samsung",
        "model": "SM-G925F",
        "model_name": "SM-G925F",
        "android_id": "",
        "device_id": "",
        "name": "",
        "battery": 0,
        "charging": false,
        "low_power_mode": "",
        "wifi": "",
        "carrier": "",
        "network": {
            "name": "",
            "mcc": "",
            "mnc": "",
            "country": ""
        },
        "screen": {
            "dpiX": 0,
            "dpiY": 0,
            "xdpi" : 580.570983886719,
            "ydpi" : 580.570983886719,
            "density" : 4,
            "scaled_density" : 4,
            "density_dpi" : 640,
            "density_dpi_name" : "xxxdpi",
            "height" : 640,
            "width" : 360,
            "scale" : 4
        }
    }
}
```