# Firebase Security Rules for CRUD Operations

## Realtime Database Rules

Copy and paste these rules into your Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "messages": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$messageId": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)",
        ".validate": "newData.hasChildren(['text', 'userId', 'userName', 'timestamp'])",
        "text": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 1000"
        },
        "userId": {
          ".validate": "newData.val() === auth.uid"
        },
        "userName": {
          ".validate": "newData.isString()"
        },
        "userPhoto": {
          ".validate": "newData.isString()"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        },
        "edited": {
          ".validate": "newData.isBoolean()"
        },
        "editedAt": {
          ".validate": "newData.isNumber()"
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth.uid === $uid",
        "name": {
          ".validate": "newData.isString()"
        },
        "email": {
          ".validate": "newData.isString()"
        },
        "photoURL": {
          ".validate": "newData.isString()"
        },
        "createdAt": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

## Rules Explanation

### Messages Rules

1. **Read Access**: 
   - Any authenticated user can read all messages
   - `"messages/.read": "auth != null"`

2. **Write Access (Create)**:
   - Authenticated users can create new messages
   - `"messages/.write": "auth != null"`

3. **Update/Delete Access**:
   - Users can only update or delete their own messages
   - `".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)"`
   - `!data.exists()` allows creation of new messages
   - `data.child('userId').val() === auth.uid` ensures only the message owner can modify it

4. **Validation Rules**:
   - **Required fields**: text, userId, userName, timestamp
   - **Text**: Must be a string, non-empty, max 1000 characters
   - **userId**: Must match the authenticated user's ID
   - **userName**: Must be a string
   - **timestamp**: Must be a number
   - **edited**: Optional boolean flag
   - **editedAt**: Optional number for edit timestamp

### Users Rules

1. **Read Access**:
   - Any authenticated user can read user profiles
   - Useful for displaying user information in chat

2. **Write Access**:
   - Users can only modify their own profile
   - `".write": "auth.uid === $uid"`

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Realtime Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the rules above
6. Click **Publish**

## Testing the Rules

### Test Create (Should succeed):
- Any authenticated user can create a message with their own userId

### Test Read (Should succeed):
- Any authenticated user can read all messages

### Test Update (Should succeed for own messages, fail for others):
- User A can edit their own message
- User A cannot edit User B's message

### Test Delete (Should succeed for own messages, fail for others):
- User A can delete their own message
- User A cannot delete User B's message

## Security Best Practices

1. **Never use test mode rules in production**
   - Test mode allows unrestricted access
   - Always implement proper authentication checks

2. **Validate data structure**
   - Use `.validate` rules to ensure data integrity
   - Prevent malformed data from being stored

3. **Limit data size**
   - Set maximum lengths for text fields
   - Prevent database abuse

4. **Use indexes for queries**
   - If querying by timestamp, add an index:
   ```json
   {
     "rules": {
       "messages": {
         ".indexOn": ["timestamp"]
       }
     }
   }
   ```

## Development vs Production

### Development (Current Rules):
- Suitable for development and testing
- All authenticated users can read all messages
- Users can only modify their own content

### Production Considerations:
- Consider adding rate limiting
- Implement message reporting system
- Add moderation capabilities
- Consider privacy settings for users
- Add encryption for sensitive data

## Troubleshooting

### "Permission Denied" errors:
1. Check if user is authenticated
2. Verify the userId in the message matches auth.uid
3. Ensure all required fields are present
4. Check field validation rules

### Messages not appearing:
1. Verify read rules allow access
2. Check if user is authenticated
3. Look at Firebase Console → Database → Data to see raw data

### Cannot delete/edit messages:
1. Confirm the message userId matches the current user's uid
2. Check browser console for specific error messages
3. Verify rules are published in Firebase Console
