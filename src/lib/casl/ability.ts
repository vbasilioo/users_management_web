import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { User } from '@/schemas/user.schemas';
import { UserRole } from '@/constants/roles';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'changeRole';

export type Subjects = 'User' | 'Profile' | 'Dashboard' | 'Analytics' | 'Settings' | 'all';

export function defineAbilitiesFor(user: User | null) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) return build();

  can('read', 'Dashboard');
  
  switch (user.role) {
    case UserRole.ADMIN:
      can('manage', 'all');
      break;
      
    case UserRole.MANAGER:
      can('read', 'User');
      can('create', 'User');
      
      can('update', 'User');
      cannot('changeRole', 'User');

      cannot('delete', 'User');
      
      can('read', 'Analytics');
      
      can('manage', 'Dashboard');
      can('manage', 'Settings');
      
      can('manage', 'Profile', { id: user.id });
      break;
      
    case UserRole.USER:
      can('read', 'Profile', { id: user.id });
      can('update', 'Profile', { id: user.id });
      
      cannot('manage', 'User');
      
      can('read', 'Dashboard');
      cannot('manage', 'Dashboard');
      
      can('manage', 'Settings', { userId: user.id });
      break;
      
    default:
      can('read', 'Dashboard');
      break;
  }

  return build();
}

export default defineAbilitiesFor; 