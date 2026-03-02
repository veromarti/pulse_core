## A. ERD (Relational SQL)

users
+-----------+-------------+
| Column    | Type        |
+-----------+-------------+
| user_id   | PK          |
| email     | VARCHAR     |
| password  | VARCHAR     |
| name      | VARCHAR     |
+-----------+-------------+

roles
+---------+-------------+
| Column  | Type        |
+---------+-------------+
| role_id | PK          |
| name    | VARCHAR     |
+---------+-------------+

user_roles
+---------+----------------------+
| Column  | Type                 |
+---------+----------------------+
| user_id | FK -> users.user_id  |
| role_id | FK -> roles.role_id  |
+---------+----------------------+

campaigns
+-------------+-------------------+
| Column      | Type              |
+-------------+-------------------+
| campaign_id | PK                |
| title       | VARCHAR           |
| description | TEXT              |
| created_by  | FK -> users.user_id|
+-------------+-------------------+

appointments
+----------------+-------------------+
| Column         | Type              |
+----------------+-------------------+
| appointment_id | PK                |
| user_id        | FK -> users.user_id|
| campaign_id    | FK -> campaigns.campaign_id|
| date           | DATETIME          |
| status         | VARCHAR           |
+----------------+-------------------+

notifications
+----------------+-------------------+
| Column         | Type              |
+----------------+-------------------+
| notification_id| PK                |
| user_id        | FK -> users.user_id|
| content        | TEXT              |
| created_at     | DATETIME          |
+----------------+-------------------+

Este modelo está normalizado hasta 3FN:

- user_roles evita repetición de roles (1:N usuarios → roles).

- appointments y campaigns separados, vinculados por FK.

- notifications vincula usuario y contenido, sin repetir datos de usuario.

### Documentación del Proceso de Normalización (SQL)

1. Datos crudos:
- El dataset tenía información de usuarios, roles, campañas, citas y notificaciones mezclados.

2. 1NF:
- Cada columna contiene un solo valor.
- Evitamos listas o datos repetidos en un mismo campo.

3. 2NF:
- Se separaron datos dependientes de la PK en tablas propias:
    - user_roles para evitar repetición de roles.
    - appointments vinculados a usuarios y campañas.

4. 3NF:
- Evitamos dependencias transitivas:
    - campaigns.created_by apunta a users.user_id en vez de guardar nombre o email en campañas.
    - notifications.user_id referencia al usuario, sin duplicar datos.

Resultado: un modelo SQL limpio, escalable y consistente.

## B. MongoDB Collection Diagram (tickets)

tickets
+-------------------------+
| Field                   |
+-------------------------+
| _id (ObjectId)          |
| ticket_id (String)      |
| subject (String)        |
| category (String)       |
| priority (String)       |
| status (String)         |
| tags [String]           |
| events [Object]         |
|   - type (String)       |
|   - at (Date)           |
|   - message {           |
|       author_type       |
|       author_name       |
|       body              |
|       attachment_url    |
|     }                   |
| related {               |
|   type                  |
|   ref                   |
| }                       |
+-------------------------+

Relación embebida para eventos (historial) y referencia para entidades SQL (related). Esto permite consultas híbridas sin duplicar datos SQL.