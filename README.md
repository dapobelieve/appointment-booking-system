# Appointment Booking API

This API provides the implementation for businesses to implement an Appointment booking feature on their system. The API provides the following modules and implementation:

* **Robust Authentication & Authorization** (auth guards, token verification guards and decorators)

* **Merchants🏪**

* **Customers👥**

* **Schedule Templates**: allows merchants to create a templates for time slots that can be easily reused

* **Schedule📆**: for merchants to create schedules with a template, when a schedule is created based on a template, the time slots are automatically generated for the dates within the set schedules without any much work from the Merchant

* **Appointement Booking 🎫**:  (for customers, customers can book based on date and time, closest available times are also suggested to the customer if their preferred one is not available).

* **Simple State Machine**: simple state machine flow for moving appointment status between the logical states ie: an appointment can only move from a *BOOKED* state to *CONFIRMED* or *CANCELLED* state. the time slots related to the appointment record is also automatically release in the case of *CANCELLED* status.

* **Role bases access control 🚨**: RBAC, merchant cannot access customers endpoints likewise customers can't access merchant endpoints

* **Logging⏺️**:  async logging of all requests and responses

* **Docker🛳️ **: the project is also dockerized for production standard. run `docker compose up api` to start the server.

* **Deployment**: a scalable CI/CD process workflow was also added for automatic deployments to an AWS EC2 instance using github actions and some bash scripting. This can deploy to different environments depending on the branch being merged or pushed to.


### Documentation
[https://documenter.getpostman.com/view/23556964/2sA3XWbHqq](https://documenter.getpostman.com/view/23556964/2sA3XWbHqq)

### Deployment URL
[https://butler-test.dapo.dev/](https://butler-test.dapo.dev/api)

