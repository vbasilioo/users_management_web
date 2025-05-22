'use client';

import { format } from 'date-fns';

/**
 * Formata uma data para exibição no formato dd/MM/yyyy
 */
export function formatUserDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

/**
 * Retorna a classe CSS para cor do papel do usuário
 */
export function getUserRoleColor(role?: string): string {
  switch(role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
    case 'manager':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    default:
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
  }
}

/**
 * Retorna as iniciais do nome do usuário
 */
export function getUserInitials(name?: string): string {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Gera um texto descritivo para o papel do usuário
 */
export function getUserRoleLabel(role?: string): string {
  switch(role) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Manager';
    default:
      return 'User';
  }
}

/**
 * Processa a data de criação do usuário, gerando uma data a partir do ID se não houver createdAt
 */
export function processUserCreatedAt(createdAt?: string, id?: string): Date {
  if (createdAt) {
    return new Date(createdAt);
  }
  
  if (id) {
    // Gera uma data baseada no ID do usuário para ter valores consistentes
    return new Date(Date.now() - parseInt(id.replace(/-/g, '').substring(0, 8), 16) * 10000);
  }
  
  return new Date();
} 