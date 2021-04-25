const { gql, } = require('apollo-server-express');


exports.typeDefs = gql`

type Employer {
  id: Int
  name: String
  employees: [Employee]
  numEmployees: Int
}

type Employee {
  id: Int
  name: String
  employer: Employer
}

type Query {
  employers: [Employer]
  employees: [Employee]
  employer(id: Int): Employer
  employee(id: Int): Employee
}

type Mutation {
  addEmployee(name: String!, employerId: Int!): Employee
  removeEmployee(id: Int!): [Employee]
  changeEmployeeName(id: Int!, name: String!): Employee
  changeEmployer(id: Int!, employerId: Int!): Employee
}

type Subscription {
  newEmployee(employerId: Int): Employee
}
`;
