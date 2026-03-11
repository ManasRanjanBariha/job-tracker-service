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
  JobApplications:{
    _: '/applications',
    GetAll: '/all',
    Add: '/add',
    GetOne: '/:id',
    Update: '/update',
    Delete: '/delete/:id',
    uploadResume: '/:id/upload-resume',
    uploadDocuments: '/:id/upload-documents',
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
