import jetPaths from 'jet-paths';

const Paths = {
  _: '/api',
  auth:{
    _: '/auth',
    Login: '/login',
    Register: '/register',
    Logout: '/logout',
    Refresh: '/refresh',
  },
  Users: {
    _: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
