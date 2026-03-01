import mysql from 'mysql2';

const mysqlConnect = mysql.createConnection(
    {
        host: "localhost",
        user:'root',
        password:"password",
        database: "pulse_core_system"
    }
)

mysqlConnect.connect((error) => {
    if (!error) {
        console.log('Connected successfully to MySQL')
    } else {
        console.log(("Failed connection to MySQL"), error)
    }
});

export default mysqlConnect;