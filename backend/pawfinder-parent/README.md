# PawFinder Backend README

## Architecture

```
                    ┌─────────────┐
                    │   Client     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Gateway   │  :8080
                    │ (Spring Cloud Gateway) │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
    │  User   │       │  Pet    │       │ Adop-   │
    │ Service │       │ Service │       │  tion   │
    │  :8081  │       │  :8082  │       │  :8083  │
    └────┬────┘       └────┬────┘       └────┬────┘
         │                 │                 │
         │          ┌──────┴──────┐            │
         │          │  Donation   │            │
         │          │  Service    │            │
         │          │   :8084     │            │
         │          └──────┬──────┘            │
         │                 │                  │
         │          ┌──────┴──────┐            │
         │          │   Chat      │            │
         │          │   Service   │            │
         │          │   :8085     │            │
         │          └─────────────┘            │
         │                                    │
    ┌────▼────────────────────────────────────▼────┐
    │                    MySQL                      │
    │                   :3306                       │
    └───────────────────────────────────────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| gateway | 8080 | API Gateway, routing |
| user-service | 8081 | User authentication & management |
| pet-service | 8082 | Pet CRUD & search |
| adoption-service | 8083 | Adoption applications & videos |
| donation-service | 8084 | Donation campaigns & records |
| chat-service | 8085 | AI chat (LLM integration) |

## Quick Start

### 1. Start Infrastructure

```bash
cd backend/pawfinder-parent
docker-compose up -d
```

This starts:
- MySQL 8.0 on port 3306
- Nacos 2.2.3 on port 8848

### 2. Initialize Database

The schema.sql runs automatically on first start. To re-run:

```bash
docker exec -i pawfinder-mysql mysql -uroot -proot123 pawfinder < database/schema.sql
```

### 3. Configure Nacos

1. Access Nacos Console: http://localhost:8848/nacos
2. Default credentials: nacos/nacos
3. Create namespace: `pawfinder-dev`
4. Add shared configuration for each service

### 4. Build & Run Services

```bash
# Build all modules
mvn clean package -DskipTests

# Run each service (in separate terminals)
java -jar gateway/target/gateway.jar
java -jar user-service/target/user-service.jar
java -jar pet-service/target/pet-service.jar
java -jar adoption-service/target/adoption-service.jar
java -jar donation-service/target/donation-service.jar
java -jar chat-service/target/chat-service.jar
```

### 5. Configure LLM API Key

For chat service, set environment variable:

```bash
export DOUBAN_API_KEY=your_api_key
```

Or configure in Nacos:

```yaml
doubao:
  api-key: your_api_key
  model: doubao-pro
```

## API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Pets

```bash
# List pets (with filters)
GET /api/pets?species=dog&status=available

# Get pet detail
GET /api/pets/1

# Search pets
GET /api/pets/search?keyword=golden+retriever
```

### Adoptions

```bash
# Submit application
POST /api/adoptions/applications
Authorization: Bearer <token>
{
  "petId": 1,
  "reason": "I want to give a loving home...",
  "idCard": "110101199001011234"
}

# Get my applications
GET /api/adoptions/applications/my
Authorization: Bearer <token>
```

### Donations

```bash
# List campaigns
GET /api/donations/campaigns

# Donate
POST /api/donations
Authorization: Bearer <token>
{
  "campaignId": 1,
  "amount": 100.00,
  "message": "Love the pets!"
}
```

### Chat

```bash
# Send message
POST /api/chat
{
  "sessionId": "session-uuid",
  "message": "推荐一只适合公寓养的猫"
}

# Get pet recommendations
POST /api/chat/recommend
{
  "preference": "cat",
  "livingCondition": "apartment",
  "experience": "beginner"
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NACOS_HOST | localhost | Nacos server host |
| NACOS_PORT | 8848 | Nacos server port |
| NACOS_NAMESPACE | public | Nacos namespace |
| DB_HOST | localhost | MySQL host |
| DB_PORT | 3306 | MySQL port |
| DB_NAME | pawfinder | Database name |
| DB_USERNAME | root | Database user |
| DB_PASSWORD | root | Database password |
| DOUBAN_API_KEY | - | Doubao API key for LLM |

## Development

### Add New Service

1. Create module in `pawfinder-parent/`
2. Add to parent `pom.xml`
3. Create entity, mapper, service, controller
4. Add route to gateway
5. Create database tables

### Common Issues

**Nacos connection failed**
- Check if Docker is running
- Verify ports 8848, 9848 are available

**Database connection failed**
- Wait for MySQL to fully start (~30s)
- Check credentials in docker-compose.yml

**LLM not responding**
- Verify API key is set
- Check network connectivity to Doubao API
