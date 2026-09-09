# Database Schema Documentation

## Overview

The Task Management App uses MongoDB with Mongoose ODM for schema management. This document describes the data models and their relationships.

## Collections

### 1. Users Collection

Stores user account information and authentication data.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required, max 50),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email` (unique)
- `createdAt`

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...", // bcrypt hash
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 2. Tasks Collection

Stores task information linked to users.

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String (required, max 100),
  description: String (max 500),
  status: String (enum: ['Todo', 'In Progress', 'Done']),
  priority: String (enum: ['Low', 'Medium', 'High']),
  dueDate: Date (optional),
  userId: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId`
- `status`
- `createdAt`
- `userId + status` (compound)

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2024-02-01T00:00:00Z",
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-16T14:30:00Z"
}
```

---

## Relationships

### User → Task (One-to-Many)

- One user can have multiple tasks
- Each task belongs to exactly one user
- Foreign key: `userId` in Task collection
- Relationship is enforced through referential integrity

**Example Query:**
```javascript
// Get all tasks for a user
db.tasks.find({ userId: ObjectId("507f1f77bcf86cd799439011") })
```

---

## Data Validation

### User Schema Validation

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | String | Yes | Max 50 chars |
| email | String | Yes | Valid email, unique |
| password | String | Yes | Min 6 chars, hashed |

### Task Schema Validation

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| title | String | Yes | Max 100 chars |
| description | String | No | Max 500 chars |
| status | String | Yes | Todo/In Progress/Done |
| priority | String | Yes | Low/Medium/High |
| dueDate | Date | No | Valid date |
| userId | ObjectId | Yes | Valid user reference |

---

## Indexes Strategy

### Performance Considerations

**Current Indexes:**

```javascript
// Users Collection
db.users.createIndex({ email: 1 }, { unique: true })

// Tasks Collection
db.tasks.createIndex({ userId: 1 })
db.tasks.createIndex({ status: 1 })
db.tasks.createIndex({ createdAt: -1 })
db.tasks.createIndex({ userId: 1, status: 1 })
```

### Query Optimization

**Frequently Used Queries:**

1. **Get user tasks by status**
   ```javascript
   db.tasks.find({ userId: ObjectId(...), status: "Todo" })
   // Uses: userId_status compound index
   ```

2. **Get tasks sorted by creation**
   ```javascript
   db.tasks.find({ userId: ObjectId(...) }).sort({ createdAt: -1 })
   // Uses: userId index, then sorts
   ```

---

## MongoDB Atlas Configuration

### Collection Settings

```javascript
// Enable TTL for audit logs (optional)
db.auditLogs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
// TTL: 90 days

// Sharding considerations for scale
// Shard Key: userId (if > 100GB)
```

---

## Data Integrity Constraints

### Referential Integrity

All tasks must reference valid users:
```javascript
// Prevent orphaned tasks
db.tasks.createIndex({ userId: 1 })
// Application logic enforces deletion cascade
```

### Unique Constraints

- User emails are globally unique
- Prevents duplicate account registration

---

## Backup & Recovery

### Backup Strategy

1. **Automated Backups**
   - MongoDB Atlas: 24-48 hour retention
   - Daily snapshots recommended

2. **Manual Backups**
   ```bash
   mongodump --uri "mongodb+srv://..." --out ./backup
   ```

3. **Restore**
   ```bash
   mongorestore --uri "mongodb+srv://..." ./backup
   ```

---

## Migration Scenarios

### Adding a New Field to Tasks

```javascript
db.tasks.updateMany(
  {},
  { $set: { tags: [] } }
)
```

### Renaming a Field

```javascript
db.tasks.updateMany(
  {},
  { $rename: { "oldField": "newField" } }
)
```

### Changing Status Values

```javascript
db.tasks.updateMany(
  { status: "InProgress" },
  { $set: { status: "In Progress" } }
)
```

---

## Monitoring

### Key Metrics

- Document count by collection
- Average document size
- Index size vs data size
- Query latency
- Slow queries

### MongoDB Atlas Monitoring

1. Metrics dashboard
2. Query performance insights
3. Real-time alerts
4. Log analysis

---

## Best Practices

1. **Always include userId in task queries**
   - Ensures user isolation
   - Improves performance

2. **Use indexes wisely**
   - Monitor unused indexes
   - Reorder compound indexes by cardinality

3. **Pagination for large result sets**
   ```javascript
   db.tasks.find({ userId: ObjectId(...) })
     .skip((page - 1) * 10)
     .limit(10)
   ```

4. **Use aggregation pipeline for complex queries**
   ```javascript
   db.tasks.aggregate([
     { $match: { userId: ObjectId(...) } },
     { $group: { _id: "$status", count: { $sum: 1 } } }
   ])
   ```

---

## Troubleshooting

### High Query Latency
1. Check slow query log
2. Analyze query plans with `.explain()`
3. Add missing indexes
4. Consider query restructuring

### Duplicate Keys Error
1. Check for existing duplicates
2. Drop and recreate index
3. Enforce unique constraints

### Connection Issues
1. Verify MongoDB URI
2. Check network whitelist
3. Verify credentials
4. Check firewall rules

---

For more information, visit [MongoDB Documentation](https://docs.mongodb.com)
