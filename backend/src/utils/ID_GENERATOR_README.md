# Unique ID Generator

This utility provides unique ID generation for different entities in the Campus Gate application with auto-increment functionality.

## Features

- **Course IDs**: `${CollegeID}-${Auto Increment From 001}`
- **Application IDs**: `${CollegeID}-${User ID}-${Auto Increment From 001}`
- **Document IDs**: `${User ID}-DOC-${Auto Increment From 001}`
- **Auto-increment**: Each entity type maintains its own counter per context
- **Database-backed**: Counters are stored in MongoDB for persistence across server restarts

## Usage

### Course ID Generation

```javascript
import { generateCourseId } from "../utils/idGenerator.js";

// Generate a course ID for a specific college
const courseId = await generateCourseId("COLL001");
// Result: "COLL001-001", "COLL001-002", etc.
```

### Application ID Generation

```javascript
import { generateApplicationId } from "../utils/idGenerator.js";

// Generate an application ID for a user applying to a course at a specific college
const applicationId = await generateApplicationId("COLL001", "USER123");
// Result: "COLL001-USER123-001", "COLL001-USER123-002", etc.
```

### Document ID Generation

```javascript
import { generateDocumentId } from "../utils/idGenerator.js";

// Generate a document ID for a specific user
const documentId = await generateDocumentId("USER123");
// Result: "USER123-DOC-001", "USER123-DOC-002", etc.
```

## Implementation Details

The ID generator uses a MongoDB collection called `Counter` to track sequence numbers for each entity type and context. Each counter automatically increments using MongoDB's atomic `$inc` operator.

## Examples

### Course IDs
- `COLL001-001` (First course at College 001)
- `COLL001-002` (Second course at College 001)

### Application IDs
- `COLL001-USER123-001` (First application by USER123 at College 001)
- `COLL001-USER123-002` (Second application by USER123 at College 001)

### Document IDs
- `USER123-DOC-001` (First document uploaded by USER123)
- `USER123-DOC-002` (Second document uploaded by USER123)

## Testing

Run the test script to verify ID generation:

```bash
cd backend/src/scripts
node test-id-generator.js
```
