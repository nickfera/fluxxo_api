# Fluxxo backend

## Introduction (English)
Fluxxo is an evolution of an older project "MoviMercado", which was my first project that was actually used in real life and not just tucked inside a random folder on my desktop. The 2019 COVID pandemic came about and with it brought many problems. One of them were new laws being enforced (to try) to limit the number of people in public spaces therefore reducing the spread of the pandemic. Keeping track of the traffic of people for small business this was easier or unecessary as they were often overlooked but for larger establishments not so, especially for a local market that is also a very popular tourist attraction.

The market trustee at the time was a very big friend of mine and had discussed the problem with the current solution (messaging in a groupchat) being ineffective. There the idea was born and my learnings took a big step forward. It was a simple web application developed using Node.js, Express and MongoDB for the server, basic HTML and CSS for the pages and Socket.io to send and recieve real time data all together which solved the problem. It wasn't the perfect solution nor the best but it was lightweight and hosted free on Heroku and worked. The local law enforcement backed down and now the local market was being able report how many people were entering and exiting through each entrance at any given time and how many were inside at that exact moment.

## The Future
After almost two years I landed my first job as a developer where my apprenticeship and experience took another huge step. I looked back and saw some potential in the idea so I decided to rewrite the whole project (heh, more than once). The evolution will consist of same idea basically, but not centered around one establishment but many, a reduction on the tracked data, seperation of the back and frontend and more mature and robust code permitting easier improvements.

## How It Works
The basic features that either are or will be implemented.
- Accounts with different roles and permissions (Administrators, moderators and regular users)
- Accounts can be linked with more than one establishment, created by administrators
- Each establishment will have there own "connection" through websockets for real-time tracking and saving data for analyzing later
- Easier and more open configuration, like adding, removing, disabling entrances or other users

Technologies used for the backend: Node.js, TypeScript, NestJS, TypeORM, MySQL, Sockets.io

Frontend: TypeScript, React, MUI