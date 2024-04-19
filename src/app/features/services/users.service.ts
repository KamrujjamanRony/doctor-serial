// import { Injectable } from '@angular/core';
// import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
// import axios from 'axios';
// import { environment } from '../../../environments/environments';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {
//   queryClient = injectQueryClient();

//   apiClient = axios.create({
//     baseURL: environment.rootApi,
//     headers: {
//       'Content-Type' : 'application/json',
//       'Accept' : 'application/json'
//     }
//   })

//   doctorsQuery = injectQuery(() => ({
//     queryKey: ['users'],
//     queryFn: () => this.getUsers(),
//   }));

//   constructor() { }

//   async getUsers(): Promise<any[]> {
//     try {
//       const response = await this.apiClient.get<any[]>('/users');
//       const filteredUsers = response.data.filter(data => data.companyID == environment.hospitalCode);
//       return filteredUsers;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       // Optionally rethrow the error or return a default value
//       throw error;
//     }
//   }

//   async addUser(model: any | FormData): Promise<any>{
//     try {
//       const response = await this.apiClient.post('/users', model);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       // Optionally rethrow the error or return a default value
//       throw error;
//     }
//   }

//   async updateUser(id: any, updateData: any): Promise<any>{
//     try {
//       const response = await this.apiClient.put(`/users/${id}`, updateData);
//       return response;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       // Optionally rethrow the error or return a default value
//       throw error;
//     }
//   };

//   async deleteUser(id: any): Promise<any>{
//     try {
//       const response = await this.apiClient.delete(`/users/${id}`);
//       return response;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       // Optionally rethrow the error or return a default value
//       throw error;
//     }
//   }

//   getUser(id: any): any{
//     const users = this.queryClient.getQueryData(['users']) as any[];
//     return users?.find((d) => d.id == id);
//   }
// }
