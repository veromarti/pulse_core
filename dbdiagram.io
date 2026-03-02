// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table patients{
  patient_id integer [primary key]
  first_name varchar [not null]
  last_name varchar [not null]
  date_of_birth timestamp [not null]
  phone varchar [not null]
}

Table physicians{
  physician_id integer [primary key]
  first_name varchar [not null]
  last_name varchar [not null]
  specialty_id integer [not null]
}

Table specialties{
  specialty_id integer [primary key]
  specialty_name varchar [not null]
}

Ref: physicians.specialty_id < specialties.specialty_id

Table appointments{
  appointment_id integer [primary key]
  patient_id integer [not null]
  physician_id integer [not null]
  datetime timestamp [not null]
  status_id integer [not null]
}

Table appointment_status{
  status_id integer [primary key]
  status_name varchar [not null]
}

Ref: appointments.patient_id < patients.patient_id
Ref: appointments.physician_id < physicians.physician_id
Ref: appointments.status_id > appointment_status.status_id

Table diagnosis{
  diagnosis_id integer [primary key]
  appointment_id integer unique [not null]
  description varchar [not null]
  treatment varchar [not null]
}
Ref: diagnosis.appointment_id - appointments.appointment_id
