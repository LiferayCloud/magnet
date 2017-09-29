# magnet-sample
This is an example of RESTful CRUD in Magnet with mySQL.

# Before
```
npm install
```
create databases and tables, verify the file `migrations.sql`

### Configuration (database)

```
web/repository/connection.js
```
    host: 'localhost',
    user: 'root',
    password : 'root',
    database: 'test'	

# Resource categories

### POST
    url: http://0.0.0.0:3000/category

```json
body: 
    {
        "category": {
            "name": "new category"
        }
    }
response:
    {
        "category": {
            "name": "new category",
            "id": 1
        }
    }
```

### PUT
    url: http://0.0.0.0:3000/category
    
```json
body:
   {
        "category": {
            "id": 1,
            "name": "edit category"
        }
    }
response:
    {
        "category": {
            "name": "edit category",
            "id": 1
        }
       
    }
 ```

### GET
    url: http://0.0.0.0:3000/category

```json
response:
{
    "categories": [
        {
            "id": 1,
            "name": "new category"
        },
        {
            "id": 2,
            "name": "other category"
        }
    ]
}
```

### DELETE
    url:http://0.0.0.0:3000/category

```json
body:
    {
        "category": {
            "id": 1
        }
    }
response:
    {
        "message": "Category removed successfully!",
        "affectedRows": 1
    }
```

## Tests
npm run test
